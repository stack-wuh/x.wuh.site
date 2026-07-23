import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<{ user?: unknown }>();
  return request.user;
});
