import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content, ContentDocument } from './schemas/content.schema';
import { CreateContentDto, UpdateContentMetadataDto } from './dto/content.dto';
import { PaginatedResult, buildPaginatedResult } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class ContentService {
  private logger = new Logger(ContentService.name);

  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<ContentDocument> {
    try {
      const content = new this.contentModel(createContentDto);
      return await content.save();
    } catch (error) {
      this.logger.error(`Failed to create content: ${error.message}`);
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
      this.logger.error(`Failed to find contents: ${error.message}`);
      throw error;
    }
  }

  async findByExternalId(externalId: number): Promise<ContentDocument | null> {
    return this.contentModel.findOne({ externalId }).exec();
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
    const existing = await this.findByExternalId(externalId);

    if (existing) {
      return this.contentModel
        .findByIdAndUpdate(existing._id, createContentDto, { new: true })
        .exec();
    }

    return this.create(createContentDto);
  }

  async updateCommentCount(externalId: number, count: number): Promise<void> {
    await this.contentModel
      .findOneAndUpdate({ externalId }, { $set: { comments: count } })
      .exec();
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
