import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Parser from 'rss-parser';
import type { TimelineEntry } from '@wuh.site/core';

/** 豆瓣 RSS（收藏 feed + 日记 feed）→ 动态条目。feed 地址可经 env 覆盖（亦用于单源降级观察） */
@Injectable()
export class DoubanTimelineProvider {
  private readonly logger = new Logger(DoubanTimelineProvider.name);
  private readonly interestsFeedUrl: string;
  private readonly notesFeedUrl: string;
  private readonly parser: Parser;

  constructor(configService: ConfigService) {
    this.interestsFeedUrl = configService.get<string>(
      'DOUBAN_INTERESTS_FEED',
      'https://www.douban.com/feed/people/wuh-site/interests',
    );
    this.notesFeedUrl = configService.get<string>(
      'DOUBAN_NOTES_FEED',
      'https://www.douban.com/feed/people/wuh-site/notes',
    );
    // 豆瓣对无浏览器 UA 的请求限流，需带 UA
    this.parser = new Parser({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      },
      timeout: 10_000,
    });
  }

  async getEntries(): Promise<TimelineEntry[]> {
    const [interests, notes] = await Promise.allSettled([
      this.parser.parseURL(this.interestsFeedUrl),
      this.parser.parseURL(this.notesFeedUrl),
    ]);

    const entries: TimelineEntry[] = [];

    if (interests.status === 'fulfilled') {
      for (const item of interests.value.items ?? []) {
        if (!item.title || !item.link || !item.pubDate) continue;
        entries.push({
          id: `douban:interests:${item.guid ?? item.link}`,
          platform: 'douban',
          category: 'doubanMark',
          title: item.title,
          link: item.link,
          timestamp: new Date(item.pubDate).toISOString(),
        });
      }
    }

    if (notes.status === 'fulfilled') {
      for (const item of notes.value.items ?? []) {
        if (!item.title || !item.link || !item.pubDate) continue;
        entries.push({
          id: `douban:notes:${item.guid ?? item.link}`,
          platform: 'douban',
          category: 'doubanNote',
          title: item.title,
          link: item.link,
          timestamp: new Date(item.pubDate).toISOString(),
        });
      }
    }

    // 单 feed 失败不丢另一 feed 的条目；双 feed 全挂才视为 douban 源失败
    if (interests.status === 'rejected' && notes.status === 'rejected') {
      const reason = interests.reason instanceof Error ? interests.reason.message : String(interests.reason);
      this.logger.warn(`Douban feeds both failed: ${reason}`);
      throw interests.reason;
    }
    if (interests.status === 'rejected') {
      this.logger.warn(`Douban interests feed failed: ${this.errorMessage(interests.reason)}`);
    }
    if (notes.status === 'rejected') {
      this.logger.warn(`Douban notes feed failed: ${this.errorMessage(notes.reason)}`);
    }

    return entries;
  }

  private errorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }
}
