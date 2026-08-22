import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? (exception.getResponse() as any).message || exception.message
      : 'Internal server error';

    const error = isHttpException
      ? (exception.getResponse() as any).error || exception.name
      : 'Internal Server Error';

    // Log full error in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(
        `${request.method} ${request.url} → ${status}: ${Array.isArray(message) ? message.join(', ') : message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message : [message],
      error,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && {
        path: request.url,
      }),
    });
  }
}
