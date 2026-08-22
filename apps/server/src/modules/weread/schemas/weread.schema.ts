import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type WereadBookDocument = HydratedDocument<WereadBook>;

@Schema({ timestamps: true, collection: 'weread_books' })
export class WereadBook {
  @ApiProperty({ description: '微信读书书籍 ID' })
  @Prop({ required: true, unique: true })
  bookId: string;

  @ApiProperty({ description: '书名' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: '作者' })
  @Prop({ required: true })
  author: string;

  @ApiPropertyOptional({ description: '封面图片 URL' })
  @Prop({ default: '' })
  cover: string;

  @ApiProperty({ description: '最近阅读更新时间戳' })
  @Prop({ required: true })
  readUpdateTime: number;

  @ApiPropertyOptional({ description: '是否读完 (0: 在读, 1: 已读完)' })
  @Prop({ default: 0 })
  finishReading: number;

  @ApiPropertyOptional({ description: '微信读书书架顺序位置' })
  @Prop({ default: 0 })
  shelfIndex: number;
}

export const WereadBookSchema = SchemaFactory.createForClass(WereadBook);
