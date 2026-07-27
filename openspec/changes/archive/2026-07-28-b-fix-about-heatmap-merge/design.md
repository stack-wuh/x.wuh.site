# 设计文档

## 架构

统一接口在服务端完成日期窗口、站点活动和 GitHub 贡献的聚合，前端不再分别请求两套热力图数据。

```
AboutView
  -> GET /api/about/activity
  -> Next rewrite: http://nest:3200/v2/about/activity
  -> AboutActivityService
       -> 站点活动日计数
       -> GitHub contributions 日计数
       -> 按 YYYY-MM-DD 合并并计算总量/等级
  -> UnifiedActivityHeatmap
  -> Heatmap
```

关键路径规则：`nestApiUrl` 已包含 `/v2`，因此浏览器请求必须是 `/api/about/activity`，不能重复添加 `/v2`。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 数据聚合位置 | NestJS 服务端 | 集中处理日期补零、归一化和外部 GitHub 数据失败语义，避免前端双请求不一致。 |
| 活动强度 | 每日原始总量的统一分布等级 | 符合“综合总量”要求，颜色仅表达同一天所有活动的合计。 |
| 日期基准 | Asia/Shanghai 的最近 365 个自然日 | 与既有站点活动规范一致，避免时区错位。 |
| 前端请求 | `/api/about/activity` | 与现有 rewrite 规则匹配，最终目标不会产生 `/v2/v2`。 |

## 数据模型

统一每日数据在原有站点分类基础上新增 GitHub 贡献计数：

```ts
interface UnifiedActivityDay {
  date: string
  total: number
  level: 0 | 1 | 2 | 3 | 4
  counts: {
    visits: number
    published: number
    updated: number
    comments: number
    guestbook: number
    projectUpdates: number
    githubContributions: number
  }
}

interface UnifiedActivityHeatmap {
  startDate: string
  endDate: string
  total: number
  days: UnifiedActivityDay[]
}
```

`total` 是所有分类原始计数（含 `githubContributions`）之和。`level` 由 365 天内非零 `total` 的分布计算；无活动日恒为 0。Tooltip 显示日期、总活动量、GitHub 贡献以及各站点分类计数。

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/about/activity` | 返回站点活动和 GitHub 贡献合并后的最近 365 天数据。 |

浏览器端经 Next rewrite 调用：`GET /api/about/activity`。

**响应示例:**

```json
{
  "startDate": "2025-07-29",
  "endDate": "2026-07-28",
  "total": 42,
  "days": [
    {
      "date": "2026-07-28",
      "total": 5,
      "level": 3,
      "counts": {
        "visits": 2,
        "published": 0,
        "updated": 1,
        "comments": 0,
        "guestbook": 0,
        "projectUpdates": 0,
        "githubContributions": 2
      }
    }
  ]
}
```

接口必须在任一必要数据源失败时返回明确错误，不能把缺失的 GitHub 数据当作零值成功返回。

## 组件/模块设计

### AboutActivityService

在现有站点活动聚合结果基础上获取 GitHub contribution 日计数，使用相同日期键合并，并计算统一 `total` 与 `level`。GitHub 获取逻辑从现有贡献接口/服务复用，不复制网络请求实现。

### Heatmap

继续接收按周组织的数据；扩展单元格详情类型，以显示 `githubContributions` 和站点分类。没有新增图表组件。

### AboutView

删除两个独立的 `useRequest`、两段热力图标题和两次 `Heatmap` 渲染，改为一次统一请求和一次渲染。请求失败时显示唯一、明确的统一热力图错误状态。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | Hover 显示当天总量和分项明细。 |
| < 768px | 点击单元格显示同样的当天总量和分项明细。 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** `GET /v2/about/activity` 的响应增加 GitHub 贡献并改为统一强度语义；它目前仅由 About 页面使用。
- **向后兼容:** 删除 About 页面上两个独立热力图的展示，不影响其他 API 路由。
- **性能影响:** 单次页面请求替换两次请求；服务端需在统一聚合中调用 GitHub 贡献数据源，沿用其缓存策略。