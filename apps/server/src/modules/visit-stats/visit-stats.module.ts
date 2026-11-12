import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitRecord, VisitRecordSchema } from './visit-record.schema';
import { VisitStatsTotal, VisitStatsTotalSchema } from './visit-stats-total.schema';
import { Content, ContentSchema } from '../content/schemas/content.schema';
import { VisitStatsService } from './visit-stats.service';
import { VisitStatsController } from './visit-stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitRecord.name, schema: VisitRecordSchema },
      { name: VisitStatsTotal.name, schema: VisitStatsTotalSchema },
      { name: Content.name, schema: ContentSchema },
    ]),
  ],
  controllers: [VisitStatsController],
  providers: [VisitStatsService],
  exports: [VisitStatsService],
})
export class VisitStatsModule {}
