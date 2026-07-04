import { Controller, Get, Param, Query, NotFoundException, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { QueryContentDto } from './dto/content.dto';
import { Request } from 'express';

const likeIpMap = new Map<string, Set<number>>();

function hasLiked(ip: string, number: number): boolean {
  const set = likeIpMap.get(ip);
  return set ? set.has(number) : false;
}

function markLiked(ip: string, number: number): void {
  if (!likeIpMap.has(ip)) likeIpMap.set(ip, new Set());
  likeIpMap.get(ip)!.add(number);
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

  @Get('posts/:slugOrNumber')
  @ApiOperation({ summary: 'Get a single post by slug or issue number' })
  @ApiResponse({ status: 200, description: 'Post details with prev/next adjacent posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPostDetail(@Param('slugOrNumber') slugOrNumber: string) {
    const result = await this.contentService.findBySlugOrNumber(slugOrNumber);
    if (!result) {
      throw new NotFoundException(`Post not found: ${slugOrNumber}`);
    }

    // fire-and-forget: view count increment doesn't block response
    this.contentService.incrementViewCount(result.number);

    const { prev, next, total, position } = await this.contentService.findAdjacentPosts(result, {
      state: 'open',
    });

    return {
      ...result.toJSON(),
      prev,
      next,
      total,
      position,
    };
  }

  @Post('posts/:number/like')
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({ status: 200, description: 'Like recorded' })
  @ApiResponse({ status: 400, description: 'Already liked' })
  async likePost(@Param('number') number: string, @Req() req: Request) {
    const num = parseInt(number, 10);
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (hasLiked(ip, num)) {
      return { liked: false, likeCount: 0, message: 'Already liked' };
    }
    markLiked(ip, num);
    await this.contentService.incrementLikeCount(num);
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
