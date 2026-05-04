# 任务拆分

## Phase 1 — 恢复酒红色系 (无依赖，可并行)

- [x] T1: `generator-color.ts` — 默认色系从纸张风恢复为酒红暖色系（#C94A44 主色）
- [x] T2: `themes/index.ts` — DefaultTheme.colors 同步恢复酒红色系
- [x] T3: `cssVariableProvider.tsx` — 默认 `:root` 硬编码值（accent-color, page-bg, elevations）恢复酒红风格，修复 `--text-color` 为浅色匹配深色背景

## Phase 2 — 验证

- [ ] T4: `pnpm exec tsc --noEmit` TypeScript 类型检查
