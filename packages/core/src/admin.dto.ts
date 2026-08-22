export type AdminRole = 'root' | 'reader';

export type AdminPermission =
  | 'admin:read'
  | 'admin:write'
  | 'content:read'
  | 'content:write'
  | 'guestbook:read'
  | 'guestbook:write'
  | 'comment:read'
  | 'comment:write';

export interface AdminUserDto {
  githubId: number;
  login: string;
  email?: string;
  avatarUrl?: string;
  profileUrl?: string;
  role: AdminRole;
  permissions: AdminPermission[];
  lastLoginAt?: string;
}

export interface AdminAuthResponseDto {
  user: AdminUserDto;
  accessToken?: string;
}

export interface AdminOperationResultDto {
  ok: boolean;
  message?: string;
}
