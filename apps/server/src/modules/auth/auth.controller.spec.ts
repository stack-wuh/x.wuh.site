import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';

describe('AuthController OAuth state handling', () => {
  const createController = () => {
    const authService = {
      buildGitHubAuthorizeUrl: jest.fn((state: string) => `https://github.test/oauth?state=${state}`),
      loginWithGithubCode: jest.fn().mockResolvedValue({ accessToken: 'jwt-token', user: { login: 'stack-wuh' } }),
    };
    const configService = {
      get: jest.fn((key: string) => (key === 'CONSOLE_URL' ? 'http://localhost:3300' : undefined)),
    };
    const controller = new AuthController(authService as any, configService as any);
    return { controller, authService, configService };
  };

  const response = () => ({
    cookie: jest.fn(),
    clearCookie: jest.fn(),
    redirect: jest.fn(),
    json: jest.fn(),
  });

  it('stores a generated oauth state and return path before redirecting to GitHub', () => {
    const { controller, authService } = createController();
    const res = response();

    controller.redirectToGithub('/content/posts', res as any);

    expect(res.cookie).toHaveBeenCalledWith(
      'oauth_state',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'oauth_return_to',
      '/content/posts',
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
    const generatedState = res.cookie.mock.calls.find(([name]) => name === 'oauth_state')?.[1];
    expect(authService.buildGitHubAuthorizeUrl).toHaveBeenCalledWith(generatedState);
    expect(res.redirect).toHaveBeenCalledWith(`https://github.test/oauth?state=${generatedState}`);
  });

  it('rejects callback requests when oauth state does not match the cookie', async () => {
    const { controller } = createController();
    const res = response();
    const req = { cookies: { oauth_state: 'expected-state' }, headers: {} };

    await expect(controller.githubCallback('code', 'wrong-state', req as any, res as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('clears oauth cookies and redirects to the original console path after login', async () => {
    const { controller } = createController();
    const res = response();
    const req = { cookies: { oauth_state: 'state-123', oauth_return_to: '/comments' }, headers: {} };

    await controller.githubCallback('code', 'state-123', req as any, res as any);

    expect(res.clearCookie).toHaveBeenCalledWith('oauth_state', { path: '/' });
    expect(res.clearCookie).toHaveBeenCalledWith('oauth_return_to', { path: '/' });
    expect(res.cookie).toHaveBeenCalledWith('access_token', 'jwt-token', expect.any(Object));
    expect(res.redirect).toHaveBeenCalledWith('http://localhost:3300/comments');
  });
});
