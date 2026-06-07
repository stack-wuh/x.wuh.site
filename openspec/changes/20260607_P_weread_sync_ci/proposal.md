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
