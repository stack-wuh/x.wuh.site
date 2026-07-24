import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ROOT_GITHUB_LOGIN } from '../user/user.service';

@Injectable()
export class RootGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: { login?: string } }>();
    const user = request.user;

    if (!user || user.login !== ROOT_GITHUB_LOGIN) {
      throw new ForbiddenException('Root permission required');
    }

    return true;
  }
}
