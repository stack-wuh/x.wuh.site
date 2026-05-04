# 任务拆分

## Phase 1 — 创建图标文件 (无依赖，可并行)

- [x] T1: 创建 `packages/components/icons/brand.tsx` — 9 个品牌图标
- [x] T2: 创建 `packages/components/icons/ui.tsx` — 17 个 UI 图标
- [x] T3: 创建 `packages/components/icons/status.tsx` — 11 个状态图标
- [x] T4: 创建 `packages/components/icons/ornament.tsx` — DiamondDivider 装饰元素
- [x] T5: 创建 `packages/components/icons/index.tsx` — barrel 统一导出

## Phase 2 — 替换 icon 导入 (无依赖，可并行)

- [x] T6: 替换 `components/link-group/index.tsx` — 6 个品牌图标
- [x] T7: 替换 `components/shared-link-group/index.tsx` — 7 个图标
- [x] T8: 替换 `components/message/index.tsx` — 5 个状态图标
- [x] T9: 替换 `components/result/index.tsx` — 2 个图标，统一 IconWarning
- [x] T10: 替换 `components/empty/index.tsx` — 1 个图标
- [x] T11: 替换 `components/alert/index.tsx` — 5 个图标
- [x] T12: 替换 `components/image-preview/index.tsx` — 11 个图标，移除 SvgIcon helper
- [x] T13: 替换 `components/image/index.tsx` — 1 个图标
- [x] T14: 替换 `wuh.site.next/app/HomeView.tsx` — IconMusic, IconDiscord, DiamondDivider
- [x] T15: 替换 `wuh.site.next/app/components/ContactCard.tsx` — 5 个图标，删除 renderLinkIcon
- [x] T16: 替换 `wuh.site.next/app/post/components/FloatingActions.tsx` — 3 个图标
- [x] T17: 替换 `wuh.site.next/app/post/components/PostToolbar.tsx` — ToolbarIcon → ChevronLeft/Right
- [x] T18: 替换 `wuh.site.next/app/post/components/PostHeader.tsx` — DiamondDivider
- [x] T19: 替换 `wuh.site.next/app/about/OrnamentDivider.tsx` — DiamondDivider
- [x] T22: 替换 `wuh.site.next/app/components/SiteHeader.tsx` — IconBars (计划遗漏)

## Phase 3 — 验证 (依赖 Phase 2)

- [x] T20: 运行 `pnpm exec tsc --noEmit` 类型检查
- [x] T21: 目视检查首页、about、博客详情页图标正常
