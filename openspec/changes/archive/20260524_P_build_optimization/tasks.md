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
