# 主题色跟随系统

## 动机

当前主题切换按钮同时控制酒红/素雅（ThemeFamily）和明亮/暗黑（ColorScheme）两个维度，4 态循环。用户认为暗黑模式应该跟随操作系统偏好，手动切换只需控制酒红/素雅。

## 变更范围

- Theme 类型从 `'wine-light' | 'wine-dark' | 'plain-light' | 'plain-dark'` 缩减为 `'wine' | 'plain'`
- ColorScheme 由 `matchMedia('(prefers-color-scheme: dark)')` 驱动，实时响应系统切换
- 切换按钮从 4 态循环改为 2 态（酒红 ↔ 素雅）
- 调试面板同步简化

## 影响

- 前端: `ThemeModeProvider`, `SiteHeader`, `/design/system-color`
- 后端: 无影响
