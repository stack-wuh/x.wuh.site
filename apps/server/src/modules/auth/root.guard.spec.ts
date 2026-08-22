import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RootGuard } from './root.guard';
import { UserRole } from '../user/schemas/user.schema';

describe('RootGuard', () => {
  const guard = new RootGuard();

  const context = (user?: unknown) => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext);

  it('allows only stack-wuh even when role data is present', () => {
    expect(guard.canActivate(context({ login: 'stack-wuh', role: UserRole.ROOT }))).toBe(true);
  });

  it('rejects non-stack-wuh users even if a stale token claims root', () => {
    expect(() => guard.canActivate(context({ login: 'guest', role: UserRole.ROOT }))).toThrow(ForbiddenException);
  });

  it('rejects reader users', () => {
    expect(() => guard.canActivate(context({ login: 'guest', role: UserRole.READER }))).toThrow(ForbiddenException);
  });
});
