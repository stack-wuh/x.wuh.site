import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { WebhookController } from './webhook.controller';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [ConfigModule, AuthModule, SyncModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
