# 移动端 viewport 增强 — themeColor + colorScheme

## 背景

移动端打开站点时缺少两项浏览器级别的体验优化：

1. Chrome 地址栏/Safari 顶部栏颜色为默认色，与站点亮暗主题不协调
2. 站点加载时可能出现短暂白屏，因为浏览器不知道站点支持暗色模式

## 目标

- 亮色模式浏览器工具栏显示暗红色（与 wine 主题主色一致）
- 暗色模式浏览器工具栏显示深黑色（与暗色背景融合）
- 通过 `colorScheme: 'light dark'` 告知浏览器站点原生支持双主题

## 非目标（明确不做）

- 不修改任何样式文件
- 不影响 viewport 现有的禁用缩放配置

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 扩展 Viewport 导出
