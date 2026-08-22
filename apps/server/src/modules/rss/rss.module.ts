import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from '../content/schemas/content.schema';
import { RssService } from './rss.service';
import { RssController } from './rss.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
    ]),
  ],
  controllers: [RssController],
  providers: [RssService],
  exports: [RssService],
})
export class RssModule {}
