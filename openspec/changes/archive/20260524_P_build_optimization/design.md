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
