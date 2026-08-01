# About 热力图 — GitHub 风格组件化

> 原始变更名：`20260621_P_github_heatmap`

## 元数据
- 日期：2026-06-21
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
当前 About 页面热力图是 12 周 × 7 天的伪随机方格，内联在 page.tsx 中。需要改为完整 GitHub 贡献热力图风格并提取为可复用组件。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
```
GitHub GraphQL API (api.github.com)
       │
       ▼
NestJS: GET /v2/github/contributions?username=stack-wuh
       │  Octokit GraphQL → 30min 内存缓存
       ▼
About page (useRequest fetch)
       │
       ▼
<Heatmap /> 组件 (@wuh.site/components/heatmap)
```

## 任务
### Phase 1：历史任务
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/github/github.service.ts`
- [x] Octokit GraphQL 查询 GitHub 贡献日历，30 分钟内存缓存
- [x] 级别映射：0→0, 1-4→1, 5-9→2, 10-19→3, 20+→4
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/github/github.controller.ts`
- [x] `@Controller('github')` — `GET contributions?username=xxx`，默认 `stack-wuh`
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/github/github.module.ts`
- [x] **文件:** `api-v2.module.ts` — 注册 `GithubModule`
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/components/heatmap/types.ts` — HeatmapData, ColorScheme, 颜色常量
- [x] **文件:** `packages/components/heatmap/styles.tsx` — Grid, Cell, Tooltip, Legend, Skeleton
- [x] **文件:** `packages/components/heatmap/index.tsx` — loading/empty/data 三态
- [x] 月份标签自动推算，hover tooltip 显示日期和贡献数
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `data.ts` — 删除 buildHeatmap, heatmap, filters, legendLabels, heatColors
- [x] **文件:** `styles.ts` — 删除 HeatmapGrid, FilterGroup, ChipButton, Legend 等
- [x] **文件:** `page.tsx` — useRequest 调 `/v2/github/contributions`，替换为 `<Heatmap />`
- [x] **类型检查:** `npx tsc --noEmit`
- [x] 后端 `npx tsc --noEmit` — 仅预存错误
- [x] 前端 `npx tsc --noEmit` — 零错误
- [x] grep 确认旧 heatmap 引用已清理

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: github-heatmap-component
date: 2026-06-21
type: P
status: archived
```

### `design.md`
# 设计文档

## 架构

```
GitHub GraphQL API (api.github.com)
       │
       ▼
NestJS: GET /v2/github/contributions?username=stack-wuh
       │  Octokit GraphQL → 30min 内存缓存
       ▼
About page (useRequest fetch)
       │
       ▼
<Heatmap /> 组件 (@wuh.site/components/heatmap)
```

## 组件设计

### Props

```tsx
interface HeatmapProps {
  data: HeatmapData | null
  loading?: boolean
  colorScheme?: 'github' | 'warm'
}
```

三态：loading → 骨架屏（53×7 灰色方格），null → 空提示，data → 完整渲染

### 视觉

- 方格 12px × 12px，间距 3px，圆角 2px
- GitHub 绿色 `#ebedf0 → #9be9a8 → #40c463 → #30a14e → #216e39`
- warm 方案：`--accent-color` 渐变
- 左侧 Mon/Wed/Fri 标签，顶部月份标签（自动推算）
- 底层 Less/More 图例
- hover tooltip："X 月 X 日 · N 条贡献"

## 数据流

### GraphQL 查询

```graphql
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { contributionCount date color }
        }
      }
    }
  }
}
```

级别映射：0→level 0, 1-4→level 1, 5-9→level 2, 10-19→level 3, 20+→level 4

### 环境变量

`GITHUB_PERSONAL_TOKEN` — 已存在，无需新增

## 文件变更

| 操作 | 文件 | 内容 |
|------|------|------|
| 新增 | `packages/components/heatmap/types.ts` | 类型 |
| 新增 | `packages/components/heatmap/styles.tsx` | 样式 |
| 新增 | `packages/components/heatmap/index.tsx` | 组件 |
| 新增 | `packages/wuh.site.nest/src/modules/api-v2/github/github.service.ts` | GraphQL 调用 |
| 新增 | `packages/wuh.site.nest/src/modules/api-v2/github/github.controller.ts` | 控制器 |
| 新增 | `packages/wuh.site.nest/src/modules/api-v2/github/github.module.ts` | 模块 |
| 修改 | `packages/wuh.site.nest/src/modules/api-v2/api-v2.module.ts` | 注册 GithubModule |
| 修改 | `packages/wuh.site.next/app/about/data.ts` | 删除 heatmap 数据 |
| 修改 | `packages/wuh.site.next/app/about/styles.ts` | 删除 heatmap 样式 |
| 修改 | `packages/wuh.site.next/app/about/page.tsx` | 替换为 Heatmap 组件 |

### `proposal.md`
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

### `tasks.md`
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
