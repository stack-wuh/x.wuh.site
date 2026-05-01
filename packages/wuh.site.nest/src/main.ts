import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { pino } from 'pino';

const logger = pino();

async function bootstrap() {
  // Initialize Sentry
  const sentryDsn = process.env.SENTRY_DSN;
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    });
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Set global route prefix for v2 API
  app.setGlobalPrefix('v2');

  // Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('wuh.site API')
    .setDescription('wuh.site 博客后端 API 文档')
    .setVersion('2.0')
    .addServer('http://localhost:3200', 'Local development')
    .addServer('https://wuh.site', 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v2/docs', app, document);

  const port = configService.get<number>('PORT') || 3200;
  await app.listen(port);

  logger.info(`wuh.site.nest is running on http://localhost:${port}`);
  logger.info(`Swagger docs: http://localhost:${port}/v2/docs`);
}

bootstrap().catch((err) => {
  logger.error(err, 'Failed to bootstrap application');
  process.exit(1);
});
