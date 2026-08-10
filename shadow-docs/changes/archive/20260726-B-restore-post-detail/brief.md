# 修复博客详情页发布后 500 错误

> 原始变更名：`2026-07-26-B-restore-post-detail`

## 元数据
- 日期：2026-07-26
- 类型：B
- 状态：proposed
- Issue：历史记录未提供

## 动机
图片语义角色变更 PR #268 合并并由 CI-CD 成功发布后，博客详情路由出现回归。访问：

`/post/165-再读《坐忘歌》`

页面命中详情路由自定义错误边界，展示：

- `500`
- `文章加载失败`
- `当前文章暂时无法加载`

线上接口 `/api/content/posts/165` 仍返回 HTTP 200，文章 `body` 非空；抓取到的 Next Flight 数据也可包含转换后的 `body_html`。因此修复不能仅假设后端取数失败，也不能在缺少复现测试时随机修改数据接口。

同时确认 `PostView` 当前只消费 `body_html`，没有在 HTML 缺失时利用仍存在的 Markdown `body`，这是会导致正文空白的韧性缺陷，但现有证据尚不足以证明它是本次运行时 500 的唯一触发源。

## 引用规范
- `specs/post/spec.md`

## 决策
修复遵循“先捕获异常，再做最小恢复”的边界，不预先假定是接口、Markdown 或 Image 单一模块导致。

```text
生产详情 URL
  ↓
Next /post/[number] Server Component
  ├─ 解析 number
  ├─ GET Nest /v2/content/posts/:number
  ├─ body → renderMarkdown → body_html
  └─ PostView props
         ↓
PostView Client Component
  ├─ PostHeader / PostCover
  ├─ useToc(body_html)
  ├─ MarkdownBody
  └─ 任一运行时异常 → app/post/[number]/error.tsx（500）
```

实施时先在发布后代码上通过可执行测试或本地浏览器捕获错误对象、堆栈和触发组件，再将修复限制在异常源。无论本次 500 的直接异常是什么，正文数据链路需要增加 `body_html` 缺失时的明确 fallback，避免 metadata 正常但正文为空。

| 维度 | 选择 | 理由 |
|------|------|------|
| 修复策略 | 发布回归的最小修复 | 需求是恢复博客详情，不撤销无关图片优化 |
| 根因定位 | 真实详情 URL + 错误边界/控制台/服务端日志 | HTTP 抓取已证明接口和 Flight 可正常，必须捕获浏览器运行时异常 |
| 回归基线 | `/post/165-再读《坐忘歌》` | 用户提供的稳定复现 URL |
| 数据边界 | Nest API 保持不变 | `/api/content/posts/165` 已返回 HTTP 200 和完整 Markdown |
| 正文兜底 | 服务端统一生成 HTML，PostView 不静默渲染空字符串 | 避免在客户端引入第二套 Markdown 渲染实现 |
| 图片处理 | 仅修正触发详情异常的 role/调用 | 不回滚 avatar、book-cover、logo、qr 等无关角色 |
| 测试 | TDD + 详情页 smoke test | 必须先看到 500 复现测试失败，再实现修复 |

## 任务
### Phase 1: 稳定复现发布回归
- [ ] **文件:** `packages/wuh.site.next/test/`、`packages/wuh.site.next/app/post/`
- [ ] 基于文章 165 创建最小 fixture 或页面 smoke test
- [ ] 在 PR #268 发布后的代码上确认测试命中与线上相同的 500/异常
- [ ] 记录错误堆栈、触发组件和输入数据，禁止根据提交范围猜测
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 修复前测试稳定失败且失败原因与线上现象一致
- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`、相关测试
- [ ] 覆盖 `body` 非空、`bodyHtml: null` 的合法 API 响应
- [ ] 验证路由 `165-再读《坐忘歌》` 正确解析为文章编号 165
- [ ] 验证最终传入 PostView 的 `body_html` 非空
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 契约测试先 RED，再由最小实现转 GREEN
### Phase 2: 最小修复
- [ ] **文件:** 由 Task 1 堆栈确定，预计位于 `packages/wuh.site.next/app/post/` 或 `packages/components/image/`
- [ ] 只修改导致详情页 500 的具体组件或 role
- [ ] 保留其他页面的图片语义角色优化
- [ ] 不修改 Nest API 或文章数据
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 原始复现测试通过，不再进入错误边界
- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`、`packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 服务端将非空 Markdown body 归一化为最终 HTML
- [ ] PostView 不再将缺失 HTML 静默渲染为空正文
- [ ] 保持现有 HTML 优先，不重复转换
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** bodyHtml 为空但 body 非空时正文仍包含标题和段落
### Phase 3: 回归与发布验证
- [ ] **文件:** 本次所有修复和测试
- [ ] 运行详情页相关测试、Oxlint、TypeScript 和 Next build
- [ ] 运行 `git diff --check`
- [ ] 若本机继续出现环境级 SIGSEGV，记录根因并以 CI 构建结果作为额外证据，不得隐藏失败
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 可执行门禁无代码错误；环境阻塞明确记录
- [ ] **URL:** `https://wuh.site/post/165-再读《坐忘歌》`
- [ ] 部署完成后打开真实浏览器并等待水合完成
- [ ] 断言页面不展示 `500`、`文章加载失败`
- [ ] 断言标题、作者和 `.markdown-body` 正文文本可见
- [ ] 检查控制台和网络请求无未捕获错误
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 线上页面可正常阅读文章内容
- [ ] `/post/165-再读《坐忘歌》` 不再进入自定义 500 错误页
- [ ] 文章标题、作者、封面（如有）和正文正常展示
- [ ] `/api/content/posts/165` 的现有响应无需修改
- [ ] `bodyHtml: null` 且 `body` 非空时正文不为空
- [ ] 数字 URL 和带 slug URL 均正常
- [ ] PR #268 的非详情页图片优化保持有效
- [ ] 相关测试、Oxlint、TypeScript、构建和 diff check 完成并如实记录
- [ ] 发布后线上 smoke test 通过

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: restore-post-detail
date: 2026-07-26
type: B
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/269
```

### `design.md`
# 博客详情页 500 回归修复设计

## 架构

修复遵循“先捕获异常，再做最小恢复”的边界，不预先假定是接口、Markdown 或 Image 单一模块导致。

```text
生产详情 URL
  ↓
Next /post/[number] Server Component
  ├─ 解析 number
  ├─ GET Nest /v2/content/posts/:number
  ├─ body → renderMarkdown → body_html
  └─ PostView props
         ↓
PostView Client Component
  ├─ PostHeader / PostCover
  ├─ useToc(body_html)
  ├─ MarkdownBody
  └─ 任一运行时异常 → app/post/[number]/error.tsx（500）
```

实施时先在发布后代码上通过可执行测试或本地浏览器捕获错误对象、堆栈和触发组件，再将修复限制在异常源。无论本次 500 的直接异常是什么，正文数据链路需要增加 `body_html` 缺失时的明确 fallback，避免 metadata 正常但正文为空。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 修复策略 | 发布回归的最小修复 | 需求是恢复博客详情，不撤销无关图片优化 |
| 根因定位 | 真实详情 URL + 错误边界/控制台/服务端日志 | HTTP 抓取已证明接口和 Flight 可正常，必须捕获浏览器运行时异常 |
| 回归基线 | `/post/165-再读《坐忘歌》` | 用户提供的稳定复现 URL |
| 数据边界 | Nest API 保持不变 | `/api/content/posts/165` 已返回 HTTP 200 和完整 Markdown |
| 正文兜底 | 服务端统一生成 HTML，PostView 不静默渲染空字符串 | 避免在客户端引入第二套 Markdown 渲染实现 |
| 图片处理 | 仅修正触发详情异常的 role/调用 | 不回滚 avatar、book-cover、logo、qr 等无关角色 |
| 测试 | TDD + 详情页 smoke test | 必须先看到 500 复现测试失败，再实现修复 |

## 数据模型

不修改 DTO、Schema 或数据库字段。

继续兼容合法响应：

```ts
{
  body: string
  bodyHtml?: string | null
}
```

Next 页面层负责将非空 `body` 转换为最终 `body_html`，不能假设数据库一定持久化 HTML。

## API 设计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v2/content/posts/:slugOrNumber` | Nest 内部文章详情接口，保持现有响应 |
| GET | `/api/content/posts/:slugOrNumber` | 浏览器侧代理接口，用于诊断与契约验证 |
| GET | `/post/:number-:slug` | 必须返回并渲染文章内容，不命中 500 错误边界 |

无请求或响应格式变更。

## 组件/模块设计

### 详情页复现测试

- 使用文章 165 的最小 fixture，保留标题、用户、Markdown body、可选封面和评论相关字段。
- 运行发布后 `PostView` 所需组件树，捕获导致错误边界的异常。
- 测试必须在修复前因同一异常失败，而不是只检查源码字符串。
- 如本地环境无法完整运行 React 页面，增加部署 smoke test，通过最终页面正文文本和无 500 文案验证。

### Server Component 数据归一化

- `getIssue` 成功返回后，确保最终传入 `PostView` 的 `body_html` 非空。
- `body` 非空时统一使用现有 `renderMarkdown` 转换。
- 转换失败应抛出可观察错误并记录文章编号，不能静默变为空字符串。
- 已有 `body_html` 可直接复用，避免不必要的重复转换。

### PostView 正文保护

- 不再将缺失 `body_html` 无条件归一化为 `''` 后继续渲染空文章卡片。
- 若页面层已归一化但仍收到空 HTML，应提供明确保护：使用已归一化结果或触发带上下文的错误，而不是无内容成功页。
- 保持 `useToc` 只处理目录，不承担 Markdown 转换职责。

### 图片角色回归边界

重点检查 PR #268 在详情页实际使用的：

- `PostHeader` 作者 `avatar`
- `PostCover` 的 `cover`
- 评论头像 `avatar`
- `Image` fallback 与 styled-components transient props

只修改被复现堆栈命中的组件。若异常来自某个 role 的运行时属性，修正共享组件并增加组件级回归；若不相关，则保留现状。

### 发布后 Smoke Test

- 请求用户提供的文章 URL。
- 断言页面不含 `500`、`文章加载失败`。
- 在浏览器水合完成后断言 `.markdown-body` 含文章正文文本。
- 检查控制台无未捕获异常和 hydration error。

## 响应式策略

| 断点 | 行为 |
|------|------|
| >= 768px | 正常展示桌面文章标题、封面、正文和侧边目录 |
| < 768px | 正常展示移动端 edge-to-edge 封面和正文，不因图片 role 触发错误 |

本次不改变现有排版，只验证所有断点不进入错误边界。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无。
- **向后兼容:** 兼容旧数字 URL、带 slug URL，以及 `bodyHtml: null` 的文章记录。
- **性能影响:** 服务端仅在缺少可用 HTML 时转换 Markdown；无额外 API 请求。
- **安全影响:** 继续使用现有统一 Markdown sanitize/render 流程，不在客户端直接引入未净化 HTML。
- **发布风险:** 修复必须在部署后对线上文章 165 做 smoke test，避免 CI 成功但运行时仍命中 500。
- **回滚策略:** 若最小修复发布后仍失败，只回滚详情页相关图片迁移或触发异常的单一提交，不回滚整套图片角色体系。

### `proposal.md`
# 修复博客详情页发布后 500 错误

## 背景

图片语义角色变更 PR #268 合并并由 CI-CD 成功发布后，博客详情路由出现回归。访问：

`/post/165-再读《坐忘歌》`

页面命中详情路由自定义错误边界，展示：

- `500`
- `文章加载失败`
- `当前文章暂时无法加载`

线上接口 `/api/content/posts/165` 仍返回 HTTP 200，文章 `body` 非空；抓取到的 Next Flight 数据也可包含转换后的 `body_html`。因此修复不能仅假设后端取数失败，也不能在缺少复现测试时随机修改数据接口。

同时确认 `PostView` 当前只消费 `body_html`，没有在 HTML 缺失时利用仍存在的 Markdown `body`，这是会导致正文空白的韧性缺陷，但现有证据尚不足以证明它是本次运行时 500 的唯一触发源。

## 目标

- 先用发布后代码稳定复现博客详情页进入 500 错误边界的具体异常。
- 定位 PR #268 中导致文章详情运行时异常的最小变更点。
- 以最小修改恢复 `/post/[number]-[slug]` 正常展示标题、作者、封面和正文。
- 保证后端返回 `body` 非空但 `bodyHtml` 为空时，详情页仍不会渲染空正文。
- 增加覆盖文章 165 URL、图片角色调用和 Markdown fallback 的回归测试。
- 发布后验证真实线上详情页面不再展示自定义 500 错误页。

## 非目标（明确不做）

- 不回滚 PR #268 的全部图片语义角色体系，除非最小复现证明整体设计不可用。
- 不修改博客内容、GitHub Issue 数据或 MongoDB 记录。
- 不重构完整 Markdown 渲染架构。
- 不改变博客 URL slug 规则、SEO metadata 或 JSON-LD 结构。
- 不将 HTTP 200 的接口响应问题错误归因于 Nest API。

## 影响范围

- `packages/wuh.site.next/app/post/` — 详情页错误触发点、PostView 正文渲染和图片角色调用。
- `packages/components/image/` — 若复现确认 Image role 在详情页触发运行时异常，仅修正对应角色边界。
- `packages/wuh.site.next/test/` — 新增详情页 500 复现、Markdown fallback 和发布回归契约。
- `.github/workflows/` 或部署检查 — 如有必要，增加发布后详情页 smoke test；不改变部署架构。
- 影响包：`@wuh.site/next`；仅在根因指向共享 Image 时影响 `@wuh.site/components`。

### `specs/post/spec.md`
# Spec: 博客详情页可用性

## ADDED Requirements

### Requirement: 发布后博客详情页正常展示

系统 SHALL 在详情 API 成功时渲染可阅读的文章详情，而不是进入错误边界。

#### Scenario: 访问存在的文章详情
- **GIVEN** 文章编号 165 存在且详情 API 返回成功
- **WHEN** 用户访问 `/post/165-再读《坐忘歌》`
- **THEN** 页面展示文章标题、作者信息和正文内容
- **AND** 不展示 `500`、`文章加载失败` 或详情错误边界
- **AND** 浏览器水合后无未捕获运行时异常

### Requirement: 详情页回归必须捕获真实异常

系统 SHALL 通过可重复证据定位详情页发布回归，修复范围必须由实际异常决定。

#### Scenario: 修复发布后的 500 回归
- **GIVEN** 博客详情页在某次发布后进入 500 错误边界
- **WHEN** 开发者修复该回归
- **THEN** 必须先通过自动化测试或可重复 smoke test 捕获相同异常
- **AND** 修复范围由错误堆栈确定
- **AND** 不因时间相关性直接回滚无关模块

### Requirement: Markdown 正文具有可靠 fallback

系统 SHALL 在持久化 HTML 缺失时从非空 Markdown 正文生成可渲染 HTML。

#### Scenario: API 未持久化正文 HTML
- **GIVEN** 详情 API 返回非空 `body` 且 `bodyHtml` 为 `null` 或空字符串
- **WHEN** Next 详情页面准备 PostView 数据
- **THEN** 使用统一服务端 Markdown renderer 生成非空 HTML
- **AND** PostView 不静默渲染空文章正文
- **AND** 已有非空 `body_html` 时优先复用，不重复转换

### Requirement: 详情路由兼容标题 slug

系统 SHALL 从带标题 slug 的详情路径中可靠提取文章编号。

#### Scenario: 访问编码后的中文标题 URL
- **GIVEN** 详情 URL 同时包含文章编号和编码后的中文标题 slug
- **WHEN** Next 路由解析参数
- **THEN** 使用首段数字查询文章 165
- **AND** URL 编码字符不导致 500 或错误查询

### Requirement: 发布流程验证真实文章详情

系统 SHALL 在修复部署后使用真实文章 URL 验证详情页内容可用性。

#### Scenario: 部署后执行线上 smoke test
- **GIVEN** 博客详情修复已部署到生产环境
- **WHEN** 发布后 smoke test 请求文章 165 的带 slug URL
- **THEN** 最终页面不包含详情 500 文案
- **AND** `.markdown-body` 包含该文章正文文本
- **AND** 详情接口和页面网络请求均无失败响应

## MODIFIED Requirements

### Requirement: PostToolbar 流动阅读线样式

系统 SHALL 仅在文章详情成功加载后展示与当前位置一致的底部阅读导航。

#### Scenario: 成功阅读文章并滚动到底部
- **GIVEN** 用户成功加载博客详情页
- **WHEN** 页面滚动到底部
- **THEN** 显示不对称布局导航（prev 全宽，next 右对齐）
- **AND** 显示文章位置「第 X / Y 篇」
- **AND** 显示「所有博客」返回入口
- **AND** 移动端隐藏「所有博客」按钮

### `tasks.md`
# 任务清单

## Phase 1: 稳定复现发布回归

### Task 1: 捕获博客详情 500 的实际异常

- [ ] **文件:** `packages/wuh.site.next/test/`、`packages/wuh.site.next/app/post/`
- [ ] 基于文章 165 创建最小 fixture 或页面 smoke test
- [ ] 在 PR #268 发布后的代码上确认测试命中与线上相同的 500/异常
- [ ] 记录错误堆栈、触发组件和输入数据，禁止根据提交范围猜测
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 修复前测试稳定失败且失败原因与线上现象一致

### Task 2: 锁定数据链路契约

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`、相关测试
- [ ] 覆盖 `body` 非空、`bodyHtml: null` 的合法 API 响应
- [ ] 验证路由 `165-再读《坐忘歌》` 正确解析为文章编号 165
- [ ] 验证最终传入 PostView 的 `body_html` 非空
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 契约测试先 RED，再由最小实现转 GREEN

## Phase 2: 最小修复

### Task 3: 修复实际异常源

- [ ] **文件:** 由 Task 1 堆栈确定，预计位于 `packages/wuh.site.next/app/post/` 或 `packages/components/image/`
- [ ] 只修改导致详情页 500 的具体组件或 role
- [ ] 保留其他页面的图片语义角色优化
- [ ] 不修改 Nest API 或文章数据
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 原始复现测试通过，不再进入错误边界

### Task 4: 补齐 Markdown 正文 fallback

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`、`packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 服务端将非空 Markdown body 归一化为最终 HTML
- [ ] PostView 不再将缺失 HTML 静默渲染为空正文
- [ ] 保持现有 HTML 优先，不重复转换
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** bodyHtml 为空但 body 非空时正文仍包含标题和段落

## Phase 3: 回归与发布验证

### Task 5: 运行质量门禁

- [ ] **文件:** 本次所有修复和测试
- [ ] 运行详情页相关测试、Oxlint、TypeScript 和 Next build
- [ ] 运行 `git diff --check`
- [ ] 若本机继续出现环境级 SIGSEGV，记录根因并以 CI 构建结果作为额外证据，不得隐藏失败
- [ ] **预计耗时:** 1 小时
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 可执行门禁无代码错误；环境阻塞明确记录

### Task 6: 线上详情页 Smoke Test

- [ ] **URL:** `https://wuh.site/post/165-再读《坐忘歌》`
- [ ] 部署完成后打开真实浏览器并等待水合完成
- [ ] 断言页面不展示 `500`、`文章加载失败`
- [ ] 断言标题、作者和 `.markdown-body` 正文文本可见
- [ ] 检查控制台和网络请求无未捕获错误
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待实施
- [ ] **验证:** 线上页面可正常阅读文章内容

## 验收

- [ ] `/post/165-再读《坐忘歌》` 不再进入自定义 500 错误页
- [ ] 文章标题、作者、封面（如有）和正文正常展示
- [ ] `/api/content/posts/165` 的现有响应无需修改
- [ ] `bodyHtml: null` 且 `body` 非空时正文不为空
- [ ] 数字 URL 和带 slug URL 均正常
- [ ] PR #268 的非详情页图片优化保持有效
- [ ] 相关测试、Oxlint、TypeScript、构建和 diff check 完成并如实记录
- [ ] 发布后线上 smoke test 通过
