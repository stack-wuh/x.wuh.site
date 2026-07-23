import { useEffect, useState } from 'react';
import type { AdminUserDto } from '@wuh.site/shared-contracts';
import { apiRequest } from '@/api/client';
import { DataTable } from '@/components/DataTable';

export function UsersPage() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<AdminUserDto[]>('/admin/users').then(setUsers).catch((err) => setError(err.message));
  }, []);

  return (
    <section className="page-section">
      <h1>用户</h1>
      {error ? <div className="page-state error">{error}</div> : (
        <DataTable data={users} columns={[
          { key: 'login', title: 'GitHub', render: (user) => user.login },
          { key: 'role', title: '权限', render: (user) => user.role },
          { key: 'lastLoginAt', title: '最后登录', render: (user) => user.lastLoginAt || '-' },
        ]} />
      )}
    </section>
  );
}
