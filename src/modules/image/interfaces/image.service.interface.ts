import { TFile } from '../../../common/types/file.type';
import { UserEntity } from '../../user/entities/user.entity';
import { UploadImageDto } from '../controllers/upload-image.dto';
import { ImagePreviewDto } from '../dto/image.preview.dto';
import { ImageEntity } from '../entities/image.entity';

export interface ImageServiceInterface {
  saveImage(
    user: UserEntity,
    file: TFile,
    dto: UploadImageDto,
  ): Promise<ImagePreviewDto>;
  deleteImageById(user: UserEntity, id: number): Promise<ImagePreviewDto>;
  updateImageById(
    user: UserEntity,
    id: number,
    image: TFile,
  ): Promise<ImagePreviewDto>;
  getById(imageId: number): Promise<ImageEntity | null>;
}
