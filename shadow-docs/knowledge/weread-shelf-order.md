---
title: 微信读书书架排序
domain: weread
keywords: [微信读书, 书架, 阅读时间排序, readUpdateTime, 在读过滤, finishReading, 分页查询]
scope:
  - packages/wuh.site.nest/src/modules/weread
  - packages/wuh.site.next/app/weread
  - packages/wuh.site.next/app/HomeView.tsx
status: active
source:
  - changes/archive/20260705-B-fix-weread-shelf-order/brief.md
  - changes/archive/20260607-B-weread_fix_and_pagination/brief.md
verified: 2026-08-08
---

# 微信读书书架排序

## 当前结论

首页微信读书模块展示最近阅读时间前 6 本在读书籍，`finishReading=1` 的已读完书籍不占用首页展示名额。

默认查询按 `readUpdateTime` 降序排列，`_id` 降序作为二级排序。不再依赖 `shelfIndex`（该字段仅记录同步 API 返回的数组下标，不代表用户实际阅读顺序）。

分页接口按最近阅读时间降序返回，`finishReading` 过滤参数需在计算分页总数前先应用。

## 执行约束

- 书架和首页均按 readUpdateTime 降序，_id 仅作稳定次序；finishReading 过滤必须先于分页统计，首页只取在读前 6 本。

## 适用边界

shelfIndex 只保存同步位置，不得作为阅读先后排序依据。

## 验证方式

检查 weread service 查询排序和 count 条件；用已读/在读混合数据验证首页与分页结果。

## 关联知识

- [homepage data](./homepage-data.md)
- [pagination](./pagination.md)
