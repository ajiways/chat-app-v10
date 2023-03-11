import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { UserTokenEntity } from './user-token.entity';

@Entity('tokens')
export class TokenEntity extends BaseEntity {
  @Column({ type: 'text', name: 'token', nullable: false, unique: true })
  token: string;

  @Column({ type: 'text', name: 'user_agent', nullable: false })
  userAgent: string;

  @OneToOne(() => UserTokenEntity, (userToken) => userToken.token, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  userToken: UserTokenEntity;
}
