# Dialog 布局和样式重新设计

## 动机

当前 Dialog 感官体验差：无遮罩层、间距过大（桌面端 padding 24-32px）、移动端占屏比例失衡、动画生硬（180ms ease 无退出动画）。

## 变更范围

只改 `packages/components/dialog` 的样式层（styled-components），不改 API，不加新依赖。

- `packages/components/dialog/styles/index.tsx` — 遮罩、间距、圆角、动画
- `packages/components/dialog/index.tsx` — 新增 `placement` prop、退出动画逻辑
- `openspec/specs/contact-dialog/spec.md` — 更新圆角规范

## 非目标

- 不引入 Radix UI / 第三方 Dialog 库
- 不改 ContactCard 内容组件
- 不修改 HomeView 调用方式（向后兼容）
