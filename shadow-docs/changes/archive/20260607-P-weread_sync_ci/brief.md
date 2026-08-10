# 微信读书书架定期同步

> 原始变更名：`20260607_P_weread_sync_ci`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
当前微信读书书架同步只能通过手动调用 `POST /weread/sync` 触发，书架数据不会自动更新。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
历史记录未提供

## 任务
### Phase 1：历史任务
- [x] 创建 `.github/workflows/weread-sync.yml`
- [x] 配置 cron 定时触发（每周日 00:00 UTC）
- [x] 配置 workflow_dispatch 手动触发
- [x] 复用现有 SSH secrets 调用 weread/sync 接口
- [x] .openspec.yaml
- [x] proposal.md
- [x] tasks.md

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: weread-sync-ci
date: 2026-06-07
type: P
status: applied
```

### `proposal.md`
# 微信读书书架定期同步

## 背景

当前微信读书书架同步只能通过手动调用 `POST /weread/sync` 触发，书架数据不会自动更新。

## 方案

新增 GitHub Actions 定时工作流，每周自动调用一次同步接口：

- **触发方式**: 每周日 UTC 00:00（北京时间 08:00），支持手动触发
- **执行方式**: SSH 到服务器，curl localhost NestJS 接口
- **复用 secrets**: `SERVER_HOST`、`SERVER_USER`、`SERVER_PASSWORD`

## 改动范围

- `.github/workflows/weread-sync.yml` — 新建定时工作流

### `tasks.md`
# 任务清单

## Task 1: GitHub Actions 工作流
- [x] 创建 `.github/workflows/weread-sync.yml`
- [x] 配置 cron 定时触发（每周日 00:00 UTC）
- [x] 配置 workflow_dispatch 手动触发
- [x] 复用现有 SSH secrets 调用 weread/sync 接口

## Task 2: OpenSpec 制品
- [x] .openspec.yaml
- [x] proposal.md
- [x] tasks.md
