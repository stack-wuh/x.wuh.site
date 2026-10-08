'use client';

import { useState, useEffect } from 'react';
import { IconCalendarDays, IconFeather, IconEye } from '@wuh.site/components/icons';
import { useLocale } from '@wuh.site/components/locales';
import { footerConf } from './types';

/** 万字段：原始计数格式化为「N.N」数值文本，万字以下保持原值（单位走词典） */
function formatWanCount(total: number): string {
  const wan = total / 10000;
  return wan >= 100 ? Math.round(wan).toString() : wan.toFixed(1).replace(/\.0$/, '');
}

/** 站龄：自 siteBorn（备案审核日）起算，含首日 */
function siteAgeDays(): number {
  const now = new Date();
  const born = footerConf.siteBorn;
  const utcToday = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcBorn = Date.UTC(born.getFullYear(), born.getMonth(), born.getDate());
  return Math.floor((utcToday - utcBorn) / 86400000) + 1;
}

/** Footer 末行「站点数据」：站龄 / 全站字数 / 访问量（总 · 今日），文案随 locale（site.stats.*） */
export function SiteStats() {
  const { t } = useLocale();
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
  const runDaysText = t('site.stats.runDays', { days: age });
  const totalText = total.toLocaleString('en-US');
  const todayText = today?.toLocaleString('en-US') ?? '—';
  const visitText = t('site.stats.visits', { total: totalText, today: todayText });
  const visitShortText = t('site.stats.visitsShort', { total: totalText, today: todayText });
  // zh/ja 用「N.N 万字」，en 用分组原值（{raw}），由词典各自取用
  const wordsParams = totalWords !== null
    ? { words: totalWords >= 10000 ? formatWanCount(totalWords) : String(totalWords), raw: totalWords.toLocaleString('en-US') }
    : null;
  const wordsText = totalWords !== null && wordsParams
    ? (totalWords >= 10000 ? t('site.stats.wordsWan', wordsParams) : t('site.stats.words', wordsParams))
    : null;

  return (
    <div role="list" className="footer-data-line">
      <span role="listitem" tabIndex={0} className="footer-data-item">
        <IconCalendarDays width={15} height={15} aria-hidden="true" />
        <span className="footer-sr">{runDaysText}</span>
        <span className="footer-tip">{runDaysText}</span>
        <span className="footer-mlabel">{t('site.stats.runDaysShort', { days: age })}</span>
      </span>
      {totalWords !== null && wordsText !== null && (
        <span role="listitem" tabIndex={0} className="footer-data-item">
          <IconFeather width={15} height={15} aria-hidden="true" />
          <span className="footer-sr">{t('site.stats.wordsWritten', { words: wordsText })}</span>
          <span className="footer-tip">{t('site.stats.wordsWritten', { words: wordsText })}</span>
          <span className="footer-mlabel">{wordsText}</span>
        </span>
      )}
      <span role="listitem" tabIndex={0} className="footer-data-item">
        <IconEye width={15} height={15} aria-hidden="true" />
        <span className="footer-sr">{t('site.stats.visitsAria', { text: visitText })}</span>
        <span className="footer-tip">{visitText}</span>
        <span className="footer-mlabel">{visitShortText}</span>
      </span>
    </div>
  );
}
