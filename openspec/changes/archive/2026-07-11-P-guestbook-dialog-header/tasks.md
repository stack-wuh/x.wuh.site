# 任务清单

## Phase 1: Dialog 组件增强

### Task 1: 新增 DialogSubtitle 样式组件

- [ ] **文件:** `packages/components/dialog/styles/index.tsx`
- [ ] 在 styles 中新增 `DialogHeaderContent` 组件（flex column 容器）
- [ ] 在 styles 中新增 `DialogSubtitle` 组件（p 标签，小字 muted 色）
- [ ] 导出新组件
- [ ] **验证:** `npx tsc --noEmit` 零错误

### Task 2: Dialog 组件支持 subtitle prop

- [ ] **文件:** `packages/components/dialog/index.tsx`
- [ ] `DialogProps` 新增可选 `subtitle?: React.ReactNode`
- [ ] 渲染逻辑：title 存在时，DialogHeader → DialogHeaderContent(DialogTitle + DialogSubtitle) + CloseButton
- [ ] DialogHeader 改为 `align-items: flex-start` 以适配 subtitle 多行场景
- [ ] **验证:** `npx tsc --noEmit` 零错误

## Phase 2: 留言板接入

### Task 3: GuestbookBarrageDialog 应用 subtitle 和引导文案

- [ ] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [ ] Dialog 调用传入 `subtitle="声无哀乐"`
- [ ] Dialog body 顶部新增引导短语：`"萍水楚客，路远情长"`
- [ ] 移除 sampleMessages 第 2 条（群聊模式提示），或保留不展示为正式消息
- [ ] **验证:** `npx tsc --noEmit` 零错误，`pnpm build:next` 构建通过

## Phase 3: 规范同步

### Task 4: 更新 guestbook-barrage spec

- [ ] **文件:** `openspec/specs/guestbook-barrage/spec.md`
- [ ] 在 spec.md 末尾添加 ## MODIFIED: 留言板 Dialog 头部优化
- [ ] GIVEN/WHEN/THEN 描述 header 有 subtitle 的行为

### Task 5: 更新 INDEX

- [ ] **文件:** `openspec/INDEX.md`
- [ ] 无需新增领域，guestbook-barrage 已有

## 验收

- [ ] Dialog 不传 subtitle 时行为完全不变
- [ ] 传 subtitle 时 header 展示 title + subtitle 垂直排列
- [ ] 留言板打开后 header 显示 "留言板" + "声无哀乐"
- [ ] Dialog body 顶部显示 "萍水楚客，路远情长"
- [ ] `npx tsc --noEmit` 零错误
