import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VisitRecord, VisitRecordDocument } from './visit-record.schema';
import { Content, ContentDocument } from '../content/schemas/content.schema';
import { VisitStatsResponse } from '@wuh.site/core';

const TOTAL_WORDS_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class VisitStatsService {
  private logger = new Logger(VisitStatsService.name);
  private totalWordsCache: { value: number; expiresAt: number } | null = null;

  constructor(
    @InjectModel(VisitRecord.name)
    private visitRecordModel: Model<VisitRecordDocument>,
    @InjectModel(Content.name)
    private contentModel: Model<ContentDocument>,
  ) {}

  /** 记录一次访问，30 分钟窗口内同一 IP 不重复计数 */
  async recordVisit(ip: string, userAgent?: string, path?: string): Promise<void> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const existing = await this.visitRecordModel
      .findOne({
        ip,
        timestamp: { $gte: thirtyMinutesAgo },
      })
      .lean()
      .exec();

    if (existing) {
      this.logger.debug(`Dedup visit from ${ip}`);
      return;
    }

    await this.visitRecordModel.create({
      ip,
      timestamp: new Date(),
      userAgent,
      path,
    });

    this.logger.debug(`Recorded visit from ${ip}`);
  }

  /** 获取总访问量、今日访问量与全站字数 */
  async getStats(): Promise<VisitStatsResponse> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [total, today, totalWords] = await Promise.all([
      this.visitRecordModel.countDocuments().exec(),
      this.visitRecordModel.countDocuments({ timestamp: { $gte: todayStart } }).exec(),
      this.getTotalWords(),
    ]);

    return { total, today, totalWords };
  }

  /**
   * 全站文章字数（已发布）：中文字符数 + 英文单词数。
   * 口径必须与前端 getArticleWordCount（apps/site/app/lib/seo.ts）一致。
   * Footer 60s 轮询本接口，聚合结果做 1 小时内存缓存，避免反复全表扫描。
   */
  private async getTotalWords(): Promise<number> {
    if (this.totalWordsCache && Date.now() < this.totalWordsCache.expiresAt) {
      return this.totalWordsCache.value;
    }

    try {
      const rows = await this.contentModel
        .aggregate<{ total: number }>([
          { $match: { state: 'open', body: { $type: 'string', $ne: '' } } },
          {
            $project: {
              words: {
                $add: [
                  { $size: { $regexFindAll: { input: '$body', regex: '[一-鿿]' } } },
                  { $size: { $regexFindAll: { input: '$body', regex: '[a-zA-Z]+' } } },
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: '$words' } } },
        ])
        .exec();

      const value = rows[0]?.total ?? 0;
      this.totalWordsCache = { value, expiresAt: Date.now() + TOTAL_WORDS_TTL_MS };
      return value;
    } catch (error) {
      this.logger.warn(`Failed to aggregate totalWords: ${error}`);
      // 聚合失败时回退上次缓存值（可能过期），无缓存则返回 0，不打断访问量返回
      return this.totalWordsCache?.value ?? 0;
    }
  }

  async getDailyCounts(start: Date, end: Date, timezone: string): Promise<Map<string, number>> {
    const rows = await this.visitRecordModel
      .aggregate([
        { $match: { timestamp: { $gte: start, $lt: end } } },
        {
          $group: {
            _id: {
              $dateToString: { date: '$timestamp', format: '%Y-%m-%d', timezone },
            },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    return new Map(rows.map((row) => [row._id, row.count]));
  }
}
