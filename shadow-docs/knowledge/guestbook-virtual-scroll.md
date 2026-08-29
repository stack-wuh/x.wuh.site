---
title: 留言板滚动与分页
domain: guestbook
keywords: [滚动区域, ScrollArea, 留言板, 分页, 全量渲染, 贴底跟随, 键盘可访问, 新留言提示]
scope:
  - packages/components/scroll-area
  - packages/wuh.site.next/app/about
  - packages/wuh.site.next/app/guestbook
  - /v2/comments
status: active
source:
  - changes/archive/20260728_P_virtual_guestbook_scroll/brief.md
  - changes/20260829-feature-guestbook-letter-style/brief.md
verified: 2026-08-29
---

# 留言板滚动与分页

## 当前结论

留言板滚动容器为 `packages/components/scroll-area`（shadcn ScrollArea 移植，基于 `@radix-ui/react-scroll-area`）：滚动条独立 DOM 渲染，Firefox/WebKit 行为一致，hover 或滚动中浮现（`data-state` 控制 opacity），键盘访问与触控适配由 Radix 提供；thumb 为中性暖棕半透明圆角胶囊，hover 加深带主色调，四主题自动适配。不虚拟化，全量渲染子内容。

弹窗贴底逻辑由消费方（About 留言板弹窗）自管理：视口 scroll 事件计算距底距离（50px 阈值），首次填充 instant 定位底部，后续新消息在贴底时 smooth 跟随（`prefers-reduced-motion` 时 instant）；用户已上滚则保持位置并显示「有新留言 ↓」信笺风浮动按钮，按钮出现/消失无位移动画。

历史方案（react-virtuoso 虚拟滚动）因滚动跳顶问题已废弃：`initialTopMostItemIndex` 每次渲染重算 + data 引用变化无 `computeItemKey` 导致重锚定错位。数据量大时不采用虚拟化，兜底路径为分页。

独立留言板页面 `/guestbook?page=N` 每页 20 条最新在前，使用 Pagination 组件，浏览器前进/后退可恢复页码。无效页码重定向到 page=1。评论数为 0 时显示空状态与返回入口。历史数据加载失败时保留已有本地消息、顶部显示 error Banner（`role="alert"`），发送失败的消息保留在原位置显示失败状态。

## 执行约束

- 留言列表走 ScrollArea 全量渲染，不引入虚拟滚动；贴底跟随只在新消息到达且用户未上滚时触发，不得打乱当前位置或时间顺序。

## 适用边界

小数据量全量渲染；数据规模真到数千条时走分页（独立页已有先例），不重新引入虚拟化。

## 验证方式

以 500 条数据检查 DOM 渲染与滚动位置、贴底跟随、新消息按钮和上一页加载后的顺序。

## 关联知识

- [guestbook barrage](./guestbook-barrage.md)
- [pagination](./pagination.md)
