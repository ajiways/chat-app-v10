import { EntityManager } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { TokenEntity } from '../entities/token.entity';
import { TTokenPayload } from '../types/token-payload.type';

export interface TokenServiceInterface {
  createAndAssignToken(
    user: UserEntity,
    userAgent: string,
    manager?: EntityManager | undefined,
  ): Promise<TokenEntity>;
  createJWTToken(payload: TTokenPayload): Promise<string>;
  checkRefreshToken(
    refreshToken: string,
    userAgent: string,
  ): Promise<{ newRefreshToken: string; token: string }>;
}
