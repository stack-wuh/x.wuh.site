import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VisitRecordDocument = HydratedDocument<VisitRecord>;

@Schema({ timestamps: true, collection: 'visit_records' })
export class VisitRecord {
  @ApiProperty({ description: '访客 IP' })
  @Prop({ required: true })
  ip: string;

  @ApiProperty({ description: '访问时间' })
  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @ApiProperty({ description: '用户代理', required: false })
  @Prop()
  userAgent?: string;

  @ApiProperty({ description: '访问路径', required: false })
  @Prop()
  path?: string;
}

export const VisitRecordSchema = SchemaFactory.createForClass(VisitRecord);
VisitRecordSchema.index({ ip: 1, timestamp: -1 });
