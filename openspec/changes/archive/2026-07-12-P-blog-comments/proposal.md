# 博客详情页评论功能

## 背景

博客详情页目前只有占位符"空空如也"，没有评论入口。每个博客文章对应一个 GitHub Issue，评论本质上就是 Issue 评论。

## 目标

- 博客详情页展示 GitHub Issue 评论和网站匿名评论
- 匿名评论支持昵称+内容输入
- 审核后可发布到 GitHub Issue
- 评论状态（审核中/已同步）前端可见

## 非目标

- 不实现管理后台审批 UI（端点已存在，需后续补充）
- 不改动留言板现有逻辑

## 影响范围

- `packages/shared-contracts/src/index.ts` — DTO 增加 issueNumber
- `packages/wuh.site.nest/src/modules/comment/` — 后端 API 扩展
- `packages/wuh.site.next/app/post/components/PostComments.tsx` — 新组件
- `packages/wuh.site.next/app/post/PostView.tsx` — 集成
