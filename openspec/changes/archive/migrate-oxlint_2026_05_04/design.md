# 设计：Oxlint 配置

## 配置文件

`.oxlintrc.json` — oxlint 原生 JSON 配置，无需 TypeScript 编译即可使用。

## 规则设置

### 基础设置
- `categories.correctness: "warn"` — 正确性规则默认 warn
- `plugins: ["import", "typescript", "unicorn", "react"]`
- `env.browser: true`
- `settings.react.version: "19.0.0"`

### Ignore
- `.next/**`, `out/**`, `build/**`, `dist/**`
- `next-env.d.ts`
- 设计 playground: `app/design/system-color/**`

## 脚本

```json
{
  "lint": "oxlint app --ignore-pattern 'dist/**' --ignore-pattern '.next/**'",
  "lint:fix": "oxlint app --fix --ignore-pattern 'dist/**' --ignore-pattern '.next/**'"
}
```

## 迁移映射

| ESLint (next/core-web-vitals) | Oxlint 覆盖 |
|------|------|
| eslint-plugin-react-hooks | ✅ react 插件内置 |
| @next/next rules | ❌ 不覆盖（非关键） |
| @typescript-eslint | ✅ typescript 插件 |

根 package.json 移除 `eslint: ^8` 和 `eslint-config-next: 15.0.4`（未使用）。
