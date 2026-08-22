import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { SITE_URL } from '@wuh.site/shared-contracts';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { pino } from 'pino';
import { parseCorsOrigin } from './common/utils/cors-origin.util';

const logger = pino();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Initialize Sentry
  const sentryDsn = configService.get<string>('SENTRY_DSN');
  if (sentryDsn && !sentryDsn.includes('your_sentry_dsn_here')) {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    });
  }

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for frontend
  app.enableCors({
    origin: parseCorsOrigin(process.env.CORS_ORIGIN),
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global route prefix for v2 API
  app.setGlobalPrefix('v2');

  // Swagger / OpenAPI
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('wuh.site API')
      .setDescription('wuh.site 博客后端 API 文档')
      .setVersion('2.0')
      .addServer('http://localhost:3200', 'Local development')
      .addServer(SITE_URL, 'Production')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('v2/docs', app, document);
  }

  const port = configService.get<number>('PORT') || 3200;
  await app.listen(port);

  logger.info(`wuh.site.nest is running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`Swagger docs: http://localhost:${port}/v2/docs`);
  }
}

bootstrap().catch((err) => {
  logger.error(err, 'Failed to bootstrap application');
  process.exit(1);
});
