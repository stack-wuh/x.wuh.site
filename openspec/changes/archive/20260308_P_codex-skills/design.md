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
