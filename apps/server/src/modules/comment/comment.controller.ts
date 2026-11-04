import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RootGuard } from '../auth/root.guard';
import { CommentService } from './comment.service';
import { CreateAnonymousCommentDto, QueryCommentDto } from './dto/comment.dto';
import { v4 as uuidv4 } from 'uuid';

const GUESTBOOK_ISSUE_NUMBER = 999999;

@ApiTags('Comments')
@Controller('comments')
@UseGuards(ThrottlerGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated comments' })
  @ApiQuery({ name: 'issueNumber', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of comments' })
  async getComments(@Query() query: QueryCommentDto) {
    const { page = 1, limit = 20, issueNumber, status } = query;
    const dbQuery: Record<string, any> = {};

    if (issueNumber) {
      dbQuery.issueNumber = issueNumber;
    }
    // 公开端点默认只吐已审核内容；显式传 status 可覆盖（管理端走 /admin/* 自行指定）
    dbQuery.status = status ?? 'approved';

    return this.commentService.findAll(page, limit, dbQuery);
  }

  @Post()
  @ApiOperation({ summary: 'Create an anonymous comment' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createAnonymousComment(
    @Body() createCommentDto: CreateAnonymousCommentDto & { page?: string },
    @Req() req: any,
  ) {
    if (!createCommentDto.nickname || !createCommentDto.content) {
      throw new BadRequestException('nickname and content are required');
    }

    const issueNumber = createCommentDto.issueNumber ?? GUESTBOOK_ISSUE_NUMBER;

    const commentData: any = {
      ...createCommentDto,
      body: createCommentDto.content,
      clientIp: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      externalId: uuidv4(),
      issueId: issueNumber,
      issueNumber: issueNumber,
      repo: issueNumber === GUESTBOOK_ISSUE_NUMBER ? 'guestbook' : 'blog',
    };

    // Blog comments start as pending until root-approved; guestbook is auto-approved
    // (see audit issue #568 P0-2: previous fallthrough left guestbook rows on the
    // schema default 'pending', making moderation effectively invisible)
    commentData.status = issueNumber === GUESTBOOK_ISSUE_NUMBER ? 'approved' : 'pending';
    return this.commentService.create(commentData);
  }
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve and post comment to GitHub Issue' })
  @ApiResponse({ status: 200, description: 'Comment approved and posted to GitHub' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @UseGuards(JwtAuthGuard, RootGuard)
  async approveComment(@Param('id') id: string) {
    const result = await this.commentService.approveAndPostToGitHub(id);
    if (!result) {
      throw new NotFoundException('Comment not found');
    }
    return result;
  }
}

