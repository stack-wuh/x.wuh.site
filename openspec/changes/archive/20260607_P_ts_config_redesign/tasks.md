# 任务清单

## 1. TypeScript 降级

- 修改 root、nest、next 的 `package.json`，将 `typescript` 改为 `~5.7.2`
- 删除 `pnpm-lock.yaml` 中 typescript@5.9.3 的引用
- `pnpm install`

## 2. 新建 tsconfig.base.json

- 提取当前各 tsconfig 的共享 compilerOptions
- 放置于仓库根目录

## 3. 重写 root tsconfig.json

- extends tsconfig.base.json
- noEmit: true
- include 改为 `packages/*/src/**/*.ts` + `packages/*/src/**/*.tsx`
- 删除 jsx、plugins、dom lib 等 next 专属项

## 4. 重写 packages/shared-contracts/tsconfig.json

- extends ../../tsconfig.base.json
- 合并 tsconfig.build.json 的逻辑（emitDeclarationOnly + outDir）
- 删除 tsconfig.build.json

## 5. 重写 packages/wuh.site.nest/tsconfig.json

- extends ../../tsconfig.base.json
- 保留 nest 专属选项（decorators、commonjs）
- 新增 include/exclude
- baseUrl 改为 ./src

## 6. 修改 packages/wuh.site.nest/nest-cli.json

- typeCheck: false

## 7. 重写 packages/wuh.site.next/tsconfig.json

- extends ../../tsconfig.base.json
- 保留 next 专属选项（jsx、plugins、paths）
- include 精简为 app/ + components/ + types/

## 8. 更新 root package.json scripts

- build: `pnpm -r build`
- typecheck: `tsc --noEmit`

## 9. 验证

```bash
pnpm install
pnpm typecheck
pnpm build
```
