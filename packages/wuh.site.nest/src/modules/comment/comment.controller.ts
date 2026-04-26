import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CommentService } from './comment.service';
import { CreateAnonymousCommentDto, QueryCommentDto } from './dto/comment.dto';
import { Request } from 'express';

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
    @Req() request: Request,
  ) {
    // Basic validation
    if (!createCommentDto.nickname || !createCommentDto.content) {
      throw new BadRequestException('nickname and content are required');
    }

    // Add IP and User-Agent for tracking
    const comment = {
      ...createCommentDto,
      clientIp: request.ip,
      userAgent: request.headers['user-agent'],
      externalId: Date.now(), // Placeholder, will be set by sync service
      issueNumber: parseInt(request.query.issueNumber as string) || null,
      repo: process.env.CONTENT_REPO_NAME || 'blog',
      body: createCommentDto.content,
      createdAtGitHub: new Date(),
      updatedAtGitHub: new Date(),
    } as any;

    // TODO: Call GitHub API to post comment and get externalId
    // For now, just save to DB
    return this.commentService.create(createCommentDto);
  }
}
