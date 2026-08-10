# 优化构建配置和组件包导出

> 原始变更名：`20260524_P_build_optimization`

## 元数据
- 日期：2026-05-24
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
Docker 构建优化后容器 unhealthy，根因是组件包导入方式与 pnpm deploy 不兼容。统一修复构建配置、导入路径和组件包导出方式。

## 引用规范
- `specs/components/spec.md`
- `specs/next/spec.md`

## 决策
# 技术方案

## 组件包导出改造

`packages/components/package.json`:
- 删除 `"main": "index.js"` 和 `"types": "src/index.ts"`
- 新增 `"exports": { "./*": "./*" }` 直接映射子路径
- 删除 `src/index.ts` 桶文件，新导出入口 `styled/index.ts`

## 导入路径统一

所有 `@wuh.site/components/*/index` → `@wuh.site/components/*`：
- 涉及 12 个 Next.js app 文件 + 1 个 components 内部文件

## 构建配置调整

- `next.config.ts`: 移除 `@wuh.site/components` 从 `optimizePackageImports`
- `tsconfig.json`: 新增 `@wuh.site/shared-contracts` 路径映射
- `layout.tsx`: 更新 iconfont CDN URL

## gitignore

- 新增 `.claude` 和 `.pnpm-store` 排除规则

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
change: build-optimization
date: 2026-05-24
type: P
status: applied
```

### `design.md`
# 技术方案

## 组件包导出改造

`packages/components/package.json`:
- 删除 `"main": "index.js"` 和 `"types": "src/index.ts"`
- 新增 `"exports": { "./*": "./*" }` 直接映射子路径
- 删除 `src/index.ts` 桶文件，新导出入口 `styled/index.ts`

## 导入路径统一

所有 `@wuh.site/components/*/index` → `@wuh.site/components/*`：
- 涉及 12 个 Next.js app 文件 + 1 个 components 内部文件

## 构建配置调整

- `next.config.ts`: 移除 `@wuh.site/components` 从 `optimizePackageImports`
- `tsconfig.json`: 新增 `@wuh.site/shared-contracts` 路径映射
- `layout.tsx`: 更新 iconfont CDN URL

## gitignore

- 新增 `.claude` 和 `.pnpm-store` 排除规则

### `proposal.md`
# 优化构建配置和组件包导出

## 动机

Docker 构建优化后容器 unhealthy，根因是组件包导入方式与 pnpm deploy 不兼容。统一修复构建配置、导入路径和组件包导出方式。

## 变更范围

- 组件包 `@wuh.site/components`: `main` → `exports map`，删除桶文件 `src/index.ts`
- 前端: 统一去除导入路径 `/index` 后缀，更新 iconfont CDN，新增 shared-contracts 路径映射
- 构建配置: 从 optimizePackageImports 移除 `@wuh.site/components`
- 工程: gitignore 排除 `.claude` 和 `.pnpm-store`

## 非目标

- 不修改功能逻辑
- 不修改 UI 样式

### `specs/components/spec.md`
# Components — 组件包

## MODIFIED

### Requirement: 组件包使用 exports map 导出
- **GIVEN** 消费者导入 `@wuh.site/components/flex`
- **WHEN** 构建工具解析模块路径
- **THEN** 通过 `exports` map 直接映射到对应子路径，无需桶文件

### `specs/next/spec.md`
# Next — 前端构建

## MODIFIED

### Requirement: 导入路径统一无 /index 后缀
- **GIVEN** 组件导入语句
- **WHEN** 开发或构建时解析路径
- **THEN** 所有 `@wuh.site/components/*/index` 统一为 `@wuh.site/components/*`

### Requirement: shared-contracts 路径映射
- **GIVEN** 前端引用 `@wuh.site/shared-contracts`
- **WHEN** TypeScript 编译
- **THEN** 通过 tsconfig paths 正确解析到源码目录

### `tasks.md`
# 实施任务

| # | 任务 | Phase | 涉及文件 |
|---|------|-------|----------|
| 1 | 组件包 package.json 导出改造 | 1 | `components/package.json` |
| 2 | 删除 src/index.ts，创建 styled/index.ts | 1 | `components/src/index.ts`, `components/styled/index.ts` |
| 3 | 修正图标名 | 1 | `components/icons/icofont.tsx` |
| 4 | 统一导入路径去掉 /index | 2 | 13 个文件 |
| 5 | 更新 next.config.ts | 2 | `next.config.ts` |
| 6 | 新增 tsconfig 路径映射 | 2 | `tsconfig.json` |
| 7 | 更新 iconfont CDN | 2 | `app/layout.tsx` |
| 8 | 更新 gitignore | 2 | `.gitignore` |
