# TypeScript 配置体系重新设计

## 目标

解决 monorepo 中 `tsc`/`nest build` 间歇性 segfault、编译扫描范围失控、TypeScript 版本混杂的问题。

## 方案概述

方案 A — 分层 tsconfig + 分离构建/检查：

- `pnpm build` = 纯转译（SWC / Next.js），不跑 tsc，快
- `pnpm typecheck` = 全量 `tsc --noEmit`，CI 跑，本地可选
- 开发时依赖编辑器 LSP 实时报错
- TypeScript 锁定 `~5.7.2`，避开 5.9.3 segfault

## tsconfig 架构

```
tsconfig.base.json          # 共享 compilerOptions
├── tsconfig.json           # root，pnpm typecheck 用，noEmit
├── packages/shared-contracts/
│   └── tsconfig.json       # extends base，emitDeclarationOnly
├── packages/wuh.site.nest/
│   └── tsconfig.json       # extends base，noEmit + decorators
└── packages/wuh.site.next/
    └── tsconfig.json       # extends base，noEmit + jsx
```

### tsconfig.base.json（新建）

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

### tsconfig.json（root，typecheck 入口）

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

### packages/shared-contracts/tsconfig.json

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

删除 `tsconfig.build.json`，统一为一个 tsconfig。

### packages/wuh.site.nest/tsconfig.json

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

### packages/wuh.site.next/tsconfig.json

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

## 构建体系

### root package.json scripts

```json
{
  "build": "pnpm -r build",
  "typecheck": "tsc --noEmit"
}
```

### nest 变更

- `nest-cli.json`: `typeCheck` 从 `true` 改为 `false`（SWC 转译保留）
- `package.json`: `typescript` 从 `^5.3.3` 改为 `~5.7.2`

### TypeScript 版本

所有包统一锁定 `~5.7.2`，避开 5.9.3 的间歇性 segfault。shared-contracts 无需直接声明 typescript 依赖，通过 workspace 共享。

## 迁移步骤

1. 降级 TypeScript → `pnpm install`
2. 创建 `tsconfig.base.json`
3. 重写各 tsconfig（root + 3 个包）
4. 修改 nest `nest-cli.json`
5. 更新 root `package.json` scripts
6. 验证：`pnpm typecheck` + `pnpm build`
