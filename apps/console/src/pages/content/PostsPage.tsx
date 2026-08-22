import { useEffect, useState } from 'react';
import type { ContentItem } from '@wuh.site/core';
import { apiRequest } from '@/api/client';
import type { AdminPostsResponse } from '@/api/types';
import { DataTable } from '@/components/DataTable';
import { PermissionGate, ReadonlyHint } from '@/components/PermissionGate';

export function PostsPage() {
  const [posts, setPosts] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<AdminPostsResponse>('/admin/content/posts?page=1&limit=20')
      .then((result) => setPosts(result.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="page-section">
      <div className="page-heading"><h1>博客管理</h1><ReadonlyHint /></div>
      {error ? <div className="page-state error">{error}</div> : (
        <DataTable
          data={posts}
          columns={[
            { key: 'number', title: '#', render: (post) => post.number },
            { key: 'title', title: '标题', render: (post) => post.title },
            { key: 'state', title: '状态', render: (post) => post.state },
            { key: 'labels', title: '标签', render: (post) => post.labels?.join(', ') || '-' },
            { key: 'actions', title: '操作', render: (post) => <PermissionGate fallback={<span>只读</span>}><button>编辑 #{post.number}</button></PermissionGate> },
          ]}
        />
      )}
    </section>
  );
}
