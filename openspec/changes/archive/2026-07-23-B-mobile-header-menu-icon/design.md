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

# 移动端 Header 汉堡菜单图标恢复设计

## 架构

`SiteHeader` 继续负责菜单状态、键盘关闭、ARIA 属性和 `IconBars` 渲染；`SiteHeader/styles` 负责移动按钮的视觉样式。仅解除移动菜单按钮与通用 `Button` 的样式耦合，不改变组件层级或状态流。

```text
SiteHeader
  └─ MobileToggle (styled.button)
       └─ IconBars (lucide-react)
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 按钮基元 | 原生 `styled.button` | Header 菜单按钮不需要通用 Button 的变体、图标包装和默认溢出样式 |
| 图标 | 现有 `IconBars` | 复用已统一导出的 Lucide outline 图标 |
| 图标布局 | `svg` 显式 `20px × 20px`、`display: block`、`flex-shrink: 0` | 避免 SVG 默认尺寸或 flex 布局导致图标不可见或被压缩 |
| 回归验证 | Node 内置测试读取组件源码与样式约束 | 项目现有 Header 主题控件测试采用同一轻量测试方式 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| `IconBars` | `@wuh.site/components/icons` | 复用 | `packages/wuh.site.next/app/components/SiteHeader/index.tsx` |
| `styled` | `@wuh.site/components/styled` | 复用 | `packages/wuh.site.next/app/components/SiteHeader/styles/index.ts` |
| 通用 `Button` | `@wuh.site/components/button` | 移除本处依赖 | 不适用于本菜单按钮的显式 SVG 布局控制 |

## 数据模型（如涉及）

不涉及数据模型、接口或持久化变更。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### MobileToggle

- 使用 `styled.button`。
- 保持 `width: 44px`、`height: 44px` 和小于 `768px` 显示。
- 重置原生按钮外观、内边距和字体，保留现有边框、背景、颜色、hover、focus-visible 和 reduced-motion 行为。
- 对内部 SVG 设置固定尺寸、块级显示和 `flex-shrink: 0`。

### SiteHeader

不修改现有状态逻辑、`IconBars` 使用方式、`aria-expanded`、`aria-controls` 和菜单切换行为。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | `MobileToggle` 隐藏，桌面导航和主题控件保持原状 |
| < 768px | `MobileToggle` 显示为 44×44 按钮，内部汉堡图标固定为 20×20 |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无
- **向后兼容:** 保持现有 Header DOM 语义、事件和 ARIA 行为
- **性能影响:** 无新增运行时依赖，仅减少通用 Button 样式层级
