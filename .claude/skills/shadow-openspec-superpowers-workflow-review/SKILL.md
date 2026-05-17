---
name: shadow-openspec-superpowers-workflow-review
description: 代码审查 + 需求验收 — apply 完成后的质量门禁，合并代码审查、需求验收和代码质量检查
---
# Review — 代码审查 + 需求验收

apply 完成后的质量门禁，合并代码审查、需求验收和代码质量检查。

**触发条件:**
- apply 完成后自动提示进入 review
- 用户主动说 "代码审查" / "review" / "验收"

## 步骤 0: 自检验证（verification 门禁）

调用 `Skill("superpowers:verification-before-completion")`：
- 运行 Lint、类型检查、测试
- 全部通过才进入正式审查
- 不通过 → 回去修，修完重新自检

**铁律:** 绝不声称完成而未通过 verification。

## 审查维度 (7 项)

### 1. 任务完成度
- tasks.md: 所有 checkbox 是否 `[x]`
- 是否有未完成的遗留任务

### 2. 需求覆盖
- 按 specs 中每个 Requirement 的 GIVEN/WHEN/THEN 检查代码是否覆盖
- 接口路径和响应格式是否匹配 spec

### 3. 设计一致性
- 实现是否匹配 `design.md` 的技术方案
- 模块划分是否符合设计

### 4. ESLint / 代码风格
- 运行 ESLint 检查所有改动文件
  ```bash
  pnpm exec eslint <changed-files> --format stylish 2>&1
  ```
- **error**: 阻塞项，必须修复
- **warning**: 生成 checklist 交给用户决定
- 不在 review 中自动 fix

### 5. 代码质量
- 重复代码、过长函数（>50行）、过深嵌套（>3层）
- 命名是否清晰；有无不必要的抽象
- 错误处理是否完整

### 6. 安全性
- 输入校验、注入风险、敏感信息泄露、权限控制

### 7. 性能 + 变更范围
- N+1 查询、缺失索引、阻塞操作、是否缺分页
- 是否有超出 proposal 范围的改动

## 审查方式

1. 读取变更制品: `proposal.md`, `design.md`, `tasks.md`, `specs/`
2. `git diff --name-only` 获取改动文件
3. 运行 ESLint 检查改动文件
4. 逐一读取改动文件，对照 7 个维度审查

## 审查报告模板

```
## 代码审查: <name>

### 任务完成度: 6/6 ✓

### 需求覆盖
- content-api: ✓ 分页格式 / ✓ 404处理 / ✓ 查询校验
- repos-api: ✓ GitHub接口 / ✓ 缓存策略

### 设计一致性 ✓

### ESLint
- ✗ error (1): src/app.service.ts:15 — no-unused-vars
- ⚠ warning (3): 见 checklist

### 代码质量
- ⚠ content.service.ts:42 — findAll 方法 60 行，建议拆分

### 安全性 ✓

### 性能 + 变更范围 ✓

### 审查结论: ✗ 阻塞

阻塞项 (必须修复):
1. [ ] ESLint error: src/app.service.ts:15 no-unused-vars

建议项 (用户决定):
2. [ ] content.service.ts findAll 拆分查询逻辑

ESLint Warning Checklist (用户决定):
3. [ ] src/main.ts:12 — prefer-const
4. [ ] src/repos.service.ts:25 — @typescript-eslint/no-explicit-any
5. [ ] src/content.controller.ts:30 — max-lines-per-function
```

## 审查结果分级 + 回环

| 结果 | 含义 | 动作 |
|------|------|------|
| ✓ 通过 | 无阻塞项 | → 执行 "归档" |
| ⚠ 建议 | 有建议无阻塞 | 用户决定: 修复→归档 / 直接归档 |
| ✗ 阻塞 | 有必须修复的问题 | → 回到 apply 修复阻塞项 → 重新审查 |

**✗ 阻塞回环流程:**
1. 列出阻塞项清单
2. 用户确认后回到 apply 子流程
3. apply 只执行阻塞项修复 task
4. 修复完成后自动触发重新审查
5. 直到 ✓ 或 ⚠（用户决定停止）

## 步骤 6: 代码简化

审查通过后，调用 `Skill("simplify")` 检查：冗余代码、可简化的逻辑、不必要的抽象。

## 步骤 7: 处理审查反馈

收到审查意见时，调用 `Skill("superpowers:receiving-code-review")` 逐条严谨分析，而非盲目同意或拒绝。修改后重新跑 verification。
