import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { EMemberStatus } from '../enums/member.status.enum';
import { RoomEntity } from './room.entity';

@Entity('users_rooms')
export class UserRoomEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => RoomEntity, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: RoomEntity;

  @Column({
    type: 'enum',
    enum: EMemberStatus,
    name: 'member_status',
    nullable: false,
  })
  memberStatus: EMemberStatus;
}
