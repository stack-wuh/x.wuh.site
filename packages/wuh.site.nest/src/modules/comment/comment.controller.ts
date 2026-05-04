import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateAnonymousCommentDto, QueryCommentDto } from './dto/comment.dto';

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
    const { page = 1, limit = 20, issueNumber } = query;
    const dbQuery: Record<string, any> = {};

    if (issueNumber) {
      dbQuery.issueNumber = issueNumber;
    }

    return this.commentService.findAll(page, limit, dbQuery);
  }

  @Post()
  @ApiOperation({ summary: 'Create an anonymous comment' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createAnonymousComment(
    @Body() createCommentDto: CreateAnonymousCommentDto,
  ) {
    // Basic validation
    if (!createCommentDto.nickname || !createCommentDto.content) {
      throw new BadRequestException('nickname and content are required');
    }

    // TODO: Call GitHub API to post comment and get externalId
    // For now, just save to DB
    return this.commentService.create(createCommentDto);
  }
}
