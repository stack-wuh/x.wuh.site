import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Footprint, FootprintSchema } from './footprint.schema';
import { FootprintService } from './footprint.service';
import { FootprintController } from './footprint.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Footprint.name, schema: FootprintSchema },
    ]),
  ],
  controllers: [FootprintController],
  providers: [FootprintService],
  exports: [FootprintService],
})
export class FootprintModule {}
