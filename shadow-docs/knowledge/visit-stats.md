---
title: 全站访问量统计
domain: analytics
keywords: [访问统计, IP去重, 页面访问, Footer, 30分钟窗口, 日聚合]
scope:
  - packages/wuh.site.nest/src/modules/visit-stats
  - packages/wuh.site.next/app/components/VisitStatsReporter
  - packages/components/layout
status: active
source:
  - changes/archive/2026-07-12-P-site-visit-stats/brief.md
verified: 2026-08-08
---

# 全站访问量统计

## 当前结论

前端页面加载或客户端路由切换时自动向后端 `POST /api/v2/visit-stats/stats` 上报访问。后端按 IP 去重：30 分钟内同一 IP 不重复计数，30 分钟后视为新访问。

`GET /api/v2/visit-stats/stats` 返回总访问量（所有去重记录数）和今日访问量（当日 00:00:00 以来的去重记录数）。Footer 展示"总访问量: {total} | 今日: {today}"，数据定期自动刷新。

为 About 综合活动接口提供按站点时区归桶的每日去重访问计数，查询失败时向调用方传播明确错误，不静默返回空序列。

## 执行约束

- 上报地址必须保持单一 `/v2` 前缀；客户端路由切换上报，后端 30 分钟同 IP 去重，Footer 只读统计接口。

## 适用边界

不作为用户身份或精准分析系统，不保存额外指纹。

## 验证方式

检查 reporter 挂载和路由监听、service 去重查询与 Footer 展示；用时间边界验证 30 分钟规则。

## 关联知识

- [homepage data](./homepage-data.md)
- [about activity](./about-activity.md)
