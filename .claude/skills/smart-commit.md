---
name: smart-commit
description: 智能提交代码，从分支名称自动生成 conventional commit message，尊重 commitlint 规则。
---

# Smart Commit

从当前分支名称自动生成 conventional commit message，美化后提交代码。

## 工作流程

### Step 1: 获取分支名称
执行 `git branch --show-current` 获取当前分支名

### Step 2: 解析分支名称
分支名称格式: `<number>-<type>-<description>`

例如: `68-build-调整包的构建模式`

- `68` → 编号/scope
- `build` → commit type（必须在 commitlint 允许的类型中）
- `调整包的构建模式` → 描述

### Step 3: 验证 type
commitlint 允许的 type 列表（来自 `commitlint.config.js`）:
- `build`, `feat`, `chore`, `style`, `docs`, `ui`, `fix`, `refactor`, `ci`, `test`

如果分支中的 type 不在列表中，使用 `chore` 作为默认值。

### Step 4: 美化生成 commit message
格式: `type(number): description`

- type: 分支中的 type（或 chore）
- number: 分支中的编号
- description: 分支后面的描述部分（保持中文原文）

示例:
- 分支 `68-build-调整包的构建模式` → `build(68): 调整包的构建模式`
- 分支 `12-feat-新增用户登录功能` → `feat(12): 新增用户登录功能`

### Step 5: 展示 commit message 让用户确认
展示:

```
生成的 commit message:

  type(number): description

确认提交？
```

### Step 6: 提交代码
1. `git add` 相关文件（展示改动列表让用户确认）
2. `git commit -m "message"` 执行提交
3. `git status` 验证提交结果

## 注意事项
- 不要使用 `git add -A`，只添加与当前改动相关的文件
- 不要跳过 hooks（不要用 `--no-verify`）
- 如果 pre-commit hook 失败，修复问题后创建新的 commit（不要 --amend）
- 提交完成后展示结果
