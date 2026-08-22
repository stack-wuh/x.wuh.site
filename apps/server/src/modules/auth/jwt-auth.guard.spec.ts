import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  const context = (authorization?: string, cookie?: string) => {
    const request: any = { headers: { authorization, cookie } };
    return {
      request,
      executionContext: {
        switchToHttp: () => ({ getRequest: () => request }),
      } as any,
    };
  };

  it('normalizes non-stack-wuh root claims to reader for UI safety', async () => {
    const authService = {
      verifyJwtToken: jest.fn().mockResolvedValue({
        githubId: 2,
        login: 'guest',
        role: 'root',
        permissions: ['admin:write'],
      }),
    };
    const guard = new JwtAuthGuard(authService as any);
    const { request, executionContext } = context('Bearer token');

    await expect(guard.canActivate(executionContext)).resolves.toBe(true);

    expect(request.user).toEqual(
      expect.objectContaining({
        githubId: 2,
        login: 'guest',
        role: 'reader',
        permissions: ['admin:read', 'content:read', 'guestbook:read', 'comment:read'],
      }),
    );
  });

  it('keeps stack-wuh as root', async () => {
    const authService = {
      verifyJwtToken: jest.fn().mockResolvedValue({ githubId: 1, login: 'stack-wuh', role: 'root' }),
    };
    const guard = new JwtAuthGuard(authService as any);
    const { request, executionContext } = context(undefined, 'access_token=cookie-token');

    await expect(guard.canActivate(executionContext)).resolves.toBe(true);

    expect(authService.verifyJwtToken).toHaveBeenCalledWith('cookie-token');
    expect(request.user).toEqual(expect.objectContaining({ login: 'stack-wuh', role: 'root' }));
  });

  it('rejects requests without a bearer token or access_token cookie', async () => {
    const guard = new JwtAuthGuard({ verifyJwtToken: jest.fn() } as any);
    const { executionContext } = context();

    await expect(guard.canActivate(executionContext)).rejects.toThrow(UnauthorizedException);
  });
});
