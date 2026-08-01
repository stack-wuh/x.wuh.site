# 修复博客详情页目录不展示

> 原始变更名：`20260729_B_restore-post-toc`

## 元数据
- 日期：2026-07-29
- 类型：B
- 状态：proposed
- Issue：历史记录未提供

## 动机
博客详情页的目录组件完全不展示。根因是详情页当前优先使用 API 返回的 `body_html`；部分 `body_html` 中的标题没有经过 `rehypeSlug` 处理，因此标题缺少 `id`。`useToc` 只收集同时拥有文本和 `id` 的 `h1`/`h2`/`h3`，最终目录为空，桌面端和移动端目录都不会渲染。

## 引用规范
- `specs/post/spec.md`

## 决策
详情页在服务端准备 `PostView` 所需的 `Issue` 数据。正文 HTML 统一通过 `ensureRenderedBody` 处理：

```text
内容 API
   |
   v
mapContentToIssue
   |
   v
ensureRenderedBody
   |-- body 非空 ------> renderMarkdown
   |                         |-- rehypeSlug 生成标题 id
   |                         `-- rehypeAutolinkHeadings 生成锚点
   `-- body 为空 ------> 有效 body_html 回退
              |
              v
           PostView
              |
              v
           useToc
              |
              v
       桌面/移动目录
```

`PostView`、`useToc`、`useHeadingObserver` 和目录样式保持现有职责与接口不变。修复点位于服务端正文数据准备层，避免在客户端为缺少 `id` 的 HTML 额外补丁。

| 维度 | 选择 | 理由 |
|------|------|------|
| 正文来源 | `body` 优先，`body_html` 回退 | 统一经过现有 Markdown renderer，确保标题 id 与锚点一致，同时兼容 body 缺失的数据 |
| 标题锚点 | 复用 `rehypeSlug` 与 `rehypeAutolinkHeadings` | 项目已有实现，无新增依赖，目录与正文共享同一 HTML |
| 回归验证 | Node 原生回归测试 + 现有 lint/typecheck | 与详情页现有测试风格一致，覆盖实现约束与工程门禁 |

## 任务
### Phase 1: 回归约束
- [x] **文件:** `packages/wuh.site.next/test/post-detail-runtime-regression.test.mjs`
- [x] 验证详情页在 `body` 非空时调用统一 `renderMarkdown`，不再优先短路返回 `body_html`
- [x] 检查回退分支仍覆盖 `body` 缺失且 `body_html` 有效的场景
- [x] **验证:** 运行详情页 Node 回归测试；RED 阶段先失败，GREEN 阶段通过
### Phase 2: 最小实现
- [x] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`
- [x] 修改 `ensureRenderedBody`，优先使用 `body` 调用 `renderMarkdown`
- [x] 保留有效 `body_html` 回退和无正文错误
- [x] **验证:** 详情页回归测试通过；实现复用 `renderMarkdown` 生成带标题 `id` 的 HTML
- [x] **文件:** `openspec/specs/post/spec.md`
- [x] 增加正文标题锚点与目录展示的 GIVEN/WHEN/THEN 需求
- [x] **验证:** 规范内容与实现设计一致，无冲突或占位符
### Phase 3: 回归验收
- [x] **文件:** 相关前端包
- [x] 运行详情页回归测试、前端 lint 和 TypeScript 类型检查
- [x] 检查 `git diff --check`
- [x] **验证:** 回归测试、类型检查和 diff 检查通过；lint 仅报告既有 `GuestbookGuide` 未使用警告
- [x] Markdown 含 `h1`、`h2` 或 `h3` 时，详情页目录正常展示
- [x] 正文标题包含 `id`，目录链接可定位对应标题
- [x] `body` 为空时，有效 `body_html` 仍可作为回退正文
- [x] 详情页已有正文、相关文章、评论和响应式布局不回归
- [ ] `pnpm --filter @wuh.site/next run lint` 零错误（当前仅有既有 warning）
- [x] `pnpm exec tsc --noEmit` 零错误

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: restore-post-toc
date: 2026-07-29
type: B
status: proposed
issue:
```

### `design.md`
# 设计文档

## 架构

详情页在服务端准备 `PostView` 所需的 `Issue` 数据。正文 HTML 统一通过 `ensureRenderedBody` 处理：

```text
内容 API
   |
   v
mapContentToIssue
   |
   v
ensureRenderedBody
   |-- body 非空 ------> renderMarkdown
   |                         |-- rehypeSlug 生成标题 id
   |                         `-- rehypeAutolinkHeadings 生成锚点
   `-- body 为空 ------> 有效 body_html 回退
              |
              v
           PostView
              |
              v
           useToc
              |
              v
       桌面/移动目录
```

`PostView`、`useToc`、`useHeadingObserver` 和目录样式保持现有职责与接口不变。修复点位于服务端正文数据准备层，避免在客户端为缺少 `id` 的 HTML 额外补丁。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 正文来源 | `body` 优先，`body_html` 回退 | 统一经过现有 Markdown renderer，确保标题 id 与锚点一致，同时兼容 body 缺失的数据 |
| 标题锚点 | 复用 `rehypeSlug` 与 `rehypeAutolinkHeadings` | 项目已有实现，无新增依赖，目录与正文共享同一 HTML |
| 回归验证 | Node 原生回归测试 + 现有 lint/typecheck | 与详情页现有测试风格一致，覆盖实现约束与工程门禁 |

## 数据模型（如涉及）

不涉及 API、DTO、Schema 或数据库模型变更。`Issue.body`、`Issue.body_html` 的现有类型和接口保持不变。

## API 设计（如涉及）

不涉及 API 变更。

## 组件/模块设计

### `ensureRenderedBody`

位于 `app/post/[number]/page.tsx` 的服务端数据准备层。行为调整为：

1. `issue.body` 非空时调用 `renderMarkdown(issue.body)`。
2. `issue.body` 为空但 `issue.body_html` 非空时返回已有 HTML。
3. 两者均为空时抛出明确错误，保持现有错误处理语义。

### `useToc` 与目录渲染

保持现有实现不变。由于输入 HTML 的标题由统一 renderer 生成并具有 `id`，现有 `useToc` 可同时驱动 `TocMobile` 和 `TocAside` 渲染。

## 响应式策略（如涉及）

不调整现有响应式策略：

| 断点 | 行为 |
|------|------|
| >= 1024px | 显示桌面端 `TocAside` |
| < 1024px | 使用现有移动端 `TocMobile` |

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无 API 和数据模型变更
- **向后兼容:** `body` 非空的文章统一生成规范 HTML；仅有有效 `body_html` 的内容继续可展示
- **性能影响:** 详情页已有服务端 Markdown renderer；目录客户端解析逻辑不变，预计无额外显著开销

### `proposal.md`
# 修复博客详情页目录不展示

## 背景

博客详情页的目录组件完全不展示。根因是详情页当前优先使用 API 返回的 `body_html`；部分 `body_html` 中的标题没有经过 `rehypeSlug` 处理，因此标题缺少 `id`。`useToc` 只收集同时拥有文本和 `id` 的 `h1`/`h2`/`h3`，最终目录为空，桌面端和移动端目录都不会渲染。

## 目标

- 详情页优先从 Markdown `body` 通过统一 renderer 生成正文 HTML。
- 确保正文标题包含稳定的 `id` 和锚点，使目录能够正常生成和跳转。
- 保留 `body` 缺失时对有效 `body_html` 的兼容回退。
- 增加回归检查，防止详情页再次绕过统一 Markdown renderer 导致目录消失。

## 非目标（明确不做）

- 不修改后端内容同步、MongoDB 数据或历史文章数据。
- 不重写 `useToc`、目录样式或标题观察逻辑。
- 不新增第三方依赖或改变目录交互设计。

## 影响范围

- `packages/wuh.site.next/app/post/[number]/page.tsx` — 调整正文 HTML 的来源优先级。
- `packages/wuh.site.next/test/post-detail-runtime-regression.test.mjs` — 增加正文标题锚点回归检查。
- `openspec/specs/post/spec.md` — 补充目录生成与标题锚点规范。

### `specs/post/spec.md`
# Spec: 博客详情页目录

## ADDED Requirements

### Requirement: Markdown 标题生成目录锚点

服务端 MUST 优先使用统一 Markdown renderer 处理非空 `body`，并为 `h1`、`h2`、`h3` 标题生成稳定的 `id` 与可用于目录跳转的锚点。

#### Scenario: Markdown 标题生成可跳转锚点
- **GIVEN** 文章 `body` 包含 `h2` 标题且 `body_html` 缺少该标题的 `id`
- **WHEN** 服务端准备详情页正文 HTML
- **THEN** 使用 Markdown renderer 生成包含标题 `id` 的 HTML
- **AND** 目录链接可以定位到对应标题

### Requirement: 详情页展示文章目录

博客详情页 MUST 在正文包含带文本和 `id` 的 `h1`、`h2` 或 `h3` 时展示文章目录，且桌面端与移动端目录 MUST 使用正文中的对应标题锚点。

#### Scenario: 桌面端展示文章目录
- **GIVEN** 正文包含至少一个带文本和 `id` 的支持层级标题
- **WHEN** 用户在桌面端访问博客详情页
- **THEN** 页面展示桌面文章目录
- **AND** 目录项链接指向正文中的对应标题

#### Scenario: 移动端展示文章目录
- **GIVEN** 正文包含至少一个带文本和 `id` 的支持层级标题
- **WHEN** 用户在移动端访问博客详情页
- **THEN** 页面展示移动端文章目录入口
- **AND** 目录项链接指向正文中的对应标题

### Requirement: 正文 HTML 兼容回退

服务端 MUST 在 Markdown `body` 为空且 `body_html` 非空时使用有效的 `body_html` 作为回退，且 MUST NOT 因目录修复导致正文无法展示。

#### Scenario: body 缺失时回退到 body_html
- **GIVEN** 文章 `body` 为空且 `body_html` 包含正文
- **WHEN** 服务端准备详情页正文 HTML
- **THEN** 使用 `body_html` 作为详情页正文
- **AND** 详情页仍可展示已有正文

## MODIFIED Requirements

### Requirement: Markdown 正文具有可靠 fallback

详情页准备 `PostView` 数据时 MUST 在 `body` 非空且 `bodyHtml` 为空或缺少标题锚点时使用统一服务端 Markdown renderer 生成非空 HTML；标题 `h1`、`h2`、`h3` MUST 生成可用于目录跳转的 `id`，且 PostView MUST NOT 静默渲染空正文。

#### Scenario: body 优先于缺少锚点的 bodyHtml
- **GIVEN** 详情 API 同时返回非空 `body` 和缺少标题锚点的 `bodyHtml`
- **WHEN** Next 详情页面准备 `PostView` 数据
- **THEN** 优先根据 `body` 生成正文 HTML
- **AND** 生成的标题包含可用于目录跳转的 `id`

#### Scenario: 无可渲染正文时报告错误
- **GIVEN** 详情 API 的 `body` 和 `body_html` 均为空
- **WHEN** Next 详情页面准备 `PostView` 数据
- **THEN** 以明确错误终止正文准备
- **AND** 不静默将正文归一化为空字符串

### `tasks.md`
# 任务清单

## Phase 1: 回归约束

### Task 1: 增加目录根因回归检查

- [x] **文件:** `packages/wuh.site.next/test/post-detail-runtime-regression.test.mjs`
- [x] 验证详情页在 `body` 非空时调用统一 `renderMarkdown`，不再优先短路返回 `body_html`
- [x] 检查回退分支仍覆盖 `body` 缺失且 `body_html` 有效的场景
- **预计耗时:** 20 分钟
- **实际耗时:** 约 10 分钟
- [x] **验证:** 运行详情页 Node 回归测试；RED 阶段先失败，GREEN 阶段通过

## Phase 2: 最小实现

### Task 2: 调整详情页正文渲染优先级

- [x] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`
- [x] 修改 `ensureRenderedBody`，优先使用 `body` 调用 `renderMarkdown`
- [x] 保留有效 `body_html` 回退和无正文错误
- **预计耗时:** 15 分钟
- **实际耗时:** 约 5 分钟
- [x] **验证:** 详情页回归测试通过；实现复用 `renderMarkdown` 生成带标题 `id` 的 HTML

### Task 3: 同步博客详情规范

- [x] **文件:** `openspec/specs/post/spec.md`
- [x] 增加正文标题锚点与目录展示的 GIVEN/WHEN/THEN 需求
- **预计耗时:** 10 分钟
- **实际耗时:** 约 5 分钟
- [x] **验证:** 规范内容与实现设计一致，无冲突或占位符

## Phase 3: 回归验收

### Task 4: 执行工程质量检查

- [x] **文件:** 相关前端包
- [x] 运行详情页回归测试、前端 lint 和 TypeScript 类型检查
- [x] 检查 `git diff --check`
- **预计耗时:** 30 分钟
- **实际耗时:** 约 5 分钟
- [x] **验证:** 回归测试、类型检查和 diff 检查通过；lint 仅报告既有 `GuestbookGuide` 未使用警告

## 验收

- [x] Markdown 含 `h1`、`h2` 或 `h3` 时，详情页目录正常展示
- [x] 正文标题包含 `id`，目录链接可定位对应标题
- [x] `body` 为空时，有效 `body_html` 仍可作为回退正文
- [x] 详情页已有正文、相关文章、评论和响应式布局不回归
- [ ] `pnpm --filter @wuh.site/next run lint` 零错误（当前仅有既有 warning）
- [x] `pnpm exec tsc --noEmit` 零错误
