---
keywords: [错误处理, 异常过滤器, Swagger, OpenAPI, API文档]
---

# 错误处理与 API 文档

所有未捕获异常由 `HttpExceptionFilter` 统一处理，返回 `{ statusCode, message, error, timestamp }` 格式。生产环境不暴露内部错误详情和堆栈。

OpenAPI/Swagger 文档挂载在 `/v2/docs`，所有 Schema、DTO、Controller 需带完整类型注解。
