import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import type { TimelineEntry } from '@wuh.site/core';
import { Content, ContentDocument } from '../../content/schemas/content.schema';
import { Comment, CommentDocument } from '../../comment/schemas/comment.schema';

/** 站内数据（content 文章 + comment 留言）→ 动态条目，只读复用既有 collection */
@Injectable()
export class SiteTimelineProvider {
  private readonly siteUrl: string;
  private readonly contentModel: Model<ContentDocument>;
  private readonly commentModel: Model<CommentDocument>;

  constructor(
    configService: ConfigService,
    @InjectModel(Content.name) contentModel: Model<ContentDocument>,
    @InjectModel(Comment.name) commentModel: Model<CommentDocument>,
  ) {
    this.siteUrl = configService.get<string>('SITE_URL') || 'https://x.wuh.site';
    this.contentModel = contentModel;
    this.commentModel = commentModel;
  }

  async getEntries(): Promise<TimelineEntry[]> {
    const [posts, comments] = await Promise.all([
      this.contentModel
        .find({ state: 'open', publishedAt: { $ne: null } })
        .sort({ publishedAt: -1 })
        .limit(10)
        .lean(),
      this.commentModel
        .find({ status: { $ne: 'rejected' } })
        .sort({ createdAtGitHub: -1 })
        .limit(10)
        .lean(),
    ]);

    const postEntries: TimelineEntry[] = posts
      .filter((post) => post.publishedAt)
      .map((post) => ({
        id: `site:post:${post.number}`,
        platform: 'site',
        category: 'blogPost',
        title: post.title,
        link: `${this.siteUrl}/post/${post.number}`,
        timestamp: new Date(post.publishedAt!).toISOString(),
      }));

    const commentEntries: TimelineEntry[] = comments
      .filter((comment) => comment.createdAtGitHub)
      .map((comment) => ({
        id: `site:comment:${comment.externalId}`,
        platform: 'site',
        category: 'comment',
        title: summarizeComment(comment.body),
        link: comment.page === 'about-guestbook'
          ? `${this.siteUrl}/about`
          : `${this.siteUrl}/post/${comment.issueNumber}`,
        timestamp: new Date(comment.createdAtGitHub).toISOString(),
      }));

    return [...postEntries, ...commentEntries];
  }
}

/** 留言标题 = 正文首行截断（不含换行，保留阅读语义） */
const summarizeComment = (body: string, maxLength = 40): string => {
  const firstLine = body.split('\n').find((line) => line.trim().length > 0) ?? '';
  const normalized = firstLine.trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}…` : normalized;
};
