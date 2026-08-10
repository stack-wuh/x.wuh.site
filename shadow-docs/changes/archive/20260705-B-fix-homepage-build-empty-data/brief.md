# 修复构建后首页数据模块为空

> 原始变更名：`2026-07-05-B-fix-homepage-build-empty-data`

## 元数据
- 日期：2026-07-05
- 类型：B
- 状态：applied
- Issue：历史记录未提供

## 动机
生产构建后，首页多个服务端数据模块显示为空。首页数据来自内容 API、仓库 API、微信读书 API，但这些请求在构建阶段失败后被转换为空数组，导致空数据被写入构建产物。

## 引用规范
- `specs/build-config/spec.md`
- `specs/homepage-data/spec.md`

## 决策
首页仍由 Server Component 获取数据，但不能在构建阶段把失败结果固化为静态 HTML。修复分两层：

1. `createService.ts` 使用和 `next.config.ts` 一致的 API base fallback：生产环境默认 `http://nest:3200/v2`，开发环境默认 `http://localhost:3200/v2`。
2. 首页声明 `dynamic = 'force-dynamic'`，确保数据在运行时获取，而不是构建时预渲染成空数据。

| 维度 | 选择 | 理由 |
|------|------|------|
| 渲染策略 | `force-dynamic` | 避免构建期 API 不可达时固化空数据 |
| API fallback | production 使用 `http://nest:3200/v2` | Docker compose 中 Next 访问 Nest 应使用服务名 |
| 错误诊断 | `console.error` 服务端日志 | 保持最小改动，便于定位线上空数据 |

## 任务
### Phase 1: 回归测试
- [x] **文件:** `packages/hooks/useFetch/apiBase.test.mjs`
- [x] 验证生产环境默认 API base 为 `http://nest:3200/v2`。
- [x] 验证开发环境默认 API base 为 `http://localhost:3200/v2`。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `node packages/hooks/useFetch/apiBase.test.mjs`
### Phase 2: 修复实现
- [x] **文件:** `packages/hooks/useFetch/createService.ts`
- [x] 将生产 fallback 改为 `http://nest:3200/v2`。
- [x] **文件:** `packages/wuh.site.next/app/page.tsx`
- [x] 增加 `dynamic = 'force-dynamic'`。
- [x] 首页数据请求失败时输出服务端日志。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [ ] **验证:** `PATH=/Users/wuhong/.nvm/versions/node/v20.20.2/bin:$PATH node_modules/.bin/tsc --noEmit --incremental false --pretty false` 当前最终复验 SIGSEGV
- [x] 构建阶段不会把首页 API 失败结果固化为空数据。
- [x] 生产环境默认 API base 指向 `http://nest:3200/v2`。
- [x] 开发环境默认 API base 仍指向 `http://localhost:3200/v2`。
- [x] 首页请求失败时能从服务端日志看到具体模块和错误。

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-05-B-fix-homepage-build-empty-data
date: 2026-07-05
type: B
status: applied
issue: https://github.com/stack-wuh/x.wuh.site/issues/184
```

### `design.md`
# 设计文档

## 架构

首页仍由 Server Component 获取数据，但不能在构建阶段把失败结果固化为静态 HTML。修复分两层：

1. `createService.ts` 使用和 `next.config.ts` 一致的 API base fallback：生产环境默认 `http://nest:3200/v2`，开发环境默认 `http://localhost:3200/v2`。
2. 首页声明 `dynamic = 'force-dynamic'`，确保数据在运行时获取，而不是构建时预渲染成空数据。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 渲染策略 | `force-dynamic` | 避免构建期 API 不可达时固化空数据 |
| API fallback | production 使用 `http://nest:3200/v2` | Docker compose 中 Next 访问 Nest 应使用服务名 |
| 错误诊断 | `console.error` 服务端日志 | 保持最小改动，便于定位线上空数据 |

## API 设计（如涉及）

不新增 API。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无。
- **向后兼容:** 开发环境仍默认访问 `localhost:3200/v2`。
- **性能影响:** 首页从静态预渲染变为运行时渲染；各请求仍使用现有 revalidate 配置参与 Next fetch 缓存。

### `proposal.md`
# 修复构建后首页数据模块为空

## 背景

生产构建后，首页多个服务端数据模块显示为空。首页数据来自内容 API、仓库 API、微信读书 API，但这些请求在构建阶段失败后被转换为空数组，导致空数据被写入构建产物。

## 目标

- 首页不在 `next build` 阶段固化空数据。
- 服务端 API base 在生产环境默认指向 Docker 内部 Nest 服务。
- 首页数据请求失败时输出可诊断日志。

## 非目标（明确不做）

- 不改后端 API 业务逻辑。
- 不改首页视觉结构。
- 不引入新的缓存系统。

## 影响范围

- `packages/hooks/useFetch/createService.ts` — 修正生产环境 API base fallback。
- `packages/wuh.site.next/app/page.tsx` — 强制首页运行时动态渲染，并记录请求失败日志。
- `openspec/specs/build-config/spec.md` — 记录生产 API base fallback 规则。
- `openspec/specs/homepage-data/spec.md` — 记录首页运行时数据获取规则。

### `specs/build-config/spec.md`
# Spec: 构建配置

## ADDED

### Requirement: Production server API fallback uses Docker service name
- **GIVEN** Next.js 服务运行在生产环境且未显式配置 `NEST_API_URL`
- **WHEN** Server Component 或 Route Handler 通过共享 service 请求 Nest API
- **THEN** 默认 API base 应为 `http://nest:3200/v2`

---

## MODIFIED

### Requirement: None
- 本次不修改既有构建配置需求。

---

## REMOVED

### Requirement: None
- 本次不移除既有构建配置需求。

### `specs/homepage-data/spec.md`
# Spec: 首页数据获取

## ADDED

### Requirement: Homepage fetches data at runtime after production build
- **GIVEN** 应用完成生产构建并启动
- **WHEN** 用户访问首页
- **THEN** 首页应在运行时请求内容、仓库和微信读书数据
- **AND** 不应使用构建阶段 API 失败产生的空数组作为最终页面数据

### Requirement: Homepage logs server data fetch failures
- **GIVEN** 首页任一服务端数据请求失败
- **WHEN** 页面返回 fallback 空数组
- **THEN** 服务端日志应包含失败模块名和错误信息

---

## MODIFIED

### Requirement: None
- 本次不修改既有首页数据需求。

---

## REMOVED

### Requirement: None
- 本次不移除既有首页数据需求。

### `tasks.md`
# 任务清单

## Phase 1: 回归测试

### Task 1: 覆盖 API base fallback

- [x] **文件:** `packages/hooks/useFetch/apiBase.test.mjs`
- [x] 验证生产环境默认 API base 为 `http://nest:3200/v2`。
- [x] 验证开发环境默认 API base 为 `http://localhost:3200/v2`。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `node packages/hooks/useFetch/apiBase.test.mjs`

## Phase 2: 修复实现

### Task 2: 修正 API base 与首页动态渲染

- [x] **文件:** `packages/hooks/useFetch/createService.ts`
- [x] 将生产 fallback 改为 `http://nest:3200/v2`。
- [x] **文件:** `packages/wuh.site.next/app/page.tsx`
- [x] 增加 `dynamic = 'force-dynamic'`。
- [x] 首页数据请求失败时输出服务端日志。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [ ] **验证:** `PATH=/Users/wuhong/.nvm/versions/node/v20.20.2/bin:$PATH node_modules/.bin/tsc --noEmit --incremental false --pretty false` 当前最终复验 SIGSEGV

## 验收

- [x] 构建阶段不会把首页 API 失败结果固化为空数据。
- [x] 生产环境默认 API base 指向 `http://nest:3200/v2`。
- [x] 开发环境默认 API base 仍指向 `http://localhost:3200/v2`。
- [x] 首页请求失败时能从服务端日志看到具体模块和错误。


## 验证备注

- `node packages/hooks/useFetch/apiBase.test.mjs` 通过。
- `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/page.tsx packages/hooks/useFetch/createService.ts packages/hooks/useFetch/apiBase.ts` 通过。
- `PATH=/Users/wuhong/.nvm/versions/node/v20.20.2/bin:$PATH node_modules/.bin/tsc --noEmit --incremental false --pretty false` 曾通过一次，最终复验连续 SIGSEGV，需在稳定本机/CI 环境复验。
- 本地 `next build` 在下载字体/编译阶段长时间无输出后手动中断；需要 CI 或有稳定网络的本机环境复验完整生产构建。
