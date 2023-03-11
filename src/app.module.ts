import { Module } from '@nestjs/common';
import EnvConfig from './config/configuration/env.config';
import TypeormConfig from './config/db/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './config/configuration/config.module';
import { ConfigurationService } from './config/configuration/config.service';
import { resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';

const modules = [AuthModule, UserModule, ImageModule];
@Module({
  imports: [
    MulterModule.register(),
    ServeStaticModule.forRoot({
      rootPath: resolve('./uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [EnvConfig, TypeormConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (config: ConfigurationService) => config.typeorm(),
      inject: [ConfigurationService],
    }),
    ConfigurationModule,
    ...modules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
