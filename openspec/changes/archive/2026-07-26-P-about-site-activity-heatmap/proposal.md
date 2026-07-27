# About 综合活动热力图

## 背景

About 页当前已有 GitHub contribution 热力图，但它只展示 GitHub 数据。相邻的“最近日志”和时间范围选择器仍是静态占位内容，无法反映站点已经收集的访问、发布、评论、留言和项目更新活动。现有访问统计、内容和评论数据尚未提供统一的逐日聚合接口，前端也无法可靠地将不同量纲的数据直接合并。

## 目标

- 在 About 页增加最近 365 天的站点综合活动热力图。
- 通过后端统一聚合访问记录、文章发布/更新、评论/留言和项目内容更新，并返回每日分类明细。
- 将不同量纲的指标分别归一化后等权合成为每日 0–4 活跃等级，避免浏览量淹没低频内容活动。
- 桌面端悬浮、移动端点击时展示日期、综合等级及各项活动明细。
- 保留现有 GitHub contribution 热力图，并使热力图组件不再固定使用“贡献”文案。

## 非目标（明确不做）

- 不接入 Yuque、公众号等外部平台抓取。
- 不新增点赞历史、逐日文章浏览量或无法由现有记录还原的历史指标。
- 不建立新的项目 changelog/release 数据模型。
- 不引入可配置权重、通用分析平台或详情弹窗。
- 不把 GitHub contribution 与站点综合活动混合为同一指数。

## 影响范围

- `packages/wuh.site.nest/src/modules/visit-stats/` — 提供最近 365 天访问记录的逐日聚合能力。
- `packages/wuh.site.nest/src/modules/content/` — 提供文章、项目内容的日期聚合。
- `packages/wuh.site.nest/src/modules/comment/` — 提供评论/留言的日期聚合与状态规则。
- `packages/wuh.site.nest/src/modules/about-activity/` — 新增 About 综合活动聚合模块及接口。
- `packages/shared-contracts/` — 新增活动 DTO、接口路径和响应类型。
- `packages/components/heatmap/` — 支持通用活动计数、文案和明细 tooltip。
- `packages/wuh.site.next/app/about/` — 加载并展示站点活动热力图，替换静态日志占位。
- `openspec/specs/about-activity/`、`openspec/specs/visit-stats/` — 补充活动聚合规范。
