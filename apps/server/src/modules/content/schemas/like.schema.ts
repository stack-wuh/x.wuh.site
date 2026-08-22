import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true, collection: 'likes' })
export class Like {
  @ApiProperty({ description: 'Issue number' })
  @Prop({ required: true, index: true })
  postNumber: number;

  @ApiProperty({ description: 'Anonymous cookie id' })
  @Prop({ required: true, index: true })
  anonId: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.index({ postNumber: 1, anonId: 1 }, { unique: true });
