# 任务拆分

## Phase 1 — Message 组件实现

- [ ] T1: 实现消息容器与队列管理
  - 涉及文件: `packages/components/message/MessageProvider.tsx`, `MessageQueue.ts`
  - 产出: 全局消息管理器

- [ ] T2: 实现 Message 项组件与样式
  - 涉及文件: `packages/components/message/MessageItem.tsx`, styles
  - 产出: 多状态消息项，支持关闭、自动消失

- [ ] T3: 实现全局 API 与导出
  - 涉及文件: `packages/components/message/index.ts`
  - 产出: message.success/info/warning/error/loading 静态方法

## Phase 2 — 验证

- [ ] T4: 验证消息功能与暗色模式
  - 手动验证多状态、不同位置、快速连续触发、duration=0 常驻
  - dark mode、reduced-motion
