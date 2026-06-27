import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { ContentService } from '../content/content.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class SyncService {
  private logger = new Logger(SyncService.name);
  private octokit: Octokit;
  private contentRepoOwner: string;
  private contentRepoName: string;

  constructor(
    private configService: ConfigService,
    private contentService: ContentService,
    private commentService: CommentService,
  ) {
    this.octokit = new Octokit({
      auth: this.configService.get<string>('GITHUB_PERSONAL_TOKEN'),
    });
    this.contentRepoOwner = this.configService.get<string>('CONTENT_REPO_OWNER');
    this.contentRepoName = this.configService.get<string>('CONTENT_REPO_NAME');
  }

  async fullSync(): Promise<void> {
    this.logger.log('Starting full sync from GitHub...');
    try {
      await this.syncAllIssues();
      this.logger.log('Full sync completed successfully');
    } catch (error) {
      this.logger.error(`Full sync failed: ${error.message}`);
      throw error;
    }
  }

  private async syncAllIssues(): Promise<void> {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const { data: issues } = await this.octokit.issues.listForRepo({
          owner: this.contentRepoOwner,
          repo: this.contentRepoName,
          state: 'open',
          per_page: 100,
          page,
        });

        if (issues.length === 0) {
          hasMore = false;
          break;
        }

        for (const issue of issues) {
          await this.syncIssue(issue.number);
        }

        page++;
      } catch (error) {
        this.logger.error(`Error syncing page ${page}: ${error.message}`);
        throw error;
      }
    }
  }

  async syncIssue(issueNumber: number): Promise<void> {
    try {
      const { data: issue } = await this.octokit.issues.get({
        owner: this.contentRepoOwner,
        repo: this.contentRepoName,
        issue_number: issueNumber,
      });

      const extractedMeta = extractMetadata(issue.body || '')

      const contentData = {
        externalId: issue.id,
        repo: this.contentRepoName,
        number: issue.number,
        title: issue.title,
        labels: issue.labels.map((l: any) => l.name),
        state: issue.state as 'open' | 'closed',
        body: issue.body,
        bodyHtml: issue.body_html,
        author: {
          login: issue.user.login,
          avatarUrl: issue.user.avatar_url,
          url: issue.user.html_url,
        },
        comments: issue.comments,
        createdAtGitHub: new Date(issue.created_at),
        updatedAtGitHub: new Date(issue.updated_at),
        ...(extractedMeta && { metadata: extractedMeta }),
      };

      await this.contentService.upsert(contentData);

      // Sync comments for this issue
      await this.syncIssueComments(issueNumber);

      this.logger.debug(`Synced issue #${issueNumber}`);
    } catch (error) {
      this.logger.error(`Failed to sync issue #${issueNumber}: ${error.message}`);
      throw error;
    }
  }

  private async syncIssueComments(issueNumber: number): Promise<void> {
    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { data: comments } = await this.octokit.issues.listComments({
          owner: this.contentRepoOwner,
          repo: this.contentRepoName,
          issue_number: issueNumber,
          per_page: 100,
          page,
        });

        if (comments.length === 0) {
          hasMore = false;
          break;
        }

        for (const comment of comments) {
          await this.syncComment(comment.id, issueNumber);
        }

        page++;
      }
    } catch (error) {
      this.logger.error(`Failed to sync comments for #${issueNumber}: ${error.message}`);
      throw error;
    }
  }

  async syncComment(commentId: number, issueNumber?: number): Promise<void> {
    try {
      const { data: comment } = await this.octokit.issues.getComment({
        owner: this.contentRepoOwner,
        repo: this.contentRepoName,
        comment_id: commentId,
      });

      const commentData = {
        externalId: comment.id,
        issueId: issueNumber ? Number(issueNumber) : Number(comment.issue_url.split('/').pop()),
        issueNumber: issueNumber ? Number(issueNumber) : Number(comment.issue_url.split('/').pop()),
        repo: this.contentRepoName,
        body: comment.body,
        bodyHtml: comment.body_html,
        user: {
          login: comment.user.login,
          avatarUrl: comment.user.avatar_url,
          url: comment.user.html_url,
        },
        createdAtGitHub: new Date(comment.created_at),
        updatedAtGitHub: new Date(comment.updated_at),
      };

      await this.commentService.upsert(commentData);

      this.logger.debug(`Synced comment #${commentId}`);
    } catch (error) {
      this.logger.error(`Failed to sync comment #${commentId}: ${error.message}`);
      throw error;
    }
  }

  async postCommentToGitHub(
    issueNumber: number,
    body: string,
  ): Promise<{ id: number; url: string }> {
    try {
      const { data: comment } = await this.octokit.issues.createComment({
        owner: this.contentRepoOwner,
        repo: this.contentRepoName,
        issue_number: issueNumber,
        body,
      });

      return {
        id: comment.id,
        url: comment.html_url,
      };
    } catch (error) {
      this.logger.error(`Failed to post comment to GitHub: ${error.message}`);
      throw error;
    }
  }
}

const METADATA_RE = /<!--\s*wuh-site-metadata:\s*(\{[\s\S]*?\})\s*-->/;

function extractMetadata(body: string): Record<string, unknown> | null {
  try {
    const match = body.match(METADATA_RE);
    if (!match) return null;
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}
