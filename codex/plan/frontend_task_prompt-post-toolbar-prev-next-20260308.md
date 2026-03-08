- **计划文档 / Plan Doc**：`codex/plan/frontend_task_prompt-post-toolbar-prev-next-20260308.md`
- **任务分级与预算 / Sizing & Budget**：`S` 级任务；预计 0.5 天；拆分 3 个子任务；首轮读取不超过 15 个文件或 1500 行；超预算时先输出差距与理由，再扩展读取范围。
- **任务背景 / Background**：当前分支 `30-featpostview-完成博客详情页底部toolbar逻辑`；目标是调整博客详情页底部 `Toolbar` 交互，替换现有“返回首页 / 在 GitHub 查看”两个入口。当前主实现位于 `packages/wuh.site.next/app/post/PostView.tsx`，样式位于 `packages/wuh.site.next/app/post/styles/index.ts`。需遵守 `CODEX_RULES.md`（输出顺序、禁止新增依赖、增量验证与最终验证）。
- **目标与范围 / Goals**
  - 必须完成：
    1. 删除底部 Toolbar 的“返回首页”“在 GitHub 查看”按钮。
    2. 保持单行双按钮且左右两端对齐的布局不变。
    3. 左侧按钮改为`prevIcon` + `上一条issue的标题`，右侧按钮改为`nextIcon` + `下一条issue的标题`。
    4. 当上一条或下一条不存在时，对应按钮不可点击，且按钮文案显示“空空如也”。
    5. 单行展示，超出显示省略号
  - 可选增强：
    1. 禁用态补充 `aria-disabled` 与视觉弱化样式（如透明度/禁止光标）以提升可访问性。
  - 不在范围：
    1. 调整文章正文、分享区、冗余信息卡片逻辑。
    2. 新增后端服务或引入第三方依赖。
- **交互与设计 / UX**：沿用现有 `Toolbar` 行布局（`display: flex; justify-content: space-between`）；左右按钮语义分别对应“上一条 / 下一条”；不可用态显示“空空如也”且不可触发导航；桌面与移动端均保持同一行两端分布。
- **技术栈约束 / Tech Stack**：Next.js App Router + React 19 + TypeScript + styled-components；只在 `packages/wuh.site.next` 范围改动；禁止新增依赖；保持现有路由结构（`/post/[number]`）兼容。
- **数据与接口 / Data**：现有详情页仅拉取单条 issue（`/repos/stack-wuh/blog/issues/{number}`）；需补充“上一条/下一条”定位所需的数据来源与排序规则（可基于 issue number 或 created_at）；保持 GitHub API 契约兼容，不改公共 API 响应字段。
- **状态与权限 / State & Auth**：无新增鉴权需求；仅增加当前详情页内的邻接导航状态（上一条/下一条可用性）。
- **可观测性 / Observability**：暂无埋点强制要求；如增加日志，仅允许开发期调试日志，不引入生产噪音。
- **开发步骤建议 / Execution Order**：
  1. 明确上一条/下一条计算规则与数据来源（服务端拼装或客户端计算）。
  2. 在数据层补齐 `prevIssue/nextIssue`（或等价字段）并传递给 `PostView`。
  3. 重构 `PostView` 底部 Toolbar：替换按钮文案、跳转目标、禁用态与空文案。
  4. 完成手动回归与 lint 校验。
- **交付物 / Deliverables**：
  1. `packages/wuh.site.next/app/post/PostView.tsx`
  2. `packages/wuh.site.next/app/post/PostView.types.ts`（如需扩展 props/类型）
  3. `packages/wuh.site.next/app/post/[number]/page.tsx`（如需补齐邻接数据）
  4. `packages/wuh.site.next/app/post/styles/index.ts`（如需禁用态样式）
- **校验标准 / Validation**：
  1. 功能：可用时左右按钮分别跳转到上一条/下一条详情；不可用时按钮不可点击且文案为“空空如也”。
  2. UI：Toolbar 保持单行两端对齐；无布局回归。
  3. 兼容：详情页正常渲染，不影响原有正文、分享、冗余信息区块。
  4. 质量：`lint` 通过；若无自动化测试新增，需提供正常/异常/边界的手动回归步骤。
- **验证策略 / Verification Strategy**：
  - 子任务增量验证：`pnpm --filter @wuh.site/next run lint -- app/post/PostView.tsx app/post/[number]/page.tsx`（若命令不支持文件参数则退化为全量包内 lint）。
  - 合并后模块回归：`pnpm --filter @wuh.site/next run lint`
  - 最终全量验证：`pnpm --filter @wuh.site/next run lint`（`typecheck/test` 命令待确认）
  - CI 要求：沿用仓库现有 PR checks。
- **止损与升级 / Stop-Loss**：同一阻塞最多重试 2 次；若 GitHub API 方案或排序规则不明确，输出候选方案与影响，等待用户拍板后再继续；若 lint 基线问题来自历史代码，记录并隔离说明。
- **依赖与风险 / Dependencies & Risks**：
  1. 主要风险：上一条/下一条定义不清（按编号、按时间、是否含 closed issue）会导致行为偏差。
  2. 外部依赖：GitHub API 速率限制与分页策略可能影响邻接查询。
  3. 回滚策略：保留变更前 Toolbar 结构，可按文件级回滚。
- **基础库变更同步 / Skill Sync**：预计不改动 `packages/components/**` 与 `packages/hooks/**`；若后续超出范围改动，需同步更新对应 Skill 与 references。
- **提交信息规范 / Commit Message**：遵循 Conventional Commits，末尾追加 `#<issue-id>`；当前分支前缀 issue-id 为 `30`，示例：`feat(post): add prev-next toolbar navigation #30`。
- **沟通约定 / Communication**：信息缺失先列 `Pending Input` 与 `Assumptions`；执行中采用“进展 + 下一步 + 阻塞点”简版同步；若需升级权限先说明目的并请求批准。
- **执行提示 / Runbook**：第二阶段编码前先完成完整性检查；缺失项未补齐不进入实现；实现后按 `CODEX_CHECKLIST.md` 覆盖范围、质量、测试、回滚四类自检。

- **Pending Input**：
  1. “上一条/下一条”判定规则：按 `issue.number` 还是按 `created_at`？
  2. 查询范围是否仅限 open issues，还是包含 closed issues？
  3. 按钮可用时的文案是否固定为“上一条 / 下一条”，还是展示目标 issue 标题？
  4. 当 `issue` 本身获取失败（空态）时，底部 Toolbar 是否仍需保留“上一条/下一条”逻辑？
  5. 是否需要为禁用态补充可访问性属性（`aria-disabled`、`tabIndex` 控制）作为强制验收项？
  6. 最终校验是否要求 `typecheck/test`（当前包脚本仅显式提供 `lint`）。

- **Assumptions**：
  - 假设：详情页路由保持 `/post/[number]`，上一条/下一条跳转目标均使用该路由。
  - 假设：禁用态按钮文案统一为“空空如也”，且点击无任何副作用。
  - 假设：本次不新增依赖与新页面，仅在现有详情页与相关数据装配层改动。
  - 假设：若未额外要求，上一条/下一条按钮可用时默认文案为“上一条”“下一条”。
