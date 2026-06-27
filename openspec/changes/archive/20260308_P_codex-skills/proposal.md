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
