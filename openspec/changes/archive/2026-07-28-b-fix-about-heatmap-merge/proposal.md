# 修复 About 统一热力图请求与展示

## 背景

About 页面当前将站点活动与 GitHub 贡献拆成两张热力图，和“单一综合热力图”的实际需求不一致。两个请求也持续失败：Next rewrite 的目标地址已经包含 `/v2`，而前端请求 `/api/v2/...` 会被转发为 `/v2/v2/...`，无法命中 NestJS 路由。

## 目标

- 修正前端到 NestJS 的代理路径，使统一热力图接口可正常访问。
- 将站点活动与 GitHub 贡献按自然日合并为一个 365 天热力图数据集。
- About 页面只渲染一个热力图；每日总活动量决定格子强度，交互明细展示站点分类和 GitHub 贡献数。

## 非目标（明确不做）

- 不更改访问、内容、评论、留言等原始数据的采集逻辑。
- 不改变 GitHub OAuth、仓库信息或其他 About 页面区域。
- 不引入新的第三方图表依赖。

## 影响范围

- `packages/wuh.site.next/app/about/AboutView.tsx` — 改为请求并渲染单一热力图。
- `packages/wuh.site.nest/src/modules/about-activity/` — 聚合 GitHub 贡献和站点活动，并提供统一接口。
- `packages/shared-contracts/` — 定义统一日活动响应类型。
- `packages/components/heatmap/` — 支持统一活动的分项详情展示。
- `openspec/specs/about-activity/spec.md` — 用单一综合热力图需求替代“两张独立热力图”要求。
