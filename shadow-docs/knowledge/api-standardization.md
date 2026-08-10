---
title: API 标准化
domain: api
keywords: [API标准化, v2接口, Swagger, 错误处理, 统一格式, NestJS API, ISR, repos接口]
scope:
  - packages/wuh.site.nest/src/main.ts
  - packages/wuh.site.nest/src/common/filters
  - /v2/docs
status: active
source:
  - changes/archive/20260501-P-standardize-api-and-migrate-frontend/brief.md
  - changes/archive/20260426-P-unify-frontend-backend/brief.md
verified: 2026-08-08
---

# API 标准化

## 当前结论

`GET /v2/repos` 返回 GitHub 仓库列表并使用内存缓存减少 GitHub API 调用。OpenAPI/Swagger 文档仅在非生产环境挂载于 `/v2/docs`。

所有未捕获异常由 `HttpExceptionFilter` 处理，返回 `{ statusCode, message, error, timestamp }`；非生产环境额外返回 `path` 并记录完整错误，生产环境不暴露路径和堆栈。

前端通过 NestJS API（默认 port 3200）获取后端数据；具体缓存和 ISR 策略由对应领域卡片约束。

## 执行约束

- 新增 Controller/DTO 必须遵循 `/v2` 前缀、统一异常响应和完整 OpenAPI 类型；生产环境不得暴露内部路径或堆栈。

## 适用边界

领域接口的具体字段、排序和缓存由对应领域卡片约束。

## 验证方式

检查 `src/main.ts` 的 prefix/Swagger 条件和 `http-exception.filter.ts` 的生产与非生产响应分支。

## 关联知识

- [content api](./content-api.md)
- [repos api](./repos-api.md)
