# 设计文档

## 架构

```
layout.tsx (根布局)
  └── AppProviders
        └── IconfontStyle          ← 唯一的注入点，一个 useEffect，load 后注入 <link>
              └── Context.Provider
                    ├── IconWechat ← useContext → loaded ? <i> : fallback SVG
                    ├── IconClose  ← 同理
                    └── ...
```

## 核心组件

### IconfontStyle

- 无 props，零配置
- 放在 `AppProviders.tsx` 组件树顶层
- 内部管理 `loadState` 状态机：`loading → loaded | error`
- 首次挂载时等 `load` 事件后注入 `<link>`，`{ once: true }` 自动清理
- `readyState === 'complete'` 兼容 SPA 内导航场景
- 提供 Context，Icon 组件通过 `useContext` 读取状态

### makeIcon 工厂函数

新增 `fallback` 参数，在定义时绑定：

```tsx
makeIcon(name: string, fallback?: React.FC<{ size: number; className?: string }>)
```

渲染逻辑：
- `loadState === 'loaded'` → 渲染 `<i>` 元素（和现在完全一致）
- 其他状态 → 渲染 fallback 组件，fallback 为 `undefined` 时返回 `null`
- Icon 组件零副作用，纯 `useContext` + 条件渲染

## Fallback 策略

### A 类：UI 操作图标 → lucide-react 映射

| iconfont | lucide fallback |
|----------|----------------|
| `iconclose` (IconClose) | `X` |
| `iconcopy` (IconCopy) | `Copy` |
| `iconlike` (IconLike/IconThumbUp) | `ThumbsUp` |
| `iconarrow-left` (IconArrowLeft) | `ChevronLeft` |
| `iconarrow-right1` (IconArrowRight) | `ChevronRight` |
| `iconarrow-up` (IconArrowUp) | `ChevronUp` |
| `iconarrow-down` (IconArrowBottom) | `ChevronDown` |
| `iconminus-circle` (IconZoomIn) | `ZoomIn` |
| `iconplus-circle` (IconZoomOut) | `ZoomOut` |
| `iconrotate-right` (IconRotateRight) | `RotateCw` |
| `iconrotate-left` (IconRotateLeft) | `RotateCcw` |
| `iconarrows-alt` (IconFullscreen) | `Maximize` |
| `iconshrink` (IconExitFullscreen) | `Minimize` |
| `iconreload` (IconReset) | `RefreshCw` |
| `iconshared` (IconLink) | `Link` |
| `iconarrow-down` (IconDownload) | `Download` |

注意：`iconarrow-down` 同时用于 `IconArrowBottom` 和 `IconDownload`，fallback 按语义区分。

### B 类：品牌/社交图标 → 手写 SVG

9 个品牌图标放在 `packages/components/icons/fallbacks/`：

```
fallbacks/
  ├── wechat.tsx      # 微信
  ├── qq.tsx          # QQ
  ├── douban.tsx      # 豆瓣
  ├── weibo.tsx       # 微博
  ├── netease-music.tsx  # 网易云音乐
  ├── discord.tsx     # Discord
  ├── github.tsx      # GitHub
  ├── twitter.tsx     # Twitter/X
  └── email.tsx       # 邮件
```

每个导出 `React.FC<{ size: number; className?: string }>`，渲染品牌 logo 的简化 SVG。

## 文件变更

| 操作 | 文件 | 内容 |
|------|------|------|
| 新增 | `packages/components/icons/iconfont-context.tsx` | Context + `IconfontStyle` 组件 + hook |
| 新增 | `packages/components/icons/fallbacks/` | 9 个品牌图标 SVG fallback |
| 修改 | `packages/components/icons/icofont.tsx` | `makeIcon` 支持 fallback 参数 + 读 Context |
| 修改 | `packages/components/icons/index.tsx` | 导出 `IconfontStyle` |
| 修改 | `packages/wuh.site.next/app/components/AppProviders.tsx` | 删除 `useExternal`，改为 `<IconfontStyle />` |

## 接口兼容性

- 所有 Icon 组件的 Props 接口不变：`{ size?: number; color?: string; className?: string }`
- 业务组件中使用方式完全不变：`<IconWechat size={20} />`
- `index.tsx` 导出的图标名称和类型不变
