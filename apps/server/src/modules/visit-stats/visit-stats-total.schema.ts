import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VisitStatsTotalDocument = HydratedDocument<VisitStatsTotal>;

/** 总访问量计数器（visit_stats 集合，global 单文档）——visit_records 有 90 天
 * TTL 后与记录解耦（审计 P1-7）；存量经 backfill-visit-total.mjs 迁移。
 * _id 显式字符串：服务用固定 id 'global' 查写，默认 ObjectId cast 会 CastError 500
 * （v1.4.104 部署后实测，20261112 热修） */
@Schema({ collection: 'visit_stats' })
export class VisitStatsTotal {
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true })
  total: number;
}

export const VisitStatsTotalSchema = SchemaFactory.createForClass(VisitStatsTotal);
