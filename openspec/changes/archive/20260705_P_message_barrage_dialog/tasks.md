# 留言弹幕弹窗任务清单

## Phase 1: 弹窗入口与骨架

### Task 1: 挂载留言弹窗入口

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`（新增）
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`（新增）
- [ ] 在文章页增加打开留言弹窗的入口
- [ ] 弹窗默认关闭，点击入口后打开
- [ ] **预计耗时:** 30 分钟
- [ ] **验证:** 本地打开文章页，点击入口可弹出留言窗口

### Task 2: 搭建弹窗结构

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 使用现有 `Dialog` 作为容器
- [ ] 默认只渲染弹幕主区
- [ ] 预留列表区和底部输入栏位置
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 弹窗打开后默认只显示弹幕区域

## Phase 2: 弹幕与列表布局

### Task 3: 实现弹幕主区

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 弹幕区采用轨道式布局
- [ ] 默认弹幕区占据主要视觉区域
- [ ] 提供空态和示例内容
- [ ] **预计耗时:** 60 分钟
- [ ] **验证:** 弹窗中能看到弹幕内容和轨道层级

### Task 4: 实现列表展开与响应式布局

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 点击列表按钮后展开列表
- [ ] 桌面端左右并列，弹幕区向左压缩
- [ ] 移动端上下布局，列表从下方展开
- [ ] **预计耗时:** 75 分钟
- [ ] **验证:** 桌面和移动端都能同屏看到弹幕和列表

## Phase 3: 输入栏与限制

### Task 5: 实现底部输入栏与 100 字限制

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] 输入框限制最大 100 字
- [ ] 输入框右侧提供列表按钮和发送按钮
- [ ] 空内容时发送按钮禁用
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 输入超过 100 字会被截断，按钮状态正确变化

## Phase 4: 数据接入与收口

### Task 6: 对接留言数据与提交流程

- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/comment/comment.controller.ts`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/comment/comment.service.ts`
- [ ] 对齐前端展示字段与后端留言字段
- [ ] 发送成功后刷新弹幕区和列表区
- [ ] 失败时显示 message 提示
- [ ] **预计耗时:** 60 分钟
- [ ] **验证:** 前端可以读取并提交真实留言数据

### Task 7: 视觉收口与可访问性

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-guestbook.ts`
- [ ] **文件:** `packages/wuh.site.next/app/post/components/GuestbookBarrageDialog.tsx`
- [ ] 补齐 focus-visible、disabled、hover 状态
- [ ] 检查桌面端与移动端断点表现
- [ ] 检查空态、加载态、无列表态文案
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** 本地预览无横向溢出，交互状态完整

## Phase 5: 文档与验收

### Task 8: 更新 OpenSpec 记录

- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/proposal.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/specs/guestbook-barrage/spec.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/design.md`
- [ ] **文件:** `openspec/changes/20260705_P_message_barrage_dialog/tasks.md`
- [ ] 确认 proposal、spec、design、tasks 内容一致
- [ ] 确认任务粒度在可执行范围内
- [ ] **预计耗时:** 30 分钟
- [ ] **验证:** 文档结构完整，可直接进入 apply
