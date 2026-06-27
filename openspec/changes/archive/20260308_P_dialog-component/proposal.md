# Dialog 组件

## 为什么做

需要统一的弹窗组件，仿 ant-design 风格，支持全屏模式。同时需要 useDialog hook 管理弹窗状态。

## 做什么

- 在 `packages/components` 实现 Dialog 组件
- Dialog 打开时不需要遮罩层，但下层元素不能点击
- 支持全屏模式
- 在 `packages/hooks` 实现 `useDialog` hook
- 样式使用 `packages/components/themes` 现有方案

## 影响范围

- `packages/components/dialog/` — 新增
- `packages/hooks/useDialog/` — 新增

## 不改什么

- 不引入新依赖（禁止引入 antd 等第三方 UI 库）
- 不改变现有页面布局
