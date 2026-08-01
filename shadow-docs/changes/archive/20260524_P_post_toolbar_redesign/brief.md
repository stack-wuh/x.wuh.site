# PostToolbar 样式优化

> 原始变更名：`20260524_P_post_toolbar_redesign`

## 元数据
- 日期：2026-05-24
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
博客详情页底部导航样式基础，缺少视觉层次和文章位置感知。

## 引用规范
- `specs/post/spec.md`

## 决策
# 技术方案

## 布局

- 流动阅读线风格，column flex，gap 36px
- prev card 全宽左对齐，next card 56% 右对齐
- 流动线：竖线 + 圆点
- 位置指示器 + 返回按钮居中排列

## 后端

- `findAdjacentPosts` 新增 `total` 和 `position` 返回
- 通过 countDocuments 并行查询

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: post-toolbar-redesign
date: 2026-05-24
type: P
status: applied
```

### `design.md`
# 技术方案

## 布局

- 流动阅读线风格，column flex，gap 36px
- prev card 全宽左对齐，next card 56% 右对齐
- 流动线：竖线 + 圆点
- 位置指示器 + 返回按钮居中排列

## 后端

- `findAdjacentPosts` 新增 `total` 和 `position` 返回
- 通过 countDocuments 并行查询

### `proposal.md`
# PostToolbar 样式优化

## 动机

博客详情页底部导航样式基础，缺少视觉层次和文章位置感知。

## 变更范围

- 重新设计 PostToolbar 为流动阅读线风格
- 不对称布局：prev 全宽，next 右对齐 56%
- 添加文章位置指示「第 X / Y 篇」
- 添加「所有博客」返回入口
- 新增后端 total/position API

## 非目标

- 不改变导航逻辑

### `specs/post/spec.md`
# Post — 博客详情

## MODIFIED

### Requirement: PostToolbar 流动阅读线样式
- **GIVEN** 用户浏览博客详情页
- **WHEN** 页面滚动到底部
- **THEN** 显示不对称布局导航（prev 全宽，next 右对齐）
- **AND** 显示文章位置「第 X / Y 篇」
- **AND** 显示「所有博客」返回入口
- **AND** 移动端隐藏「所有博客」按钮

### `tasks.md`
# 实施任务

| # | 任务 | 涉及文件 |
|---|------|----------|
| 1 | 后端加 total/position | content.service.ts, content.controller.ts |
| 2 | 前端 API 类型更新 | api.ts |
| 3 | PostToolbar 重设计 | PostToolbar.tsx, styles/index.ts |
| 4 | 数据链路传递 | page.tsx, PostView.tsx, PostView.types.ts |
