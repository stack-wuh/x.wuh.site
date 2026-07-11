# About 热力图 — GitHub 风格组件化

## 背景

当前 About 页面热力图是 12 周 × 7 天的伪随机方格，内联在 page.tsx 中。需要改为完整 GitHub 贡献热力图风格并提取为可复用组件。

## 目标

- 视觉对齐 GitHub 贡献图：53 周 × 7 天、5 级绿色、月份标签、hover tooltip
- 提取为独立组件 `@wuh.site/components/heatmap`
- 数据源从 GitHub GraphQL API 获取，后端新增代理端点 `GET /v2/github/contributions`
- 组件 props 接口预留，后续可切换数据源

## 影响范围

- `packages/components/heatmap/` — 新增组件（types + styles + index）
- `packages/wuh.site.nest/src/modules/api-v2/github/` — 新增 NestJS 模块
- `packages/wuh.site.next/app/about/` — 替换内联热力图为组件，清理 heatmap 样式和数据
