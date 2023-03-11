import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EImageType } from '../common/types';

export class UploadImageDto {
  @ApiProperty({ enum: EImageType, type: 'enum', required: true })
  @IsEnum(EImageType)
  type: EImageType;
}
