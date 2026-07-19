---
artifact: design
contractVersion: 1
requiredHeadings:
  - 架构
  - 技术选型
  - 复用分析
  - 影响分析
requiredPatterns:
  - '^# .+'
---

# 首页主题切换控件现代化重设计

## 架构

本次变更只调整首页头部的主题切换表现层，不改变 `ThemeModeProvider` 的状态和持久化逻辑。

```text
ThemeModeProvider
  ├─ theme: wine | plain
  └─ toggle()
        │
        ▼
SiteHeader
  ├─ DesktopThemeToggle（>= 768px）
  │    ├─ Palette 图标
  │    ├─ 当前主题标签
  │    └─ ChevronDown 提示
  └─ MobileThemeAction（< 768px，菜单展开后）
       ├─ Palette 图标
       ├─ “切换主题”操作文案
       ├─ 当前主题标签
       └─ ChevronRight/Down 提示
```

桌面端使用头部专用的轻量胶囊控件；移动端使用菜单内的整行操作项。两者都是原生 `button` 语义，但不再让通用 Button 的 `filled` 默认视觉参与主题控件绘制。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 视觉方向 | Swiss Modernism 2.0 + 当前 editorial/wine 品牌令牌 | `ui-ux-pro-max` 推荐其清晰网格、理性间距、明暗主题兼容和高可访问性；通过现有 CSS 变量保留站点品牌，而不是引入新色板 |
| 桌面布局 | 36px 高胶囊按钮，图标 + 主题名 + ChevronDown | 让控件既紧凑又具备明确的可操作暗示，避免只有颜色点造成歧义 |
| 移动布局 | 48px 以上整行按钮，左侧操作信息、右侧当前主题和 Chevron | 符合 `ui-ux-pro-max` 的 >=44px 触摸目标和 8px 间距要求，图标不会因压缩而消失 |
| 图标 | 现有 `lucide-react` outline 图标，通过 `@wuh.site/components/icons` 导出 `IconPalette` / `IconChevronDown` | 保持 icon-system 的 outline、currentColor、统一线宽风格，避免 emoji 或内联 SVG |
| 颜色 | `--primary-color`、`--background-100/200`、`--normal-300`、`--text-primary` | 保持 `wine/plain` 和系统明暗模式下的 token 映射，不在页面写入硬编码色值 |
| 动效 | 150–250ms 的背景、边框、阴影和轻微 transform；`prefers-reduced-motion` 下关闭位移 | 符合 UI Pro Max 的微交互节奏和减少动效规范，不改变布局尺寸 |
| 测试 | Node `node:test` 的静态契约回归 + TypeScript/lint | 当前前端没有 React Testing Library/Jest 配置，先用可执行的源码契约防止图标和响应式语义回归 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| `ThemeModeProvider` | `../theme/ThemeModeProvider` | 复用，不改状态逻辑 | `packages/wuh.site.next/app/components/theme/ThemeModeProvider.tsx` |
| Lucide icon exports | `@wuh.site/components/icons` | 扩展导出 `IconPalette`、`IconChevronDown` | `packages/components/icons/index.tsx` |
| `styled-components` | `@wuh.site/components/styled` | 复用，新增头部专用 styled primitives | `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` |
| 通用 `Button` | `@wuh.site/components/button` | 本次主题控件不再继承其视觉样式，避免默认 `filled`/padding 覆盖 | `packages/components/button/index.tsx` |

**说明：**
- 通用 Button 仍可用于其他站点按钮，不修改其公共 API。
- 主题控件保留原生 `button` 语义，使用 styled-components 的专用元素隔离默认按钮样式。
- 图标只作为视觉提示，所有操作信息仍通过可见文字和动态 `aria-label` 提供。

## 数据模型（如涉及）

无数据模型变更。继续使用：

- `Theme = 'wine' | 'plain'`
- `localStorage` key：`wuh.site.theme`
- `document.documentElement.dataset.themeFamily`

## API 设计（如涉及）

无 API 变更。

## 组件/模块设计

### 桌面端主题控件

- 使用 `DesktopThemeToggle` 专用 styled button。
- 子元素顺序：`IconPalette` → 当前主题文本 → `IconChevronDown`。
- `aria-label` 保持动态：`切换主题（当前：酒红）`。
- 通过 `aria-hidden="true"` 隐藏纯装饰图标。
- `min-height: 36px`，不依赖通用 Button 的 `min-height: 40px`。

### 移动端主题操作项

- 使用 `MobileThemeAction` 专用 styled button。
- 左侧显示 `IconPalette` 与 `切换主题`；右侧显示当前主题名称和 Chevron。
- `min-height: 48px`，`width: 100%`，图标设置 `flex: 0 0 auto`。
- 点击后先执行 `toggleTheme()`，再关闭移动面板。
- 保持现有菜单关闭、Escape 关闭和导航链接行为。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 隐藏移动菜单按钮；显示桌面胶囊式主题控件；主题控件与导航保持 8–12px 间距 |
| < 768px | 顶部隐藏桌面主题控件；汉堡按钮保持 44px 触摸目标；菜单展开后显示 48px 以上的主题整行操作项 |
| <= 380px | 主题操作项两侧内容允许收缩文本但图标保持固定；不出现横向滚动，当前主题标签使用 `white-space: nowrap` |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；通用 Button API、ThemeModeProvider API 和主题存储协议保持不变。
- **向后兼容:** 兼容现有桌面/移动头部交互、键盘操作和系统明暗模式。
- **性能影响:** 仅新增两个轻量 Lucide 图标和 CSS 状态样式，无运行时数据请求；动效仅作用于控件本身。
- **风险控制:** 通过源码契约测试锁定图标导出、动态 aria-label、移动端图标固定和 `prefers-reduced-motion` 规则；最终 review 额外运行类型检查和 lint。
