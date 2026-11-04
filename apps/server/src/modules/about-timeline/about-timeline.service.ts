import { Injectable, Logger } from '@nestjs/common';
import type { TimelineEntry, TimelinePlatform, TimelineResponse, TimelineSourceStatus } from '@wuh.site/core';
import { SiteTimelineProvider } from './providers/site-timeline.provider';
import { GithubTimelineProvider } from './providers/github-timeline.provider';
import { DoubanTimelineProvider } from './providers/douban-timeline.provider';
import { WereadTimelineProvider } from './providers/weread-timeline.provider';

const CACHE_TTL = 10 * 60 * 1000;
const ENTRY_LIMIT = 50;

/** 「最近日志」聚合：四 provider 部分降级合并（单源失败不整体失败），timestamp 降序截断 + 内存缓存 */
@Injectable()
export class AboutTimelineService {
  private readonly logger = new Logger(AboutTimelineService.name);
  private cache: { data: TimelineResponse; timestamp: number } | null = null;

  constructor(
    private readonly siteProvider: SiteTimelineProvider,
    private readonly githubProvider: GithubTimelineProvider,
    private readonly doubanProvider: DoubanTimelineProvider,
    private readonly wereadProvider: WereadTimelineProvider,
  ) {}

  async getTimeline(): Promise<TimelineResponse> {
    if (this.cache && Date.now() - this.cache.timestamp < CACHE_TTL) {
      return this.cache.data;
    }

    const results = await Promise.allSettled([
      this.siteProvider.getEntries(),
      this.githubProvider.getEntries(),
      this.doubanProvider.getEntries(),
      this.wereadProvider.getEntries(),
    ]);

    const platformByIndex: TimelinePlatform[] = ['site', 'github', 'douban', 'weread'];
    const sources: TimelineSourceStatus[] = [];
    const entries: TimelineEntry[] = [];

    results.forEach((result, index) => {
      const platform = platformByIndex[index];
      if (result.status === 'fulfilled') {
        sources.push({ platform, ok: true, count: result.value.length });
        entries.push(...result.value);
        return;
      }
      // INV-3 部分降级：单源失败记录状态，其余源照常返回
      sources.push({ platform, ok: false, count: 0 });
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      this.logger.error(`Timeline provider ${platform} failed: ${reason}`);
    });

    const response: TimelineResponse = {
      updatedAt: new Date().toISOString(),
      entries: this.sanitize(entries),
      sources,
    };

    this.cache = { data: response, timestamp: Date.now() };
    return response;
  }

  /** INV-1/INV-2：字段完整、link 禁 '#' 占位（无真实链接用平台主页兜底发生在 provider 层）、降序、无空条目 */
  private sanitize(entries: TimelineEntry[]): TimelineEntry[] {
    return entries
      .filter((entry): entry is TimelineEntry =>
        Boolean(
          entry &&
          typeof entry.title === 'string' && entry.title.length > 0 &&
          typeof entry.link === 'string' && entry.link.length > 0 && entry.link !== '#' &&
          typeof entry.timestamp === 'string' && !Number.isNaN(Date.parse(entry.timestamp)),
        ),
      )
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .slice(0, ENTRY_LIMIT);
  }
}
