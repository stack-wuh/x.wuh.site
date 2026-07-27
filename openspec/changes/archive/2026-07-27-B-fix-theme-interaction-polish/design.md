# 设计文档

## 架构

本变更由两个独立的局部 CSS 修复组成，均不改变 React 结构或数据流：

```text
SiteHeader.NavLink
├── 覆盖全局 a:hover text-decoration
└── 保留 NavLink::after 主题色装饰线

About.GuestbookTrigger
├── 使用 --primary-color 生成单向雾化渐变
├── 使用 data-color-scheme 路由亮暗状态
└── 保留文字可读性、220ms 过渡与 reduced-motion
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Header 双线修复 | 在 `NavLink` 的 Hover / Focus 状态显式设置 `text-decoration: none` | 局部解决全局 `a:hover` 与伪元素冲突，不影响正文链接 |
| Header 装饰线 | 保留现有 `::after` 1px 主题色渐隐线 | 已符合用户选择和正式设计系统规范 |
| 留言板渐变 | 方案 A：105deg 左向右单向主题雾化 | 主题色沿内容阅读方向自然衰减，纸张层次清晰 |
| 渐变色源 | `--primary-color` 与 `--background-100` 的 `color-mix()` | 直接随酒红/素雅主题变化，不依赖固定强调色 |
| 亮暗路由 | `[data-color-scheme='dark'] &` | 与站点用户选择一致，避免系统偏好与手动模式冲突 |
| 动效 | 背景、边框与文字保留 `220ms ease` | 延续已确认的同步节奏 |

## 数据模型（如涉及）

不涉及数据模型变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### NavLink

保留现有 `::after`：1px 高、两端透明、中段使用 `--primary-color`。在 `:hover` 与 `:focus-visible` 中显式声明 `text-decoration: none`，覆盖全局 `a:hover`，从而只显示伪元素装饰线。焦点轮廓、文字颜色增强和链接点击区域保持不变。

### GuestbookTrigger

默认和 Hover / Focus 状态均以 `--background-100` 为纸张基底。前景渐变改为从左侧低浓度 `--primary-color` 开始，经过较淡中段后在右侧自然回归纸张底色。Hover / Focus 仅适度增加主题色浓度和扩展衰减范围，不改变渐变方向，不使用固定 `--accent-color` 作为背景主色。

左侧强调边框、CTA 和相关强调反馈统一使用 `--primary-color`。标题、预览文字继续使用语义文字令牌，保证可读性。

暗色分支从 `@media (prefers-color-scheme: dark)` 改为 `[data-color-scheme='dark'] &`，使用相同方向和层次，仅调整主题色浓度与纸张底色混合比例。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | Header 桌面导航只显示主题色装饰线；留言板采用单向主题雾化 |
| < 768px | Header 移动菜单保持不变；留言板沿用同一渐变与现有窄屏布局 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** DOM、链接、按钮语义、布局与业务行为保持不变
- **性能影响:** 仅调整已有 CSS 选择器和渐变值，影响可忽略
