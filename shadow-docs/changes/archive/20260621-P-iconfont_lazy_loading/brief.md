# Icon 组件 iconfont 加载重构

> 原始变更名：`20260621_P_iconfont_lazy_loading`

## 元数据
- 日期：2026-06-21
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
当前 iconfont CSS 通过 `ahooks` 的 `useExternal` 钩子在 `AppProviders.tsx` 中加载：

```tsx
useExternal('//at.alicdn.com/t/c/font_2595178_z5oq1y0t12.css', { type: 'css' })
```

三个问题：
1. 依赖阿里 CDN，不可用时所有 iconfont 图标失效
2. 组件挂载即加载，阻塞首页关键渲染路径
3. 加载逻辑与 Icon 组件分离，不用 iconfont 的页面也会加载

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
```
layout.tsx (根布局)
  └── AppProviders
        └── IconfontStyle          ← 唯一的注入点，一个 useEffect，load 后注入 <link>
              └── Context.Provider
                    ├── IconWechat ← useContext → loaded ? <i> : fallback SVG
                    ├── IconClose  ← 同理
                    └── ...
```

## 任务
### Phase 1：历史任务
- [x] **文件:** `packages/components/icons/iconfont-context.tsx`
- [x] `IconfontLoadState` 类型：`'loading' | 'loaded' | 'error'`
- [x] `IconfontContext` + `useIconfontLoadState()` hook
- [x] `IconfontStyle` 组件：`load` 事件后注入 `<link>`，`readyState === 'complete'` 兼容 SPA
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/components/icons/fallbacks/*.tsx`（9 个文件）
- [x] wechat / qq / douban / weibo / netease-music / discord / github / twitter / email
- [x] 每个导出 `React.FC<{ size: number; className?: string }>`
- [x] 24x24 viewBox，`stroke="currentColor"`，`aria-hidden="true"`
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/components/icons/icofont.tsx`
- [x] `makeIcon(name, Fallback?)` — 新增 fallback 参数
- [x] `useIconfontLoadState()` 读取 Context，`loaded` → `<i>`，否则 → fallback
- [x] `lucideFallback()` 包装器适配 lucide 图标到 FallbackComponent 签名
- [x] 品牌图标传入 SVG fallback，UI 图标传入 lucideFallback(...)
- [x] 所有 26 个导出名称不变
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/components/icons/index.tsx`
- [x] 追加 `export { IconfontStyle } from './iconfont-context'`
- [x] **类型检查:** `npx tsc --noEmit`
- [x] **文件:** `packages/wuh.site.next/app/components/AppProviders.tsx`
- [x] 删除 `useExternal` 从 ahooks import
- [x] 删除 `useExternal('//at.alicdn.com/...', { type: 'css' })` 调用
- [x] 添加 `import { IconfontStyle } from '@wuh.site/components/icons'`
- [x] JSX 中 `<CssVariableStyles />` 后用 `<IconfontStyle>` 包裹 children
- [x] **类型检查:** `npx tsc --noEmit`
- [x] `grep -r "useExternal" packages/` — 无匹配
- [x] `grep -r "alicdn" packages/` — 仅 `iconfont-context.tsx` 有匹配
- [x] `npx tsc --noEmit` — 零错误

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: iconfont-lazy-loading
date: 2026-06-21
type: P
status: archived
```

### `design.md`
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

### `proposal.md`
# Icon 组件 iconfont 加载重构

## 背景

当前 iconfont CSS 通过 `ahooks` 的 `useExternal` 钩子在 `AppProviders.tsx` 中加载：

```tsx
useExternal('//at.alicdn.com/t/c/font_2595178_z5oq1y0t12.css', { type: 'css' })
```

三个问题：
1. 依赖阿里 CDN，不可用时所有 iconfont 图标失效
2. 组件挂载即加载，阻塞首页关键渲染路径
3. 加载逻辑与 Icon 组件分离，不用 iconfont 的页面也会加载

## 目标

- iconfont CSS 在 `load` 事件之后加载，不阻塞首页渲染
- 加载逻辑内聚在图标系统中，`<IconfontStyle />` 统一管理
- iconfont 加载失败时自动降级到 SVG fallback（lucide-react + 手写品牌 SVG）

## 影响范围

- `packages/components/icons/` — 新增 `iconfont-context.tsx` + `fallbacks/`，修改 `icofont.tsx`、`index.tsx`
- `packages/wuh.site.next/app/components/AppProviders.tsx` — 删除 `useExternal`，换 `<IconfontStyle />`
- 消费者（所有使用 iconfont Icon 的组件）— 不改，API 向后兼容

### `tasks.md`
# 任务清单

## Task 1: 创建 iconfont-context.tsx

- [x] **文件:** `packages/components/icons/iconfont-context.tsx`
- [x] `IconfontLoadState` 类型：`'loading' | 'loaded' | 'error'`
- [x] `IconfontContext` + `useIconfontLoadState()` hook
- [x] `IconfontStyle` 组件：`load` 事件后注入 `<link>`，`readyState === 'complete'` 兼容 SPA
- [x] **类型检查:** `npx tsc --noEmit`

## Task 2: 创建品牌图标 SVG fallback

- [x] **文件:** `packages/components/icons/fallbacks/*.tsx`（9 个文件）
- [x] wechat / qq / douban / weibo / netease-music / discord / github / twitter / email
- [x] 每个导出 `React.FC<{ size: number; className?: string }>`
- [x] 24x24 viewBox，`stroke="currentColor"`，`aria-hidden="true"`
- [x] **类型检查:** `npx tsc --noEmit`

## Task 3: 修改 icofont.tsx

- [x] **文件:** `packages/components/icons/icofont.tsx`
- [x] `makeIcon(name, Fallback?)` — 新增 fallback 参数
- [x] `useIconfontLoadState()` 读取 Context，`loaded` → `<i>`，否则 → fallback
- [x] `lucideFallback()` 包装器适配 lucide 图标到 FallbackComponent 签名
- [x] 品牌图标传入 SVG fallback，UI 图标传入 lucideFallback(...)
- [x] 所有 26 个导出名称不变
- [x] **类型检查:** `npx tsc --noEmit`

## Task 4: 修改 index.tsx

- [x] **文件:** `packages/components/icons/index.tsx`
- [x] 追加 `export { IconfontStyle } from './iconfont-context'`
- [x] **类型检查:** `npx tsc --noEmit`

## Task 5: 修改 AppProviders.tsx

- [x] **文件:** `packages/wuh.site.next/app/components/AppProviders.tsx`
- [x] 删除 `useExternal` 从 ahooks import
- [x] 删除 `useExternal('//at.alicdn.com/...', { type: 'css' })` 调用
- [x] 添加 `import { IconfontStyle } from '@wuh.site/components/icons'`
- [x] JSX 中 `<CssVariableStyles />` 后用 `<IconfontStyle>` 包裹 children
- [x] **类型检查:** `npx tsc --noEmit`

## Task 6: 构建验证

- [x] `grep -r "useExternal" packages/` — 无匹配
- [x] `grep -r "alicdn" packages/` — 仅 `iconfont-context.tsx` 有匹配
- [x] `npx tsc --noEmit` — 零错误
