import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    default: 'Комната',
    description: 'Название комнаты',
    maxLength: 14,
    minLength: 4,
  })
  @IsString()
  @MaxLength(14)
  @MinLength(4)
  title: string;

  @ApiProperty({
    default: 'xxx_hentai_xxx',
    description: 'Кастомный айди комнаты',
    maxLength: 14,
    minLength: 4,
  })
  @IsString()
  @MaxLength(14)
  @MinLength(4)
  customId: string;

  @ApiProperty({
    default: 143,
    minimum: 1,
    description: 'Айди картинки',
  })
  @IsNumber()
  @Min(1)
  imageId: number;
}
