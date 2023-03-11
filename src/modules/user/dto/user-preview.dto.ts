import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserPreviewDto {
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  login: string;
}
