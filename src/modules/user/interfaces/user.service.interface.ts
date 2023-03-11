import { EntityManager, FindOptionsWhere } from 'typeorm';
import { UserPreviewDto } from '../dto/user-preview.dto';
import { UserEntity } from '../entities/user.entity';

export interface UserServiceInterface {
  findById(id: number): Promise<UserEntity | null>;
  findByIds(ids: number[]): Promise<UserEntity[]>;
  findBy(criteria: FindOptionsWhere<UserEntity>): Promise<UserEntity[]>;
  findOneBy(criteria: FindOptionsWhere<UserEntity>): Promise<UserEntity | null>;
  createAndSaveUser(
    login: string,
    password: string,
    manager?: EntityManager | undefined,
  ): Promise<UserEntity>;
  getUserPreview(user: UserEntity): Promise<UserPreviewDto>;
}
