import { Controller, Get, Param, Query, NotFoundException, Post, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { ContentService } from './content.service';
import { QueryContentDto } from './dto/content.dto';
import { Request, Response } from 'express';

const ANON_COOKIE_NAME = 'anonId';
const ANON_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365;

function readCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const segment of cookieHeader.split(';')) {
    const [rawKey, ...rawValue] = segment.split('=');
    if (rawKey?.trim() !== name) continue;
    return decodeURIComponent(rawValue.join('=').trim());
  }
  return undefined;
}

function getAnonId(req: Request): string | undefined {
  return (req as any).cookies?.[ANON_COOKIE_NAME] || readCookie(req.headers.cookie, ANON_COOKIE_NAME);
}

function ensureAnonId(req: Request, res: Response): string {
  const existing = getAnonId(req);
  if (existing) return existing;

  const anonId = uuidv4();
  res.cookie(ANON_COOKIE_NAME, anonId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ANON_COOKIE_MAX_AGE,
    path: '/',
  });
  return anonId;
}

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Get paginated blog posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'labels', required: false, type: [String] })
  @ApiQuery({ name: 'state', required: false, enum: ['open', 'closed'] })
  @ApiResponse({ status: 200, description: 'Paginated list of posts' })
  async getPosts(@Query() query: QueryContentDto) {
    const { page = 1, limit = 20, labels, state } = query;
    const dbQuery: Record<string, any> = {};

    if (labels && labels.length > 0) {
      dbQuery.labels = { $in: labels };
    }
    if (state) {
      dbQuery.state = state;
    }

    return this.contentService.findAll(page, limit, dbQuery);
  }

  @Get('labels')
  @ApiOperation({ summary: 'Get blog label summaries' })
  @ApiQuery({ name: 'state', required: false, enum: ['open', 'closed'] })
  @ApiResponse({ status: 200, description: 'Blog label summaries' })
  async getLabels(@Query() query: Pick<QueryContentDto, 'state'>) {
    return this.contentService.getLabelSummaries({ state: query.state });
  }

  @Get('posts/:slugOrNumber')
  @ApiOperation({ summary: 'Get a single post by slug or issue number' })
  @ApiResponse({ status: 200, description: 'Post details with prev/next adjacent posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostDetail(
    @Param('slugOrNumber') slugOrNumber: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.contentService.findBySlugOrNumber(slugOrNumber);
    if (!result) {
      throw new NotFoundException(`Post not found: ${slugOrNumber}`);
    }

    const anonId = ensureAnonId(req, res);

    // fire-and-forget: view count increment doesn't block response
    this.contentService.incrementViewCount(result.number);

    const { prev, next, total, position } = await this.contentService.findAdjacentPosts(result, {
      state: 'open',
    });
    const liked = await this.contentService.hasLiked(result.number, anonId);

    return {
      ...result.toJSON(),
      liked,
      prev,
      next,
      total,
      position,
    };
  }

  @Post('posts/:number/like')
  @ApiOperation({ summary: 'Toggle like for a post' })
  @ApiResponse({ status: 200, description: 'Like state toggled' })
  async likePost(
    @Param('number') number: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const num = parseInt(number, 10);
    const anonId = ensureAnonId(req, res);
    const liked = await this.contentService.hasLiked(num, anonId);

    if (liked) {
      await this.contentService.decrementLikeCount(num, anonId);
      return { liked: false, message: 'Unliked' };
    }

    await this.contentService.incrementLikeCount(num, anonId);
    return { liked: true, message: 'Liked' };
  }

  @Get('projects')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of projects' })
  async getProjects(@Query() query: QueryContentDto) {
    const { page = 1, limit = 20 } = query;
    return this.contentService.findAll(page, limit, {});
  }
}
