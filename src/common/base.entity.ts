import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn({ generated: 'increment', nullable: false, type: 'integer' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
