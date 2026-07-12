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
