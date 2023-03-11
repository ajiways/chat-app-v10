import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { EIMAGE_EXTENSION } from '../common/extensions';
import { EImageState, EImageType } from '../common/types';

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Column({ name: 'file_path', type: 'varchar', nullable: false, unique: true })
  filePath: string;

  @Column({ name: 'original_file_name', type: 'varchar', nullable: false })
  originalFileName: string;

  @Column({
    name: 'original_file_extension',
    type: 'enum',
    enum: EIMAGE_EXTENSION,
    nullable: false,
  })
  originalFileExtension: EIMAGE_EXTENSION;

  @ManyToOne(() => UserEntity, (user) => user.images, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  author: UserEntity;

  @Column({
    type: 'enum',
    enum: EImageState,
    nullable: false,
    default: EImageState.UNATTACHED,
  })
  state: EImageState;

  @Column({ type: 'enum', enum: EImageType, nullable: false })
  type: EImageType;
}
