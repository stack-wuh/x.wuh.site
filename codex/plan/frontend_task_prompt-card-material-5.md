# Frontend Task Prompt

> 第一阶段文档：仅用于补全需求与约束，不进入编码实现。

- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-card-material-5.md`
- **任务分级与预算 / Sizing & Budget**：`M`（假设）；预计 0.5-1 天；拆分 4 个子任务；首轮读取不超过 15 个文件或 1500 行；超预算时先输出当前结论与缺口，再申请扩展读取。
- **任务背景 / Background**：
  1. 当前分支：`5-featcomponent-基于styled-components实现card组件`，按分支规则可提取 issue-id=`5`。
  2. 仓库为 pnpm monorepo，UI 组件位于 `packages/components`。
  3. 用户目标为“基于 styled-components 实现 Card 组件，风格与 Material 类似”。
  4. 重构 `packages/components/card` 的`Card`组件
- **目标与范围 / Goals**
  - 必须完成：
    1. 在 `packages/components/card` 完成可复用 Card 组件实现，样式基于 styled-components。
    2. Card 视觉风格接近 Material（层级阴影、圆角、间距、交互态），并兼容项目主题变量。
    3. 补齐 `card` 组件 README（用法、Props、示例）。
  - 可选增强：
    1. 提供 Card 的子结构（如 Header/Content/Actions）或 `variant/elevation` 能力。
    2. 提供 hover/press 动画并适配 `prefers-reduced-motion`。
  - 不在范围：
    1. 后端 API 联调。
    2. 全新设计系统重构。
- **交互与设计 / UX**：
  1. 风格参考 Material Card：背景层级清晰、边角圆润、默认轻阴影、悬浮态阴影增强。
  2. 要求兼容 light/dark（若项目已有主题变量则优先复用）。
  3. 需保证基础可访问性（语义结构、可聚焦元素可见 focus 态）。
  4. 响应式场景下不破版（最小宽度、内边距、标题/内容换行策略需明确）。
- **技术栈约束 / Tech Stack**：
  1. React 19 + styled-components 6 + pnpm workspace。
  2. 禁止新增依赖（遵循 `CODEX_RULES.md`）。
  3. 仅修改任务范围内文件，保持向后兼容。
  4. 组件导出路径需与 `@wuh.site/components` 现有导出结构保持一致。
- **数据与接口 / Data**：
  1. 本任务为纯 UI 组件开发，不依赖新 API。
  2. 示例数据使用本地 mock 或静态内容。
- **状态与权限 / State & Auth**：
  1. Card 组件原则上无业务权限逻辑。
  2. 若包含可交互区块（如 actions），由外部传入事件回调处理。
- **可观测性 / Observability**：
  1. 暂无强制埋点需求。
  2. 若后续用于关键路径页面，可在接入层补充埋点。
- **开发步骤建议 / Execution Order**：
  1. 确认 Card API（Props、插槽结构、默认样式与变体边界）。
  2. 实现 styled-components 样式骨架（基础态/hover/focus/禁用态如适用）。
  3. 完成组件逻辑与导出接入（必要时更新聚合导出）。
  4. 编写 README 与示例，执行受影响范围验证。
- **交付物 / Deliverables**：
  1. `packages/components/card/index.tsx`
  2. `packages/components/card/readme.md`（或统一为 `README.md`，以仓库规范为准）
  3. 如需拆分样式：`packages/components/card/styles/*`
  4. 如需更新聚合导出：`packages/components/*` 中对应入口文件
- **校验标准 / Validation**：
  1. 手动验证正常/异常/边界场景（空内容、长标题、含操作区、不同宽度容器）。
  2. 样式符合 Material 风格预期且不影响现有组件。
  3. 对照 `CODEX_CHECKLIST.md` 完成范围、质量、测试、文档项勾选。
- **验证策略 / Verification Strategy**：
  1. 子任务增量验证：`TBD`（需确认当前仓库用于组件改动的最小验证命令）。
  2. 合并后模块回归：`pnpm --filter @wuh.site/next lint`（若 Card 在 next 应用有消费示例）。
  3. 最终全量验证：`TBD`（仓库暂无统一 lint/typecheck/test 脚本声明，需补充）。
  4. CI 验证要求：保持现有 PR 检查通过（具体项待补充）。
- **止损与升级 / Stop-Loss**：
  1. 同一阻塞最多重试 2 次。
  2. 达到阈值后输出：阻塞点、已尝试方案、备选方案、推荐决策。
  3. 遇到 API 兼容性或导出策略冲突时暂停实现并请求用户确认。
- **依赖与风险 / Dependencies & Risks**：
  1. Material 风格“接近”存在主观空间，需要设计基线截图或细化标准。
  2. 现有 `card` 目录为空壳，若外部已有隐式依赖，重构时需核对引用路径。
  3. 主题变量若缺失关键 token（阴影/圆角/间距），需先确认兜底策略。
- **基础库变更同步 / Skill Sync**：
  1. 本任务会改动 `packages/components/**`，完成后必须同步更新：
     - `codex/skills/x-wuh-components/SKILL.md`
     - `codex/skills/x-wuh-components/references/component-library-map.md`
  2. 若最终改动涉及 `packages/hooks/**`，还需同步：
     - `codex/skills/x-wuh-hooks/SKILL.md`
     - `codex/skills/x-wuh-hooks/references/hooks-api-map.md`
- **提交信息规范 / Commit Message**：
  1. 使用 Conventional Commits。
  2. 末尾追加 `#<issue-id>`，本分支 issue-id 预计为 `5`。
  3. 示例：`feat(card): implement styled material-like card component #5`
- **沟通约定 / Communication**：
  1. 缺失信息先列 `Pending Input`，默认值写入 `Assumptions` 并标注 `假设:`。
  2. 执行阶段输出遵循：Plan -> Patch -> Tests -> Verify Commands -> Risks & Rollback -> PR Summary。
  3. 需要超权限命令时先请求批准，不绕过审批流程。
- **执行提示 / Runbook**：
  1. 开始编码前先完成本文件 `Pending Input` 补全。
  2. 编码后按 `CODEX_CHECKLIST.md` 逐项自检并记录验证命令结果。
  3. 若出现规范冲突，以 `CODEX_RULES.md` 为最高优先级。

- **Pending Input**：
  1. Card 的 API 范围：是否必须支持 `header/content/actions/cover` 子结构？还是仅单体容器？
  2. Material 对齐基线：是否有参考链接/截图（M2/M3、阴影级别、圆角值、间距规范）？
  3. 是否需要提供交互态（hover/active/focus/selected/disabled）的完整规范？
  4. 文档产物是否需要示例页面或 Storybook，还是仅 README 即可？
  5. 最终验证命令清单请确认（当前仓库未见统一 typecheck/test 脚本）。
  6. `readme.md` 是否需要统一改名为 `README.md`（与仓库文档规范保持一致）？

- **Assumptions**：
  1. 假设：本任务仅实现组件层，不包含业务页面改造。
  2. 假设：不新增任何第三方依赖。
  3. 假设：若无额外指示，Card 默认提供基础容器能力与 Material 风格视觉。
