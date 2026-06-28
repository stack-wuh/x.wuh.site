import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type FootprintDocument = HydratedDocument<Footprint>;

@Schema({ timestamps: true, collection: 'footprints' })
export class Footprint {
  @ApiProperty({ description: '地点名称' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: '经度' })
  @Prop({ required: true })
  lng: number;

  @ApiProperty({ description: '纬度' })
  @Prop({ required: true })
  lat: number;

  @ApiProperty({ description: '到访日期' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ description: '图片URL数组' })
  @Prop({ type: [String], default: [] })
  photos: string[];

  @ApiProperty({ description: 'B站视频链接数组' })
  @Prop({ type: [String], default: [] })
  videos: string[];

  @ApiProperty({ description: '游记正文 (Markdown)' })
  @Prop({ default: '' })
  content: string;
}

export const FootprintSchema = SchemaFactory.createForClass(Footprint);
FootprintSchema.index({ date: -1 });
FootprintSchema.index({ name: 1 });
