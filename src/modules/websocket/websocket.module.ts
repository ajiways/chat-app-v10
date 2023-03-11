import { Logger, Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module';
import { ApiWSGateway } from './gateways/api.ws.gateway';

@Module({
  imports: [UserModule, MessageModule, RoomModule],
  providers: [ApiWSGateway, Logger],
  exports: [],
})
export class WebSocketModule {}
