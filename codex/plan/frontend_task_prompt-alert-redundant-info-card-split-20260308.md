# Frontend Task Prompt — 重新设计博客详情页 Alert 冗余信息展示样式

- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-alert-redundant-info-card-split-20260308.md`
- **任务分级与预算 / Sizing & Budget**：`S` 级任务；预计 0.5 天；拆分 3 个子任务；首轮读取不超过 15 个文件或 1500 行；超预算时先输出缺口与扩展理由。
- **任务背景 / Background**：
  1. 当前分支：`28-feat-优化需求-重新设计博客详情页alert区域`，issue-id 可提取为 `28`。
  2. 博客详情页冗余信息区域当前由 Alert + 页面样式承载，需要进一步重排结构并强化信息分组可读性。
  3. 任务来源：你要求“独立 Card 包裹元信息；独立 Card 包裹 SharedLinkGroup”，并且元信息字段“不许换行”。
  4. 必须遵守 `CODEX_RULES.md`：不新增依赖、仅改任务范围、输出顺序与验证门禁。
- **目标与范围 / Goals**
  - 必须完成：
    1. 在博客详情页中，将以下字段集中到一个独立 `Card` 组件内展示：更新时间、原文链接、所属项目、开源许可、所属标签。
    2. 上述字段展示必须保持单行（不换行）。
    3. `SharedLinkGroup` 必须放入另一个独立 `Card` 组件，不与元信息混排。
    4. 保持现有数据来源与页面主流程不变（仅调整展示结构和样式）。
    5. 更新时间展示改为: 由`github.userName`于`yyyy-MM-dd HH:MM:SS`更新
    6. 原文链接展示改为: github中issues的链接，但是去掉github的域名, 防止原文链接过长
    7. 这5个字段都改为: `label`: `value`结构, 在`label`前都需要添加一个Icon, 鼠标移上去时, Icon绕中心渲染360度
  - 可选增强：
    1. 单行超长文本采用省略号与 `title` 提示，提升可读性。
    2. 卡片间距和边框层级与当前页面 `Card` 视觉语言统一。
  - 不在范围：
    1. 后端数据结构变更。
    2. 文章正文、目录、评论等非冗余信息区域改造。
    3. 新增第三方依赖或引入新 UI 库。
- **交互与设计 / UX**：
  - 冗余信息区分为“两张卡片”：`Meta Card` 与 `Share Card`。
  - `Meta Card` 内字段必须单行显示；超长内容需可识别（策略见 Pending Input）。
  - 布局需兼容桌面与移动端，不出现布局错位。
- **技术栈约束 / Tech Stack**：
  - Next.js 15 + React 19 + TypeScript + styled-components。
  - 复用现有 `@wuh.site/components/card` 与现有 Alert/ShareLinkGroup 能力。
  - 禁止新增依赖；保持向后兼容。
- **数据与接口 / Data**：
  - 输入：`PostView` 现有 issue 派生字段（更新时间、源链接、项目链接、许可文案、labels、share items）。
  - 输出：页面冗余信息区域渲染为“双卡片结构”。
  - 错误/异常：字段缺失时安全降级（该项隐藏或显示兜底），不得产生运行时异常。
- **状态与权限 / State & Auth**：
  - 纯展示逻辑调整，不引入新全局状态；无权限差异。
- **可观测性 / Observability**：
  - 暂无新增埋点要求。
- **开发步骤建议 / Execution Order**：
  1. 调整 `PostView` 结构：拆分 `Meta Card` 与 `Share Card`。
  2. 调整样式：保证元信息字段单行不换行，处理移动端显示策略。
  3. 回归验证：博客详情页主链路、链接点击、分享区域显示。
- **交付物 / Deliverables**：
  - 预期代码文件：
    - `packages/wuh.site.next/app/post/PostView.tsx`
    - `packages/wuh.site.next/app/post/styles/index.ts`
    - `packages/components/alert/index.tsx`（若需要仅展示元信息并裁剪头部）
    - `packages/components/alert/styles/index.tsx`（若需要实现单行约束）
    - `packages/components/alert/readme.md`（若组件 API 变化）
  - 计划文档：
    - `codex/plan/frontend_task_prompt-alert-redundant-info-card-split-20260308.md`
- **校验标准 / Validation**：
  - 功能验收：
    1. 元信息字段位于独立 Card，SharedLinkGroup 位于独立 Card。
    2. 元信息字段无换行（桌面/移动端均成立）。
    3. 原文链接、项目链接、标签跳转能力不回归。
  - 测试验收：
    1. 正常：完整数据下全部字段展示正确。
    2. 异常：部分字段缺失时页面可正常渲染。
    3. 边界：超长链接/项目名/标签时仍满足单行策略。
  - 文档验收：
    1. 若改动 Alert 对外 API，需同步 README。
- **验证策略 / Verification Strategy**：
  - 子任务增量验证命令（必填）：`pnpm --filter @wuh.site/next lint`
  - 合并后模块回归命令（`M/L` 必填）：`pnpm --filter @wuh.site/next lint` + 博客详情页手动回归
  - 最终全量验证命令（必填）：`TBD（是否要求 workspace 全量 lint/typecheck/test）`
  - CI 验证要求（如适用）：沿用现有 PR checks。
- **止损与升级 / Stop-Loss**：
  - 同一阻塞最大重试次数：2
  - 达到阈值后的升级动作：输出阻塞点、尝试记录、备选方案，等待你确认。
  - 需要用户决策的问题：超长文本单行策略与移动端显示优先级。
- **依赖与风险 / Dependencies & Risks**：
  - “不许换行”在极窄屏下可能导致信息截断，需要明确是省略号还是横向滚动。
  - 若标签数量过多，单行策略可能影响可点击性，需要明确优先级（可读性 vs 可点击完整性）。
- **基础库变更同步 / Skill Sync**：
  - 若改动 `packages/components/**`，必须同步更新：
    - `codex/skills/x-wuh-components/SKILL.md`
    - `codex/skills/x-wuh-components/references/component-library-map.md`
  - 若改动 `packages/hooks/**`，必须同步更新：
    - `codex/skills/x-wuh-hooks/SKILL.md`
    - `codex/skills/x-wuh-hooks/references/hooks-api-map.md`
- **提交信息规范 / Commit Message**：
  - 必须使用 Conventional Commits + 末尾 issue-id。
  - 本分支 issue-id 为 `28`，示例：`refactor(post): split redundant info into meta/share cards #28`
- **沟通约定 / Communication**：
  - 缺信息先列 `Pending Input` 与 `Assumptions`，确认后再编码。
  - 最终交付遵循 `CODEX_RULES.md` 输出顺序：Plan -> Patch -> Tests -> Verify Commands -> Risks & Rollback -> PR Summary。
- **执行提示 / Runbook**：
  - 优先最小改动达成双卡片拆分与单行约束，再处理视觉细节优化。
  - 每次样式调整后做移动端和长文本回归，避免“单行”策略引入可用性退化。

- **Pending Input**：
  1. “不许换行”对超长文本的期望策略是：`省略号`、`横向滚动`、还是 `缩小字号`？
  2. 标签区域是否要求“所有标签都必须可见且可点击”，还是允许部分截断？
  3. `SharedLinkGroup` 独立 Card 的标题/说明文案是否需要展示，还是仅展示分享按钮组？
  4. 是否要求在本任务执行 workspace 全量验证（`lint/typecheck/test`）？

- **Assumptions**：
  - 假设：元信息字段单行通过 `white-space: nowrap + text-overflow: ellipsis` 实现。
  - 假设：`Meta Card` 与 `Share Card` 都放在正文下方、原冗余信息区域位置。
  - 假设：保持现有数据映射逻辑不变，仅调整展示容器与样式。
