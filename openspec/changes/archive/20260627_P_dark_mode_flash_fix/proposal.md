# 暗黑模式切换闪动修复 + 过渡动画

## 背景

当前主题系统 `data-color-scheme` 在客户端 `useEffect` 中设置，晚于 React hydration 执行。表现为：

- 页面默认用明亮样式渲染首屏
- JS 执行后检测到系统暗黑偏好才切换到暗色
- 用户看到明显的亮→暗"闪动"

此外，切换过程没有过渡动画，明暗切换太直接。

## 目标

- 首屏渲染前（`<head>` 同步脚本）即设置 `data-color-scheme` 和 `data-theme-family`，消除闪动
- 主题切换时有全局 0.3s 平滑过渡动画
- 首屏禁用过渡以防反向闪动（元素从默认值过渡到目标值）

## 非目标（明确不做）

- 不改变双维度主题模型架构
- 不改变 CSS 变量结构
- 不改用户手动切换主题的逻辑

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 添加 `<head>` 阻塞脚本
- `packages/components/themes/cssVariableProvider.tsx` — 添加全局过渡 CSS + 无过渡 guard
- `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` — hydration 后移除 `data-no-transition`
