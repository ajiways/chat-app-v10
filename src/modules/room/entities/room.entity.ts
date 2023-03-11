import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { ImageEntity } from '../../image/entities/image.entity';

@Entity('rooms')
export class RoomEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 20,
    name: 'title',
    nullable: false,
    unique: true,
  })
  title: string;

  @OneToOne(() => ImageEntity, (image) => image.room, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'image_id' })
  image: ImageEntity;

  @Column({ type: 'varchar', length: 14, name: 'custom_id', nullable: false })
  customId: string;
}
