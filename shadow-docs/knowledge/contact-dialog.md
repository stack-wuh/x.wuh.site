---
keywords: [联系弹窗, Dialog, 遮罩, 移动端底部弹出, 动画, 纸张风, 滚动锁定, 响应式]
---

# 联系弹窗 Dialog 规范

Dialog 遮罩层使用 `rgba(0,0,0,0.4)` 叠加 `backdrop-filter: blur(2px)`，点击遮罩关闭弹窗。桌面端四角 border-radius 16px，Header padding 12px 22px 底部带分割线，Body padding 12px 22px 18px，默认最大宽度 480px。关闭图标在 44x44 像素点击区域内水平垂直居中。

移动端（≤640px）从底部滑入，顶部圆角 16px 底部直角，顶部显示拖拽指示条，max-height 80vh 内容溢出时内部滚动。body scroll lock 使用 `position: fixed` 防止 iOS 穿透滚动。

center placement 进入动画 `cubic-bezier(0.34,1.56,0.64,1) 250ms`，bottom placement 进入 `cubic-bezier(0.32,0.72,0,1) 300ms` slide-up，关闭时播放反向退出动画后卸载 DOM。尊重 `prefers-reduced-motion`。

ContactCard 使用 paper-style（background-100 + elevation + inset），暗色模式正常。标题区域与关闭按钮沿 Header 交叉轴垂直居中，有副标题时关闭按钮对「标题+副标题」整体居中。
