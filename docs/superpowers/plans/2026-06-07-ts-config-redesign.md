# TypeScript 配置体系重新设计 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 消除 tsc segfault，构建与类型检查分离，TypeScript 锁定 5.7.2

**Architecture:** 新建 `tsconfig.base.json` 作为共享基类，root `tsconfig.json` 作为 `pnpm typecheck` 入口，各包 tsconfig 继承 base 并保留包专属选项。`nest build` 关闭 typeCheck（SWC 转译保留），类型检查统一到 `pnpm typecheck`

**Tech Stack:** TypeScript 5.7.2, NestJS 10 + SWC, Next.js 15

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `tsconfig.base.json` | **Create** | 共享 compilerOptions |
| `tsconfig.json` | **Rewrite** | root typecheck 入口 |
| `packages/shared-contracts/tsconfig.json` | **Rewrite** | emitDeclarationOnly |
| `packages/shared-contracts/tsconfig.build.json` | **Delete** | 合并到 tsconfig.json |
| `packages/wuh.site.nest/tsconfig.json` | **Rewrite** | nest 专属 + include/exclude |
| `packages/wuh.site.nest/nest-cli.json` | **Modify** | typeCheck: false |
| `packages/wuh.site.next/tsconfig.json` | **Rewrite** | next 专属 + 精简 include |
| `package.json` | **Modify** | typescript 版本 + scripts |
| `packages/wuh.site.nest/package.json` | **Modify** | typescript 版本 |
| `packages/wuh.site.next/package.json` | **Modify** | typescript 版本 |

---

### Task 1: Commit current state before changes

**Files:** None (just a safety checkpoint)

- [ ] **Step 1: Verify working tree is clean from previous changes**

We already committed the previous migration. Confirm status:

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git status
```

Expected: clean working tree (or only untracked files).

---

### Task 2: Create tsconfig.base.json

**Files:**
- Create: `tsconfig.base.json`

- [ ] **Step 1: Create the file**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
```

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["ES2021"],
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist", ".next"]
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add tsconfig.base.json
git commit -m "feat: add tsconfig.base.json as shared compiler options base"
```

---

### Task 3: Rewrite root tsconfig.json

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace content**

Delete all existing content (40 lines) and replace with:

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": [
    "packages/*/src/**/*.ts",
    "packages/*/src/**/*.tsx"
  ],
  "exclude": ["node_modules", "dist", ".next"]
}
```

Changes:
- `extends` tsconfig.base.json instead of duplicating compilerOptions
- Delete `jsx`, `plugins`, `lib: ["dom", ...]`, `allowJs`, `paths` — these belong in per-package tsconfigs
- `include` from `**/*.ts` to `packages/*/src/**/*.ts` — no more scanning dist/ or .next/
- `exclude` adds `dist` and `.next` in addition to `node_modules`

- [ ] **Step 2: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add tsconfig.json
git commit -m "refactor: rewrite root tsconfig to extend base, narrow include scope"
```

---

### Task 4: Rewrite shared-contracts tsconfig

**Files:**
- Rewrite: `packages/shared-contracts/tsconfig.json`
- Delete: `packages/shared-contracts/tsconfig.build.json`

- [ ] **Step 1: Rewrite tsconfig.json**

Replace current content with:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": false,
    "emitDeclarationOnly": true
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Delete tsconfig.build.json**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
rm packages/shared-contracts/tsconfig.build.json
```

The build config is now merged into tsconfig.json. The `emitDeclarationOnly` doesn't conflict because base has no `noEmit`.

- [ ] **Step 3: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/shared-contracts/tsconfig.json
git rm packages/shared-contracts/tsconfig.build.json
git commit -m "refactor: merge shared-contracts tsconfig.build.json into tsconfig.json"
```

---

### Task 5: Rewrite nest tsconfig

**Files:**
- Rewrite: `packages/wuh.site.nest/tsconfig.json`

- [ ] **Step 1: Replace content**

Replace all 31 lines with:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmit": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

Key changes from current:
- `extends` base instead of standalone
- `baseUrl` from `./` to `./src` (avoids cwd-dependent resolution)
- `noEmit: true` — SWC handles transpilation
- Added `include`/`exclude` — no more scanning dist/ or node_modules

- [ ] **Step 2: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/wuh.site.nest/tsconfig.json
git commit -m "refactor: rewrite nest tsconfig with include/exclude, extend base"
```

---

### Task 6: Disable typeCheck in nest-cli.json

**Files:**
- Modify: `packages/wuh.site.nest/nest-cli.json`

- [ ] **Step 1: Change typeCheck from true to false**

Read the file and change `"typeCheck": true` to `"typeCheck": false`.

Expected result:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": false
  }
}
```

The SWC builder is kept. Type checking moves to `pnpm typecheck`.

- [ ] **Step 2: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/wuh.site.nest/nest-cli.json
git commit -m "refactor: disable swc typeCheck in nest build"
```

---

### Task 7: Rewrite next tsconfig

**Files:**
- Rewrite: `packages/wuh.site.next/tsconfig.json`

- [ ] **Step 1: Replace content**

Replace all 67 lines with:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "ES2021"],
    "jsx": "preserve",
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@wuh.site/components/*": ["../components/*"],
      "@wuh.site/shared-contracts": ["../shared-contracts/src/index.ts"],
      "@wuh.site/shared-contracts/*": ["../shared-contracts/src/*"],
      "@wuh.site/config/*": ["../config/*"],
      "@wuh.site/hooks/*": ["../hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "app/**/*", "components/**/*", "types/**/*"],
  "exclude": ["node_modules", ".next", "dist"]
}
```

Changes from current:
- `extends` base
- `include` from 17 lines of bloated duplicate paths to 4 precise entries
- `exclude` adds `.next` and `dist`
- `paths` preserved — all package references kept

- [ ] **Step 2: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add packages/wuh.site.next/tsconfig.json
git commit -m "refactor: rewrite next tsconfig with clean include, extend base"
```

---

### Task 8: Lock TypeScript to ~5.7.2

**Files:**
- Modify: `package.json` (root)
- Modify: `packages/wuh.site.nest/package.json`
- Modify: `packages/wuh.site.next/package.json`

- [ ] **Step 1: Update all three files**

In each file, change the `typescript` version from its current value to `~5.7.2`:

Root `package.json`:
```
"typescript": "~5.7.2"
```

Nest `packages/wuh.site.nest/package.json`:
```
"typescript": "~5.7.2"
```

Next `packages/wuh.site.next/package.json`:
```
"typescript": "~5.7.2"
```

- [ ] **Step 2: Reinstall**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
pnpm install
```

Expected: lockfile updated, only typescript@5.7.2 remains.

- [ ] **Step 3: Verify version**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
node -e "console.log(require('typescript/package.json').version)"
```

Expected: `5.7.2`

- [ ] **Step 4: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add package.json packages/wuh.site.nest/package.json packages/wuh.site.next/package.json pnpm-lock.yaml
git commit -m "chore: lock TypeScript to ~5.7.2"
```

---

### Task 9: Add root scripts

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Replace build/check scripts**

In root `package.json`, replace the existing `build:next` and `build:nest` scripts with:

```json
{
  "build": "pnpm -r build",
  "build:next": "pnpm --filter @wuh.site/next run build",
  "build:nest": "pnpm --filter @wuh.site/nest run build",
  "typecheck": "tsc --noEmit"
}
```

Keep the existing `build:next` and `build:nest` as individual targets in addition to the new `build` command.

- [ ] **Step 2: Commit**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add package.json
git commit -m "feat: add root build and typecheck scripts"
```

---

### Task 10: Verify — type check

**Files:** None (verification only)

- [ ] **Step 1: Run typecheck**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
pnpm typecheck
```

Expected: exit 0, no errors. If errors appear, they are pre-existing issues revealed by the more precise type checking. Fix any errors that block the check.

- [ ] **Step 2: Run nest build**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
pnpm build:nest
```

Expected: SWC compiles successfully, no tsc crash.

- [ ] **Step 3: Run next build**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
pnpm build:next
```

Expected: Next.js builds successfully.

- [ ] **Step 4: Run full build**

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
pnpm build
```

Expected: all three packages (shared-contracts, nest, next) build in correct order.

- [ ] **Step 5: Commit any fixes**

If any fixes were needed during verification:

```bash
cd /Users/wuhong/shadow-desktop/github/x.wuh.site
git add -A
git commit -m "fix: type errors revealed by new tsconfig"
```
