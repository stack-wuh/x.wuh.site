# Image 组件

> 原始变更名：`20260308_P_image-component`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：Image 组件

## 方案

### 1. 组件 API

```ts
interface ImageProps extends Omit<NextImageProps, 'fill'> {
  variant?: 'cover' | 'contain'
  ratio?: string // 如 '16:9', '4:3', '1:1'
  placeholder?: 'blur' | 'skeleton'
  errorFallback?: React.ReactNode
  caption?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}
```

### 2. 状态管理

- 内部维护 loading/error 状态
- loading: skeleton 或 blur placeholder
- error: 错误插画/icon + 提示文字
- 加载完成: 正常显示图片 + 可选 caption

### 3. 样式

- 使用 styled-components + CSS 变量主题令牌
- ratio 通过 `aspect-ratio` 或 padding-top hack 实现
- skeleton 使用 shimmer 动画
- 适配 `prefers-reduced-motion`

### 4. SSR 安全

- `'use client'` 指令
- `typeof window !== 'undefined'` guard

## 依赖

- 零新依赖，基于 next/image

## 任务
### Phase 1 — Image 组件实现
- [ ] T1: 搭建目录结构与基础封装
- [ ] T2: 实现 loading skeleton 与错误 fallback
- [ ] T3: 更新导出与 README
### Phase 2 — 验证
- [ ] T4: 验证各状态与场景

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Image组件
change: image-component
date: 2026-03-08
type: P
status: applied
```

### `design.md`
# 设计：Image 组件

## 方案

### 1. 组件 API

```ts
interface ImageProps extends Omit<NextImageProps, 'fill'> {
  variant?: 'cover' | 'contain'
  ratio?: string // 如 '16:9', '4:3', '1:1'
  placeholder?: 'blur' | 'skeleton'
  errorFallback?: React.ReactNode
  caption?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}
```

### 2. 状态管理

- 内部维护 loading/error 状态
- loading: skeleton 或 blur placeholder
- error: 错误插画/icon + 提示文字
- 加载完成: 正常显示图片 + 可选 caption

### 3. 样式

- 使用 styled-components + CSS 变量主题令牌
- ratio 通过 `aspect-ratio` 或 padding-top hack 实现
- skeleton 使用 shimmer 动画
- 适配 `prefers-reduced-motion`

### 4. SSR 安全

- `'use client'` 指令
- `typeof window !== 'undefined'` guard

## 依赖

- 零新依赖，基于 next/image

### `proposal.md`
# Image 组件

## 为什么做

站点各页面直接使用 Next.js `<Image>`，加载策略、占位图与错误处理不一致。需要封装统一的 Image 组件提供默认体验并集中维护。

## 做什么

- 在 `packages/components/image/` 创建 Image 组件
- 保留 Next Image 核心 props，提供统一的 `variant`（cover/contain）、`ratio`、`placeholder`、`errorFallback` 扩展点
- 实现 loading skeleton/blur placeholder 与错误兜底
- 默认 lazy loading，SSR/CSR 一致

## 影响范围

- `packages/components/image/` — 新增
- 后续逐步替换各页面的 next/image 直接使用

## 不改什么

- 不改动 Next.js Image 优化 pipeline 配置
- 不新增第三方图像处理依赖

### `tasks.md`
# 任务拆分

## Phase 1 — Image 组件实现

- [ ] T1: 搭建目录结构与基础封装
  - 涉及文件: `packages/components/image/index.tsx`, `packages/components/image/types.ts`
  - 产出: 基于 next/image 的 Image 组件，支持 variant/ratio

- [ ] T2: 实现 loading skeleton 与错误 fallback
  - 涉及文件: `packages/components/image/styles/index.ts`
  - 产出: shimmer skeleton + 错误插画兜底

- [ ] T3: 更新导出与 README
  - 涉及文件: `packages/components/index.ts`, `packages/components/image/readme.md`

## Phase 2 — 验证

- [ ] T4: 验证各状态与场景
  - `pnpm --filter @wuh.site/next lint`
  - 手动验证正常加载/skeleton/错误/不同 ratio/响应式
