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
