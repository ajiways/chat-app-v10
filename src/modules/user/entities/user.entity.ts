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

  @OneToMany(() => ImageEntity, (image) => image.author)
  images: ImageEntity[];
}
