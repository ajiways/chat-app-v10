import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { RoomEntity } from '../../room/entities/room.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { EMessageType } from '../enums/message-type.enum';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: UserEntity;

  @Column({ type: 'text', nullable: false, name: 'message' })
  message: string;

  @ManyToOne(() => RoomEntity, (room) => room.messages, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: RoomEntity;

  @Column({
    type: 'enum',
    enum: EMessageType,
    default: EMessageType.SYSTEM,
    nullable: false,
    name: 'type',
  })
  type: EMessageType;
}
