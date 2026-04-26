import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Content, ContentSchema } from '../content/schemas/content.schema';
import { Comment, CommentSchema } from '../comment/schemas/comment.schema';
import { SyncService } from './sync.service';
import { ContentModule } from '../content/content.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    ContentModule,
    CommentModule,
  ],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
