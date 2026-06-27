# 首页与博客列表响应式布局优化

## 为什么做

当前 HomeView 使用固定 980px 宽度、三栏网格和大段留白。需要实现手机(≤640px)、平板(≤1024px)和桌面三档响应式体验，在不同设备保持可读、可交互的排版。

## 做什么

- 将 HomeView 栅格/CTA/列表部分拆分，统一响应式断点
- 重新定义 padding/margin/字体/按钮排列
- 手机堆叠、平板双列、桌面三列
- blog/page.tsx 同步完成响应式布局
- 维护现有主题变量，无新增依赖

## 影响范围

- `packages/wuh.site.next/app/HomeView.tsx` — 结构+样式重构
- `packages/wuh.site.next/app/blog/page.tsx` — 响应式
