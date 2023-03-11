import { Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { validate } from 'class-validator';
import { Socket } from 'socket.io';
import ClientsStorage from '../../../common/storages/clients.storage';
import { MessageDto } from '../../message/dto/message.dto';
import { MessageServiceInterface } from '../../message/interfaces/message.service.interface';
import { MessageService } from '../../message/services/message.service';
import { RoomServiceInterface } from '../../room/interfaces/room.service.interface';
import { RoomService } from '../../room/services/room.service';
import { UserServiceInterface } from '../../user/interfaces/user.service.interface';
import { UserService } from '../../user/services/user.service';
import { EEvent, ESendEvent } from '../enums/events.enum';

@WebSocketGateway(9124, { transports: ['websocket'] })
export class ApiWSGateway implements OnGatewayDisconnect {
  @Inject()
  private readonly logger: Logger;

  @Inject(UserService)
  private readonly userService: UserServiceInterface;

  @Inject(MessageService)
  private readonly messageService: MessageServiceInterface;

  @Inject(RoomService)
  private readonly roomService: RoomServiceInterface;

  private readonly clientsStorage = ClientsStorage.getInstance;

  @SubscribeMessage(EEvent.CONNECTION)
  async handleConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() arg: { userId: number },
  ) {
    if (!arg?.userId) {
      this.logger.warn('Someone connected without user id');
      if (client) {
        client.emit(ESendEvent.TRY_RECONNECT);
      }
      return;
    }

    const user = await this.userService.findById(arg.userId);

    if (!user) {
      this.logger.error('Someone connected with user id, but its invalid');
      return;
    }
    this.logger.log(`User with id ${arg.userId} connected`);

    client.emit(ESendEvent.CONNECTION_SUCCEED);

    this.clientsStorage.addClient(user.id, client);
  }

  handleDisconnect(client: Socket) {
    const userId = this.clientsStorage.getUserIdByClientId(client.id);

    if (!userId) {
      this.logger.warn(
        "Someone disconnected, but we don't know who it was (no user id)",
      );
    }

    this.clientsStorage.removeClient(userId, client);

    this.logger.log(`User with id ${userId} disconnected`);
  }

  @SubscribeMessage(EEvent.MESSAGE)
  async handleMessage(
    @MessageBody() arg: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const errors = await validate(arg);

    if (errors.length) {
      this.logger.warn(
        `Client ${client.id} tried to send a message, errors: ${errors.map(
          (error) => error.constraints,
        )}`,
      );
      if (client) {
        client.emit(
          ESendEvent.NEW_MESSAGE_ERROR,
          errors.map((error) => error.constraints),
        );
      }
      return;
    }

    const userId = this.clientsStorage.getUserIdByClientId(client.id);

    if (!userId) {
      this.logger.warn(
        `Unknown client (userId: ${userId}) tried to send a message`,
      );
      return;
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      this.logger.warn(
        `Unknown client (userId: ${userId}) tried to send a message`,
      );
      return;
    }

    const room = await this.roomService.findOne({ id: arg.roomId });

    if (!room) {
      this.logger.error(
        `User ${user.id} tried to send a message in a non existing room`,
      );
      return;
    }

    const message = await this.messageService.createMessage(user, arg, room);

    const sendToIds = await this.roomService.getAllUserIdsByRoom(room);

    this.sendToClients(sendToIds, ESendEvent.NEW_MESSAGE, message);
  }

  @SubscribeMessage(EEvent.JOIN_ROOM)
  async joinRoom(
    @MessageBody() arg: { customId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!arg?.customId) {
      this.logger.warn(`Someone tried to join room without id`);
      return;
    }

    const userId = this.clientsStorage.getUserIdByClientId(client.id);

    if (!userId) {
      this.logger.warn(
        `Unknown user tried to join room with custom id: ${arg.customId}`,
      );
      return;
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      this.logger.warn(
        `User with id ${userId} tried to join room with custom id: ${arg.customId}, but there is no user with this id`,
      );
      return;
    }

    const room = await this.roomService.findOne({ customId: arg.customId });

    if (!room) {
      this.logger.warn(
        `User with id ${user.id} tried to join non existing room (customId: ${arg.customId})`,
      );
      return;
    }

    await this.roomService.addUserIntoRoom(user, room);
    const sendToIds = await this.roomService.getAllUserIdsByRoom(room);
    const message = await this.messageService.createSystemMessage(
      {
        message: `Пользователь ${user.login} подюключился!`,
        roomId: room.id,
      },
      room,
    );

    this.sendToClients(sendToIds, ESendEvent.NEW_USER, message);
  }

  private sendToClients<T>(userIds: number[], event: ESendEvent, payload: T) {
    const clients = this.clientsStorage.getByUsersIds(userIds);

    for (const client of clients) {
      client.emit(event, payload);
    }
  }
}
