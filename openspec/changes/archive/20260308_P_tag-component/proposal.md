# 标签组件

## 为什么做

首页 CardHeader 中标签部分直接内联渲染，缺少统一组件。新增 Tag 胶囊组件，与 GitHub 标签色彩保持一致，提供统一的视觉和交互体验。

## 做什么

- 在 `packages/components` 新增 Tag 组件，胶囊样式
- hover 时字体放大一个字号，字色与背景色互换
- 接入 styled-components + CSS 变量主题令牌，支持 light/dark 模式
- 替换 `HomeView.tsx` 中 CardHeader 的标签部分

## 覆盖范围

- 博客列表卡片标签
- 博客详情页标签
- 后续任意需要展示标签的场景

## 影响范围

- `packages/components/tag/` — 新增
- `packages/wuh.site.next/app/HomeView.tsx` — 替换标签渲染

## 不改什么

- 不改变标签数据获取方式
- 不新增第三方依赖
