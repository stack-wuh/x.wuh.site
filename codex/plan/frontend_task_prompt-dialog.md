# Frontend Task Prompt

- **任务背景 / Background**：
  1. 本仓库是基于 pnpm 的多包结构，`packages/components` 存放复用组件
  2. `packages/wuh.site.next` 是 Next.js 15 应用入口。
  3. 实现功能示例: 实现公共组件Dialog, 模仿ant-design风格的Dialog实现
  4. Dialog样式主题需要使用`packages/components/themes` 现有方案。
  5. 在`packages/hooks`中实现`useDialog`

- **目标与范围 / Goals**
  - 必须完成：
    1. 在 `packages/components/`目录中生成`Dialog`组件
    2. 写好README文档

  - 可选增强：
    1. 暂无
  - 不在范围：
    1. 暂无

- **交互与设计 / UX**：
  1. Dialog打开时，不需要遮罩层，但是Dialog下层的元素不能点击
  2. Dialog支持全屏

- **技术栈约束 / Tech Stack**
  1. Next.js 15 + React 19 + styled-components + pnpm workspace；
  2. 组件通过 `@wuh.site/components` 导出；禁止引入新依赖（参考 `CODEX_RULES.md`）
  3. CSS 变量与主题逻辑沿用 `packages/components/themes` 现有方案。

- **数据与接口 / Data**：
  1. 暂无

- **状态与权限 / State & Auth**：
  1. 暂无

- **可观测性 / Observability**
  1. 暂无

- **开发步骤建议 / Execution Order**
  - 在组件包`packages/components`中新增`Dialog`目录
  - 查询`ant-design`组件库中`Dialog`组件的代码
  - 开始仿写Dialog组件
  - 新增README.md文件, 便于后期使用
  - 在`packages/hooks`中新增`useDialog`钩子

- **交付物 / Deliverables**
  - `packages/components/**/index.tsx`（或子目录）

- **校验标准 / Validation**
  - 手动在浏览器中确认标签颜色、hover 效果、响应式换行、light/dark；
  - 运行 `pnpm --filter @wuh.site/next lint`（若需 typecheck/test，请确认脚本后补充）；
  - 对照 `CODEX_CHECKLIST.md` 勾选范围、质量、测试项。

- **依赖与风险 / Dependencies & Risks**
  - 组件 hover 动画需考虑 reduced-motion;
  - lint 可能受遗留 `dist` 目录影响，必要时先清理。

- **沟通约定 / Communication**：
  - 实施过程中若缺失信息，先列出 `缺失信息` 与 `假设`（遵循 `CODEX_RULES.md` 第4条）；
  - 响应需严格遵循 Plan→Patch→Tests→Verify→Risks & Rollback→PR Summary 顺序；
  - 必要时引用 `frontend-prompt-template` skill 以维持模板一致性。

- **执行提示 / Runbook**：
  - 实现前先将 `CODEX_TASK_TEMPLATE.md` 字段映射到具体实现，提交前按 `CODEX_CHECKLIST.md` 自检；
  - 如需拓展 *** 组件给其他模块，请在 PR 中说明影响并附回滚策略。

- **Pending Input**：
  - 暂无

- **Assumptions**：
  - 假设: 当前无需新增自动化测试脚本，lint 通过即可，如需其它验证用户会在 Pending Input 中补充。
