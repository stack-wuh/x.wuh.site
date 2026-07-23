import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const createService = () => {
    const config = {
      get: jest.fn((key: string) => {
        const values: Record<string, string> = {
          GITHUB_OAUTH_CLIENT_ID: 'client-id',
          GITHUB_OAUTH_CLIENT_SECRET: 'client-secret',
          GITHUB_OAUTH_CALLBACK_URL: 'http://localhost:3200/v2/auth/github/callback',
          CONSOLE_URL: 'http://localhost:3300',
          JWT_SECRET: 'jwt-secret',
          JWT_EXPIRATION: '86400',
        };
        return values[key];
      }),
    } as unknown as ConfigService;

    const jwt = {
      sign: jest.fn().mockReturnValue('signed.jwt.token'),
      verify: jest.fn().mockReturnValue({ githubId: 1 }),
    } as unknown as JwtService;

    const userService = {
      resolveRoleByLogin: jest.fn((login: string) => (login === 'stack-wuh' ? UserRole.ROOT : UserRole.READER)),
      upsertGithubUser: jest.fn(async (input: any) => input),
    } as unknown as UserService;

    const service = new AuthService(config, jwt, userService);
    return { service, config, jwt, userService };
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds GitHub authorize url with callback and state', () => {
    const { service } = createService();

    const result = service.buildGitHubAuthorizeUrl('state-123');

    expect(result).toContain('https://github.com/login/oauth/authorize');
    expect(result).toContain('client_id=client-id');
    expect(result).toContain('redirect_uri=' + encodeURIComponent('http://localhost:3200/v2/auth/github/callback'));
    expect(result).toContain('state=state-123');
    expect(result).toContain('scope=read%3Auser');
  });

  it('upserts GitHub users and signs a root token for stack-wuh', async () => {
    const { service, userService, jwt } = createService();
    jest.spyOn(service as any, 'exchangeCodeForAccessToken').mockResolvedValue('gh-access');
    jest.spyOn(service as any, 'fetchGithubProfile').mockResolvedValue({
      id: 123,
      login: 'stack-wuh',
      email: 'root@example.com',
      avatar_url: 'https://avatars.example/root.png',
      html_url: 'https://github.com/stack-wuh',
    });

    const result = await service.loginWithGithubCode('code-123');

    expect(userService.upsertGithubUser).toHaveBeenCalledWith(
      expect.objectContaining({ login: 'stack-wuh', role: UserRole.ROOT }),
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        githubId: 123,
        login: 'stack-wuh',
        role: 'root',
        permissions: expect.arrayContaining(['admin:write', 'content:write']),
      }),
      expect.any(Object),
    );
    expect(result.user.role).toBe('root');
    expect(result.user.permissions).toEqual(expect.arrayContaining(['admin:write', 'content:write']));
    expect(result.accessToken).toBe('signed.jwt.token');
  });

  it('downgrades non-root users to reader before signing the token', async () => {
    const { service, userService, jwt } = createService();
    jest.spyOn(service as any, 'exchangeCodeForAccessToken').mockResolvedValue('gh-access');
    jest.spyOn(service as any, 'fetchGithubProfile').mockResolvedValue({
      id: 124,
      login: 'guest-user',
      email: 'guest@example.com',
      avatar_url: 'https://avatars.example/guest.png',
      html_url: 'https://github.com/guest-user',
    });

    const result = await service.loginWithGithubCode('code-456');

    expect(userService.upsertGithubUser).toHaveBeenCalledWith(
      expect.objectContaining({ login: 'guest-user', role: UserRole.READER }),
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'reader',
        permissions: ['admin:read', 'content:read', 'guestbook:read', 'comment:read'],
      }),
      expect.any(Object),
    );
    expect(result.user.role).toBe('reader');
    expect(result.user.permissions).toEqual(['admin:read', 'content:read', 'guestbook:read', 'comment:read']);
  });
});
