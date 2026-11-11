import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from './schemas/content.schema';
import { Like, LikeDocument } from './schemas/like.schema';
import { CreateContentDto, UpdateContentMetadataDto } from './dto/content.dto';
import type { ContentLabelSummary, PaginatedResult } from '@wuh.site/core';
import { buildPaginatedResult } from '../../common/utils/paginated-result';

@Injectable()
export class ContentService {
  private logger = new Logger(ContentService.name);

  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<ContentDocument> {
    try {
      const content = new this.contentModel(createContentDto);
      return await content.save();
    } catch (error) {
      this.logger.error(`Failed to create content: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    query?: Record<string, any>,
  ): Promise<PaginatedResult<ContentDocument>> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.contentModel
          .find(query || {})
          .sort({ createdAtGitHub: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.contentModel.countDocuments(query || {}),
      ]);
      return buildPaginatedResult(data, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to find contents: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async getLabelSummaries(query: { state?: 'open' | 'closed' } = {}): Promise<ContentLabelSummary[]> {
    const match: Record<string, any> = {};
    if (query.state) {
      match.state = query.state;
    }

    const pipeline = [
      { $match: match },
      { $unwind: '$labels' },
      { $match: { labels: { $type: 'string', $ne: '' } } },
      { $group: { _id: '$labels', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { count: -1, name: 1 } },
    ];
    const summaries = await (this.contentModel as any).aggregate(pipeline).exec();

    return summaries as ContentLabelSummary[];
  }

  async findByExternalId(externalId: number): Promise<ContentDocument | null> {
    return this.contentModel.findOne({ externalId }).exec();
  }

  // GitHub 上删除的 issue 本地同步移除（审计 P1-3：删除动作此前永久漂移）
  async deleteByExternalId(externalId: number): Promise<void> {
    await this.contentModel.deleteOne({ externalId }).exec();
  }

  // fullSync 对账：删除远端已不存在的本地记录（调用方须保证 numbers 为远端成功
  // 拉取的全集，防止中途失败拿到残缺集合误删）
  async deleteAllNotIn(numbers: number[]): Promise<{ deletedCount: number }> {
    const result = await this.contentModel
      .deleteMany({ number: { $nin: numbers } })
      .exec();
    return { deletedCount: result.deletedCount ?? 0 };
  }

  async findBySlugOrNumber(
    slugOrNumber: string,
  ): Promise<ContentDocument | null> {
    const isNumber = !isNaN(Number(slugOrNumber));
    if (isNumber) {
      return this.contentModel.findOne({ number: Number(slugOrNumber) }).exec();
    }
    return this.contentModel
      .findOne({ 'metadata.slug': slugOrNumber })
      .exec();
  }

  async findByNumber(number: number): Promise<ContentDocument | null> {
    return this.contentModel.findOne({ number }).exec();
  }

  async findAdjacentPosts(
    currentPost: ContentDocument,
    baseQuery: Record<string, any> = {},
  ): Promise<{
    prev: { number: number; title: string } | null;
    next: { number: number; title: string } | null;
    total: number;
    position: number;
  }> {
    const query = { ...baseQuery };

    const [prev, next, total, newerCount] = await Promise.all([
      this.contentModel
        .findOne({
          ...query,
          $or: [
            { createdAtGitHub: { $gt: currentPost.createdAtGitHub } },
            {
              createdAtGitHub: currentPost.createdAtGitHub,
              number: { $gt: currentPost.number },
            },
          ],
        })
        .sort({ createdAtGitHub: 1, number: 1 })
        .select('number title')
        .lean()
        .exec(),

      this.contentModel
        .findOne({
          ...query,
          $or: [
            { createdAtGitHub: { $lt: currentPost.createdAtGitHub } },
            {
              createdAtGitHub: currentPost.createdAtGitHub,
              number: { $lt: currentPost.number },
            },
          ],
        })
        .sort({ createdAtGitHub: -1, number: -1 })
        .select('number title')
        .lean()
        .exec(),

      this.contentModel.countDocuments(query),

      this.contentModel.countDocuments({
        ...query,
        createdAtGitHub: { $gt: currentPost.createdAtGitHub },
      }),
    ]);

    return {
      prev: prev ? { number: prev.number, title: prev.title } : null,
      next: next ? { number: next.number, title: next.title } : null,
      total,
      position: newerCount + 1,
    };
  }

  async updateMetadata(
    externalId: number,
    metadata: UpdateContentMetadataDto,
  ): Promise<ContentDocument | null> {
    return this.contentModel
      .findOneAndUpdate(
        { externalId },
        { $set: { metadata } },
        { new: true },
      )
      .exec();
  }

  async upsert(createContentDto: CreateContentDto): Promise<ContentDocument> {
    const { externalId } = createContentDto;
    // 原子 upsert：并发 webhook/fullSync 下「读后写」会双双走 create 分支，
    // 撞 externalId 唯一索引 E11000 使整轮同步失败（审计 P1-5）
    return this.contentModel
      .findOneAndUpdate({ externalId }, { $set: createContentDto }, {
        upsert: true,
        new: true,
      })
      .exec();
  }

  async updateCommentCount(externalId: number, count: number): Promise<void> {
    await this.contentModel
      .findOneAndUpdate({ externalId }, { $set: { comments: count } })
      .exec();
  }

  async incrementViewCount(number: number): Promise<void> {
    await this.contentModel
      .updateOne({ number }, { $inc: { viewCount: 1 } })
      .exec();
  }

  async hasLiked(number: number, anonId: string): Promise<boolean> {
    const like = await this.likeModel
      .findOne({ postNumber: number, anonId })
      .select('_id')
      .lean()
      .exec();
    return !!like;
  }

  async incrementLikeCount(number: number, anonId: string): Promise<void> {
    const result = await this.likeModel
      .updateOne(
        { postNumber: number, anonId },
        { $setOnInsert: { postNumber: number, anonId } },
        { upsert: true },
      )
      .exec();

    if (result.upsertedCount > 0) {
      await this.contentModel
        .updateOne({ number }, { $inc: { likeCount: 1 } })
        .exec();
    }
  }

  async decrementLikeCount(number: number, anonId: string): Promise<void> {
    const result = await this.likeModel
      .deleteOne({ postNumber: number, anonId })
      .exec();

    if (result.deletedCount > 0) {
      await this.contentModel
        .updateOne({ number, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } })
        .exec();
    }
  }

  async findRssExcluded(
    excluded: boolean = false,
  ): Promise<ContentDocument[]> {
    return this.contentModel
      .find({
        $or: [
          { 'metadata.rssExcluded': excluded },
          { 'metadata.rssExcluded': { $exists: false } },
        ],
      })
      .sort({ createdAtGitHub: -1 })
      .exec();
  }
}
