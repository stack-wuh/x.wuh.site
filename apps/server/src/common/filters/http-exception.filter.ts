import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';

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

    // 5xx 与未知异常必须留痕：生产 500 静默是事故黑盒（P1-8）；
    // 4xx 客户端错误保持 dev-only，避免日志被正常拒绝请求刷屏
    const serverError = !isHttpException || status >= 500;
    if (serverError) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}: ${Array.isArray(message) ? message.join(', ') : message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      // 未知的非 Http 异常（真正的 crash）上报 Sentry；已建模的 HttpException 不重复上报
      if (!isHttpException) {
        Sentry.captureException(exception);
      }
    } else if (process.env.NODE_ENV !== 'production') {
      this.logger.warn(
        `${request.method} ${request.url} → ${status}: ${Array.isArray(message) ? message.join(', ') : message}`,
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
