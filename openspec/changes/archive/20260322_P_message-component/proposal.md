# Message 消息提示组件

## 为什么做

当前系统提示使用 window.alert，体验与样式不一致。需要实现 Ant Design 风格 Message 组件，支持多状态、可关闭、可配置位置，提供统一的消息提示体验。

## 做什么

- 实现 Message 组件（Ant Design 风格）
- 支持多状态: success/info/warning/error/loading
- 支持手动关闭（close icon）
- 支持配置位置: top/topLeft/topRight/bottom/bottomLeft/bottomRight
- 支持自动消失（可配置 duration，默认 3 秒）
- 提供全局 API: message.success/info/warning/error/loading + message.config
- 默认 maxCount=5，超出时移除同 placement 最早一条
- 进入/退出动效: fade + slide
- 适配暗色模式

## 影响范围

- `packages/components/message/` — 新增
