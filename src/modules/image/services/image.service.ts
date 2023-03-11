import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as mime from 'mime';
import { Repository } from 'typeorm';
import { deleteFile } from '../../../common/helpers/file.helper';
import { TFile } from '../../../common/types/file.type';
import { UserEntity } from '../../user/entities/user.entity';
import { EIMAGE_EXTENSION } from '../common/extensions';
import { UploadImageDto } from '../controllers/upload-image.dto';
import { ImagePreviewDto } from '../dto/image.preview.dto';
import { ImageEntity } from '../entities/image.entity';
import { ImageServiceInterface } from '../interfaces/image.service.interface';

@Injectable()
export class ImageService implements ImageServiceInterface {
  @InjectRepository(ImageEntity)
  private readonly imageRepository: Repository<ImageEntity>;

  public async saveImage(
    user: UserEntity,
    file: TFile,
    dto: UploadImageDto,
  ): Promise<ImagePreviewDto> {
    const saved = await this.imageRepository.save({
      filePath: file.path,
      originalFileExtension: mime.getExtension(
        file.mimetype,
      ) as EIMAGE_EXTENSION,
      originalFileName: file.originalname,
      author: user,
      type: dto.type,
    });

    return plainToInstance(ImagePreviewDto, saved, {
      excludeExtraneousValues: true,
    });
  }

  public async deleteImageById(
    user: UserEntity,
    id: number,
  ): Promise<ImagePreviewDto> {
    const toDelete = await this.imageRepository.findOne({
      where: { id, author: { id: user.id } },
    });

    this.checkIfImageExists(toDelete);

    await this.imageRepository.delete(toDelete.id);

    await deleteFile(toDelete.filePath);

    return plainToInstance(ImagePreviewDto, toDelete, {
      excludeExtraneousValues: true,
    });
  }

  public async updateImageById(
    user: UserEntity,
    id: number,
    image: TFile,
  ): Promise<ImagePreviewDto> {
    if (!image) {
      throw new BadRequestException('Нет файла');
    }

    const toUpdate = await this.imageRepository.findOne({
      where: { id, author: { id: user.id } },
    });

    if (!toUpdate) {
      throw new NotFoundException('Такой картинки нет');
    }

    this.checkIfImageExists(toUpdate);

    await this.imageRepository.update(toUpdate, {
      filePath: image.path,
      originalFileName: image.originalname,
      originalFileExtension: mime.getExtension(
        image.mimetype,
      ) as EIMAGE_EXTENSION,
    });

    const updated = await this.imageRepository.findOne({
      where: { id: toUpdate.id },
    });

    await deleteFile(toUpdate.filePath);

    return plainToInstance(ImagePreviewDto, updated, {
      excludeExtraneousValues: true,
    });
  }

  private checkIfImageExists(image: ImageEntity | null) {
    if (!image) {
      throw new NotFoundException('Изображение не найдено');
    }
  }
}
