import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from '../content/schemas/content.schema';
import { Comment, CommentSchema } from '../comment/schemas/comment.schema';
import { WereadBook, WereadBookSchema } from '../weread/schemas/weread.schema';
import { AboutTimelineController } from './about-timeline.controller';
import { AboutTimelineService } from './about-timeline.service';
import { SiteTimelineProvider } from './providers/site-timeline.provider';
import { GithubTimelineProvider } from './providers/github-timeline.provider';
import { DoubanTimelineProvider } from './providers/douban-timeline.provider';
import { WereadTimelineProvider } from './providers/weread-timeline.provider';

@Module({
  imports: [
    // 只读复用既有 collection（本模块不写入）
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: WereadBook.name, schema: WereadBookSchema },
    ]),
  ],
  controllers: [AboutTimelineController],
  providers: [
    AboutTimelineService,
    SiteTimelineProvider,
    GithubTimelineProvider,
    DoubanTimelineProvider,
    WereadTimelineProvider,
  ],
})
export class AboutTimelineModule {}
