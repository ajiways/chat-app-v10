import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../room/entities/room.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { MessageDto } from '../dto/message.dto';
import { MessagePreviewDto } from '../dto/message.preview.dto';
import { MessageEntity } from '../entities/message.entity';
import { EMessageType } from '../enums/message-type.enum';
import { MessageServiceInterface } from '../interfaces/message.service.interface';

@Injectable()
export class MessageService implements MessageServiceInterface {
  @InjectRepository(MessageEntity)
  private readonly messageRepository: Repository<MessageEntity>;

  public async createMessage(
    user: UserEntity,
    dto: MessageDto,
    room: RoomEntity,
  ): Promise<MessagePreviewDto> {
    const message = await this.messageRepository.save({
      author: user,
      message: dto.message,
      room: room,
    });

    return plainToInstance(MessagePreviewDto, {
      author: user.login,
      date: new Date(message.createdAt).getTime(),
      message: message.message,
      roomId: room.id,
    });
  }

  public async createSystemMessage(dto: MessageDto, room: RoomEntity) {
    const message = await this.messageRepository.save({
      message: dto.message,
      room: room,
      type: EMessageType.SYSTEM,
    });

    return plainToInstance(MessagePreviewDto, {
      author: 'Система',
      date: new Date(message.createdAt).getTime(),
      message: message.message,
      roomId: room.id,
    });
  }

  public async getMessagesByRoom(
    room: RoomEntity,
    limit: number,
  ): Promise<MessagePreviewDto[]> {
    const messages = await this.messageRepository.find({
      where: { room: { id: room.id } },
      relations: { author: true },
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return messages.reverse().map((message) =>
      plainToInstance(MessagePreviewDto, {
        author: message.author.login,
        date: new Date(message.createdAt).getTime(),
        message: message.message,
        roomId: room.id,
      } as MessagePreviewDto),
    );
  }
}
