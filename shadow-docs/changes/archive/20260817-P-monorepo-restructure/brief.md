# Monorepo 目录结构重构

> 状态：设计已确认，待实施

## 动机

当前 `packages/` 目录平铺了应用和共享库，不符合标准 monorepo 的 apps/packages 分层惯例：

- 应用（wuh.site.next / wuh.site.nest / wuh.site.console）和共享库（components / hooks / shared-contracts）混在同一层。
- 应用名 `wuh.site.next` / `wuh.site.nest` 是「域名 + 技术栈」，不够语义化。
- `shared-contracts` 名字不够直观，其内容（DTO 契约 + API 端点 + 站点常量）更贴近「核心共享」定位。

## 目标

- 采用 apps/ + packages/ 分层，应用与共享库分离。
- 应用重命名为 site / server / console。
- `shared-contracts` 重命名为 `core`。
- `hooks` 升级为真正的 npm 包（`@wuh.site/hooks`）。
- 更新所有引用、配置、脚本，保证重命名后构建、类型检查、部署不回归。

## 非目标

- 不改变各应用/库的内部文件结构（只做目录移动和命名）。
- 不引入新的依赖或工具（不用 turborepo/nx，除非另有需求）。
- 不改变业务逻辑、API 路径、路由。

## 决策

### 1. 目录结构

```
apps/
├── site        # 主站前端（原 wuh.site.next）
├── server      # 后端 API（原 wuh.site.nest）
└── console     # 管理后台（原 wuh.site.console）

packages/
├── components  # UI 组件库（不变）
├── hooks       # 共享 hooks（升级为 npm 包）
├── core        # 核心共享（原 shared-contracts）
└── docs        # 文档（不变）
```

### 2. 包名映射

| 原 | 新 |
|----|----|
| `@wuh.site/next` | `@wuh.site/site` |
| `@wuh.site/nest` | `@wuh.site/server` |
| `@wuh.site/console` | `@wuh.site/console`（不变） |
| `@wuh.site/shared-contracts` | `@wuh.site/core` |
| `@wuh.site/hooks`（tsconfig paths 伪包） | `@wuh.site/hooks`（真 npm 包） |
| `@wuh.site/components` | 不变 |

### 3. hooks 升级为 npm 包

- 新增 `packages/hooks/package.json`（name `@wuh.site/hooks`，exports `"./*": "./*"`）。
- 删除空占位的 `packages/hooks/src/index.ts`。
- `shared-contracts`（改名 core 后）的 `endpoints.ts` 把相对路径 `../../hooks/useFetch/createService` 改为 npm 包引用 `@wuh.site/hooks/useFetch/createService`。
- 移除 tsconfig 里 `@wuh.site/hooks/*` 的 paths 映射（改用 node_modules 解析）。

### 4. 依赖关系说明

本变更基于 `20260817-P-site-config-constants`（PR #314）合并之后进行，因为站点常量已落在 shared-contracts，改名 core 会一并移动。

## 影响范围

- `pnpm-workspace.yaml` — 包路径
- 各 `package.json` — name 字段
- 各 `tsconfig.json` — paths 映射 + 相对路径
- 所有 `@wuh.site/shared-contracts` 引用 → `@wuh.site/core`
- 所有 `@wuh.site/next` / `@wuh.site/nest` 引用 → `@wuh.site/site` / `@wuh.site/server`
- 根 `package.json` 脚本（dev:next / build:next / dev:nest 等）
- `.github/workflows/*` — CI/CD 路径
- Docker / 部署脚本（如有）
- 项目文档（CLAUDE.md、README 等）

## 任务

### Phase 1：移动目录 + 改名

- [ ] `git mv packages/wuh.site.next apps/site`
- [ ] `git mv packages/wuh.site.nest apps/server`
- [ ] `git mv packages/wuh.site.console apps/console`
- [ ] `git mv packages/shared-contracts packages/core`
- [ ] 新增 `packages/hooks/package.json`（name `@wuh.site/hooks`，exports `"./*": "./*"`）
- [ ] 删除空占位的 `packages/hooks/src/index.ts`
- [ ] 更新各 `package.json` 的 name 字段
- [ ] 更新 `pnpm-workspace.yaml`

### Phase 2：更新引用

- [ ] 全局替换 `@wuh.site/shared-contracts` → `@wuh.site/core`
- [ ] 全局替换 `@wuh.site/next` → `@wuh.site/site`
- [ ] 全局替换 `@wuh.site/nest` → `@wuh.site/server`
- [ ] `core/src/endpoints.ts` 把 `../../hooks/useFetch/createService` 改为 `@wuh.site/hooks/useFetch/createService`
- [ ] 更新各 tsconfig 的 paths 映射和相对路径（移除 `@wuh.site/hooks/*` 映射）

### Phase 3：更新脚本与 CI

- [ ] 根 package.json 脚本（dev:next → dev:site 等）
- [ ] `.github/workflows/*` 路径
- [ ] Docker / 部署脚本

### Phase 4：验证

- [ ] `pnpm install` 成功，workspace 链接正确
- [ ] `tsc` 通过
- [ ] 前端/后端构建通过
- [ ] 浏览器预览各页面正常

## 验收标准

- [ ] apps/ 与 packages/ 分层清晰。
- [ ] 包名符合 site/server/console + core 映射。
- [ ] 无残留的旧包名引用（@wuh.site/next、@wuh.site/nest、@wuh.site/shared-contracts）。
- [ ] 构建、类型检查、部署流程不回归。

## 知识影响预期

- 需要更新 `shadow-docs/knowledge/` 中涉及包路径和命名的 active Knowledge。
- `CLAUDE.md`、根 README 的仓库结构描述需同步更新。
