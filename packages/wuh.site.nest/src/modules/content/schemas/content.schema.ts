import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContentDocument = HydratedDocument<Content>;

@Schema({ timestamps: true })
export class Content {
  @Prop({ required: true, unique: true })
  externalId: number; // GitHub issue id

  @Prop({ required: true })
  repo: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ enum: ['open', 'closed'], default: 'open' })
  state: 'open' | 'closed';

  @Prop()
  body: string;

  @Prop()
  bodyHtml?: string;

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

  @Prop({ default: 0 })
  comments: number;

  @Prop()
  createdAtGitHub: Date;

  @Prop()
  updatedAtGitHub: Date;

  @Prop()
  publishedAt?: Date;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
ContentSchema.index({ externalId: 1 }, { unique: true });
ContentSchema.index({ number: 1 });
ContentSchema.index({ 'metadata.slug': 1 });
ContentSchema.index({ 'labels': 1 });
ContentSchema.index({ state: 1 });
