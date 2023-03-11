import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './controllers/room.controller';
import { RoomEntity } from './entities/room.entity';
import { UserRoomEntity } from './entities/users-rooms.entity';
import { RoomService } from './services/room.service';

const services = [RoomService];
const modules = [ImageModule, UserModule];
const controllers = [RoomController];
const entities = [RoomEntity, UserRoomEntity];

@Module({
  controllers,
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services],
  exports: [...services],
})
export class RoomModule {}
