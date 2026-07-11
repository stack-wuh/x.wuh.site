# 任务清单

## Phase 1: 布局改造

### Task 1: 移除多余包装层 + 重写 Composer 样式

- [x] **文件:** `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
- [x] 移除 `GuestbookBody` / `GuestbookPanel` 容器
- [x] 引入 `ComposerBadge` / `ComposerNicknameInput` 组件
- [x] 添加 `editingNickname` 状态切换昵称编辑
- [x] 添加 `Enter 发送` 键盘事件
- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] 重写 Composer：flex 水平布局、负 margin 浮动、backdrop-filter 毛玻璃、z-index
- [x] 新增 ComposerBadge（首字母徽标按钮）
- [x] 新增 ComposerNicknameInput（内联昵称编辑输入框）
- [x] 重写 ComposerSend（圆形主题色按钮）
- [x] 调整 ChatFeed 底部 padding 80px 避免被浮动条遮挡
- [x] GuestbookStage 底部圆角收窄（16px 16px 12px 12px）
- [x] **验证:** `packages/wuh.site.next/node_modules/.bin/oxlint` 零错误

## Phase 2: 样式收敛和暗色模式

### Task 2: 暗色变量集成

- [x] **文件:** `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
- [x] Composer 暗色背景和阴影使用 `[data-color-scheme="dark"]`
- [x] 浮动条 focus-within 边框变色
- [x] **验证:** 暗色/亮色切换样式正确

## 验收

- [x] oxlint 零错误
- [x] 单元测试 4/4 通过
- [x] Enter 发送消息
- [x] 昵称徽标点击编辑
- [x] 暗色/亮色主题视图一致
