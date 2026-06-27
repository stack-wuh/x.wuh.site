# 粘性按钮组优化

## 为什么做

浮动按钮组中的独立进度按钮占用空间，阅读进度数字反馈不够直观。需要将进度视觉迁移到"回到页头"按钮，减少按钮数量。

## 做什么

- 移除浮动按钮组中的阅读进度按钮及相关 DOM/样式
- 复用渐变填充逻辑，使"回到页头"按钮根据滚动进度展示渐变背景
- 保留回到页头/返回首页/点赞按钮的事件、拖拽吸附逻辑
- light/dark 适配
- 可访问性（aria-label、focus）更新

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 移除进度按钮 + 渐变迁移
- `packages/wuh.site.next/app/post/styles/index.ts` — 样式更新
