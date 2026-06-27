# 任务清单

## Phase 1: 核心修复

### Task 1: layout.tsx 添加 <head> 阻塞脚本

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`
- [ ] 在 `<head>` 中插入同步 `<script>`，读取 `prefers-color-scheme` 和 `localStorage`，设置 `data-color-scheme`、`data-theme-family`、`data-no-transition`
- [ ] **预计耗时:** 15 min
- [ ] **验证:** 页面首次加载不闪动

### Task 2: CssVariableStyles 添加过渡规则

- [ ] **文件:** `packages/components/themes/cssVariableProvider.tsx`
- [ ] 在 Layer 3 之后追加 `data-no-transition` guard 和全局 `*` transition 规则
- [ ] **预计耗时:** 10 min
- [ ] **验证:** 手动切换系统亮暗 → 0.3s 平滑过渡

### Task 3: ThemeModeProvider 移除 no-transition guard

- [ ] **文件:** `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx`
- [ ] 在 useEffect 末尾调用 `document.documentElement.removeAttribute('data-no-transition')`
- [ ] **预计耗时:** 5 min
- [ ] **验证:** hydration 后无 data-no-transition，过渡正常工作

## Phase 2: 验证

### Task 4: 端到端验证

- [ ] 启动 `pnpm dev:next`
- [ ] 系统设为暗色 → 首次加载无闪动
- [ ] 系统设为亮色 → 首次加载无闪动
- [ ] 系统亮→暗切换 → 0.3s 平滑过渡
- [ ] 系统暗→亮切换 → 0.3s 平滑过渡
- [ ] 手动切换酒红/素雅 → 过渡正常
- [ ] **预计耗时:** 10 min

## 验收

- [ ] 首次加载零闪动
- [ ] 主题切换有 0.3s 全局平滑过渡
- [ ] `npx tsc --noEmit` 零错误
- [ ] 移动端和桌面端行为一致
