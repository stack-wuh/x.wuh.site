import { Controller, Get, Header } from '@nestjs/common';
import { RssService } from './rss.service';

@Controller()
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Get('rss.xml')
  @Header('Content-Type', 'application/xml')
  async getRssFeed(): Promise<string> {
    return this.rssService.generateFeed();
  }
}
