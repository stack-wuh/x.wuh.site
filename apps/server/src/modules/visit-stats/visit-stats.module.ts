import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitRecord, VisitRecordSchema } from './visit-record.schema';
import { VisitStatsService } from './visit-stats.service';
import { VisitStatsController } from './visit-stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitRecord.name, schema: VisitRecordSchema },
    ]),
  ],
  controllers: [VisitStatsController],
  providers: [VisitStatsService],
  exports: [VisitStatsService],
})
export class VisitStatsModule {}
