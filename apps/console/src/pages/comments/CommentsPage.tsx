import { useEffect, useState } from 'react';
import { apiRequest } from '@/api/client';
import type { AdminComment, AdminCommentsResponse } from '@/api/types';
import { DataTable } from '@/components/DataTable';
import { PermissionGate, ReadonlyHint } from '@/components/PermissionGate';
import { StatusBadge } from '@/components/StatusBadge';

export function CommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<AdminCommentsResponse>('/admin/post-comments?page=1&limit=20')
      .then((result) => setComments(result.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="page-section">
      <div className="page-heading"><h1>博客评论</h1><ReadonlyHint /></div>
      {error ? <div className="page-state error">{error}</div> : (
        <DataTable data={comments} columns={[
          { key: 'issueNumber', title: '博客 Issue', render: (item) => item.issueNumber || '-' },
          { key: 'nickname', title: '昵称', render: (item) => item.nickname },
          { key: 'content', title: '内容', render: (item) => item.body || item.content || '-' },
          { key: 'status', title: '状态', render: (item) => <StatusBadge status={item.status} /> },
          { key: 'actions', title: '操作', render: () => <PermissionGate fallback={<span>只读</span>}><button>审核</button></PermissionGate> },
        ]} />
      )}
    </section>
  );
}
