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
