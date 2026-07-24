---
component: SiteHeader Theme Toggle
keywords:
  - theme
  - theme toggle
  - palette
  - responsive
  - mobile
  - accessibility
  - 主题
  - 主题切换
  - 响应式
  - 移动端
  - 可访问性
related: []
hooks:
  - useThemeMode
---

## 首页主题切换控件

首页头部使用两种响应式主题切换入口：桌面端为轻量胶囊按钮，移动端为菜单内整行操作项。

### 设计约束

- 使用统一的 outline `Palette` / `ChevronDown` 图标。
- 桌面端显示当前主题名称；移动端同时显示“切换主题”和当前主题。
- 触摸目标至少 44px，图标使用 `flex: 0 0 auto` 防止窄屏消失。
- 使用动态 `aria-label`，并保留 `focus-visible` 与 reduced-motion 支持。
- 主题控件不继承通用 Button 的 filled 视觉，避免公共按钮样式覆盖头部专用布局。
