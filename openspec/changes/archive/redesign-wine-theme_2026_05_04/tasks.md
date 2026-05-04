# 任务拆分

## Phase 1 — 色阶重设计 (无依赖，可并行)

- [x] T1: `generator-color.ts` — 重设计 backgroundLight（暖粉/米色系）和 normalLight（深棕色系）
- [x] T2: `themes/index.ts` — DefaultTheme.colors.background 更新为 #F5F0EC
- [x] T3: `cssVariableProvider.tsx` — --page-bg 简化为线性渐变，--text-color 改为 normal.light[900]

## Phase 2 — 验证

- [ ] T4: 目视确认对比度合理（Node segfault 无法跑 tsc/swc）
