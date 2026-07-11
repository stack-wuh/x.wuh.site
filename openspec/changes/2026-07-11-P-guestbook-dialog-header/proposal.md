# 留言板 Dialog 头部优化

## 背景

当前留言板 Dialog 的 header 只有纯标题 "留言板"，缺少氛围和引导。trigger 按钮中已有副标题和提示文案，但这些信息在打开 Dialog 后就消失了。同时 sampleMessages 中的群聊模式提示放在消息流里，容易跟真实留言混淆。

## 目标

- Dialog header 新增 subtitle 区域，展示装饰性短语营造氛围
- Dialog body 顶部新增引导提示文字，替代 sample 消息的功能
- trigger 文案已由用户优化为更贴合氛围的表达
- Dialog 组件新增 `subtitle` prop，支持 header 中标题下方展示副文本

## 非目标

- 不改变留言板整体交互逻辑
- 不改变消息发送/展示流程
- 不涉及后端 API 变更

## 影响范围

- `packages/components/dialog/index.tsx` — 新增 `subtitle` prop
- `packages/components/dialog/styles/*.tsx` — 新增 `DialogSubtitle` 样式组件
- `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx` — 应用 subtitle，调整引导文案
