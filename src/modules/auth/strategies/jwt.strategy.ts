import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigurationService } from '../../../config/configuration/config.service';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { AuthService } from '../services/auth.service';
import { TTokenPayload } from '../types/token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthService)
  private readonly authService: AuthServiceInterface;

  constructor(configurationService: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configurationService.env.JWT_SECRET,
    });
  }

  async validate(payload: TTokenPayload): Promise<UserEntity> {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new ForbiddenException('Токен истёк или отсутствует');
    }

    return user;
  }
}
