# OpenSpec Workflow

## ADDED: 5 环节中文工作流

### Requirement: propose — 创建新需求
- **GIVEN** 用户描述新功能或修复需求
- **WHEN** 用户说 "新需求" / "propose"
- **THEN** 自动创建变更目录，生成 proposal.md + design.md + tasks.md + specs/
- **AND** 所有文档使用中文，关键字保留英文

### Requirement: discuss — 需求讨论
- **GIVEN** 已有 OpenSpec change
- **WHEN** 用户说 "需求讨论" / "discuss" / "explore"
- **THEN** 进入只讨论模式，读取代码/搜索调研，不写代码
- **AND** 按需求/架构方向自适应深度

### Requirement: apply — 开始执行
- **GIVEN** proposal + design + tasks 已明确
- **WHEN** 用户说 "开始执行" / "apply"
- **THEN** 按 tasks.md 顺序执行，同 Phase 无依赖 task 并行 Agent
- **AND** 每个 task 显示预估耗时和实际耗时
- **AND** 失败 task 不阻塞独立 task

### Requirement: review — 代码审查
- **GIVEN** apply 所有 task 已完成
- **WHEN** 用户说 "代码审查" / "review"
- **THEN** 执行 7 维度审查: 任务完成度/需求覆盖/设计一致性/ESLint/代码质量/安全性/性能
- **AND** ESLint error → 阻塞；warning → 用户决定
- **AND** 审查不通过 → 自动回环到 apply 修复阻塞项

### Requirement: archive — 归档
- **GIVEN** review 通过或用户决定归档
- **WHEN** 用户说 "归档" / "archive"
- **THEN** 变更目录移入 `openspec/changes/archive/`
- **AND** specs 合并到 `openspec/specs/`

## MODIFIED: 工作流精简

### Requirement: 7 步 → 5 步
- **GIVEN** 原始 7 步工作流 (init → research → plan → implement → test → review → done)
- **WHEN** 工作流触发
- **THEN** 精简为 5 步 (propose → discuss → apply → review → archive)
- **AND** test 合并入 review 环节

## MODIFIED: Skill 架构

### Requirement: 单一 Skill 入口
- **GIVEN** 多个独立 openspec 命令 Skill
- **WHEN** 用户调用任意 openspec 命令
- **THEN** 通过单一 `openspec-cn` Skill 路由到对应子流程
- **AND** 自然语言意图识别自动匹配
