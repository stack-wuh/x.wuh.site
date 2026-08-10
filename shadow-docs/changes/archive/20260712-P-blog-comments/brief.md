# 博客详情页评论功能

> 原始变更名：`2026-07-12-P-blog-comments`

## 元数据
- 日期：2026-07-12
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
博客详情页目前只有占位符"空空如也"，没有评论入口。每个博客文章对应一个 GitHub Issue，评论本质上就是 Issue 评论。

## 引用规范
- `specs/blog-comments/spec.md`

## 决策
```
前端 PostComments 组件
  → GET /api/comments?issueNumber=X  拉取评论
  → POST /api/comments                提交评论
后端 CommentController
  → CommentService.create (pending)
  → PATCH :id/approve → postCommentToGitHub → 更新 externalId
同步模块 syncIssueComments → upsert by externalId (自动去重)
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 评论存储 | MongoDB Comment 集合 | 复用已有模型 |
| GitHub API | Octokit | 同步模块已有 |
| 前端 | React Client Component | 交互式表单 |

## 任务
### Phase 1: 后端
- [x] shared-contracts: CreateAnonymousCommentDto 增加 issueNumber
- [x] comment.dto.ts: 增加 issueNumber 字段
- [x] comment.controller.ts: POST 自动识别博客/留言板评论
- [x] comment.controller.ts: PATCH :id/approve 端点
- [x] comment.service.ts: approveAndPostToGitHub 方法
- [x] comment.service.ts: 重复审批拦截
### Phase 2: 前端
- [x] 组件创建：列表 + 输入 + 状态管理
- [x] GitHub/匿名评论区分，来源标记
- [x] 审核中/已同步状态徽标
- [x] 错误处理：API 失败显示提示
- [x] 替换 CommentPlaceholder 为 PostComments
- [x] 移除 CommentPlaceholder 死引用
- [x] tsc --noEmit 零错误
- [x] 留言板功能不受影响

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-12-P-blog-comments
date: 2026-07-12
type: P
status: archived
issue: https://github.com/stack-wuh/x.wuh.site/issues/215

domain:
  name: 博客评论
  keywords:
    - 评论
    - comment
    - GitHub Issues
    - 后端API
    - 前端组件
    - PostComments
  description: 博客详情页评论功能，匿名评论审核后发到 GitHub Issue，同步回来
```

### `design.md`
# 设计文档

## 架构

```
前端 PostComments 组件
  → GET /api/comments?issueNumber=X  拉取评论
  → POST /api/comments                提交评论
后端 CommentController
  → CommentService.create (pending)
  → PATCH :id/approve → postCommentToGitHub → 更新 externalId
同步模块 syncIssueComments → upsert by externalId (自动去重)
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 评论存储 | MongoDB Comment 集合 | 复用已有模型 |
| GitHub API | Octokit | 同步模块已有 |
| 前端 | React Client Component | 交互式表单 |

## 复用分析

| 组件 | import path | 决策 |
|------|------------|------|
| CommentController | 已有 | 扩展 POST 支持 issueNumber |
| CommentService | 已有 | 新增 approveAndPostToGitHub |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（留言板兼容 issueNumber fallback）
- **向后兼容:** 留言板行为不变

### `proposal.md`
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

### `specs/blog-comments/spec.md`
# Spec: 博客评论

## ADDED

### Requirement: 博客详情页展示评论
- **GIVEN** 用户访问博客详情页
- **WHEN** 页面加载完成
- **THEN** 显示该 Issue 下的评论列表
- **AND** 评论来源为 GitHub Issue 或网站匿名提交

### Requirement: 匿名提交评论
- **GIVEN** 用户在博客详情页填写昵称和内容
- **WHEN** 点击发表
- **THEN** 评论以 pending 状态入库
- **AND** 前端显示"审核中"状态

### Requirement: 审批后发到 GitHub
- **GIVEN** 后端收到 PATCH :id/approve
- **WHEN** 评论状态为 pending
- **THEN** 调用 Octokit 发到 GitHub Issue
- **AND** 更新 externalId 为 GitHub Comment ID
- **AND** 已审批的评论重复调用直接返回

### `tasks.md`
# 任务清单

## Phase 1: 后端

### Task 1: DTO + Controller 扩展
- [x] shared-contracts: CreateAnonymousCommentDto 增加 issueNumber
- [x] comment.dto.ts: 增加 issueNumber 字段
- [x] comment.controller.ts: POST 自动识别博客/留言板评论

### Task 2: 审批 + GitHub 发布
- [x] comment.controller.ts: PATCH :id/approve 端点
- [x] comment.service.ts: approveAndPostToGitHub 方法
- [x] comment.service.ts: 重复审批拦截

## Phase 2: 前端

### Task 3: PostComments 组件
- [x] 组件创建：列表 + 输入 + 状态管理
- [x] GitHub/匿名评论区分，来源标记
- [x] 审核中/已同步状态徽标
- [x] 错误处理：API 失败显示提示

### Task 4: 集成到 PostView
- [x] 替换 CommentPlaceholder 为 PostComments
- [x] 移除 CommentPlaceholder 死引用

## 验收

- [x] tsc --noEmit 零错误
- [x] 留言板功能不受影响
