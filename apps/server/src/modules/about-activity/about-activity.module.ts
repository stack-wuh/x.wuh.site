import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from '../content/content.module';
import { Content, ContentSchema } from '../content/schemas/content.schema';
import { Comment, CommentSchema } from '../comment/schemas/comment.schema';
import { CommentModule } from '../comment/comment.module';
import { VisitStatsModule } from '../visit-stats/visit-stats.module';
import { GithubModule } from '../api-v2/github/github.module';
import { AboutActivityController } from './about-activity.controller';
import { AboutActivityService } from './about-activity.service';

@Module({
  imports: [
    ContentModule,
    CommentModule,
    VisitStatsModule,
    GithubModule,
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [AboutActivityController],
  providers: [AboutActivityService],
})
export class AboutActivityModule {}
