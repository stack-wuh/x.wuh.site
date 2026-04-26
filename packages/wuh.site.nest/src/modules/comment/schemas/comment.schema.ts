import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, unique: true })
  externalId: number; // GitHub comment id

  @Prop({ required: true })
  issueId: number; // issue id (MongoDB ObjectId)

  @Prop({ required: true })
  issueNumber: number;

  @Prop({ required: true })
  repo: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  bodyHtml?: string;

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

  // Anonymous comment fields
  @Prop()
  nickname?: string;

  @Prop()
  email?: string;

  @Prop()
  avatarUrl?: string; // Random avatar for anonymous comments

  @Prop()
  footprint?: string; // UUID for tracking

  @Prop()
  clientIp?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  createdAtGitHub: Date;

  @Prop()
  updatedAtGitHub: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ externalId: 1 }, { unique: true });
CommentSchema.index({ issueNumber: 1 });
CommentSchema.index({ issueId: 1 });
CommentSchema.index({ createdAtGitHub: -1 });
