---
title: 博客时间格式与浏览量
domain: blog
keywords: [博客展示, 时间格式, 相对时间, 浏览量, 列表页, 详情页, 日期显示]
scope:
  - packages/wuh.site.next/app/HomeView.tsx
  - packages/wuh.site.next/app/blog
  - packages/wuh.site.next/app/post
status: active
source:
  - changes/archive/20260701_P_date_format_view_count/brief.md
verified: 2026-08-08
---

# 博客时间格式与浏览量

## 当前结论

首页和博客列表页日期格式为 MM-dd。博客详情页发布时间根据距今时长显示：1 天内显示「X小时前发布」，1 周内显示「X天前发布」，1 月内显示「MM月dd日」，超过 1 月显示「YYYY年MM月dd日」。

首页、列表页和详情页均展示浏览量，不再展示评论数。

## 执行约束

- 首页、列表、详情的日期和浏览量展示必须使用一致规则；不得重新以评论数替代浏览量。

## 适用边界

不约束 CMS 中原始日期的存储格式。

## 验证方式

检查共享日期格式函数及三个页面调用点，使用跨 1 天、1 周、1 月边界的固定输入验证输出。

## 关联知识

- [blog detail](./blog-detail.md)
- [visit stats](./visit-stats.md)
