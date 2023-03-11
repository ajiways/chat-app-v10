import { RoomEntity } from '../../room/entities/room.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { MessageDto } from '../dto/message.dto';
import { MessagePreviewDto } from '../dto/message.preview.dto';

export interface MessageServiceInterface {
  createMessage(
    user: UserEntity,
    dto: MessageDto,
    room: RoomEntity,
  ): Promise<MessagePreviewDto>;
  getMessagesByRoom(
    room: RoomEntity,
    limit: number,
  ): Promise<MessagePreviewDto[]>;
  createSystemMessage(dto: MessageDto, room: RoomEntity);
}
