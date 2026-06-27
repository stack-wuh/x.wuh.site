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
