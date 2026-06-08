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
