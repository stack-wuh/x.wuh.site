# 任务清单

## Task 1: 创建 iconfont-context.tsx

- [x] **文件:** `packages/components/icons/iconfont-context.tsx`
- [x] `IconfontLoadState` 类型：`'loading' | 'loaded' | 'error'`
- [x] `IconfontContext` + `useIconfontLoadState()` hook
- [x] `IconfontStyle` 组件：`load` 事件后注入 `<link>`，`readyState === 'complete'` 兼容 SPA
- [x] **类型检查:** `npx tsc --noEmit`

## Task 2: 创建品牌图标 SVG fallback

- [x] **文件:** `packages/components/icons/fallbacks/*.tsx`（9 个文件）
- [x] wechat / qq / douban / weibo / netease-music / discord / github / twitter / email
- [x] 每个导出 `React.FC<{ size: number; className?: string }>`
- [x] 24x24 viewBox，`stroke="currentColor"`，`aria-hidden="true"`
- [x] **类型检查:** `npx tsc --noEmit`

## Task 3: 修改 icofont.tsx

- [x] **文件:** `packages/components/icons/icofont.tsx`
- [x] `makeIcon(name, Fallback?)` — 新增 fallback 参数
- [x] `useIconfontLoadState()` 读取 Context，`loaded` → `<i>`，否则 → fallback
- [x] `lucideFallback()` 包装器适配 lucide 图标到 FallbackComponent 签名
- [x] 品牌图标传入 SVG fallback，UI 图标传入 lucideFallback(...)
- [x] 所有 26 个导出名称不变
- [x] **类型检查:** `npx tsc --noEmit`

## Task 4: 修改 index.tsx

- [x] **文件:** `packages/components/icons/index.tsx`
- [x] 追加 `export { IconfontStyle } from './iconfont-context'`
- [x] **类型检查:** `npx tsc --noEmit`

## Task 5: 修改 AppProviders.tsx

- [x] **文件:** `packages/wuh.site.next/app/components/AppProviders.tsx`
- [x] 删除 `useExternal` 从 ahooks import
- [x] 删除 `useExternal('//at.alicdn.com/...', { type: 'css' })` 调用
- [x] 添加 `import { IconfontStyle } from '@wuh.site/components/icons'`
- [x] JSX 中 `<CssVariableStyles />` 后用 `<IconfontStyle>` 包裹 children
- [x] **类型检查:** `npx tsc --noEmit`

## Task 6: 构建验证

- [x] `grep -r "useExternal" packages/` — 无匹配
- [x] `grep -r "alicdn" packages/` — 仅 `iconfont-context.tsx` 有匹配
- [x] `npx tsc --noEmit` — 零错误
