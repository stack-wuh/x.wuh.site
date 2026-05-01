---
name: smart-commit
description: 智能提交代码，从分支名称自动生成 conventional commit message，尊重 commitlint 规则。
---

# Smart Commit

从当前分支名称自动生成 conventional commit message，按文件类型自动分拆提交。

## 核心规则

### 禁止混交
**不同类型（type）的改动必须拆分为独立 commit，严禁一次提交包含多种 type。**

常见 type 与文件的对应关系：
- `feat` — 功能代码 (`.ts`, `.tsx`, `.js`, `.jsx`)
- `docs` — 文档 (`.md`, `openspec/`, `.claude/`, `.github/`)
- `build` — 构建配置 (`package.json`, `tsconfig.json`, `next.config.*`, `pnpm-lock.yaml`)
- `ci` — CI/CD (`.github/workflows/`)
- `style` — 样式文件 (`.css`, `.less`, `styled-components` 文件)
- `refactor` — 重构（逻辑不变，结构变化）
- `fix` — Bug 修复
- `chore` — 杂项（无法归类到以上类型的）

### 判定逻辑
1. 检查 `git diff --cached --name-only` 或 `git status` 获取所有改动文件
2. 按文件扩展名和路径将文件分组到对应的 type
3. 对每个分组，生成对应的 commit message
4. 按 type → scope → description 格式，依次创建多个 commit

## 工作流程

### Step 1: 获取分支名称
执行 `git branch --show-current` 获取当前分支名

### Step 2: 解析分支名称
分支名称格式: `<number>-<type>-<description>`

例如: `68-build-调整包的构建模式`

- `68` → 编号/scope
- `build` → commit type（分支主 type，仅用于同名文件组的 message）
- `调整包的构建模式` → 描述

### Step 3: 验证 type
commitlint 允许的 type 列表（来自 `commitlint.config.js`）:
- `build`, `feat`, `chore`, `style`, `docs`, `ui`, `fix`, `refactor`, `ci`, `test`

如果分支中的 type 不在列表中，使用 `chore` 作为默认值。

### Step 4: 分析文件并分组
检查所有改动文件，按类型分组：

```
分组规则:
  openspec/** + .claude/** + .github/prompts/** + .github/skills/** + *.md → docs
  src/**/*.ts + src/**/*.tsx + lib/**/*.ts → feat (或分支 type)
  package.json + tsconfig.json + next.config.* + pnpm-lock.yaml → build
  .github/workflows/** → ci
  *.css + *.less → style
```

### Step 5: 为每组生成 commit message
格式: `type(number): description`

- 如果文件组 type 与分支 type 相同，使用分支的完整描述
- 如果文件组 type 与分支 type 不同，使用该 type 的描述 + 分支信息

### Step 6: 逐一提交每个分组
1. 展示分组结果让用户确认
2. `git add` 仅该分组的文件
3. `git commit -m "message"` 执行提交
4. 检查下一个分组
5. 全部提交完成后展示结果

### Step 7: 验证不能有遗漏
`git status` 确认所有文件已提交，无遗漏。

## 示例

### 示例 1: docs + feat 混合
```
检测到改动:
  docs 组: openspec/, .claude/, .github/prompts/
  feat 组: packages/**/*.ts, app/**/*.tsx

→ 生成 2 个 commit:
  feat(68): OpenAPI标准化 + repos接口 + 前端API迁移
  docs(68): 接入OpenSpec规格驱动开发工作流
```

### 示例 2: 仅有代码
```
检测到改动:
  feat 组: packages/wuh.site.nest/src/**

→ 生成 1 个 commit:
  feat(68): 新增评论通知功能
```

## 注意事项
- **严禁** `git add -A` 或不加区分的一次性 add
- **严禁** 跳过 hooks（不要用 `--no-verify`）
- 如果 pre-commit hook 失败，修复问题后创建新的 commit（不要 --amend）
- 每个 commit 只包含同一 type 的文件
- 提交前展示分组结果让用户确认
- 提交完成后展示所有 commit 结果
