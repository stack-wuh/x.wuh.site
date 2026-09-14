'use client';

import { useState, useEffect } from 'react';
import { IconCalendarDays, IconFeather, IconEye } from '@wuh.site/components/icons';
import { footerConf } from './specs';

/** 全站字数：原始计数格式化为「N.N 万字」，万字以下保持原值 */
function formatWords(total: number): string {
  if (total >= 10000) {
    const wan = total / 10000;
    const text = wan >= 100 ? Math.round(wan).toString() : wan.toFixed(1).replace(/\.0$/, '');
    return `${text} 万字`;
  }
  return `${total} 字`;
}

/** 站龄：自 siteBorn（备案审核日）起算，含首日 */
function siteAgeDays(): number {
  const now = new Date();
  const born = footerConf.siteBorn;
  const utcToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcBorn = Date.UTC(born.getFullYear(), born.getMonth(), born.getDate());
  return Math.floor((utcToday - utcBorn) / 86400000) + 1;
}

/** Footer 末行「站点数据」：站龄 / 全站字数 / 访问量（总 · 今日） */
export function SiteStats() {
  const [total, setTotal] = useState<number | null>(null);
  const [today, setToday] = useState<number | null>(null);
  const [totalWords, setTotalWords] = useState<number | null>(null);

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
            setTotalWords(typeof data.totalWords === 'number' ? data.totalWords : null);
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

  const age = siteAgeDays();
  const visitText = `总访问量: ${total.toLocaleString('en-US')} · 今日: ${today?.toLocaleString('en-US') ?? '—'}`;

  return (
    <div role="list" className="footer-data-line">
      <span role="listitem" tabIndex={0} className="footer-data-item">
        <IconCalendarDays width={15} height={15} aria-hidden="true" />
        <span className="footer-sr">{`驿站已运行 ${age} 天`}</span>
        <span className="footer-tip">{`驿站已运行 ${age} 天`}</span>
        <span className="footer-mlabel">{`运行 ${age} 天`}</span>
      </span>
      {totalWords !== null && (
        <span role="listitem" tabIndex={0} className="footer-data-item">
          <IconFeather width={15} height={15} aria-hidden="true" />
          <span className="footer-sr">{`已写下 ${formatWords(totalWords)}`}</span>
          <span className="footer-tip">{`已写下 ${formatWords(totalWords)}`}</span>
          <span className="footer-mlabel">{formatWords(totalWords)}</span>
        </span>
      )}
      <span role="listitem" tabIndex={0} className="footer-data-item">
        <IconEye width={15} height={15} aria-hidden="true" />
        <span className="footer-sr">{`访问量，${visitText}`}</span>
        <span className="footer-tip">{visitText}</span>
        <span className="footer-mlabel">{visitText.replace('总访问量: ', '总访问 ').replace('今日: ', '今日 ')}</span>
      </span>
    </div>
  );
}
