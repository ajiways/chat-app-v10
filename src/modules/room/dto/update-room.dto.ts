import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRoomDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @ApiProperty({
    default: 'Комната',
    description: 'Название комнаты',
    maxLength: 14,
    minLength: 4,
    required: false,
  })
  @IsString()
  @MaxLength(14)
  @MinLength(4)
  title?: string;

  @IsOptional()
  @ApiProperty({
    default: 'xxx_hentai_xxx',
    description: 'Кастомный айди комнаты',
    maxLength: 14,
    minLength: 4,
    required: false,
  })
  @IsString()
  @MaxLength(14)
  @MinLength(4)
  customId?: string;
}
