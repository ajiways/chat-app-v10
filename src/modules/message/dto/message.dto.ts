import { Transform } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class MessageDto {
  @IsNumber()
  roomId: number;

  @Transform(({ value }: { value: string }) => value.trim())
  @MinLength(1)
  @IsString()
  message: string;
}
