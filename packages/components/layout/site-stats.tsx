'use client';

import { useState, useEffect } from 'react';
import { StatsText } from './styles';

/** Footer 中展示全站访问量的组件 */
export function SiteStats() {
  const [total, setTotal] = useState<number | null>(null);
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/visit-stats/stats');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setTotal(data.total);
            setToday(data.today);
          }
        }
      } catch {
        // 静默失败
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (total === null) return null;

  return (
    <StatsText>
      总访问量: {total} | 今日: {today}
    </StatsText>
  );
}
