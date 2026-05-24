# ImagePreview 组件代码优化

## 动机

ImagePreview 组件 `index.tsx` 达 902 行，维护困难。图片切换、缩放、旋转缺少过渡动画，操作体验生硬。

## 变更范围

- 引入 framer-motion 实现平滑动画（切换/缩放/旋转/关闭）
- 拆分大组件：提取 types、hooks、Toolbar、MoreMenu、ThumbnailRail
- 主组件控制在 500 行以内
- 样式文件保持不变

## 非目标

- 不修改组件对外 API（props 接口不变）
- 不修改 hooks/useImagePreview 的调用方式
- 不改变功能行为
