import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateAnonymousCommentDto, QueryCommentDto } from './dto/comment.dto';

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
    const { page = 1, limit = 20, issueNumber, status } = query as any;
    const dbQuery: Record<string, any> = {};

    if (issueNumber) {
      dbQuery.issueNumber = issueNumber;
    }
    if (status) {
      dbQuery.status = status;
    }

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

    return this.commentService.create({
      ...createCommentDto,
      clientIp: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      issueNumber: GUESTBOOK_ISSUE_NUMBER,
    });
  }
}
