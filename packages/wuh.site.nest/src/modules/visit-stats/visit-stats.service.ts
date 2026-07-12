import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VisitRecord, VisitRecordDocument } from './visit-record.schema';

@Injectable()
export class VisitStatsService {
  private logger = new Logger(VisitStatsService.name);

  constructor(
    @InjectModel(VisitRecord.name)
    private visitRecordModel: Model<VisitRecordDocument>,
  ) {}

  /** 记录一次访问，30 分钟窗口内同一 IP 不重复计数 */
  async recordVisit(ip: string, userAgent?: string, path?: string): Promise<void> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // 查询最近 30 分钟内同一 IP 的记录
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

  /** 获取总访问量和今日访问量 */
  async getStats(): Promise<{ total: number; today: number }> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [total, today] = await Promise.all([
      this.visitRecordModel.countDocuments().exec(),
      this.visitRecordModel.countDocuments({ timestamp: { $gte: todayStart } }).exec(),
    ]);

    return { total, today };
  }
}
