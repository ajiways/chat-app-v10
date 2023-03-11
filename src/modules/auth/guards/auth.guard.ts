import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class AuthorizationGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: Record<any, any>) {
    if (err || !user) {
      throw err || new UnauthorizedException('Не авторизован');
    }
    return user;
  }
}
