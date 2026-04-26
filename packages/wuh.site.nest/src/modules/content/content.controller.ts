import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { QueryContentDto } from './dto/content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('posts')
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
  async getPostDetail(@Param('slugOrNumber') slugOrNumber: string) {
    return this.contentService.findBySlugOrNumber(slugOrNumber);
  }

  @Get('projects')
  async getProjects(@Query() query: QueryContentDto) {
    const { page = 1, limit = 20 } = query;
    // Projects logic can be implemented later
    return this.contentService.findAll(page, limit, {});
  }
}
