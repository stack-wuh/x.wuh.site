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
