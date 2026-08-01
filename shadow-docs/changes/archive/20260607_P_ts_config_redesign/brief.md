# TypeScript 配置体系重新设计

> 原始变更名：`20260607_P_ts_config_redesign`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
monorepo 中 `tsc`/`nest build` 间歇性 segfault（TypeScript 5.9.3 on macOS + Node 20），根 tsconfig 使用 `**/*.ts` 全局通配导致编译扫描范围失控，各包 tsconfig 缺少 include/exclude 定义。

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计文档

## tsconfig 架构

```
tsconfig.base.json          # 共享 compilerOptions
├── tsconfig.json           # root，pnpm typecheck 入口，noEmit
├── packages/shared-contracts/
│   └── tsconfig.json       # extends base，emitDeclarationOnly
├── packages/wuh.site.nest/
│   └── tsconfig.json       # extends base，noEmit + decorators
└── packages/wuh.site.next/
    └── tsconfig.json       # extends base，noEmit + jsx
```

## tsconfig.base.json（新建）

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

## tsconfig.json（root，typecheck 入口）

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

不再使用全局通配 `**/*.ts`，只扫描 packages 的 src 目录。

## packages/shared-contracts/tsconfig.json

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

删除 `tsconfig.build.json`，统一为一个 tsconfig。`emitDeclarationOnly` 不会与继承选项冲突（base 中未设 noEmit）。

## packages/wuh.site.nest/tsconfig.json

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

关键变更：
- 新增 `include`/`exclude`，不扫描 dist 和 node_modules
- `baseUrl` 从 `./` → `./src`，`@/` 路径映射更精确
- `noEmit: true`，swc 负责转译

## packages/wuh.site.next/tsconfig.json

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
      "@wuh.site/config/*": ["../config/*"],
      "@wuh.site/hooks/*": ["../hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "app/**/*", "components/**/*", "types/**/*"],
  "exclude": ["node_modules", ".next", "dist"]
}
```

关键变更：
- `include` 从 17 行臃肿列表精简为 4 项精确路径
- paths 中已有的包引用保持不变

## 构建体系

### root package.json scripts

```json
{
  "build": "pnpm -r build",
  "typecheck": "tsc --noEmit"
}
```

### nest-cli.json

```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": false
  }
}
```

SWC 转译保留，类型检查关闭（由 `pnpm typecheck` 负责）。

### TypeScript 版本

所有包统一 `~5.7.2`，避开 5.9.3 segfault。shared-contracts 通过 workspace 共享，无需直接声明。

## 构建顺序

`pnpm -r build` 按 workspace 依赖关系排序，shared-contracts → nest。但 root `typecheck` 引用的是源文件 `packages/*/src/**/*.ts`，直接通过 paths 解析，不需要先 build。

## 任务
- [ ] 历史任务清单未提供

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: ts-config-redesign
change: ts-config-redesign
date: 2026-06-07
type: P
status: archived
```

### `design.md`
# 设计文档

## tsconfig 架构

```
tsconfig.base.json          # 共享 compilerOptions
├── tsconfig.json           # root，pnpm typecheck 入口，noEmit
├── packages/shared-contracts/
│   └── tsconfig.json       # extends base，emitDeclarationOnly
├── packages/wuh.site.nest/
│   └── tsconfig.json       # extends base，noEmit + decorators
└── packages/wuh.site.next/
    └── tsconfig.json       # extends base，noEmit + jsx
```

## tsconfig.base.json（新建）

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

## tsconfig.json（root，typecheck 入口）

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

不再使用全局通配 `**/*.ts`，只扫描 packages 的 src 目录。

## packages/shared-contracts/tsconfig.json

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

删除 `tsconfig.build.json`，统一为一个 tsconfig。`emitDeclarationOnly` 不会与继承选项冲突（base 中未设 noEmit）。

## packages/wuh.site.nest/tsconfig.json

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

关键变更：
- 新增 `include`/`exclude`，不扫描 dist 和 node_modules
- `baseUrl` 从 `./` → `./src`，`@/` 路径映射更精确
- `noEmit: true`，swc 负责转译

## packages/wuh.site.next/tsconfig.json

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
      "@wuh.site/config/*": ["../config/*"],
      "@wuh.site/hooks/*": ["../hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "app/**/*", "components/**/*", "types/**/*"],
  "exclude": ["node_modules", ".next", "dist"]
}
```

关键变更：
- `include` 从 17 行臃肿列表精简为 4 项精确路径
- paths 中已有的包引用保持不变

## 构建体系

### root package.json scripts

```json
{
  "build": "pnpm -r build",
  "typecheck": "tsc --noEmit"
}
```

### nest-cli.json

```json
{
  "compilerOptions": {
    "builder": "swc",
    "typeCheck": false
  }
}
```

SWC 转译保留，类型检查关闭（由 `pnpm typecheck` 负责）。

### TypeScript 版本

所有包统一 `~5.7.2`，避开 5.9.3 segfault。shared-contracts 通过 workspace 共享，无需直接声明。

## 构建顺序

`pnpm -r build` 按 workspace 依赖关系排序，shared-contracts → nest。但 root `typecheck` 引用的是源文件 `packages/*/src/**/*.ts`，直接通过 paths 解析，不需要先 build。

### `proposal.md`
# TypeScript 配置体系重新设计

## 背景

monorepo 中 `tsc`/`nest build` 间歇性 segfault（TypeScript 5.9.3 on macOS + Node 20），根 tsconfig 使用 `**/*.ts` 全局通配导致编译扫描范围失控，各包 tsconfig 缺少 include/exclude 定义。

## 目标

- 消除 tsc segfault，构建稳定通过
- 构建与类型检查分离：`pnpm build` 纯转译，`pnpm typecheck` 全量检查
- tsconfig 层级清晰：base → root → packages
- 统一 TypeScript 版本，消除版本混杂

## 方案

方案 A — 分层 tsconfig + 分离构建/检查：

- `pnpm build` = 纯转译（SWC / Next.js），不跑 tsc
- `pnpm typecheck` = 全量 `tsc --noEmit`，CI 跑，本地可选
- TypeScript 锁定 `~5.7.2`

## 范围

- `tsconfig.base.json`（新建）
- `tsconfig.json`（root，重写）
- `packages/shared-contracts/tsconfig.json`（重写，合并 tsconfig.build.json）
- `packages/wuh.site.nest/tsconfig.json`（重写）
- `packages/wuh.site.next/tsconfig.json`（重写）
- `packages/wuh.site.nest/nest-cli.json`（typeCheck: false）
- root `package.json`（scripts）

## 风险

- shared-contracts 须在 nest 之前构建（nest 依赖 .d.ts）
- TypeScript 降级到 5.7.2 需确认无 breaking change

### `tasks.md`
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
