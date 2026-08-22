import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from '../comment/comment.module';
import { ContentModule } from '../content/content.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule, ContentModule, CommentModule, UserModule],
  controllers: [AdminController],
})
export class AdminModule {}
