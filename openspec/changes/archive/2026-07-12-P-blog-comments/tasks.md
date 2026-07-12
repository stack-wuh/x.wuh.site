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
