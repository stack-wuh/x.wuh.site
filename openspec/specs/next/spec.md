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
