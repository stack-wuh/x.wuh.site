# Proposal: 修复 weread 模块 Swagger 不显示接口 + 补全文档 + 支持分页

> 原始变更名：`20260607_B_weread_fix_and_pagination`

## 元数据
- 日期：2026-06-07
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
1. `/v2/docs` Swagger UI 中看不到 weread 模块接口
2. API 端点 `GET /v2/weread/books` 和 `POST /v2/weread/sync` 返回 404
3. README.md、CLAUDE.md、api-v2.service.ts 文档缺 weread/repos 模块
4. 前端 /weread 页面无分页，一次加载全部数据

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# Design: weread 分页支持

## 后端

- `WereadService.getBooks(page, limit)` → 使用 Mongoose `skip()`/`limit()`/`countDocuments()` + `buildPaginatedResult()`
- `WereadController` → 新增 `page` 和 `limit` 查询参数，默认 page=1, limit=10
- 返回 `PaginatedResult<WereadBook>` 结构（data + pagination）

## 前端

- `api.weread.getBooks({page, limit})` → 替代旧的 `getBooks(limit)`
- `app/weread/page.tsx` → 服务端组件，`searchParams.page`，`PER_PAGE=10`
- `WereadView` → 接收 `total`/`currentPage`/`totalPages`，底部渲染 `<Pagination>`

## 任务
### Phase 1：历史任务
- [x] 补全 weread.schema.ts @ApiProperty 装饰器
- [x] 补全 README.md 路由表 /weread
- [x] 补全 CLAUDE.md 后端模块图 repos + weread
- [x] 补全 api-v2.service.ts 端点列表
- [x] 后端 weread 分页（service + controller）
- [x] 前端 weread 分页（api.ts + page.tsx + WereadView）

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: weread-swagger-fix-pagination
date: 2026-06-07
type: B
status: applied
```

### `design.md`
# Design: weread 分页支持

## 后端

- `WereadService.getBooks(page, limit)` → 使用 Mongoose `skip()`/`limit()`/`countDocuments()` + `buildPaginatedResult()`
- `WereadController` → 新增 `page` 和 `limit` 查询参数，默认 page=1, limit=10
- 返回 `PaginatedResult<WereadBook>` 结构（data + pagination）

## 前端

- `api.weread.getBooks({page, limit})` → 替代旧的 `getBooks(limit)`
- `app/weread/page.tsx` → 服务端组件，`searchParams.page`，`PER_PAGE=10`
- `WereadView` → 接收 `total`/`currentPage`/`totalPages`，底部渲染 `<Pagination>`

### `proposal.md`
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

### `tasks.md`
# Tasks

- [x] 补全 weread.schema.ts @ApiProperty 装饰器
- [x] 补全 README.md 路由表 /weread
- [x] 补全 CLAUDE.md 后端模块图 repos + weread
- [x] 补全 api-v2.service.ts 端点列表
- [x] 后端 weread 分页（service + controller）
- [x] 前端 weread 分页（api.ts + page.tsx + WereadView）
