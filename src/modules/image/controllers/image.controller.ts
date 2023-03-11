import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ApiFile } from '../../../common/decorators/api-file.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { fileStorage } from '../../../common/storages/file.storage';
import { fileExtensionFilter } from '../../../common/validators/file-extension.validator';
import { AuthorizationGuard } from '../../auth/guards/auth.guard';
import { UserEntity } from '../../user/entities/user.entity';
import { IMAGE_EXTENSIONS } from '../common/extensions';
import { updateImageSchema } from '../common/schemas/update-image.schema';
import { imageUploadSchema } from '../common/schemas/upload-image.schema';
import { MAX_IMAGE_SIZE } from '../constants/constants';
import { ImagePreviewDto } from '../dto/image.preview.dto';
import { ImageServiceInterface } from '../interfaces/image.service.interface';
import { ImageService } from '../services/image.service';
import { UploadImageDto } from './upload-image.dto';

@Controller('/image')
@UseGuards(AuthorizationGuard)
export class ImageController {
  @Inject(ImageService)
  private readonly imageService: ImageServiceInterface;

  @ApiOperation({ description: 'Загрузка изображения' })
  @ApiFile(
    'image',
    true,
    {
      fileFilter: fileExtensionFilter(...IMAGE_EXTENSIONS),
      storage: fileStorage,
      limits: {
        fileSize: MAX_IMAGE_SIZE,
      },
    },
    imageUploadSchema,
  )
  @ApiResponse({ type: ImagePreviewDto, status: HttpStatus.CREATED })
  @Post()
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserEntity,
    @Body() arg: UploadImageDto,
  ) {
    return await this.imageService.saveImage(user, image, arg);
  }

  @ApiOperation({ description: 'Обновить изображение' })
  @ApiResponse({ type: ImagePreviewDto, status: HttpStatus.CREATED })
  @ApiParam({ name: 'id', type: 'number', description: 'ID изображения' })
  @ApiFile(
    'image',
    true,
    {
      fileFilter: fileExtensionFilter(...IMAGE_EXTENSIONS),
      storage: fileStorage,
      limits: {
        fileSize: MAX_IMAGE_SIZE,
      },
    },
    updateImageSchema,
  )
  @Put('/:id')
  async updateImage(
    @UploadedFile() image: Express.Multer.File,
    @CurrentUser() user: UserEntity,
    @Param('id') id: number,
  ) {
    return await this.imageService.updateImageById(user, id, image);
  }

  @ApiOperation({ description: 'Удалить изображение' })
  @ApiResponse({ type: ImagePreviewDto, status: HttpStatus.CREATED })
  @ApiParam({ name: 'id', type: 'number', description: 'ID изображения' })
  @Delete('/:id')
  async deleteImage(@CurrentUser() user: UserEntity, @Param('id') id: number) {
    return await this.imageService.deleteImageById(user, id);
  }
}
