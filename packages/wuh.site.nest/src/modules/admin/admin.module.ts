import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [ContentModule],
  controllers: [AdminController],
})
export class AdminModule {}
