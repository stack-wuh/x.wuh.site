import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type ContentDocument = HydratedDocument<Content>;

@Schema({ timestamps: true, collection: 'blogs' })
export class Content {
  @ApiProperty({ description: 'GitHub issue id' })
  @Prop({ required: true, unique: true })
  externalId: number;

  @ApiProperty({ description: 'Repository name' })
  @Prop({ required: true })
  repo: string;

  @ApiProperty({ description: 'Issue number' })
  @Prop({ required: true })
  number: number;

  @ApiProperty({ description: 'Issue title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Issue labels', type: [String] })
  @Prop({ type: [String], default: [] })
  labels: string[];

  @ApiProperty({ description: 'Issue state', enum: ['open', 'closed'] })
  @Prop({ enum: ['open', 'closed'], default: 'open' })
  state: 'open' | 'closed';

  @ApiPropertyOptional({ description: 'Issue body (markdown)' })
  @Prop()
  body: string;

  @ApiPropertyOptional({ description: 'Issue body (HTML)' })
  @Prop()
  bodyHtml?: string;

  @ApiPropertyOptional({ description: 'Content metadata' })
  @Prop({
    type: {
      slug: String,
      summary: String,
      cover: String,
      keywords: [String],
      rssExcluded: Boolean,
      extra: { type: Map, of: String },
    },
    default: {},
  })
  metadata: {
    slug?: string;
    summary?: string;
    cover?: string;
    keywords?: string[];
    rssExcluded?: boolean;
    extra?: Record<string, unknown>;
  };

  @ApiPropertyOptional({ description: 'Issue author info' })
  @Prop({
    type: {
      login: String,
      avatarUrl: String,
      url: String,
    },
  })
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };

  @ApiProperty({ description: 'Comment count' })
  @Prop({ default: 0 })
  comments: number;

  @ApiProperty({ description: 'View count' })
  @Prop({ default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Like count' })
  @Prop({ default: 0 })
  likeCount: number;

  @ApiPropertyOptional({ description: 'GitHub created date' })
  @Prop()
  createdAtGitHub: Date;

  @ApiPropertyOptional({ description: 'GitHub updated date' })
  @Prop()
  updatedAtGitHub: Date;

  @ApiPropertyOptional({ description: 'Published date' })
  @Prop()
  publishedAt?: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
ContentSchema.index({ externalId: 1 }, { unique: true });
ContentSchema.index({ number: 1 });
ContentSchema.index({ 'metadata.slug': 1 });
ContentSchema.index({ 'labels': 1 });
ContentSchema.index({ state: 1 });
ContentSchema.index({ createdAtGitHub: -1 });
