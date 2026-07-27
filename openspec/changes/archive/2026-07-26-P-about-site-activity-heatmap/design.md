# 设计文档

## 架构

About 页面分别请求现有 GitHub contribution 接口和新增站点活动接口。站点活动接口由 NestJS 后端负责读取各数据源、按站点时区生成最近 365 个自然日、补齐缺失日期、计算分类等级和综合等级，并一次性返回前端。

```text
访问记录 ─┐
文章发布 ─┤
文章更新 ─┤→ AboutActivityService → 日期补齐 → 分类归一化 → 等权综合 → DTO
评论留言 ─┤                                                   ↓
项目内容更新┘                                      About / Heatmap 展示

GitHub contribution API ───────────────────────────────→ 独立 Heatmap
```

接口聚合失败时直接返回明确的 5xx 错误并记录失败来源；不允许仅返回部分数据并标记为成功。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 聚合位置 | NestJS 后端 | 统一处理日期边界、MongoDB 查询、缺失日期和失败语义，避免前端重复实现 |
| 时间窗口 | 当前站点日期往前 365 个自然日（含当前日） | 满足 About 页面固定范围，避免前端时钟和时区产生差异 |
| 日期时区 | 站点配置时区 | 保证访问、内容和评论在同一日期边界归桶 |
| 分类等级 | 每个分类独立按 365 天非零分布分为 1–4 级，零值为 0 | 防止访问量级远大于其他活动而淹没综合指数 |
| 综合等级 | 各分类等级等权平均后四舍五入到 0–4 | 不引入权重配置，结果可解释且满足统一热力图等级 |
| 前端展示 | 复用 Heatmap，新增活动文案和 breakdown | 保持现有视觉和布局，避免新建重复热力图组件 |

## 数据模型

新增共享类型（字段名以最终实现为准）：

```ts
type SiteActivityBreakdown = {
  visits: number
  published: number
  updated: number
  comments: number
  guestbook: number
  projectUpdates: number
}

type SiteActivityDay = {
  date: string // YYYY-MM-DD，站点时区
  count: number // 综合原始计数，用于总量展示
  level: 0 | 1 | 2 | 3 | 4
  breakdown: SiteActivityBreakdown
  levels: SiteActivityBreakdown
}

type SiteActivityHeatmap = {
  startDate: string
  endDate: string
  timezone: string
  total: number
  days: SiteActivityDay[]
}
```

其中 `levels` 的字段与 `breakdown` 一一对应，分类等级只由同分类的 365 天计数分布计算。当前 Content 模型没有可可靠区分项目 changelog 历史事件的独立字段，因此 `projectUpdates` 暂不从未证实的标签或内容更新中推导，统一返回 0；待数据模型提供稳定来源后再单独接入。


## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/about/activity` | 返回最近 365 天站点活动热力图及分类明细 |

不接受客户端日期范围、时区或权重参数，避免不同客户端获得不一致的指标。

**响应示例:**

```json
{
  "startDate": "2025-07-27",
  "endDate": "2026-07-26",
  "timezone": "Asia/Shanghai",
  "total": 47,
  "days": [
    {
      "date": "2026-07-26",
      "count": 6,
      "level": 3,
      "breakdown": {
        "visits": 120,
        "published": 1,
        "updated": 0,
        "comments": 2,
        "projectUpdates": 1
      },
      "levels": {
        "visits": 2,
        "published": 4,
        "updated": 0,
        "comments": 3,
        "projectUpdates": 4
      }
    }
  ]
}
```

实际实现应保证 `days` 恰好包含 365 个按日期升序排列的元素；无活动日期的 breakdown 和 levels 全部为 0。`count` 为当天各分类原始计数之和，`total` 为所有日期综合原始计数之和。

## 组件/模块设计

### AboutActivityModule

新增 NestJS 模块、Controller 和 Service。Service 并行查询访问记录、内容日期和评论/留言日期，按统一日期键合并后计算等级；任一查询失败则抛出异常并保留来源日志。

### Heatmap

扩展现有 Heatmap Props，允许传入活动数据类型、单元格文案和 breakdown。GitHub 数据继续使用现有“贡献”语义；站点活动使用“活动”语义，并在 tooltip 中显示日期、综合等级和各分类原始计数。tooltip 的交互保持桌面 hover；移动端增加点击选中状态，点击其他单元格或组件外部可关闭。

### AboutView

新增站点活动请求和加载/失败/空状态；GitHub 热力图保持独立渲染。移除或不再依赖静态日志作为站点活动数据源，避免静态内容与真实聚合结果混淆。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 单元格 hover 显示 tooltip，键盘聚焦也可查看详情 |
| < 768px | 点击单元格显示详情，避免依赖 hover；详情不超出视口 |

## 影响分析

- **新增依赖:** 无，复用 NestJS、Mongoose、现有 Heatmap 和请求工具。
- **破坏性变更:** 无；新增接口，现有 GitHub contributions 和 visit-stats 总量接口保持兼容。
- **向后兼容:** Heatmap 默认 Props 保持 GitHub 现有行为；旧调用方不传 breakdown 时继续显示原有 tooltip。
- **性能影响:** 聚合接口一次读取 365 天窗口，使用 MongoDB 日期范围查询和按日聚合；必要时复用已有短时缓存，避免每个热力图单元格单独请求。
