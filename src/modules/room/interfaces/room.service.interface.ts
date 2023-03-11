import { FindOptionsWhere } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomPreviewDto } from '../dto/room.preview.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { RoomEntity } from '../entities/room.entity';

export interface RoomServiceInterface {
  getAllUserRooms(user: UserEntity): Promise<RoomPreviewDto[]>;
  createRoom(user: UserEntity, dto: CreateRoomDto): Promise<RoomPreviewDto>;
  updateRoom(user: UserEntity, dto: UpdateRoomDto): Promise<RoomPreviewDto>;
  deleteRoom(user: UserEntity, roomId: number): Promise<RoomPreviewDto>;
  findOne(criteria: FindOptionsWhere<RoomEntity>): Promise<RoomEntity | null>;
  getAllUserIdsByRoom(room: RoomEntity): Promise<number[]>;
  addUserIntoRoom(user: UserEntity, room: RoomEntity): Promise<void>;
  getRoomPreview(roomId: number): Promise<RoomPreviewDto>;
}
