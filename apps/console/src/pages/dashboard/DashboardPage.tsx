import { useEffect, useState } from 'react';
import { apiRequest } from '@/api/client';
import type { AdminOverview } from '@/api/types';

export function DashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<AdminOverview>('/admin/overview').then(setOverview).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="page-state error">{error}</div>;
  if (!overview) return <div className="page-state">加载概览...</div>;

  return (
    <section className="page-section">
      <h1>概览</h1>
      <div className="stat-grid">
        <article><strong>{overview.posts}</strong><span>博客</span></article>
        <article><strong>{overview.guestbookComments}</strong><span>留言</span></article>
        <article><strong>{overview.pendingPostComments}</strong><span>待审核评论</span></article>
      </div>
    </section>
  );
}
