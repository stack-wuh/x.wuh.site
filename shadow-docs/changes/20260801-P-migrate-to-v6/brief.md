# 从 OpenSpec/Superpowers 迁移到 shadow-dev-workflow v6

> Issue: 无（内部工具迁移）

## 动机

完全移除对外部工作流插件 Superpowers 和 OpenSpec 的依赖，建立自包含的三层知识库驱动的开发工作流。

## 引用规范

- norms/tdd-verification.md: TDD 与验证铁律保持不变
- norms/code-style.md: 代码风格约定保持不变
- norms/ui-patterns.md: UI 约束适用于后续前端变更
- 项目 knowledge/: 30 个领域知识片段覆盖所有已知规范

## 决策

- **选型**: 完全自包含——shadow-dev-workflow v6 仓库提供 5 个 skill + 5 个通用规范，本项目用 shadow-docs/knowledge/ 存放 30 个领域知识
- **对比方案**: 保留 OpenSpec 结构但去掉外部依赖（仍然复杂，5 个制品文件 vs 1 个 brief.md）
- **对比方案**: 完全无结构全靠 rules（没有知识沉淀，跨会话无法恢复上下文）
- **理由**: 3 年使用 OpenSpec + Superpowers 积累的经验表明 5 个制品太重，真正有价值的是规范约束和决策论据。用 brief.md 单文件 + 知识库分层替代。

## 任务

### Phase 1（shadow-dev-workflow 仓库，可并行）

- [x] task 1 — `skills/shadow-dev-propose/SKILL.md` — 需求对齐 + 方案设计 skill
- [x] task 2 — `skills/shadow-dev-apply/SKILL.md` — 代码执行 skill
- [x] task 3 — `skills/shadow-dev-review/SKILL.md` — 质量门禁 skill
- [x] task 4 — `skills/shadow-dev-ship/SKILL.md` — 归档 + 提交 skill
- [x] task 5 — `skills/shadow-dev-knowledge/SKILL.md` — 知识库查询 skill
- [x] task 6 — `norms/` — 5 个跨项目通用规范 + menu.md 路由表

### Phase 2（项目迁移，可并行）

- [x] task 7 — `shadow-docs/knowledge/` — 30 个知识片段从 openspec/specs/ 转化
- [x] task 8 — `shadow-docs/menu.md` — 项目路由表
- [x] task 9 — `shadow-docs/INDEX.md` — 变更索引

### Phase 3（清理）

- [x] task 10 — `openspec/` — 完全删除（123 归档 + 32 spec）
- [x] task 11 — `docs/superpowers/` — 完全删除
- [x] task 12 — `.github/workflows/openspec-archive.yml` — 删除旧 CI
- [x] task 13 — `CLAUDE.md`, `CONTRIBUTING.md`, `.claude/CLAUDE.md` — 更新引用

## 结果

- 实际耗时: ~3h（跨 2 个仓库）
- 验证: 删除 31156 行旧代码，新增 408 行
