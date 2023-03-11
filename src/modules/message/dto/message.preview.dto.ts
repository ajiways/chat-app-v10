import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessagePreviewDto {
  @ApiProperty()
  @Expose()
  author: string;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  roomId: number;

  @ApiProperty()
  @Expose()
  date: number;
}
