import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AdminAuthResponseDto, AdminPermission, AdminRole, AdminUserDto } from '@wuh.site/shared-contracts';
import { UserRole } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

interface GithubAccessTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface GithubProfileResponse {
  id: number;
  login: string;
  email?: string | null;
  avatar_url?: string | null;
  html_url?: string | null;
  name?: string | null;
}

type ConsoleRole = 'root' | 'reader';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  buildGitHubAuthorizeUrl(state: string): string {
    const clientId = this.requireConfig('GITHUB_OAUTH_CLIENT_ID');
    const callbackUrl = this.requireConfig('GITHUB_OAUTH_CALLBACK_URL');
    const searchParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      scope: 'read:user user:email',
      state,
    });

    return `https://github.com/login/oauth/authorize?${searchParams.toString()}`;
  }

  async loginWithGithubCode(code: string): Promise<AdminAuthResponseDto> {
    const accessToken = await this.exchangeCodeForAccessToken(code);
    const profile = await this.fetchGithubProfile(accessToken);
    const role = this.userService.resolveRoleByLogin(profile.login);

    const user = await this.userService.upsertGithubUser({
      githubId: profile.id,
      login: profile.login,
      email: profile.email ?? undefined,
      avatarUrl: profile.avatar_url ?? undefined,
      profileUrl: profile.html_url ?? undefined,
      role,
    });

    const adminUser = this.toAdminUserDto(user);
    const token = this.jwtService.sign(
      {
        ...adminUser,
        sub: String(adminUser.githubId),
      },
      {
        secret: this.requireConfig('JWT_SECRET'),
        expiresIn: Number.parseInt(this.configService.get<string>('JWT_EXPIRATION') || '86400', 10),
      },
    );

    return { user: adminUser, accessToken: token };
  }

  getPermissions(role: ConsoleRole): AdminPermission[] {
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

  toAdminRole(role: UserRole): AdminRole {
    return role === UserRole.ROOT ? 'root' : 'reader';
  }

  toAdminUserDto(user: {
    githubId: number;
    login: string;
    email?: string | null;
    avatarUrl?: string | null;
    profileUrl?: string | null;
    role: UserRole;
    lastLoginAt?: Date | null;
  }): AdminUserDto {
    const role = this.toAdminRole(user.role);
    return {
      githubId: user.githubId,
      login: user.login,
      email: user.email ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      profileUrl: user.profileUrl ?? undefined,
      role,
      permissions: this.getPermissions(role),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    };
  }

  async verifyJwtToken(token: string): Promise<Record<string, unknown>> {
    try {
      return this.jwtService.verify(token, { secret: this.requireConfig('JWT_SECRET') });
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }

  private async exchangeCodeForAccessToken(code: string): Promise<string> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.requireConfig('GITHUB_OAUTH_CLIENT_ID'),
        client_secret: this.requireConfig('GITHUB_OAUTH_CLIENT_SECRET'),
        code,
        redirect_uri: this.requireConfig('GITHUB_OAUTH_CALLBACK_URL'),
      }),
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to exchange GitHub OAuth code');
    }

    const payload = (await response.json()) as GithubAccessTokenResponse;
    if (!payload.access_token) {
      throw new UnauthorizedException(payload.error_description || 'GitHub OAuth access token missing');
    }

    return payload.access_token;
  }

  private async fetchGithubProfile(accessToken: string): Promise<GithubProfileResponse> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'x.wuh.site-console',
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Failed to fetch GitHub profile');
    }

    return (await response.json()) as GithubProfileResponse;
  }

  private requireConfig(key: string): string {
    const value = this.configService.get<string>(key) || process.env[key];
    if (!value) {
      throw new UnauthorizedException(`Missing required configuration: ${key}`);
    }
    return value;
  }
}
