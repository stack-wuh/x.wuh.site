# Error Handling

## ADDED

### Requirement: Global exception filter
所有未捕获异常由 `HttpExceptionFilter` 处理，统一响应格式。

- **GIVEN** 任何请求处理中抛出异常
- **WHEN** 异常未被 Controller 层捕获
- **THEN** 返回 `{ statusCode, message, error, timestamp }`
- **AND** 生产环境不暴露内部错误详情和堆栈信息

### Requirement: Swagger API documentation
OpenAPI/Swagger 文档挂载在 `/v2/docs`。

- **GIVEN** 服务启动
- **WHEN** 浏览器访问 `/v2/docs`
- **THEN** 显示 Swagger UI，包含所有 API 的文档
- **AND** 所有 Schema、DTO、Controller 带有完整类型注解
