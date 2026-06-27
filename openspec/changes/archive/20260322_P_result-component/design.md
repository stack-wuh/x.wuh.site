# 设计：Result 组件

## 方案

### 1. 组件 API

```ts
interface ResultProps {
  status: 404 | 500 | 'info' | 'empty'
  title?: string
  description?: string
  extra?: React.ReactNode // 操作按钮等
  children?: React.ReactNode
}
```

### 2. 视觉

- GitHub 风格卡片布局
- 404: 插画 + 标题 + 引导去 GitHub/首页
- 500: 插画 + 标题 + 引导去 GitHub Issues
- 暗色模式对比度适配

## 依赖

- 零新依赖
