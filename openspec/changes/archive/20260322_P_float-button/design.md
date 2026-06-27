# 设计：浮动按钮组

## 方案

### 1. 按钮组结构

```
FloatButtonGroup（position: fixed, 右下）
├── ScrollProgressBtn（阅读进度数字）
├── BackToTopBtn（回到页头 + 平滑滚动）
├── BackToHomeBtn（返回首页 Link）
└── LikeBtn（点赞占位）
```

### 2. 交互

- 拖拽: mousedown/touchstart → mousemove/touchmove → mouseup/touchend
- 吸附: 释放时判断距离左/右边缘，吸附到最近一侧
- 纵向边界: 避免遮挡导航栏和底部内容
- 按钮宽度一致，无间隙

### 3. 样式

- 固定定位 `position: fixed`
- 移动端缩小边距
- aria-label 可访问性标注
- 暗色模式适配

### 4. SSR 安全

- window/document 访问需 guard
- 滚动进度计算在 useEffect 中注册

## 依赖

- 零新依赖
