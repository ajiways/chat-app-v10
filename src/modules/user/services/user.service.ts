import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  DataSource,
  EntityManager,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { UserPreviewDto } from '../dto/user-preview.dto';
import { UserEntity } from '../entities/user.entity';
import { UserServiceInterface } from '../interfaces/user.service.interface';
@Injectable()
export class UserService implements UserServiceInterface {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;

  public async findById(id: number): Promise<UserEntity | null> {
    return (await this.userRepository.findOneBy({ id })) ?? null;
  }
  public async findByIds(ids: number[]): Promise<UserEntity[]> {
    return await this.userRepository.findBy({ id: In(ids) });
  }

  public async findBy(
    criteria: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity[]> {
    return await this.userRepository.findBy(criteria);
  }

  public async findOneBy(
    criteria: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    return (await this.userRepository.findOneBy(criteria)) ?? null;
  }

  public async createAndSaveUser(
    login: string,
    password: string,
    manager: EntityManager | undefined,
  ): Promise<UserEntity> {
    if (!manager) {
      return await this.dataSource.transaction((manager) =>
        this.createAndSaveUser(login, password, manager),
      );
    }

    return await manager.save(manager.create(UserEntity, { login, password }));
  }

  public async getUserPreview(user: UserEntity): Promise<UserPreviewDto> {
    return plainToInstance(UserPreviewDto, {
      userId: user.id,
      login: user.login,
    });
  }
}
