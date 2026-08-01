---
keywords: [Next.js, 导入路径, 路径别名, shared-contracts, 前端构建]
---

# Next.js 前端构建

导入路径规范：所有 `@wuh.site/components/*/index` 统一为 `@wuh.site/components/*`。前端文件引用内部模块优先使用 `@/*` 路径别名（映射到 Next.js 项目根目录），避免深层相对路径。仅在引用同层或相邻子目录时使用 `./xxx` 相对路径。`@wuh.site/shared-contracts` 通过 tsconfig paths 正确解析到源码目录。
