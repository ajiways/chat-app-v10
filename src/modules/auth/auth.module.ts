import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../../config/configuration/config.module';
import { ConfigurationService } from '../../config/configuration/config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { TokenEntity } from './entities/token.entity';
import { UserTokenEntity } from './entities/user-token.entity';
import { AuthorizationGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const modules = [UserModule, ConfigurationModule];
const entities = [TokenEntity, UserTokenEntity];
const services = [AuthService, TokenService];
const controllers = [AuthController];

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (c: ConfigurationService) => c.jwtOptions(),
    }),
    ...modules,
  ],
  providers: [JwtStrategy, AuthorizationGuard, ...services],
  controllers,
})
export class AuthModule {}
