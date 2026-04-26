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
import { CommentService } from './comment.service';
import { CreateAnonymousCommentDto, QueryCommentDto } from './dto/comment.dto';

@Controller('comments')
@UseGuards(ThrottlerGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(@Query() query: QueryCommentDto) {
    const { page = 1, limit = 20, issueNumber } = query;
    const dbQuery: Record<string, any> = {};

    if (issueNumber) {
      dbQuery.issueNumber = issueNumber;
    }

    return this.commentService.findAll(page, limit, dbQuery);
  }

  @Post()
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
