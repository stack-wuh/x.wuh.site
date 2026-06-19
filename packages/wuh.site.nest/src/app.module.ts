import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import * as path from 'path';
import { ContentModule } from './modules/content/content.module';
import { CommentModule } from './modules/comment/comment.module';
import { SyncModule } from './modules/sync/sync.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { RssModule } from './modules/rss/rss.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { ApiV2Module } from './modules/api-v2/api-v2.module';
import { ReposModule } from './modules/repos/repos.module';
import { WereadModule } from './modules/weread/weread.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(__dirname, '../../../.env.local'),
        path.resolve(__dirname, '../../../.env'),
      ],
      isGlobal: true,
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || process.env.MONGO_URI,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        maxPoolSize: 10,
        minPoolSize: 2,
      })
    }),

    // Throttler for rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Feature modules
    ContentModule,
    CommentModule,
    SyncModule,
    WebhookModule,
    RssModule,
    UserModule,
    AuthModule,
    AdminModule,
    ApiV2Module,
    ReposModule,
    WereadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
