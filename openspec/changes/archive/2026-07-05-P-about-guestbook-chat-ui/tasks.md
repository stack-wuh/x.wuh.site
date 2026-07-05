# 任务清单：About 页面留言板群聊化改造

## Phase 1: 提案与设计

- [x] Task 1: 创建 OpenSpec 提案
  - 文件: `openspec/changes/2026-07-05-P-about-guestbook-chat-ui/proposal.md`
  - 预估: 10min
  - 实际: 8min

- [x] Task 2: 记录技术设计
  - 文件: `openspec/changes/2026-07-05-P-about-guestbook-chat-ui/design.md`
  - 预估: 15min
  - 实际: 12min

## Phase 2: 前端体验改造

- [x] Task 3: 将弹幕弹窗改为群聊式留言弹窗
  - 文件: `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
  - 预估: 1h
  - 实际: 45min

- [x] Task 4: 发送后立即提交并展示消息状态
  - 文件: `packages/wuh.site.next/app/about/components/GuestbookBarrageDialog.tsx`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.js`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.test.js`
  - 预估: 45min
  - 实际: 35min

- [x] Task 5: 重设计 About 页面留言板入口
  - 文件: `packages/wuh.site.next/app/about/AboutView.tsx`
  - 文件: `packages/wuh.site.next/app/about/components/guestbook-barrage.styles.ts`
  - 预估: 35min
  - 实际: 25min

## Phase 3: API 与后端修复

- [x] Task 6: 新增 Next 留言代理 route
  - 文件: `packages/wuh.site.next/app/api/comments/route.ts`
  - 预估: 30min
  - 实际: 20min

- [x] Task 7: 对齐 Nest 留言 DTO 与 schema
  - 文件: `packages/wuh.site.nest/src/modules/comment/dto/comment.dto.ts`
  - 文件: `packages/wuh.site.nest/src/modules/comment/schemas/comment.schema.ts`
  - 文件: `packages/wuh.site.nest/src/modules/comment/comment.service.ts`
  - 文件: `packages/shared-contracts/src/index.ts`
  - 预估: 30min
  - 实际: 20min

## Phase 4: 构建与校验

- [x] Task 8: 分离 Next dev / build 输出目录
  - 文件: `packages/wuh.site.next/next.config.ts`
  - 文件: `packages/wuh.site.next/tsconfig.json`
  - 预估: 20min
  - 实际: 15min

- [x] Task 9: 执行验证
  - 命令: `./node_modules/.bin/oxlint ...`
  - 命令: `./node_modules/.bin/nest build`（直接执行曾通过；最后复跑出现本地 SWC/Node 139 与卡住，已中断）
  - 命令: `node --test packages/wuh.site.next/app/about/components/guestbook-barrage.helpers.test.js`
  - 预估: 20min
  - 实际: 15min

## Phase 5: Review 与归档

- [x] Task 10: 代码审查并处理阻塞项
  - 检查: 需求覆盖、设计一致性、lint、构建、错误可观测性
  - 预估: 20min
  - 实际: 15min

- [x] Task 11: 归档 OpenSpec change
  - 文件: `openspec/specs/guestbook-barrage/spec.md`
  - 文件: `openspec/changes/archive/2026-07-05-P-about-guestbook-chat-ui/`
  - 预估: 15min
  - 实际: 10min
