import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({ default: 1, description: 'ID пользователя' })
  @Expose()
  userId: number;

  @ApiProperty({ default: 'Buddy', description: 'Логин пользователя' })
  @Expose()
  login: string;

  @ApiProperty({ default: '%some_jwt_token%', description: 'JWT токен' })
  @Expose()
  token: string;
}
