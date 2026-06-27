# 浮动按钮组

## 为什么做

博客详情页内容较长，需要在右下角提供常用操作与阅读进度提示，方便用户快速导航。

## 做什么

- 在详情页右下角新增 FloatButton 组
- 支持返回首页
- 支持返回页头（平滑滚动）
- 支持点赞（先用占位提示）
- 展示当前滚动进度数字（不带百分号）
- 每个按钮宽度一致，连续一体无间隙
- 支持鼠标拖放，仅能吸附左侧或右侧

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 接入
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式
