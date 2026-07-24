import type { AdminPermission, AdminUserDto } from '@wuh.site/shared-contracts';

export function isRoot(user: AdminUserDto | null | undefined) {
  return user?.role === 'root' || user?.login === 'stack-wuh';
}

export function hasPermission(user: AdminUserDto | null | undefined, permission: AdminPermission) {
  return Boolean(user?.permissions?.includes(permission));
}
