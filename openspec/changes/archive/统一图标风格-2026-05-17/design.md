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
