import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { RepoDto } from './dto/repos.dto';

@Injectable()
export class ReposService {
  private logger = new Logger(ReposService.name);
  private octokit: Octokit;
  private cache: { data: RepoDto[]; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(private configService: ConfigService) {
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_PERSONAL_TOKEN'),
    });
  }

  async getRepos(): Promise<RepoDto[]> {
    // Return cached data if still valid
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return this.cache.data;
    }

    try {
      const { data } = await this.octokit.rest.repos.listForUser({
        username: this.configService.get<string>('CONTENT_REPO_OWNER') || 'stack-wuh',
        sort: 'updated',
        per_page: 100,
      });

      const repos: RepoDto[] = data
        .filter((repo) => !repo.fork)
        .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
        .map((repo) => ({
          name: repo.name,
          description: repo.description ?? null,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count ?? 0,
          language: repo.language ?? null,
          homepage: repo.homepage ?? null,
          fork: repo.fork,
        }));

      // Update cache
      this.cache = { data: repos, timestamp: Date.now() };

      return repos;
    } catch (error) {
      this.logger.error(`Failed to fetch repos: ${error.message}`);
      // Return cached data if available, even if expired
      if (this.cache) {
        return this.cache.data;
      }
      return [];
    }
  }
}
