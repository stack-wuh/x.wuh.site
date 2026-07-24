// ============================================
// 首页主题切换控件 — 桌面胶囊 / 移动整行
// 实际实现位于：
//   packages/wuh.site.next/app/components/SiteHeader/index.tsx
//   packages/wuh.site.next/app/components/SiteHeader/styles/index.ts
// ============================================

import { IconChevronDown, IconPalette } from '@wuh.site/components/icons'

export function ThemeToggleContent({ themeLabel = '酒红' }) {
  return (
    <>
      <IconPalette aria-hidden="true" size={18} strokeWidth={2} />
      <span>切换主题</span>
      <span>当前：{themeLabel}</span>
      <IconChevronDown aria-hidden="true" size={16} strokeWidth={2} />
    </>
  )
}
