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
