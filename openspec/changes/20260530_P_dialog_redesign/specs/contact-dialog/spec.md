# Spec: 弹窗样式重设计

## MODIFIED

### Requirement: Dialog 遮罩层
- **GIVEN** Dialog 处于打开状态
- **WHEN** 用户查看弹窗
- **THEN** 显示半透明黑色遮罩 (rgba(0,0,0,0.4))，叠加 backdrop-filter: blur(2px)
- **AND** 点击遮罩区域关闭弹窗

### Requirement: Dialog 圆角和间距
- **GIVEN** Dialog 在桌面端打开
- **WHEN** 弹窗渲染
- **THEN** 四角 border-radius 为 16px
- **AND** Header padding 为 16px 22px 0
- **AND** Body padding 为 12px 22px 18px
- **AND** 默认宽度 max 480px

### Requirement: Dialog 移动端底部弹出
- **GIVEN** 屏幕宽度 ≤ 640px
- **WHEN** Dialog 打开
- **THEN** 从底部滑入，顶部圆角 16px，底部直角
- **AND** 顶部显示拖拽指示条
- **AND** 高度 max-height 80vh，内容溢出时内部滚动

### Requirement: Dialog 动画
- **GIVEN** Dialog 打开或关闭
- **WHEN** placement 为 center
- **THEN** 进入使用 cubic-bezier(0.34,1.56,0.64,1) 250ms
- **WHEN** placement 为 bottom
- **THEN** 进入使用 cubic-bezier(0.32,0.72,0,1) 300ms slide-up
- **AND** 关闭时播放反向退出动画后卸载 DOM
- **AND** 尊重 prefers-reduced-motion

## REMOVED

### Requirement: Dialog border-radius: var(--radius-card)
- 原规范要求使用 `var(--radius-card)` (24px)，新设计改为固定 16px。
