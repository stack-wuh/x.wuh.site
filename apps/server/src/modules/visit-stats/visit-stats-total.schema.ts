import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisitStatsTotalDocument = HydratedDocument<VisitStatsTotal>;

/** 总访问量计数器（visit_stats 集合，global 单文档）——visit_records 有 90 天
 * TTL 后与记录解耦（审计 P1-7）；存量经 backfill-visit-total.mjs 迁移 */
@Schema({ collection: 'visit_stats' })
export class VisitStatsTotal {
  @Prop({ required: true })
  total: number;
}

export const VisitStatsTotalSchema = SchemaFactory.createForClass(VisitStatsTotal);
