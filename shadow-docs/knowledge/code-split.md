---
keywords: [代码拆分, About页, page.tsx, 文件职责, TypeScript, 行数约束]
---

# About 页面代码拆分

About 页面 `page.tsx` 控制在 80 行以内，每个文件职责单一。拆分后功能与拆分前完全一致，无回归，TypeScript 类型检查通过。新增文件应遵循单一职责原则，避免将多个无关逻辑放在同一文件中。
