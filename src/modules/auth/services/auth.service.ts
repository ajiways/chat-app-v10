import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { UserServiceInterface } from '../../user/interfaces/user.service.interface';
import { UserService } from '../../user/services/user.service';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthRegisterDto } from '../dto/auth.register.dto';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { TTokenPayload } from '../types/token-payload.type';
import { compare, hash } from 'bcrypt';
import { TokenService } from './token.service';
import { TokenServiceInterface } from '../interfaces/token.service.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';

@Injectable()
export class AuthService implements AuthServiceInterface {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  @Inject(UserService)
  private readonly userService: UserServiceInterface;

  @Inject(TokenService)
  private readonly tokenService: TokenServiceInterface;

  public async validateUser(payload: TTokenPayload): Promise<UserEntity> {
    return await this.userService.findById(payload.userId);
  }

  public async login(
    dto: AuthLoginDto,
    userAgent: string,
  ): Promise<AuthResponseDto & { refreshToken: string }> {
    const candidate = await this.userService.findOneBy({ login: dto.login });

    if (!candidate) {
      throw new BadRequestException('Ошибка авторизации');
    }

    const passIsValid = await compare(dto.password, candidate.password);

    if (!passIsValid) {
      throw new BadRequestException('Ошибка авторизации');
    }

    const { token: refreshToken } =
      await this.tokenService.createAndAssignToken(candidate, userAgent);

    const token = await this.tokenService.createJWTToken({
      login: dto.login,
      userId: candidate.id,
    });

    return {
      login: candidate.login,
      refreshToken,
      token,
      userId: candidate.id,
    };
  }

  public async register(
    dto: AuthRegisterDto,
    userAgent: string,
  ): Promise<AuthResponseDto & { refreshToken: string }> {
    return await this.dataSource.transaction(async (manager) => {
      const candidate = await this.userService.findOneBy({ login: dto.login });

      if (candidate) {
        throw new BadRequestException('Логин занят');
      }

      const user = await this.userService.createAndSaveUser(
        dto.login,
        await hash(dto.password, 7),
        manager,
      );

      const { token: refreshToken } =
        await this.tokenService.createAndAssignToken(user, userAgent, manager);

      const token = await this.tokenService.createJWTToken({
        userId: user.id,
        login: user.login,
      });

      return {
        login: user.login,
        refreshToken,
        token,
        userId: user.id,
      };
    });
  }

  public async refresh(
    refreshToken: string,
    userAgent: string,
  ): Promise<{ newRefreshToken: string; token: string }> {
    return await this.tokenService.checkRefreshToken(refreshToken, userAgent);
  }

  public async getUserPreview(user: UserEntity): Promise<UserPreviewDto> {
    return await this.userService.getUserPreview(user);
  }
}
