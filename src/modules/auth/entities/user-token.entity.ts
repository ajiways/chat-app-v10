import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TokenEntity } from './token.entity';

@Entity('users_tokens')
export class UserTokenEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToOne(() => TokenEntity, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'token_id', referencedColumnName: 'id' })
  token: TokenEntity;
}
