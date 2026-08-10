# 开发服务器启动优化

> 原始变更名：`20260607_P_dev_startup_optimization`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
`pnpm dev:next` / `pnpm dev:nest` 启动不稳定，常需多次重试（进程静默退出 / 端口冲突）。诊断发现：VSCode/Cursor 终端关闭后 dev server 进程不终止，端口被旧实例占用，累积多个 NestJS 实例和僵尸进程。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
历史记录未提供

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
change: dev-startup-optimization
date: 2026-06-07
type: P
status: applied
```

### `proposal.md`
# 开发服务器启动优化

## 背景

`pnpm dev:next` / `pnpm dev:nest` 启动不稳定，常需多次重试（进程静默退出 / 端口冲突）。诊断发现：VSCode/Cursor 终端关闭后 dev server 进程不终止，端口被旧实例占用，累积多个 NestJS 实例和僵尸进程。

## 目标

- `pnpm dev` 一条命令同时启动 next + nest
- 启动前自动检测并释放端口 3000/3200
- Ctrl+C 或终端关闭时自动清理所有子进程
- 不改动现有的 `dev:next` / `dev:nest` 命令

## 方案

新增 `scripts/dev.sh` + root `package.json` 新增 `dev` 命令：

- 用 `lsof -ti` 检测端口占用，被占则 `kill` 释放
- `trap cleanup EXIT INT TERM` 保证退出时清理子进程
- `&` + `wait` 并行启动 next 和 nest
- 不引入新依赖

## 范围

- `scripts/dev.sh`（新建）
- root `package.json`（新增 `dev` script）
