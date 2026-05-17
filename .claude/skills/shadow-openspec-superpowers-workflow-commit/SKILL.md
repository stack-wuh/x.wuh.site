---
name: shadow-openspec-superpowers-workflow-commit
description: 代码提交 — 将 worktree 分支的改动合入功能主分支，推送远端，可选创建 PR
---
# Commit — 代码提交

在 archive 之后，将 worktree 分支的改动合入功能主分支，推送远端。

**前置条件:** worktree 是从 GitHub Issue 对应的功能分支检出的。功能分支命名如 `{issue-number}-feat-{name}`。

## 步骤

### 1. 提交 openspec 文档

在主仓库中提交 archive 阶段产生的 openspec 文档变更（归档目录 + 合并后的 specs）。

```bash
cd <main-repo-root>
git add openspec/changes/archive/<name>/ openspec/specs/
git commit -m "docs(openspec): 归档需求文档 <name>"
```

### 2. 提交代码

在 worktree 中提交所有代码改动，遵守 conventional commits（`type(scope): description`）。

```bash
cd <worktree-path>
git add <changed-files>
git commit -m "type(scope): description"
```

### 3. 合入功能主分支

worktree 分支 → 功能主分支 → 推送远端。

```bash
# 回到主仓库，切到功能分支
cd <main-repo-root>
git checkout <base-branch>     # 功能分支，如 100-feat-blog-typography
git merge <worktree-branch>    # 合入 worktree 的改动
git push origin <base-branch>  # 推送功能分支到远端
```

### 4. 清理 worktree

合入成功后，清理 worktree 和临时分支：

```bash
git worktree remove <worktree-path>
git branch -d <worktree-branch>
git worktree prune
```

### 5. 创建 PR（可选）

```bash
gh pr create --title "<title>" --body "<description>" --base main --head <base-branch>
```

### 6. 输出

```
## 代码已提交

**功能分支:** <base-branch>
**openspec 文档:** 已提交 (archive/<name> + specs)
**代码提交:** <N> commits
**远端:** 已推送
**PR:** <url>（如创建）
```
