import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../modules/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<{ user: UserEntity }>();

    return request.user;
  },
);
