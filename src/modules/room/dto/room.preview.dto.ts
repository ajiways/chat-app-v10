import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MessagePreviewDto } from '../../message/dto/message.preview.dto';
import { UserPreviewDto } from '../../user/dto/user-preview.dto';

export class RoomPreviewDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ type: MessagePreviewDto, isArray: true })
  @Expose()
  messages: MessagePreviewDto[];

  @ApiProperty({ type: MessagePreviewDto, required: false })
  @Expose()
  lastMessage: MessagePreviewDto | null = null;

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
