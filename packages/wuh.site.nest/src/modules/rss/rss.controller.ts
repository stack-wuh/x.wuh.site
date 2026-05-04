import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RssService } from './rss.service';

@ApiTags('RSS')
@Controller()
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Get('rss.xml')
  @Header('Content-Type', 'application/xml')
  @ApiOperation({ summary: 'Get RSS 2.0 feed' })
  @ApiResponse({ status: 200, description: 'RSS XML feed' })
  async getRssFeed(): Promise<string> {
    return this.rssService.generateFeed();
  }
}
