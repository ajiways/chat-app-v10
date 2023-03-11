import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { EnvironmentConfig } from './env.config';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  private getKey<T>(key: string) {
    const value = this.configService.get<T>(key);
    if (value === undefined)
      throw new Error(`Missing property ${key} in configuration object.`);
    return value;
  }

  get env(): EnvironmentConfig {
    return this.getKey<EnvironmentConfig>('testapp-env');
  }

  typeorm(): PostgresConnectionOptions {
    return this.getKey<PostgresConnectionOptions>('typeorm');
  }

  jwtOptions(): JwtModuleOptions {
    return {
      secret: this.env.JWT_SECRET,
      signOptions: {
        expiresIn: this.env.JWT_EXPIRES_IN,
      },
    };
  }
}
