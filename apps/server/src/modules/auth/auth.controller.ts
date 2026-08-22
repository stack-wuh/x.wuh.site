import { BadRequestException, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

const OAUTH_STATE_COOKIE = 'oauth_state';
const OAUTH_RETURN_TO_COOKIE = 'oauth_return_to';
const OAUTH_COOKIE_MAX_AGE = 1000 * 60 * 10;

function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const segment of cookieHeader.split(';')) {
    const [rawKey, ...rawValue] = segment.split('=');
    if (rawKey?.trim() !== name) continue;
    return decodeURIComponent(rawValue.join('=').trim());
  }
  return undefined;
}

function getCookie(req: Request, name: string): string | undefined {
  return (req as any).cookies?.[name] || readCookie(req.headers.cookie, name);
}

function safeReturnTo(returnTo: string | undefined): string {
  if (!returnTo || !returnTo.startsWith('/') || returnTo.startsWith('//')) return '/';
  return returnTo;
}

function joinConsoleUrl(consoleUrl: string, returnTo: string): string {
  return `${consoleUrl.replace(/\/$/, '')}${returnTo}`;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github')
  @ApiOperation({ summary: 'Redirect to GitHub OAuth' })
  redirectToGithub(@Query('state') returnTo = '/', @Res() res: Response) {
    const oauthState = randomBytes(16).toString('hex');
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: isProduction,
      path: '/',
      maxAge: OAUTH_COOKIE_MAX_AGE,
    };

    res.cookie(OAUTH_STATE_COOKIE, oauthState, cookieOptions);
    res.cookie(OAUTH_RETURN_TO_COOKIE, safeReturnTo(returnTo), cookieOptions);

    return res.redirect(this.authService.buildGitHubAuthorizeUrl(oauthState));
  }

  @Get('github/callback')
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirect to console after login' })
  async githubCallback(
    @Query('code') code: string,
    @Query('state') state: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const expectedState = getCookie(req, OAUTH_STATE_COOKIE);
    if (!state || !expectedState || state !== expectedState) {
      throw new BadRequestException('Invalid GitHub OAuth state');
    }

    const result = await this.authService.loginWithGithubCode(code);
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie(OAUTH_STATE_COOKIE, { path: '/' });
    res.clearCookie(OAUTH_RETURN_TO_COOKIE, { path: '/' });
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24,
    });

    const consoleUrl = this.configService.get<string>('CONSOLE_URL') || '/';
    const returnTo = safeReturnTo(getCookie(req, OAUTH_RETURN_TO_COOKIE));
    return res.redirect(joinConsoleUrl(consoleUrl, returnTo));
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout console session' })
  logout(@Res() res: Response) {
    res.clearCookie('access_token', { path: '/' });
    return res.json({ ok: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Current authenticated user' })
  @ApiResponse({ status: 200, description: 'Authenticated user info' })
  me(@CurrentUser() user: any) {
    return user;
  }
}
