import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [ConfigModule, SyncModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
