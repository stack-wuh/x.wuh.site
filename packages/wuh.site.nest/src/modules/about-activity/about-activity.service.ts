import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  SiteActivityBreakdown,
  SiteActivityDay,
  SiteActivityHeatmap,
} from '@wuh.site/shared-contracts';
import { Content, ContentDocument } from '../content/schemas/content.schema';
import { Comment, CommentDocument } from '../comment/schemas/comment.schema';
import { VisitStatsService } from '../visit-stats/visit-stats.service';
import { calculateActivityLevels } from './about-activity.utils';

const TIMEZONE = 'Asia/Shanghai';
const DAY_COUNT = 365;

@Injectable()
export class AboutActivityService {
  private readonly logger = new Logger(AboutActivityService.name);

  constructor(
    private readonly visitStatsService: VisitStatsService,
    @InjectModel(Content.name) private readonly contentModel: Model<ContentDocument>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {}

  async getActivity(): Promise<SiteActivityHeatmap> {
    const { start, end, dates } = this.createDateWindow();
    const [visits, content, comments] = await Promise.all([
      this.visitStatsService.getDailyCounts(start, end, TIMEZONE).catch((error: unknown) => {
        this.logger.error(`Failed to aggregate visits: ${this.errorMessage(error)}`);
        throw error;
      }),
      this.getContentCounts(start, end).catch((error: unknown) => {
        this.logger.error(`Failed to aggregate content activity: ${this.errorMessage(error)}`);
        throw error;
      }),
      this.getCommentCounts(start, end).catch((error: unknown) => {
        this.logger.error(`Failed to aggregate comments: ${this.errorMessage(error)}`);
        throw error;
      }),
    ]);

    const days = dates.map((date) => ({
      date,
      breakdown: {
        visits: visits.get(date) ?? 0,
        published: content.published.get(date) ?? 0,
        updated: content.updated.get(date) ?? 0,
        comments: comments.comments.get(date) ?? 0,
        guestbook: comments.guestbook.get(date) ?? 0,
        projectUpdates: 0,
      } satisfies SiteActivityBreakdown,
    }));
    const leveledDays = calculateActivityLevels(days) as SiteActivityDay[];

    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      timezone: TIMEZONE,
      total: leveledDays.reduce((total, day) => total + day.count, 0),
      days: leveledDays,
    };
  }

  private errorMessage(error: unknown) {
    return error instanceof Error ? error.message : String(error);
  }

  private createDateWindow() {
    const now = new Date();
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    const end = new Date(`${today}T16:00:00.000Z`);
    const start = new Date(end.getTime() - DAY_COUNT * 24 * 60 * 60 * 1000);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const dates = Array.from({ length: DAY_COUNT }, (_, index) =>
      formatter.format(new Date(start.getTime() + index * 24 * 60 * 60 * 1000)),
    );
    return { start, end, dates };
  }

  private async getContentCounts(start: Date, end: Date) {
    const [published, updated] = await Promise.all([
      this.contentModel.aggregate([
        { $match: { publishedAt: { $gte: start, $lt: end } } },
        { $group: { _id: { $dateToString: { date: '$publishedAt', format: '%Y-%m-%d', timezone: TIMEZONE } }, count: { $sum: 1 } } },
      ]).exec(),
      this.contentModel.aggregate([
        { $match: { updatedAtGitHub: { $gte: start, $lt: end } } },
        { $group: { _id: { $dateToString: { date: '$updatedAtGitHub', format: '%Y-%m-%d', timezone: TIMEZONE } }, count: { $sum: 1 } } },
      ]).exec(),
    ]);
    return {
      published: new Map(published.map((row) => [row._id, row.count])),
      updated: new Map(updated.map((row) => [row._id, row.count])),
      projectUpdates: new Map(),
    };
  }

  private async getCommentCounts(start: Date, end: Date) {
    const rows = await this.commentModel.aggregate([
      { $match: { createdAtGitHub: { $gte: start, $lt: end }, status: { $ne: 'rejected' } } },
      { $group: {
        _id: { date: { $dateToString: { date: '$createdAtGitHub', format: '%Y-%m-%d', timezone: TIMEZONE } }, guestbook: { $eq: ['$page', 'about-guestbook'] } },
        count: { $sum: 1 },
      } },
    ]).exec();
    return {
      comments: new Map(rows.filter((row) => !row._id.guestbook).map((row) => [row._id.date, row.count])),
      guestbook: new Map(rows.filter((row) => row._id.guestbook).map((row) => [row._id.date, row.count])),
    };
  }
}
