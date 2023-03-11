import { UserPreviewDto } from '../../user/dto/user-preview.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthRegisterDto } from '../dto/auth.register.dto';
import { AuthResponseDto } from '../dto/auth.response.dto';
import { TTokenPayload } from '../types/token-payload.type';

export interface AuthServiceInterface {
  validateUser(payload: TTokenPayload): Promise<UserEntity | null>;
  login(
    dto: AuthLoginDto,
    userAgent: string,
  ): Promise<AuthResponseDto & { refreshToken: string }>;
  register(
    dto: AuthRegisterDto,
    userAgent: string,
  ): Promise<AuthResponseDto & { refreshToken: string }>;
  refresh(
    refreshToken: string,
    userAgent: string,
  ): Promise<{ newRefreshToken: string; token: string }>;
  getUserPreview(user: UserEntity): Promise<UserPreviewDto>;
}
