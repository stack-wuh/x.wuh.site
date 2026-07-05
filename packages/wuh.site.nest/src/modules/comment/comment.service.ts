import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateAnonymousCommentDto } from './dto/comment.dto';
import type { PaginatedResult } from '@wuh.site/shared-contracts';
import { buildPaginatedResult } from '../../common/utils/paginated-result';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateAnonymousCommentDto): Promise<CommentDocument> {
    try {
      const comment = new this.commentModel({
        ...createCommentDto,
        footprint: uuidv4(),
        avatarUrl: this.generateAvatarUrl(createCommentDto.email || createCommentDto.nickname),
      });
      return await comment.save();
    } catch (error) {
      this.logger.error(`Failed to create comment: ${error.message}`);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    query?: Record<string, any>,
  ): Promise<PaginatedResult<CommentDocument>> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.commentModel
          .find(query || {})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.commentModel.countDocuments(query || {}),
      ]);
      return buildPaginatedResult(data, total, page, limit);
    } catch (error) {
      this.logger.error(`Failed to find comments: ${error.message}`);
      throw error;
    }
  }

  async findByIssueNumber(issueNumber: number): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ issueNumber })
      .sort({ createdAtGitHub: -1 })
      .exec();
  }

  async findByExternalId(externalId: string | number): Promise<CommentDocument | null> {
    return this.commentModel.findOne({ externalId }).exec();
  }

  async upsert(data: Partial<CommentDocument>): Promise<CommentDocument> {
    const { externalId } = data;
    const existing = await this.findByExternalId(externalId);

    if (existing) {
      return this.commentModel
        .findByIdAndUpdate(existing._id, data, { new: true })
        .exec();
    }

    const comment = new this.commentModel(data);
    return await comment.save();
  }

  async countByIssueNumber(issueNumber: number): Promise<number> {
    return this.commentModel.countDocuments({ issueNumber }).exec();
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
  ): Promise<CommentDocument | null> {
    return this.commentModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<CommentDocument | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  private generateAvatarUrl(seed: string): string {
    // Using UI Avatars or Gravatar
    const hash = crypto.createHash('md5').update(seed).digest('hex');
    return `https://i.pravatar.cc/150?u=${hash}`;
  }
}
