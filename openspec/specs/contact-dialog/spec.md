# Spec: 联系弹窗

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
- **AND** Header padding 为 12px 22px，底部带分割线
- **AND** 标题区域与关闭按钮在 Header 内垂直居中
- **AND** Body padding 为 12px 22px 18px
- **AND** 默认宽度 max 480px

### Requirement: Dialog 移动端底部弹出
- **GIVEN** 屏幕宽度 ≤ 640px
- **WHEN** Dialog 打开
- **THEN** 从底部滑入，顶部圆角 16px，底部直角
- **AND** 顶部显示拖拽指示条
- **AND** 高度 max-height 80vh，内容溢出时内部滚动
- **AND** body scroll lock 使用 position:fixed 防止 iOS 穿透滚动

### Requirement: Dialog 动画
- **GIVEN** Dialog 打开或关闭
- **WHEN** placement 为 center
- **THEN** 进入使用 cubic-bezier(0.34,1.56,0.64,1) 250ms
- **WHEN** placement 为 bottom
- **THEN** 进入使用 cubic-bezier(0.32,0.72,0,1) 300ms slide-up
- **AND** 关闭时播放反向退出动画后卸载 DOM
- **AND** 尊重 prefers-reduced-motion

### Requirement: 纸张风视觉
- **GIVEN** 用户打开联系弹窗
- **WHEN** 弹窗渲染
- **THEN** ContactCard 使用 paper-style (background-100 + elevation + inset)
- **AND** 暗色模式正常
- **AND** 功能无回归（二维码预览、关闭弹窗）

### Requirement: Dialog 标题栏垂直对齐
- **GIVEN** 共享 Dialog 显示标题且关闭按钮可见
- **WHEN** Dialog Header 渲染
- **THEN** 标题区域与关闭按钮沿 Header 交叉轴垂直居中
- **AND** 关闭图标在 44×44 像素点击区域内水平、垂直居中

### Requirement: Dialog 副标题场景对齐
- **GIVEN** 共享 Dialog 同时显示标题和副标题
- **WHEN** Dialog Header 渲染
- **THEN** 关闭按钮相对“标题 + 副标题”组成的标题组整体垂直居中
- **AND** 桌面 center placement 与移动端 bottom placement 使用相同对齐规则
