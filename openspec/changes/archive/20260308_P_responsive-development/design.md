# 设计：响应式布局优化

## 方案

### 1. 断点定义

```ts
const breakpoints = {
  mobile: 640,   // ≤640px: 单列
  tablet: 1024,  // ≤1024px: 双列
  desktop: 1440, // >1024px: 三列, 最大宽度 1200px
}
```

### 2. 布局策略

- 手机 (≤640px): CTA 按钮换行, 列表卡片全幅, padding 16px
- 平板 (≤1024px): 卡片双列, Hero 图文上下排列
- 桌面 (>1024px): 三列栅格, max-width 1200px 居中

### 3. 组件适配

- Card: 响应式宽度 `width: 100%`（移动端）/ `calc(50% - gap)`（平板）/ `calc(33.33% - gap)`（桌面）
- Tag: 移动端不换行，超出滚动
- Button: 移动端全宽或最小宽度

## 依赖

- 零新依赖（仅 styled-components @media）
