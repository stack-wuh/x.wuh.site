import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import type { TimelineEntry } from '@wuh.site/core';

/** GitHub 公开事件 → 动态条目（排除 PushEvent/WatchEvent 等噪音源） */
@Injectable()
export class GithubTimelineProvider {
  private readonly logger = new Logger(GithubTimelineProvider.name);
  private readonly octokit: Octokit;
  private readonly login: string;

  constructor(configService: ConfigService) {
    this.octokit = new Octokit({
      auth: configService.get<string>('GITHUB_PERSONAL_TOKEN'),
    });
    this.login = configService.get<string>('CONTENT_REPO_OWNER') || 'stack-wuh';
  }

  async getEntries(): Promise<TimelineEntry[]> {
    const { data: events } = await this.octokit.request('GET /users/{username}/events/public', {
      username: this.login,
      per_page: 30,
    });

    const entries: TimelineEntry[] = [];

    for (const event of events) {
      // CreateEvent(repository)：开源新仓库
      if (event.type === 'CreateEvent' && event.payload?.repository_type === 'repository') {
        entries.push({
          id: `github:${event.id}`,
          platform: 'github',
          category: 'repoCreated',
          title: event.repo.name.split('/')[1] ?? event.repo.name,
          link: `https://github.com/${event.repo.name}`,
          timestamp: event.created_at,
        });
        continue;
      }

      // ReleaseEvent：发布版本
      if (event.type === 'ReleaseEvent') {
        const release = event.payload?.release;
        if (!release?.html_url) continue;
        entries.push({
          id: `github:${event.id}`,
          platform: 'github',
          category: 'release',
          title: release.name || release.tag_name || event.repo.name,
          link: release.html_url,
          timestamp: event.created_at,
        });
      }

      // PushEvent / WatchEvent / IssuesEvent 等不进「最近日志」：
      // push 噪音过大；博客发布由 site provider 从 content 库承载（publishedAt 更可靠）。
    }

    return entries;
  }
}
