# Proposal: 修复 weread 模块 Swagger 不显示接口 + 补全文档 + 支持分页

## 问题

1. `/v2/docs` Swagger UI 中看不到 weread 模块接口
2. API 端点 `GET /v2/weread/books` 和 `POST /v2/weread/sync` 返回 404
3. README.md、CLAUDE.md、api-v2.service.ts 文档缺 weread/repos 模块
4. 前端 /weread 页面无分页，一次加载全部数据

## 根因

SWC 编译器在处理仅含 `@nestjs/mongoose` 装饰器（`@Prop`）、不含 `@nestjs/swagger` 装饰器（`@ApiProperty`）的 schema class 时，生成有问题的代码，导致 Mongoose 原生模块加载时段错误 (SIGSEGV)，NestJS 路由静默注册失败。

## 修复

1. weread.schema.ts 添加 `@ApiProperty` / `@ApiPropertyOptional` 装饰器
2. 补全 README/CLAUDE/api-v2.service.ts 中的文档缺口
3. weread API 支持分页（page + limit），前端 /weread 页面一页 10 条
