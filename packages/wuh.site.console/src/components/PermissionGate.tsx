import type { ReactNode } from 'react';
import { isRoot } from '@/auth/permissions';
import { useAuth } from '@/auth/AuthProvider';

export function PermissionGate({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const { user } = useAuth();
  return isRoot(user) ? <>{children}</> : <>{fallback}</>;
}

export function ReadonlyHint() {
  return <span className="readonly-hint">只读账号：写操作仅 stack-wuh 可用</span>;
}
