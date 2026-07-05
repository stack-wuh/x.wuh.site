import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WereadBook, WereadBookDocument } from './schemas/weread.schema';
import type { PaginatedResult, WereadBook as WeReadBook } from '@wuh.site/shared-contracts';
import { buildPaginatedResult } from '../../common/utils/paginated-result';

@Injectable()
export class WereadService {
  private logger = new Logger(WereadService.name);
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    @InjectModel(WereadBook.name) private wereadBookModel: Model<WereadBookDocument>,
  ) {
    this.apiKey = this.configService.get<string>('WEREAD_API_KEY') || '';
  }

  async syncBooks(): Promise<{ synced: number }> {
    if (!this.apiKey) {
      throw new Error('WEREAD_API_KEY not configured');
    }

    const res = await fetch('https://i.weread.qq.com/api/agent/gateway', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_name: '/shelf/sync',
        skill_version: '1.0.4',
      }),
    });

    const data = await res.json();
    if (data.errcode && data.errcode !== 0) {
      throw new Error(`WeRead API error: ${data.errmsg || 'unknown'}`);
    }

    const books: WeReadBook[] = (data.books || []).map((b: any, shelfIndex: number) => ({
      bookId: b.bookId,
      title: b.title,
      author: b.author || '',
      cover: b.cover || '',
      readUpdateTime: b.readUpdateTime || 0,
      finishReading: b.finishReading || 0,
      shelfIndex,
    }));

    let synced = 0;
    for (const book of books) {
      await this.wereadBookModel.updateOne(
        { bookId: book.bookId },
        { $set: book },
        { upsert: true },
      );
      synced++;
    }

    this.logger.log(`Synced ${synced} books from WeRead`);
    return { synced };
  }

  async getBooks(
    page: number,
    limit: number,
    finishReading?: 0 | 1,
  ): Promise<PaginatedResult<WereadBookDocument>> {
    const filter = finishReading === undefined ? {} : { finishReading };
    const [data, total] = await Promise.all([
      this.wereadBookModel
        .find(filter)
        .sort({ shelfIndex: 1, readUpdateTime: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec() as any,
      this.wereadBookModel.countDocuments(filter).exec(),
    ]);
    return buildPaginatedResult(data as WereadBookDocument[], total, page, limit);
  }
}
