import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feed } from 'feed';
import { Content, ContentDocument } from '../content/schemas/content.schema';

@Injectable()
export class RssService {
  private logger = new Logger(RssService.name);
  private feedCache: string | null = null;
  private cacheExpire: number = 0;
  private readonly CACHE_TTL = 3600000; // 1 hour

  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  async generateFeed(): Promise<string> {
    // Return cached feed if still valid
    if (this.feedCache && Date.now() < this.cacheExpire) {
      return this.feedCache;
    }

    try {
      const contents = await this.contentModel
        .find({
          state: 'open',
          $or: [
            { 'metadata.rssExcluded': false },
            { 'metadata.rssExcluded': { $exists: false } },
          ],
        })
        .sort({ createdAtGitHub: -1 })
        .limit(50)
        .exec();

      const feed = new Feed({
        title: 'wuh.site - 博客订阅',
        description: '吴尒红的个人博客内容',
        id: 'https://wuh.site',
        link: 'https://wuh.site',
        language: 'zh-cn',
        favicon: 'https://wuh.site/favicon.ico',
        copyright: '© 2024 wuh.site',
      });

      for (const content of contents) {
        feed.addItem({
          title: content.title,
          id: `${content.number}`,
          link: `https://wuh.site/post/${content.number}`,
          description: content.metadata?.summary || content.body?.substring(0, 200),
          content: content.bodyHtml || content.body,
          author: [
            {
              name: content.author.login,
              link: content.author.url,
            },
          ],
          date: new Date(content.createdAtGitHub),
          image: content.metadata?.cover,
        });
      }

      const xml = feed.rss2();
      this.feedCache = xml;
      this.cacheExpire = Date.now() + this.CACHE_TTL;

      return xml;
    } catch (error) {
      this.logger.error(`Failed to generate RSS feed: ${error.message}`);
      throw error;
    }
  }

  clearCache(): void {
    this.feedCache = null;
    this.cacheExpire = 0;
    this.logger.debug('RSS cache cleared');
  }
}
