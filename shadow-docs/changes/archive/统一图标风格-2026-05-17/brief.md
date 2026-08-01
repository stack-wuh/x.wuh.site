# 提案：统一图标风格

> 原始变更名：`统一图标风格-2026-05-17`

## 元数据
- 日期：2026-05-17
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
当前 `@wuh.site/components/icons` 中 37 个图标存在严重的风格不一致：

- **描边 vs 填充混用**：UI 图标多为 `stroke` 线框，Status/Brand 多为 `fill` 实心
- **viewBox 不统一**：16、24、48 三种尺寸乱用
- **尺寸不一致**：有的设了 `width/height`，有的靠 CSS 继承
- **包裹元素不一致**：IconChevronLeft/Right 多包了 `<span>`，其他没有
- **缺失属性**：部分图标无 `fill`/`stroke` 声明，走默认黑色

## 引用规范
- `specs/icon-system/spec.md`

## 决策
# 技术方案：统一图标风格

## 整体策略

```
                    自定义 SVG (37个)
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    UI 图标 (18)   Status 图标 (10)  Brand 图标 (9)
          │              │              │
          ▼              ▼              ▼
    lucide-react    lucide-react    保留自定义 SVG
    直接替换         直接替换         重绘为 Outline
```

## Lucide 图标映射

### UI 图标

| 当前组件 | Lucide 组件 | 备注 |
|----------|------------|------|
| IconClose | `X` | |
| IconArrowLeft | `ArrowLeft` | |
| IconArrowRight | `ArrowRight` | |
| IconHome | `Home` | |
| IconScrollToTop | `ArrowUpToLine` | |
| IconThumbUp | `ThumbsUp` | |
| IconBars | `Menu` | |
| IconChevronLeft | `ChevronLeft` | 去掉 `<span>` 包裹 |
| IconChevronRight | `ChevronRight` | 去掉 `<span>` 包裹 |
| IconLink | `Link` | |
| IconCopy | `Copy` | |
| IconZoomIn | `ZoomIn` | |
| IconZoomOut | `ZoomOut` | |
| IconRotate | `RotateCw` | |
| IconDownload | `Download` | |
| IconFullscreen | `Maximize` | |
| IconExitFullscreen | `Minimize` | |
| IconReset | `Undo` | |

### Status 图标

| 当前组件 | Lucide 组件 | 备注 |
|----------|------------|------|
| IconInfo | `Info` | |
| IconSuccess | `CircleCheck` | |
| IconWarning | `TriangleAlert` | |
| IconError | `CircleX` | |
| IconEmpty | `PackageOpen` | |
| IconFallbackImage | `Image` | |
| IconCompass | `Compass` | |
| IconClock | `Clock` | |
| IconFolder | `Folder` | |
| IconShield | `ShieldCheck` | |
| IconTag | `Tag` | |

### Brand 图标（保留自定义）

| 组件 | 处理方式 |
|------|---------|
| IconWechat | 重绘 SVG path 为 stroke 轮廓风格 |
| IconQQ | 同上 |
| IconTwitter | 同上 |
| IconGithub | 同上 |
| IconDouban | 同上 |
| IconEmail | 同上 |
| IconDiscord | 同上 |
| IconWeibo | 同上 |
| IconMusic | 同上 |

## 统一 Props 接口

所有图标对外暴露统一接口：

```tsx
interface IconProps {
  size?: number       // 默认 24
  color?: string      // 默认 'currentColor'
  strokeWidth?: number // 默认 2
  className?: string
}
```

- lucide 图标天然支持 `size`、`color`、`strokeWidth` props
- Brand 自定义图标也实现相同接口，确保使用方式一致

## 实施步骤

1. 安装 `lucide-react` 依赖到 `@wuh.site/components`
2. 重写 `icons/brand.tsx`，9 个 brand 图标全部改为 Outline 风格
3. 重写 `icons/index.tsx`，UI/Status 图标改为从 lucide-react 重导出
4. 删除 `icons/ui.tsx` 和 `icons/status.tsx`
5. 搜索所有 `<IconChevronLeft>` / `<IconChevronRight>` 使用处，移除 `toolbar-icon` 相关的 CSS 依赖（因为去掉 `<span>` 包裹后不再需要）
6. 搜索所有图标引用处，验证替换后的视觉效果

## 文件变更清单

| 操作 | 文件 |
|------|------|
| 新增依赖 | `packages/components/package.json`（lucide-react） |
| 重写 | `packages/components/icons/brand.tsx` |
| 重写 | `packages/components/icons/index.tsx` |
| 删除 | `packages/components/icons/ui.tsx` |
| 删除 | `packages/components/icons/status.tsx` |
| 可能修改 | `packages/components/icons/ornament.tsx`（如需统一接口） |
| 可能修改 | `packages/wuh.site.next/` 下 ~20 个引用文件（import 路径不变，props 可能需要微调） |

## 任务
### Phase 1: 依赖安装 + Brand 图标重绘（可并行）
### Phase 2: 图标系统重构（依赖 Phase 1）
### Phase 3: 引用适配（依赖 Phase 2）
### Phase 4: 验证
- [ ] 历史任务清单未提供

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 统一图标风格
date: 2026-05-17
type: P
status: proposed
```

### `design.md`
# 技术方案：统一图标风格

## 整体策略

```
                    自定义 SVG (37个)
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    UI 图标 (18)   Status 图标 (10)  Brand 图标 (9)
          │              │              │
          ▼              ▼              ▼
    lucide-react    lucide-react    保留自定义 SVG
    直接替换         直接替换         重绘为 Outline
```

## Lucide 图标映射

### UI 图标

| 当前组件 | Lucide 组件 | 备注 |
|----------|------------|------|
| IconClose | `X` | |
| IconArrowLeft | `ArrowLeft` | |
| IconArrowRight | `ArrowRight` | |
| IconHome | `Home` | |
| IconScrollToTop | `ArrowUpToLine` | |
| IconThumbUp | `ThumbsUp` | |
| IconBars | `Menu` | |
| IconChevronLeft | `ChevronLeft` | 去掉 `<span>` 包裹 |
| IconChevronRight | `ChevronRight` | 去掉 `<span>` 包裹 |
| IconLink | `Link` | |
| IconCopy | `Copy` | |
| IconZoomIn | `ZoomIn` | |
| IconZoomOut | `ZoomOut` | |
| IconRotate | `RotateCw` | |
| IconDownload | `Download` | |
| IconFullscreen | `Maximize` | |
| IconExitFullscreen | `Minimize` | |
| IconReset | `Undo` | |

### Status 图标

| 当前组件 | Lucide 组件 | 备注 |
|----------|------------|------|
| IconInfo | `Info` | |
| IconSuccess | `CircleCheck` | |
| IconWarning | `TriangleAlert` | |
| IconError | `CircleX` | |
| IconEmpty | `PackageOpen` | |
| IconFallbackImage | `Image` | |
| IconCompass | `Compass` | |
| IconClock | `Clock` | |
| IconFolder | `Folder` | |
| IconShield | `ShieldCheck` | |
| IconTag | `Tag` | |

### Brand 图标（保留自定义）

| 组件 | 处理方式 |
|------|---------|
| IconWechat | 重绘 SVG path 为 stroke 轮廓风格 |
| IconQQ | 同上 |
| IconTwitter | 同上 |
| IconGithub | 同上 |
| IconDouban | 同上 |
| IconEmail | 同上 |
| IconDiscord | 同上 |
| IconWeibo | 同上 |
| IconMusic | 同上 |

## 统一 Props 接口

所有图标对外暴露统一接口：

```tsx
interface IconProps {
  size?: number       // 默认 24
  color?: string      // 默认 'currentColor'
  strokeWidth?: number // 默认 2
  className?: string
}
```

- lucide 图标天然支持 `size`、`color`、`strokeWidth` props
- Brand 自定义图标也实现相同接口，确保使用方式一致

## 实施步骤

1. 安装 `lucide-react` 依赖到 `@wuh.site/components`
2. 重写 `icons/brand.tsx`，9 个 brand 图标全部改为 Outline 风格
3. 重写 `icons/index.tsx`，UI/Status 图标改为从 lucide-react 重导出
4. 删除 `icons/ui.tsx` 和 `icons/status.tsx`
5. 搜索所有 `<IconChevronLeft>` / `<IconChevronRight>` 使用处，移除 `toolbar-icon` 相关的 CSS 依赖（因为去掉 `<span>` 包裹后不再需要）
6. 搜索所有图标引用处，验证替换后的视觉效果

## 文件变更清单

| 操作 | 文件 |
|------|------|
| 新增依赖 | `packages/components/package.json`（lucide-react） |
| 重写 | `packages/components/icons/brand.tsx` |
| 重写 | `packages/components/icons/index.tsx` |
| 删除 | `packages/components/icons/ui.tsx` |
| 删除 | `packages/components/icons/status.tsx` |
| 可能修改 | `packages/components/icons/ornament.tsx`（如需统一接口） |
| 可能修改 | `packages/wuh.site.next/` 下 ~20 个引用文件（import 路径不变，props 可能需要微调） |

### `proposal.md`
# 提案：统一图标风格

## 动机

当前 `@wuh.site/components/icons` 中 37 个图标存在严重的风格不一致：

- **描边 vs 填充混用**：UI 图标多为 `stroke` 线框，Status/Brand 多为 `fill` 实心
- **viewBox 不统一**：16、24、48 三种尺寸乱用
- **尺寸不一致**：有的设了 `width/height`，有的靠 CSS 继承
- **包裹元素不一致**：IconChevronLeft/Right 多包了 `<span>`，其他没有
- **缺失属性**：部分图标无 `fill`/`stroke` 声明，走默认黑色

## 变更范围

将全部图标统一为 **全 Outline（线框）风格**，引入 `lucide-react` 替代手写 SVG。

- **UI 图标 (18个)**：替换为 lucide-react 对应图标
- **Status 图标 (10个)**：替换为 lucide-react 对应图标
- **Brand 图标 (9个)**：保留自定义 SVG，重绘为 Outline 风格以匹配 lucide
- **装饰元素 (1个)**：保留不变

## 非目标

- 不新增图标
- 不改变图标的语义和交互行为
- 不修改图标以外的 UI 组件

## 影响

| 包 | 影响 |
|----|------|
| `@wuh.site/components` | 新增 lucide-react 依赖，删除 28 个自定义 SVG 组件，重绘 9 个 brand 图标 |
| `@wuh.site/next` | 更新图标 import 路径（如有直接引用） |

### `specs/icon-system/spec.md`
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

### `tasks.md`
# 任务清单

## Phase 1: 依赖安装 + Brand 图标重绘（可并行）

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 1 | 安装 lucide-react 到 components 包 | 5min | `packages/components/package.json` |
| 2 | 重绘 9 个 Brand 图标为 Outline 风格 | 30min | `packages/components/icons/brand.tsx` |

## Phase 2: 图标系统重构（依赖 Phase 1）

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 3 | 重写 icons/index.tsx，UI/Status 从 lucide-react 重导出，统一接口 | 10min | `packages/components/icons/index.tsx` |
| 4 | 删除 ui.tsx 和 status.tsx | 2min | `packages/components/icons/ui.tsx`, `icons/status.tsx` |

## Phase 3: 引用适配（依赖 Phase 2）

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 5 | 搜索所有 IconChevronLeft/Right 使用处，移除 toolbar-icon span 包裹 | 10min | `packages/wuh.site.next/` 下引用文件 |
| 6 | 搜索图标引用，检查尺寸/props 是否需要适配 | 15min | `packages/wuh.site.next/` 下 ~20 个引用文件 |

## Phase 4: 验证

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 7 | TypeScript 类型检查 + ESLint | 5min | 所有改动文件 |
| 8 | 构建验证（next build） | 5min | 全局 |

总预估：~82min
