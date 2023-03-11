import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './controllers/image.controller';
import { ImageEntity } from './entities/image.entity';
import { ImageService } from './services/image.service';

const entities = [ImageEntity];
const controllers = [ImageController];
const services = [ImageService];
const modules = [];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  controllers,
  providers: [...services],
  exports: [...services],
})
export class ImageModule {}
