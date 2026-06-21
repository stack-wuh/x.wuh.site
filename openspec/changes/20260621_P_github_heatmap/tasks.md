# 任务清单

## Task 1: NestJS GithubModule

- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/github/github.service.ts`
- [x] Octokit GraphQL 查询 GitHub 贡献日历，30 分钟内存缓存
- [x] 级别映射：0→0, 1-4→1, 5-9→2, 10-19→3, 20+→4
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/github/github.controller.ts`
- [x] `@Controller('github')` — `GET contributions?username=xxx`，默认 `stack-wuh`
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/github/github.module.ts`
- [x] **文件:** `api-v2.module.ts` — 注册 `GithubModule`
- [x] **类型检查:** `npx tsc --noEmit`

## Task 2: Heatmap 前端组件

- [x] **文件:** `packages/components/heatmap/types.ts` — HeatmapData, ColorScheme, 颜色常量
- [x] **文件:** `packages/components/heatmap/styles.tsx` — Grid, Cell, Tooltip, Legend, Skeleton
- [x] **文件:** `packages/components/heatmap/index.tsx` — loading/empty/data 三态
- [x] 月份标签自动推算，hover tooltip 显示日期和贡献数
- [x] **类型检查:** `npx tsc --noEmit`

## Task 3: About 页面集成

- [x] **文件:** `data.ts` — 删除 buildHeatmap, heatmap, filters, legendLabels, heatColors
- [x] **文件:** `styles.ts` — 删除 HeatmapGrid, FilterGroup, ChipButton, Legend 等
- [x] **文件:** `page.tsx` — useRequest 调 `/v2/github/contributions`，替换为 `<Heatmap />`
- [x] **类型检查:** `npx tsc --noEmit`

## Task 4: 构建验证

- [x] 后端 `npx tsc --noEmit` — 仅预存错误
- [x] 前端 `npx tsc --noEmit` — 零错误
- [x] grep 确认旧 heatmap 引用已清理
