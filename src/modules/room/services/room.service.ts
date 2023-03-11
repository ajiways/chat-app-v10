import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ImageServiceInterface } from '../../image/interfaces/image.service.interface';
import { ImageService } from '../../image/services/image.service';
import { MessageServiceInterface } from '../../message/interfaces/message.service.interface';
import { MessageService } from '../../message/services/message.service';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomPreviewDto } from '../dto/room.preview.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { RoomEntity } from '../entities/room.entity';
import { UserRoomEntity } from '../entities/users-rooms.entity';
import { EMemberStatus } from '../enums/member.status.enum';
import { RoomServiceInterface } from '../interfaces/room.service.interface';

@Injectable()
export class RoomService implements RoomServiceInterface {
  @Inject(ImageService)
  private readonly imageService: ImageServiceInterface;

  @Inject(MessageService)
  private readonly messageService: MessageServiceInterface;

  @InjectRepository(UserRoomEntity)
  private readonly userRoomRepository: Repository<UserRoomEntity>;

  @InjectRepository(RoomEntity)
  private readonly roomRepository: Repository<RoomEntity>;

  public async createRoom(
    user: UserEntity,
    dto: CreateRoomDto,
  ): Promise<RoomPreviewDto> {
    const image = await this.imageService.getById(dto.imageId);

    if (!image) {
      throw new NotFoundException('Изображение не найдено');
    }

    const candidate = await this.roomRepository.findOne({
      where: { title: dto.title },
    });

    if (candidate) {
      throw new BadRequestException('Название комнаты уже занято');
    }

    const savedRoom = await this.roomRepository.save({
      owner: user,
      title: dto.title,
      customId: dto.customId,
      messages: [],
      image,
    });

    await this.userRoomRepository.save({
      memberStatus: EMemberStatus.OWNER,
      room: savedRoom,
      user,
    });

    return await this.getRoomPreview(savedRoom.id);
  }

  public async updateRoom(
    user: UserEntity,
    dto: UpdateRoomDto,
  ): Promise<RoomPreviewDto> {
    const toUpdateUserRoom = await this.userRoomRepository.findOne({
      where: {
        room: { id: dto.id },
        user: { id: user.id },
        memberStatus: EMemberStatus.OWNER,
      },
    });

    if (!toUpdateUserRoom) {
      throw new NotFoundException('Комната не найдена');
    }

    const toUpdate = await this.roomRepository.findOne({
      where: { id: dto.id },
    });

    if (!toUpdate) {
      throw new NotFoundException('Комната не найдена');
    }

    await this.roomRepository.update(toUpdate.id, {
      title: dto.title,
      customId: dto.customId,
    });

    const updated = await this.roomRepository.findOne({
      where: { id: toUpdate.id },
    });

    return await this.getRoomPreview(updated.id);
  }

  public async deleteRoom(
    user: UserEntity,
    roomId: number,
  ): Promise<RoomPreviewDto> {
    const toDeleteUserRoom = await this.userRoomRepository.findOne({
      where: {
        room: { id: roomId },
        user: { id: user.id },
        memberStatus: EMemberStatus.OWNER,
      },
    });

    if (!toDeleteUserRoom) {
      throw new NotFoundException('Комната не найдена');
    }

    const toDelete = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!toDelete) {
      throw new NotFoundException('Комната не найдена');
    }

    const roomPreview = await this.getRoomPreview(toDelete.id);

    await this.roomRepository.delete(toDelete.id);

    return roomPreview;
  }

  public async getRoomPreview(roomId: number): Promise<RoomPreviewDto> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: { image: true, messages: true },
    });

    const roomMessages = await this.messageService.getMessagesByRoom(room, 40);

    const roomOwner = await this.userRoomRepository.findOne({
      where: { memberStatus: EMemberStatus.OWNER, room: { id: room.id } },
      relations: { user: true },
    });

    const roomUsers = await this.userRoomRepository.find({
      where: { room: { id: room.id } },
      relations: { user: true },
    });

    return plainToInstance(RoomPreviewDto, {
      customId: room.customId,
      id: room.id,
      image: room.image.filePath,
      imageId: room.image.id,
      owner: plainToInstance(UserPreviewDto, {
        login: roomOwner.user.login,
        userId: roomOwner.user.id,
      }),
      title: room.title,
      users: roomUsers.map((ru) =>
        plainToInstance(UserPreviewDto, {
          login: ru.user.login,
          userId: ru.user.id,
        }),
      ),
      messages: roomMessages,
      lastMessage: roomMessages[roomMessages.length - 1] ?? null,
    } as RoomPreviewDto);
  }

  public async getAllUserRooms(user: UserEntity): Promise<RoomPreviewDto[]> {
    const allUserRoomIds: { id: number }[] =
      await this.userRoomRepository.query(
        `
      SELECT DISTINCT room.room_id as id FROM users_rooms room WHERE room.user_id = $1;
    `,
        [user.id],
      );

    return await Promise.all(
      allUserRoomIds.map(async (item) => await this.getRoomPreview(item.id)),
    );
  }

  public async findOne(
    criteria: FindOptionsWhere<RoomEntity>,
  ): Promise<RoomEntity | null> {
    return this.roomRepository.findOneBy(criteria);
  }

  public async getAllUserIdsByRoom(room: RoomEntity): Promise<number[]> {
    const allUserIds: { id: number }[] = await this.userRoomRepository.query(
      `
      SELECT ur.user_id as id FROM users_rooms ur WHERE ur.room_id = $1
    `,
      [room.id],
    );

    return allUserIds.map((ur) => ur.id);
  }

  public async addUserIntoRoom(
    user: UserEntity,
    room: RoomEntity,
  ): Promise<void> {
    await this.userRoomRepository.save({ user, room });
  }
}
