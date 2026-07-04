import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({ description: 'GitHub comment id' })
  @Prop({ required: true, unique: true })
  externalId: number;

  @ApiProperty({ description: 'Issue id (MongoDB ObjectId)' })
  @Prop({ required: true })
  issueId: number;

  @ApiProperty({ description: 'Issue number' })
  @Prop({ required: true })
  issueNumber: number;

  @ApiProperty({ description: 'Repository name' })
  @Prop({ required: true })
  repo: string;

  @ApiProperty({ description: 'Comment body (markdown)' })
  @Prop({ required: true })
  body: string;

  @ApiPropertyOptional({ description: 'Comment body (HTML)' })
  @Prop()
  bodyHtml?: string;

  @ApiPropertyOptional({ description: 'GitHub user info' })
  @Prop({
    type: {
      login: String,
      avatarUrl: String,
      url: String,
    },
  })
  user: {
    login: string;
    avatarUrl: string;
    url: string;
  };

  @ApiPropertyOptional({ description: 'Anonymous comment nickname' })
  @Prop()
  nickname?: string;

  @ApiPropertyOptional({ description: 'Anonymous comment email' })
  @Prop()
  email?: string;

  @ApiPropertyOptional({ description: 'Random avatar URL' })
  @Prop()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'UUID for tracking' })
  @Prop()
  footprint?: string;

  @ApiPropertyOptional({ description: 'Client IP address' })
  @Prop()
  clientIp?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @Prop()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Comment status', enum: ['pending', 'approved', 'rejected'] })
  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @ApiPropertyOptional({ description: 'Page identifier (e.g. about-guestbook)' })
  @Prop()
  page?: string;

  @ApiPropertyOptional({ description: 'GitHub created date' })
  @Prop()
  createdAtGitHub: Date;

  @ApiPropertyOptional({ description: 'GitHub updated date' })
  @Prop()
  updatedAtGitHub: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ externalId: 1 }, { unique: true });
CommentSchema.index({ issueNumber: 1 });
CommentSchema.index({ issueId: 1 });
CommentSchema.index({ createdAtGitHub: -1 });
