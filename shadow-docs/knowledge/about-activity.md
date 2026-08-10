---
title: About 综合热力图
domain: about
keywords: [About页, 热力图, 活动聚合, GitHub贡献, 365天, Heatmap, 综合活动]
scope:
  - packages/wuh.site.nest/src/modules/about-activity
  - packages/wuh.site.next/app/about
status: active
source:
  - changes/archive/20260726-P-about-site-activity-heatmap/brief.md
  - changes/archive/20260728-B-b-fix-about-heatmap-merge/brief.md
verified: 2026-08-08
---

# About 综合热力图

## 当前结论

后端聚合站点活动与 GitHub contribution 为单一 365 天数据集，通过 `GET /v2/about/activity` 返回。每日数据按 `YYYY-MM-DD` 升序排列，包含访问、文章发布、文章更新、评论、留言和 GitHub contributions 等分项计数。每日 `total` 为所有来源计数之和，`level` 基于统一分布计算 0-4 等级。无活动日期补零。

About 页面只渲染一个综合热力图，格子颜色表达每日统一 `total` 强度。桌面 hover 或移动端点击时显示日期、总量和分类明细 Tooltip。热力图完整展示 53 个周列不产生内部横向滚动，月份标题与周列同坐标轨道，星期标题与日期行准确对齐。

任一必要数据源失败时接口返回明确错误，不返回伪完整成功数据。Heatmap 加载态与真实数据态使用相同响应式轨道，状态切换不产生布局跳变。旧调用方继续兼容。

## 执行约束

- 聚合规则、365 天补零、level 计算和单热力图展示必须同步修改前后端契约；不得重新拼接 `/v2/v2` 路径。

## 适用边界

只约束 About 综合活动接口和热力图，不约束独立 GitHub contributions 展示。

## 验证方式

检查 `packages/wuh.site.nest/src/modules/about-activity` 的返回结构，并验证 About 页面只消费 `/v2/about/activity`。

## 关联知识

- [repos api](./repos-api.md)
- [visit stats](./visit-stats.md)
