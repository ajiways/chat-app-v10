import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ImagePreviewDto {
  @ApiProperty({ default: 1, description: 'ID изображения' })
  @Expose()
  id: number;

  @ApiProperty({
    default: '/uploads/12/13/14/15/img.jpeg',
    description: 'Путь к изображению',
  })
  @Expose()
  filePath: string;

  @ApiProperty({
    default: 'image.png',
    description: 'Оригинальное название изображения',
  })
  @Expose()
  originalFileName: string;
}
