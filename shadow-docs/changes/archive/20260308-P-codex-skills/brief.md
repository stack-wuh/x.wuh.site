# Codex 技能定义（历史归档）

> 原始变更名：`20260308_P_codex-skills`

## 元数据
- 日期：2026-03-08
- 类型：P
- 状态：applied
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
# 设计：Codex 技能定义

## 技能结构

```
codex/skills/
├── x-wuh-components/
│   ├── SKILL.md                      # 技能主文档
│   ├── agents/openai.yaml            # Agent 配置
│   └── references/
│       └── component-library-map.md  # 组件库映射参考
├── x-wuh-fullstack/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── x-wuh-hooks/
    ├── SKILL.md
    ├── agents/openai.yaml
    └── references/
        └── hooks-api-map.md
```

## 迁移说明

- 组件库知识已整合到项目 CLAUDE.md 的"组件库清单"章节
- Hooks 知识已整合到 CLAUDE.md 的"Hooks"章节
- 全栈开发流程已被 shadow-dev-workflow skill 取代

## 依赖

- 无

## 任务
### Phase 1 — 归档
- [ ] T1: 标记 codex/skills/ 为已废弃
- [ ] T2: 确认新 skill 体系覆盖旧功能
### Phase 2 — 清理
- [ ] T3: 将相关文档记录到 openspec/changes/archive/
- [ ] T4: 后续可考虑清理 codex 目录

## 结果
- 状态：applied
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: Codex技能定义
change: codex-skills
date: 2026-03-08
type: P
status: applied
```

### `design.md`
# 设计：Codex 技能定义

## 技能结构

```
codex/skills/
├── x-wuh-components/
│   ├── SKILL.md                      # 技能主文档
│   ├── agents/openai.yaml            # Agent 配置
│   └── references/
│       └── component-library-map.md  # 组件库映射参考
├── x-wuh-fullstack/
│   ├── SKILL.md
│   └── agents/openai.yaml
└── x-wuh-hooks/
    ├── SKILL.md
    ├── agents/openai.yaml
    └── references/
        └── hooks-api-map.md
```

## 迁移说明

- 组件库知识已整合到项目 CLAUDE.md 的"组件库清单"章节
- Hooks 知识已整合到 CLAUDE.md 的"Hooks"章节
- 全栈开发流程已被 shadow-dev-workflow skill 取代

## 依赖

- 无

### `proposal.md`
# Codex 技能定义（历史归档）

## 为什么做

早期 Codex 工作流使用 3 个技能定义来引导 AI 编码：
- **x-wuh-components**: 组件库映射与使用指南
- **x-wuh-fullstack**: 全栈开发工作流
- **x-wuh-hooks**: Hooks API 映射

每个技能包含 SKILL.md 主文档、agents 配置（openai.yaml）、references 参考文档。

## 当前状态

已被新的 OpenSpec 工作流 + shadow-dev-workflow skill 体系取代。此归档仅保留历史记录。

## 技能清单

| 技能 | 路径 | 用途 |
|------|------|------|
| x-wuh-components | `codex/skills/x-wuh-components/` | 组件库映射，引导使用 @wuh.site/components |
| x-wuh-fullstack | `codex/skills/x-wuh-fullstack/` | 全栈开发流程，前后端协作 |
| x-wuh-hooks | `codex/skills/x-wuh-hooks/` | Hooks API 映射，引导使用 @wuh.site/hooks |

## 影响范围

- `codex/skills/` — 已废弃，由 shadow-dev-workflow skill 取代

### `tasks.md`
# 任务拆分

## Phase 1 — 归档

- [ ] T1: 标记 codex/skills/ 为已废弃
- [ ] T2: 确认新 skill 体系覆盖旧功能

## Phase 2 — 清理

- [ ] T3: 将相关文档记录到 openspec/changes/archive/
- [ ] T4: 后续可考虑清理 codex 目录
