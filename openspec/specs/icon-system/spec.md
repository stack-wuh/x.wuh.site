# 图标系统规格

## ADDED

### Requirement: 统一 Outline 图标风格

所有图标 MUST 使用线框风格（`stroke='currentColor' fill='none'`），视觉权重一致。

GIVEN 开发者使用任意图标组件
WHEN 图标渲染到页面
THEN 图标使用 outline 线框风格
AND strokeWidth 统一为 2
AND strokeLinecap 为 round
AND strokeLinejoin 为 round

### Requirement: 统一图标接口

所有图标 MUST 支持相同的 Props 接口。

GIVEN 开发者使用任意图标组件
WHEN 传入 `size` prop
THEN 图标按指定像素尺寸渲染，默认 24

GIVEN 开发者使用任意图标组件
WHEN 传入 `color` prop
THEN 图标使用指定颜色，默认 `currentColor`（继承父级文字颜色）

GIVEN 开发者使用任意图标组件
WHEN 传入 `strokeWidth` prop
THEN 图标使用指定描边宽度，默认 2


### Requirement: 移动端 Header 菜单按钮始终显示汉堡图标

GIVEN 用户在视口宽度小于 768px 的页面访问 Header
WHEN Header 初始渲染且移动菜单未展开
THEN 右侧菜单按钮渲染可见的 `IconBars` outline SVG
AND SVG 具有明确的 20×20 尺寸，不因 flex 收缩或通用按钮默认样式消失

### Requirement: 菜单按钮交互和触摸目标保持兼容

GIVEN 用户使用触摸设备或键盘访问移动 Header
WHEN 用户聚焦或点击菜单按钮
THEN 按钮保持 44×44 触摸区域、清晰 focus-visible 状态和原有展开/收起行为
AND `aria-expanded` 与 `aria-controls` 继续反映菜单状态

## REMOVED

### Requirement: 移除混用 fill/stroke 的旧图标

所有旧版实心填充图标和混合风格图标 MUST 被移除。

GIVEN 旧版图标组件（IconHome, IconScrollToTop, IconThumbUp 等）
WHEN 替换完成后
THEN 这些组件不再存在于代码库中
AND 其引用全部指向新的 lucide-react 或重绘组件

## MODIFIED

### Requirement: Brand 图标保持自定义但风格对齐

GIVEN 品牌图标（微信、QQ、GitHub 等）无 lucide-react 对应图标
WHEN 渲染品牌图标
THEN 使用自定义 SVG 但风格 MUST 与 lucide outline 图标一致
AND 支持相同的 `size`、`color`、`strokeWidth` Props
