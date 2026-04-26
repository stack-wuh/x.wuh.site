import { NestFactory } from '@nestjs/core';
import { SyncModule } from '../src/modules/sync/sync.module';
import { SyncService } from '../src/modules/sync/sync.service';
import { pino } from 'pino';

const logger = pino();

async function bootstrap() {
  logger.info('Starting initial sync...');
  try {
    const app = await NestFactory.createApplicationContext(SyncModule, {
      logger: ['log', 'error', 'warn'],
    });

    const syncService = app.get(SyncService);
    await syncService.fullSync();

    logger.info('Initial sync completed successfully');
    await app.close();
  } catch (error) {
    logger.error(error, 'Initial sync failed');
    process.exit(1);
  }
}

bootstrap();
