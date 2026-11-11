import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { ContentService } from '../content/content.service';
import { CommentService } from '../comment/comment.service';
import { parseIssueMetadata } from '../content/content-metadata.util';

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
      const remoteNumbers = await this.syncAllIssues();
      // 对账删除：远端已删除的 issue 本地永久漂移（审计 P1-3）。远端全集拉取
      // 成功完成才执行——中途失败会 throw，不会拿到残缺集合误删
      if (remoteNumbers.length > 0) {
        const { deletedCount } = await this.contentService.deleteAllNotIn(remoteNumbers);
        if (deletedCount > 0) {
          this.logger.log(`Reconciled ${deletedCount} locally-orphaned issue(s) not present on GitHub`);
        }
      }
      this.logger.log('Full sync completed successfully');
    } catch (error) {
      this.logger.error(`Full sync failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  // 返回远端 issue number 全集（供 fullSync 对账删除孤儿）
  private async syncAllIssues(): Promise<number[]> {
    let page = 1;
    let hasMore = true;
    const remoteNumbers: number[] = [];

    while (hasMore) {
      try {
        // state 'all'：closed issue 同样入库（webhook closed 事件本就同步它们），
        // 且对账删除需要远端全集而非仅 open 子集
        const { data: issues } = await this.octokit.issues.listForRepo({
          owner: this.contentRepoOwner,
          repo: this.contentRepoName,
          state: 'all',
          per_page: 100,
          page,
        });

        if (issues.length === 0) {
          hasMore = false;
          break;
        }

        for (const issue of issues) {
          // listForRepo 也会返回 PR（带 pull_request 键）——PR 标题/描述不是博客文章，跳过（P1-2）
          if (issue.pull_request) continue;
          remoteNumbers.push(issue.number);
          await this.syncIssue(issue.number);
        }

        page++;
      } catch (error) {
        this.logger.error(`Error syncing page ${page}: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }

    return remoteNumbers;
  }

  // webhook deleted 事件的删除代理（controller 只注入 SyncService，保持依赖方向）
  async deleteIssue(externalId: number): Promise<void> {
    await this.contentService.deleteByExternalId(externalId);
    this.logger.log(`Deleted issue externalId=${externalId} from local store`);
  }

  async deleteComment(externalId: number): Promise<void> {
    await this.commentService.deleteByExternalId(externalId);
  }

  async syncIssue(issueNumber: number): Promise<void> {
    try {
      const { data: issue } = await this.octokit.issues.get({
        owner: this.contentRepoOwner,
        repo: this.contentRepoName,
        issue_number: issueNumber,
      });

      const extractedMeta = parseIssueMetadata(issue.body || '')

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
        // 发布时间=issue 创建时间（与站点 PostView 口径一致）——schema 有字段但
        // 此前全服务端无写入路径，最近日志与热力图恒空（审计 P1-10）
        publishedAt: new Date(issue.created_at),
        ...(extractedMeta && { metadata: extractedMeta }),
      };

      await this.contentService.upsert(contentData);

      // Sync comments for this issue
      await this.syncIssueComments(issueNumber);

      this.logger.debug(`Synced issue #${issueNumber}`);
    } catch (error) {
      this.logger.error(`Failed to sync issue #${issueNumber}: ${error instanceof Error ? error.message : String(error)}`);
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
      this.logger.error(`Failed to sync comments for #${issueNumber}: ${error instanceof Error ? error.message : String(error)}`);
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
        // GitHub 上已存在的评论即公开内容，同步进来直接是 approved
        // （审计 #568 P0-2：此前落 schema 默认 pending，公开端点却不过滤，审核语义名存实亡）
        status: 'approved' as const,
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
      this.logger.error(`Failed to sync comment #${commentId}: ${error instanceof Error ? error.message : String(error)}`);
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
      this.logger.error(`Failed to post comment to GitHub: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
