# 图标抽离为公共组件

> 原始变更名：`2026-05-04-extract-icons`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/icons-library.md`

## 决策
# 技术方案: 图标组件库

## 文件结构

```
packages/components/icons/
├── index.tsx        # barrel 统一导出
├── brand.tsx        # 品牌/社交图标 (fill 风格, 9个)
├── ui.tsx           # 通用 UI 交互图标 (17个, 混合 fill/stroke)
├── status.tsx       # 状态/语义图标 (11个, 全 fill)
└── ornament.tsx     # 装饰 SVG 元素 (1个)
```

## 分类原则

| 文件 | 用途 | 风格 |
|------|------|------|
| brand.tsx | 微信/QQ/Twitter/GitHub 等品牌图标 | fill |
| ui.tsx | 工具栏/导航/操作按钮图标 | fill + stroke 共存 |
| status.tsx | 信息/成功/警告/错误/空等状态反馈 | fill (stroke 属性在 SVG 元素上) |
| ornament.tsx | 纯装饰元素 | fill |

## 关键决策

1. **stroke vs fill 共存**: image-preview 的图标用 stroke (线框风格)，其余用 fill。各保持原样。
2. **IconClose 统一**: message 和 image-preview 各有一个 Close，统一为 fill 版本（message 的版本）
3. **IconWarning 统一**: message 的 WarningIcon 和 result 的 AlertTriangleIcon 路径一致，统一为 IconWarning
4. **ToolbarIcon 拆分**: `direction` prop 拆为 IconChevronLeft / IconChevronRight
5. **renderLinkIcon 删除**: ContactCard 中 switch-case 改为 badge→icon 映射对象
6. **DiamondDivider 只抽 polygon**: 外层 styled-component 留在原文件

## 导入约定

```tsx
import { IconWechat, IconGithub, DiamondDivider } from '@wuh.site/components/icons'
```

所有图标从 barrel `index.tsx` 统一导出。

## 任务
### Phase 1 — 创建图标文件 (无依赖，可并行)
- [x] T1: 创建 `packages/components/icons/brand.tsx` — 9 个品牌图标
- [x] T2: 创建 `packages/components/icons/ui.tsx` — 17 个 UI 图标
- [x] T3: 创建 `packages/components/icons/status.tsx` — 11 个状态图标
- [x] T4: 创建 `packages/components/icons/ornament.tsx` — DiamondDivider 装饰元素
- [x] T5: 创建 `packages/components/icons/index.tsx` — barrel 统一导出
### Phase 2 — 替换 icon 导入 (无依赖，可并行)
- [x] T6: 替换 `components/link-group/index.tsx` — 6 个品牌图标
- [x] T7: 替换 `components/shared-link-group/index.tsx` — 7 个图标
- [x] T8: 替换 `components/message/index.tsx` — 5 个状态图标
- [x] T9: 替换 `components/result/index.tsx` — 2 个图标，统一 IconWarning
- [x] T10: 替换 `components/empty/index.tsx` — 1 个图标
- [x] T11: 替换 `components/alert/index.tsx` — 5 个图标
- [x] T12: 替换 `components/image-preview/index.tsx` — 11 个图标，移除 SvgIcon helper
- [x] T13: 替换 `components/image/index.tsx` — 1 个图标
- [x] T14: 替换 `wuh.site.next/app/HomeView.tsx` — IconMusic, IconDiscord, DiamondDivider
- [x] T15: 替换 `wuh.site.next/app/components/ContactCard.tsx` — 5 个图标，删除 renderLinkIcon
- [x] T16: 替换 `wuh.site.next/app/post/components/FloatingActions.tsx` — 3 个图标
- [x] T17: 替换 `wuh.site.next/app/post/components/PostToolbar.tsx` — ToolbarIcon → ChevronLeft/Right
- [x] T18: 替换 `wuh.site.next/app/post/components/PostHeader.tsx` — DiamondDivider
- [x] T19: 替换 `wuh.site.next/app/about/OrnamentDivider.tsx` — DiamondDivider
- [x] T22: 替换 `wuh.site.next/app/components/SiteHeader.tsx` — IconBars (计划遗漏)
### Phase 3 — 验证 (依赖 Phase 2)
- [x] T20: 运行 `pnpm exec tsc --noEmit` 类型检查
- [x] T21: 目视检查首页、about、博客详情页图标正常

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `design.md`
# 技术方案: 图标组件库

## 文件结构

```
packages/components/icons/
├── index.tsx        # barrel 统一导出
├── brand.tsx        # 品牌/社交图标 (fill 风格, 9个)
├── ui.tsx           # 通用 UI 交互图标 (17个, 混合 fill/stroke)
├── status.tsx       # 状态/语义图标 (11个, 全 fill)
└── ornament.tsx     # 装饰 SVG 元素 (1个)
```

## 分类原则

| 文件 | 用途 | 风格 |
|------|------|------|
| brand.tsx | 微信/QQ/Twitter/GitHub 等品牌图标 | fill |
| ui.tsx | 工具栏/导航/操作按钮图标 | fill + stroke 共存 |
| status.tsx | 信息/成功/警告/错误/空等状态反馈 | fill (stroke 属性在 SVG 元素上) |
| ornament.tsx | 纯装饰元素 | fill |

## 关键决策

1. **stroke vs fill 共存**: image-preview 的图标用 stroke (线框风格)，其余用 fill。各保持原样。
2. **IconClose 统一**: message 和 image-preview 各有一个 Close，统一为 fill 版本（message 的版本）
3. **IconWarning 统一**: message 的 WarningIcon 和 result 的 AlertTriangleIcon 路径一致，统一为 IconWarning
4. **ToolbarIcon 拆分**: `direction` prop 拆为 IconChevronLeft / IconChevronRight
5. **renderLinkIcon 删除**: ContactCard 中 switch-case 改为 badge→icon 映射对象
6. **DiamondDivider 只抽 polygon**: 外层 styled-component 留在原文件

## 导入约定

```tsx
import { IconWechat, IconGithub, DiamondDivider } from '@wuh.site/components/icons'
```

所有图标从 barrel `index.tsx` 统一导出。

### `proposal.md`
# 图标抽离为公共组件

## 为什么做

项目内 14 个文件中散落着 40+ 个硬编码 SVG 图标，11 组重复定义（如 Twitter 图标在三处各自写了一遍）。维护困难、样式不统一、新增图标不知往哪放。

## 做什么

- 在 `packages/components/icons/` 下按用途拆为 4 个分类文件: brand、ui、status、ornament
- 统一 barrel 导出 `@wuh.site/components/icons`
- 替换 14 个消费文件的硬编码 SVG 为 import

## 影响范围

- 新建 5 个图标文件
- 修改 14 个消费文件
- 不改样式、不改 SVG 路径数据、不改渲染行为

## 不改什么

- SVG path 数据保持原样
- stroke/fill 风格各自保持
- 不影响任何业务逻辑

### `specs/icons-library.md`
# Icons Library Spec

## MODIFIED

### 消费文件导入替换

GIVEN 项目中任意需要图标的组件
WHEN 该组件使用 SVG 图标
THEN 图标必须从 `@wuh.site/components/icons` import，不得在组件内硬编码 SVG

### 图标命名规范

GIVEN 一个图标组件
WHEN 它被定义在 icons/ 目录下
THEN 命名必须以 `Icon` 前缀 + 语义化名称（如 IconWechat, IconClose, IconWarning）

## ADDED

### brand.tsx — 品牌图标

GIVEN `packages/components/icons/brand.tsx`
WHEN 被导入使用
THEN 必须导出以下 9 个图标: IconWechat, IconQQ, IconTwitter, IconGithub, IconDouban, IconEmail, IconDiscord, IconWeibo, IconMusic
AND 所有图标使用 `fill="currentColor"` 风格

### ui.tsx — UI 交互图标

GIVEN `packages/components/icons/ui.tsx`
WHEN 被导入使用
THEN 必须导出以下 17 个图标: IconClose, IconArrowLeft, IconArrowRight, IconHome, IconScrollToTop, IconThumbUp, IconBars, IconChevronLeft, IconChevronRight, IconLink, IconCopy, IconZoomIn, IconZoomOut, IconRotate, IconDownload, IconFullscreen, IconExitFullscreen, IconReset
AND IconClose 使用 fill 风格（message 版本）
AND image-preview 系列图标使用 stroke 风格

### status.tsx — 状态反馈图标

GIVEN `packages/components/icons/status.tsx`
WHEN 被导入使用
THEN 必须导出以下 11 个图标: IconInfo, IconSuccess, IconWarning, IconError, IconEmpty, IconFallbackImage, IconCompass, IconClock, IconFolder, IconShield, IconTag
AND IconWarning 替代 message 的 WarningIcon 和 result 的 AlertTriangleIcon

### ornament.tsx — 装饰元素

GIVEN `packages/components/icons/ornament.tsx`
WHEN 被导入使用
THEN 必须导出 DiamondDivider 组件（仅 diamond polygon SVG）
AND 外层 DividerRow + DividerLine styled-component 保留在原文件

### index.tsx — barrel 导出

GIVEN `packages/components/icons/index.tsx`
WHEN 被 import 引用
THEN 必须 re-export 所有 brand/ui/status/ornament 中的图标

## REMOVED

### ContactCard renderLinkIcon

GIVEN `ContactCard.tsx` 的渲染逻辑
WHEN 图标抽离完成后
THEN `renderLinkIcon` switch-case 函数必须删除
AND 替换为 badge→icon 的静态映射对象

### image-preview SvgIcon helper

GIVEN `image-preview/index.tsx` 的 SvgIcon 包装组件
WHEN 图标抽离完成后
THEN SvgIcon 必须删除
AND 所有使用处替换为对应 import 图标

### PostToolbar ToolbarIcon

GIVEN `PostToolbar.tsx` 的 ToolbarIcon 组件
WHEN 图标抽离完成后
THEN ToolbarIcon 必须删除
AND direction prop 逻辑替换为 IconChevronLeft / IconChevronRight

### `tasks.md`
# 任务拆分

## Phase 1 — 创建图标文件 (无依赖，可并行)

- [x] T1: 创建 `packages/components/icons/brand.tsx` — 9 个品牌图标
- [x] T2: 创建 `packages/components/icons/ui.tsx` — 17 个 UI 图标
- [x] T3: 创建 `packages/components/icons/status.tsx` — 11 个状态图标
- [x] T4: 创建 `packages/components/icons/ornament.tsx` — DiamondDivider 装饰元素
- [x] T5: 创建 `packages/components/icons/index.tsx` — barrel 统一导出

## Phase 2 — 替换 icon 导入 (无依赖，可并行)

- [x] T6: 替换 `components/link-group/index.tsx` — 6 个品牌图标
- [x] T7: 替换 `components/shared-link-group/index.tsx` — 7 个图标
- [x] T8: 替换 `components/message/index.tsx` — 5 个状态图标
- [x] T9: 替换 `components/result/index.tsx` — 2 个图标，统一 IconWarning
- [x] T10: 替换 `components/empty/index.tsx` — 1 个图标
- [x] T11: 替换 `components/alert/index.tsx` — 5 个图标
- [x] T12: 替换 `components/image-preview/index.tsx` — 11 个图标，移除 SvgIcon helper
- [x] T13: 替换 `components/image/index.tsx` — 1 个图标
- [x] T14: 替换 `wuh.site.next/app/HomeView.tsx` — IconMusic, IconDiscord, DiamondDivider
- [x] T15: 替换 `wuh.site.next/app/components/ContactCard.tsx` — 5 个图标，删除 renderLinkIcon
- [x] T16: 替换 `wuh.site.next/app/post/components/FloatingActions.tsx` — 3 个图标
- [x] T17: 替换 `wuh.site.next/app/post/components/PostToolbar.tsx` — ToolbarIcon → ChevronLeft/Right
- [x] T18: 替换 `wuh.site.next/app/post/components/PostHeader.tsx` — DiamondDivider
- [x] T19: 替换 `wuh.site.next/app/about/OrnamentDivider.tsx` — DiamondDivider
- [x] T22: 替换 `wuh.site.next/app/components/SiteHeader.tsx` — IconBars (计划遗漏)

## Phase 3 — 验证 (依赖 Phase 2)

- [x] T20: 运行 `pnpm exec tsc --noEmit` 类型检查
- [x] T21: 目视检查首页、about、博客详情页图标正常
