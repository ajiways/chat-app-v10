import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';

export class RoomPreviewDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ type: UserPreviewDto, isArray: true })
  @Expose()
  users: UserPreviewDto[];

  @ApiProperty({ type: UserPreviewDto })
  @Expose()
  owner: UserPreviewDto;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty()
  @Expose()
  imageId: number;

  @ApiProperty()
  @Expose()
  customId: string;

  @ApiProperty()
  @Expose()
  id: number;
}
