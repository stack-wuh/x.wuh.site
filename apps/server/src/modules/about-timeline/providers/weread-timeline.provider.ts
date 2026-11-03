import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { TimelineEntry } from '@wuh.site/core';
import { WereadBook, WereadBookDocument } from '../../weread/schemas/weread.schema';

/** 微信读书书架（readUpdateTime 最新）→ 在读/读完动态。无真实书籍深链，链接用书架主页兜底 */
@Injectable()
export class WereadTimelineProvider {
  private readonly wereadBookModel: Model<WereadBookDocument>;

  constructor(@InjectModel(WereadBook.name) wereadBookModel: Model<WereadBookDocument>) {
    this.wereadBookModel = wereadBookModel;
  }

  async getEntries(): Promise<TimelineEntry[]> {
    const books = await this.wereadBookModel
      .find()
      .sort({ readUpdateTime: -1 })
      .limit(10)
      .lean();

    return books.map((book) => ({
      id: `weread:${book.bookId}`,
      platform: 'weread',
      category: 'reading',
      title: book.title,
      link: 'https://weread.qq.com/web/shelf',
      timestamp: new Date(book.readUpdateTime * 1000).toISOString(),
    }));
  }
}
