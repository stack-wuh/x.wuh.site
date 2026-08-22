import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ROOT_GITHUB_LOGIN } from '../user/user.service';

function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const segment of cookieHeader.split(';')) {
    const [rawKey, ...rawValue] = segment.split('=');
    if (rawKey?.trim() !== name) continue;
    return decodeURIComponent(rawValue.join('=').trim());
  }
  return undefined;
}

function permissionsFor(role: 'root' | 'reader') {
  return role === 'root'
    ? [
        'admin:read',
        'admin:write',
        'content:read',
        'content:write',
        'guestbook:read',
        'guestbook:write',
        'comment:read',
        'comment:write',
      ]
    : ['admin:read', 'content:read', 'guestbook:read', 'comment:read'];
}

function normalizeUser(payload: Record<string, unknown>) {
  const login = typeof payload.login === 'string' ? payload.login : undefined;
  const role = login === ROOT_GITHUB_LOGIN ? 'root' : 'reader';

  return {
    ...payload,
    login,
    role,
    permissions: permissionsFor(role),
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: unknown }>();
    const token = this.extractToken(request.headers.authorization, request.headers.cookie);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    request.user = normalizeUser(await this.authService.verifyJwtToken(token));
    return true;
  }

  private extractToken(authorization: string | undefined, cookieHeader: string | undefined): string | undefined {
    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length).trim();
    }

    return readCookie(cookieHeader, 'access_token');
  }
}
