import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { MessageService } from './services/message.service';

const entities = [MessageEntity];
const services = [MessageService];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
})
export class MessageModule {}
