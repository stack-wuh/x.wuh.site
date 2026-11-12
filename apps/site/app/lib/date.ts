/**
 * 日期格式化单源——全部固定 UTC 口径（审计 P1-15）：
 * SSR（Docker 容器 UTC）与客户端任意时区输出一致，消除 hydration mismatch
 * （React 19 整树重渲染/白屏闪烁）；GitHub created_at 本就是 UTC ISO 串，
 * 按 UTC 展示与 GitHub 面板口径一致，PostView 的 slice(0,10) 亦是 UTC 截断。
 */

/** 首页/列表页 MM-dd */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

/** 详情页全量时间 yyyy-MM-dd HH:mm */
export function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hour = String(d.getUTCHours()).padStart(2, '0')
  const minute = String(d.getUTCMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}
