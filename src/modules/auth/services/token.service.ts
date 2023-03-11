import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ConfigurationService } from '../../../config/configuration/config.service';
import { UserEntity } from '../../user/entities/user.entity';
import { TokenEntity } from '../entities/token.entity';
import { UserTokenEntity } from '../entities/user-token.entity';
import { TokenServiceInterface } from '../interfaces/token.service.interface';
import { TTokenPayload } from '../types/token-payload.type';

@Injectable()
export class TokenService implements TokenServiceInterface {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly configService: ConfigurationService;

  @InjectRepository(TokenEntity)
  private readonly tokenRepository: Repository<TokenEntity>;

  @InjectRepository(UserTokenEntity)
  private readonly userTokenRepository: Repository<UserTokenEntity>;

  public async createJWTToken(payload: TTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.env.JWT_SECRET,
      expiresIn: this.configService.env.JWT_EXPIRES_IN,
    });
  }

  private async createRefreshJWTToken(payload: TTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.env.JWT_REFRESH_SECRET,
      expiresIn: this.configService.env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  public async createAndAssignToken(
    user: UserEntity,
    userAgent: string,
    manager: EntityManager | undefined,
  ): Promise<TokenEntity> {
    if (!manager) {
      return await this.dataSource.transaction((manager) =>
        this.createAndAssignToken(user, userAgent, manager),
      );
    }

    const existingToken = await manager.findOne(TokenEntity, {
      where: { userAgent },
    });

    const newRefreshToken = await this.createRefreshJWTToken({
      login: user.login,
      userId: user.id,
    });

    if (existingToken) {
      await manager.update(TokenEntity, existingToken.id, {
        token: newRefreshToken,
      });
      existingToken.token = newRefreshToken;
      return existingToken;
    }

    const token = manager.create(TokenEntity, {
      token: await this.createRefreshJWTToken({
        login: user.login,
        userId: user.id,
      }),
      userAgent,
    });

    const userToken = manager.create(UserTokenEntity, { token, user });
    token.userToken = userToken;

    await manager.save([token, userToken]);

    return token;
  }

  public async checkRefreshToken(
    refreshToken: string,
    userAgent: string,
  ): Promise<{ newRefreshToken: string; token: string }> {
    const token = await this.tokenRepository.findOneBy({
      userAgent,
      token: refreshToken,
    });

    if (!token) {
      throw new ForbiddenException('Нет токена');
    }

    try {
      const payload = await this.jwtService.verifyAsync<TTokenPayload>(
        token.token,
        {
          secret: this.configService.env.JWT_REFRESH_SECRET,
        },
      );

      const newRefreshToken = await this.createRefreshJWTToken({
        login: payload.login,
        userId: payload.userId,
      });
      const newToken = await this.createJWTToken({
        login: payload.login,
        userId: payload.userId,
      });

      await this.tokenRepository.update(token.id, {
        token: newRefreshToken,
      });

      return { newRefreshToken, token: newToken };
    } catch (e) {
      await this.userTokenRepository.delete({ token: { id: token.id } });
      await this.tokenRepository.delete(token.id);

      throw new ForbiddenException('Токен истёк');
    }
  }
}
