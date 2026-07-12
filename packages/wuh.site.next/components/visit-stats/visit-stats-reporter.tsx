'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** 静默上报组件：嵌入 RootLayout，页面加载和路由切换时自动上报一次访问 */
export function VisitStatsReporter() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/visit-stats/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {
      // 静默失败，不影响页面体验
    });
  }, [pathname]);

  return null;
}
