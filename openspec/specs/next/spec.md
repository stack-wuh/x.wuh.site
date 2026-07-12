# Next — 前端构建

## MODIFIED

### Requirement: 导入路径统一无 /index 后缀
- **GIVEN** 组件导入语句
- **WHEN** 开发或构建时解析路径
- **THEN** 所有 `@wuh.site/components/*/index` 统一为 `@wuh.site/components/*`

### Requirement: 优先使用 @/* 路径别名
- **GIVEN** 前端文件引用 `packages/wuh.site.next/` 内部的模块
- **WHEN** 编写 import 语句
- **THEN** 优先使用 `@/*` 路径别名（`@/*` → `./*`，映射到 Next.js 项目根目录）
- **AND** 避免使用深层相对路径（如 `../../../components/xxx`）
- **AND** 仅在引用同层或相邻子目录时使用相对路径（`./xxx`）

### Requirement: shared-contracts 路径映射
- **GIVEN** 前端引用 `@wuh.site/shared-contracts`
- **WHEN** TypeScript 编译
- **THEN** 通过 tsconfig paths 正确解析到源码目录
