import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ImageEntity } from '../../image/entities/image.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({
    name: 'login',
    type: 'varchar',
    length: 12,
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', name: 'socket_id', nullable: true })
  socketId: string | null;

  @OneToMany(() => ImageEntity, (image) => image.author)
  images: ImageEntity[];
}
