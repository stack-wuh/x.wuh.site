import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { RepoDto } from './dto/repos.dto';

interface PinnedRepoNode {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: { name: string } | null;
  homepageUrl: string | null;
}

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
      const login = this.configService.get<string>('CONTENT_REPO_OWNER') || 'stack-wuh';

      const result = await this.octokit.graphql<{
        user: { pinnedItems: { nodes: PinnedRepoNode[] } };
      }>(
        `query($login: String!) {
          user(login: $login) {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  url
                  stargazerCount
                  primaryLanguage { name }
                  homepageUrl
                }
              }
            }
          }
        }`,
        { login },
      );

      const repos: RepoDto[] = result.user.pinnedItems.nodes.map((repo) => ({
        name: repo.name,
        description: repo.description ?? null,
        html_url: repo.url,
        stargazers_count: repo.stargazerCount,
        language: repo.primaryLanguage?.name ?? null,
        homepage: repo.homepageUrl ?? null,
        fork: false,
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
