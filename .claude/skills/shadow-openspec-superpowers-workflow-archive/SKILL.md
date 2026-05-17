---
name: shadow-openspec-superpowers-workflow-archive
description: 文档归档 — 将 openspec 变更文档移到 archive/，同步 specs 到主规范。纯文档管理，不涉及 git 操作
---
# Archive — 文档归档

将 openspec 变更文档移到 archive/，同步 specs 到主规范。**纯文档管理，不涉及 git 操作。**

## 步骤

### 1. 确认归档条件

审查结果必须为 ✓ 或用户对 ⚠ 明确决定归档。

### 2. 迁移 change 目录

```bash
mv openspec/changes/<name> openspec/changes/archive/<name>
```

### 3. 同步 specs

将 `openspec/changes/archive/<name>/specs/` 中的增量规格合并到 `openspec/specs/<domain>/`：
- `## ADDED` → 追加到对应 spec 文件
- `## MODIFIED` → 替换对应 Requirement
- `## REMOVED` → 删除对应 Requirement

### 4. 验证归档结果

```bash
ls openspec/changes/archive/<name>/
```

**输出:**

```
## 文档已归档

**变更:** <name>
**归档位置:** openspec/changes/archive/<name>/
**合并的 Specs:** <domain>
**下一步:** 建议执行 '提交' (commit/PR)
```
