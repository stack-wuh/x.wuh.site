import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SyncService } from '../src/modules/sync/sync.service';
import { pino } from 'pino';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

// Validate required environment variables
const requiredVars = ['MONGO_URI', 'GITHUB_PERSONAL_TOKEN'];
for (const name of requiredVars) {
  if (!process.env[name]) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

process.env.CONTENT_REPO_OWNER = process.env.CONTENT_REPO_OWNER || 'stack-wuh';
process.env.CONTENT_REPO_NAME = process.env.CONTENT_REPO_NAME || 'blog';

const logger = pino();

async function bootstrap() {
  logger.info('Starting initial sync...');
  logger.info('Environment variables loaded:', {
    MONGO_URI: process.env.MONGO_URI ? '***loaded***' : 'undefined',
    GITHUB_PERSONAL_TOKEN: process.env.GITHUB_PERSONAL_TOKEN ? '***loaded***' : 'undefined',
    CONTENT_REPO_OWNER: process.env.CONTENT_REPO_OWNER,
    CONTENT_REPO_NAME: process.env.CONTENT_REPO_NAME,
  });

  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });

    const syncService = app.get(SyncService);
    await syncService.fullSync();

    logger.info('Initial sync completed successfully');
    await app.close();
  } catch (error) {
    logger.error(error, 'Initial sync failed');
    console.error('Error details:', error);
    process.exit(1);
  }
}

bootstrap();
