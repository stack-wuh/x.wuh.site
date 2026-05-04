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
