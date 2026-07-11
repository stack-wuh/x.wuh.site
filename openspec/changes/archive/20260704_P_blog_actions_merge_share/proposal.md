# 博客详情页操作按钮融入分享区

## 背景

当前博客详情页底部工具栏存在以下问题：
- 独立卡片的边框视觉过重
- 按钮样式与整体设计不协调
- 文字+图标的组合不够优雅
- 位置安排感觉别扭，作为独立区域突兀

用户希望将操作按钮（返回首页、回到顶部、点赞）整合到现有的分享卡片中，形成统一的操作区域。

## 目标

- 移除独立的底部工具栏卡片
- 将三个操作按钮融入分享卡片内部
- 与现有分享按钮保持一致的视觉风格
- 响应式布局：桌面端操作按钮和分享按钮分两行显示，移动端都堆叠排列

## 非目标（明确不做）

- 不修改 PostToolbar（上一篇/下一篇导航）
- 不改变按钮的功能行为
- 不调整分享按钮的样式和交互

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 移除 FloatingActions 调用
- `packages/wuh.site.next/app/post/components/FloatingActions.tsx` — 删除或重构为操作按钮组件
- `packages/wuh.site.next/app/post/styles/post-floating.ts` — 删除或简化样式
- `packages/wuh.site.next/app/post/styles/post-article.ts` — 调整 ShareInfoCard 内部布局
