# 设计：粘性按钮组优化

## 方案

### 1. 按钮组结构（优化后）

```
FloatButtonGroup
├── BackToTopBtn（回到页头 + 渐变进度背景）
├── BackToHomeBtn（返回首页）
└── LikeBtn（点赞占位）
```

### 2. 渐变进度

- 回到页头按钮背景根据 scrollPercent 动态渐变
- CSS 渐变方向: 从左到右
- 颜色: 主色渐变（如 #C94A44 → #A13531）
- light/dark 模式自动切换渐变色

### 3. SSR 安全

- scrollPercent 在客户端 useEffect 中计算
- 渐变通过 CSS custom property 或 inline style 注入

## 依赖

- 零新依赖
