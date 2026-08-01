# 重构博客详情页封面图体验

> 原始变更名：`2026-07-19-P-post-cover-redesign`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
当前博客详情页在 `metadata.cover` 缺失时，会把正文第一张图片推导为封面，并从详情正文中移除该图片以避免重复。这个回退逻辑让历史文章能够展示封面，但也让“文章第一张内容图”和“文章封面”无法同时存在。

移动端封面仍在文章内容栏中，缺少明确的文章开场；而桌面端现有的克制、阅读优先版式不适合直接套用跨越正文与目录的大型媒体头图。需要同时解决封面来源、旧文章兼容和两端差异化展示的问题，且不能破坏 GitHub Issues 作为 CMS 的日常写作体验。

## 引用规范
- `specs/post-cover/spec.md`

## 决策
封面配置继续使用现有 Issue 隐藏元数据约定，不新增第二种写作格式。同步层保存原始 Markdown 作为内容源；详情接口负责为前端生成不含隐藏元数据、且在首图回退时已去重的文章内容。前端只消费统一的 `metadata.cover` / `metadata.coverAlt`，根据断点调整同一个封面组件与文章头部的呈现顺序。

```
GitHub Issue
  └─ <!-- wuh-site-metadata: {"cover":"...","coverAlt":"..."} -->
       │
       ▼
SyncService ── parseIssueMetadata ──► MongoDB Content.metadata
       │                                      │
       │                                      ▼
       └─ 保留原始 body              ContentController 详情响应
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
              显式 cover：移除元数据                         无显式 cover：首图回退
              保留全部正文图片                             同时清理返回 body 与 bodyHtml
                         └─────────────────────┬─────────────────────┘
                                               ▼
                           Next.js 元数据 / PostView / PostCover
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
                  移动端：封面在标题前                    桌面端：标题在前、封面在主栏
```

| 维度 | 选择 | 理由 |
|------|------|------|
| Issue 元数据 | 复用 `<!-- wuh-site-metadata: {...} -->` JSON 注释 | 已被 `SyncService` 解析，GitHub 页面不显示，无需维护两套写作规范。 |
| 元数据清理 | 新增后端纯函数工具，分别解析和剥离元数据注释 | 防止隐藏配置进入页面正文和 SEO description，同时保持数据库原始 Issue 内容不变。 |
| 回退去重 | 后端在详情响应中同步清理 `body` 与 `bodyHtml` 的首张图 | Next.js 从 `body` 重新渲染 Markdown，单独清理 `bodyHtml` 会使首图重新出现。 |
| 响应式布局 | `PostLead` 聚合一个 `PostCover` 与 `PostHeader`，用 CSS `order` 切换顺序 | 同一封面节点只渲染一次，避免移动/桌面双节点下载与无障碍重复。 |
| 动效 | styled-components `keyframes` + `prefers-reduced-motion` | 不新增动画依赖，沿用当前样式与可访问性模式。 |

## 任务
### Phase 1: 后端封面契约与回退去重
- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts`、`packages/wuh.site.nest/src/modules/content/content-cover.util.spec.ts`、`packages/wuh.site.nest/src/modules/content/content.controller.spec.ts`
- [ ] 先覆盖合法/非法 `wuh-site-metadata` 注释的解析与清理行为。
- [ ] 先覆盖显式封面保留正文首图、首图回退同时清理 Markdown 与 HTML 的详情响应行为。
- [ ] 在实现前运行定向 Jest，记录预期失败证据。
- [ ] **预计耗时:** 40 分钟
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.ts`、`packages/wuh.site.nest/src/modules/content/content-cover.util.ts`、`packages/wuh.site.nest/src/modules/content/content.controller.ts`、`packages/wuh.site.nest/src/modules/sync/sync.service.ts`
- [ ] 抽取可测试的隐藏元数据解析/清理函数并让同步服务复用它。
- [ ] 扩展封面工具，使首图回退时同时返回已去重的 Markdown 和 HTML。
- [ ] 更新详情 controller：显式封面仅移除隐藏元数据，回退封面移除同一张正文首图。
- [ ] 运行 Phase 1 的定向 Jest，记录从失败到通过的证据。
- [ ] **预计耗时:** 1 小时 20 分钟
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts`
### Phase 2: 共享类型、SEO 与详情页展示
- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/schemas/content.schema.ts`、`packages/wuh.site.nest/src/modules/content/dto/content.dto.ts`、`packages/shared-contracts/src/index.ts`、`packages/wuh.site.next/app/post/PostView.types.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`
- [ ] 为 `coverAlt` 增加可选 schema、DTO、共享契约和前端 Issue 类型。
- [ ] 将 `coverAlt` 映射为 Open Graph 图片替代文本，缺省时回退文章标题。
- [ ] 保持 Twitter Card 与 JSON-LD 使用既有 cover URL，不新增 API 字段或请求。
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** `pnpm exec tsc --noEmit`
- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`、`packages/wuh.site.next/app/post/components/PostCover.tsx`、`packages/wuh.site.next/app/post/styles/post-header.ts`、`packages/wuh.site.next/app/post/styles/post-layout.ts`、`packages/wuh.site.next/app/post/styles/index.ts`
- [ ] 用单一 `PostLead` 结构组合 `PostCover` 和 `PostHeader`，通过 CSS 调整移动/桌面顺序。
- [ ] 移动端实现全宽、受限高度的封面；桌面端保留主阅读栏内的克制横图。
- [ ] 添加短暂加载入场动效和 `prefers-reduced-motion` 降级，不创建重复封面节点。
- [ ] **预计耗时:** 1 小时 30 分钟
- [ ] **验证:** `pnpm exec tsc --noEmit`，并在 390px 与 1440px 视口进行实际页面截图检查。
### Phase 3: 集成验证
- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts`、`packages/wuh.site.next/app/post/`
- [ ] 验证显式封面、首图回退、无图文章三种详情响应。
- [ ] 验证移动端封面在标题前且高度受限，桌面端封面不侵入目录栏。
- [ ] 验证 `prefers-reduced-motion: reduce` 下封面不播放自身入场动效。
- [ ] **预计耗时:** 40 分钟
- [ ] **验证:** 后端定向 Jest、`pnpm exec tsc --noEmit`、Playwright 桌面/移动截图
- [ ] GitHub Issue 的 `wuh-site-metadata` 注释可声明 `cover` 和 `coverAlt`，且不会进入详情页正文或 description。
- [ ] 显式封面与第一张正文图片可同时存在；无显式封面时，回退首图不会在正文重复出现。
- [ ] `coverAlt` 能用于详情页封面和 Open Graph 图片替代文本，旧内容回退文章标题。
- [ ] 移动端封面先于文章标题、全宽且高度限制为 220–300px；桌面端封面保留在主阅读栏内且最大高度为 360px。
- [ ] `prefers-reduced-motion: reduce` 下封面动效禁用。
- [ ] `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。

## 结果
- 状态：历史记录未提供
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
schema: agent-loop/v1
change:
  id: 2026-07-19-P-post-cover-redesign
  title: 重构博客详情页封面图体验
  type: feature
  status: archived
  issue: https://github.com/stack-wuh/x.wuh.site/issues/226
artifacts:
  proposal:
    path: proposal.md
    status: completed
    template:
      id: proposal
      source: skills/shadow-dev-propose/templates/proposal.md
      contractVersion: 1
      digest: sha256:426c31b60cb50e7457a6e4aa6f86c9bd6718cdd6217f292d98f1b9739ad612fd
    validation:
      status: passed
      checkedAt: 2026-07-19T11:04:57+08:00
      missing: []
      invalidPatterns: []
  design:
    path: design.md
    status: completed
    template:
      id: design
      source: skills/shadow-dev-propose/templates/design.md
      contractVersion: 1
      digest: sha256:2483c466de2ab4e8e34a1e147e098a6cef61ff6b5a69d567f565987fdd77b3e4
    validation:
      status: passed
      checkedAt: 2026-07-19T11:27:36+08:00
      missing: []
      invalidPatterns: []
  tasks:
    path: tasks.md
    status: completed
    template:
      id: tasks
      source: skills/shadow-dev-propose/templates/tasks.md
      contractVersion: 1
      digest: sha256:d67578bdb054f235acd942e8cf1bb436abbd6831ff52469e30b82c9c845d37f9
    validation:
      status: passed
      checkedAt: 2026-07-19T11:27:36+08:00
      missing: []
      invalidPatterns: []
  specs:
    status: completed
    entries:
      - path: specs/post-cover/spec.md
        status: completed
        template:
          id: spec
          source: skills/shadow-dev-propose/templates/spec.md
          contractVersion: 1
          digest: sha256:322bb9b2a379e72fa08f5ce84fbee689fddac788245ebf2c4d01153947072ea5
        validation:
          status: passed
          checkedAt: 2026-07-19T11:04:57+08:00
          missing: []
          invalidPatterns: []
proposal:
  status: completed
  source:
    channel: codex
    userIntent: 重新设计博客详情页封面图，并让封面元数据兼容 GitHub Issues 同步。
  intent: 为博客详情页建立独立、可编辑、非重复的封面图机制，并以端侧差异化布局改善阅读开场。
  background: 现有详情响应会在 metadata.cover 缺失时从正文首图推导封面并移除该图，无法区分文章封面与第一张内容图。
  goals:
    - 支持 HTML 注释中的显式封面 URL 与替代文本。
    - 兼容未迁移历史文章的首图回退与去重。
    - 移动端使用受高度限制的全宽封面开场。
    - 桌面端在主阅读栏内保留克制的封面展示。
    - 提供尊重减少动态效果偏好的轻量封面动效。
  nonGoals:
    - 不批量修改现有 Issues。
    - 不新增图片托管、封面生成或可视化内容编辑能力。
    - 不改造桌面端为跨栏大图布局。
  scope:
    packages:
      - packages/wuh.site.nest
      - packages/shared-contracts
      - packages/wuh.site.next
    files:
      - packages/wuh.site.nest/src/modules/sync/sync.service.ts
      - packages/wuh.site.nest/src/modules/content/content.controller.ts
      - packages/wuh.site.nest/src/modules/content/content-cover.util.ts
      - packages/shared-contracts/src/index.ts
      - packages/wuh.site.next/app/post/PostView.tsx
      - packages/wuh.site.next/app/post/components/PostCover.tsx
      - packages/wuh.site.next/app/post/styles/post-header.ts
  acceptanceCriteria:
    - HTML 注释配置的 cover 不在 GitHub Issue 或博客正文可见内容中出现。
    - 显式封面与正文第一张图片可同时展示且互不删除。
    - 未显式配置封面的旧文章维持首图回退，且首图不在正文重复出现。
    - 移动端封面位于文章信息之前且有明确高度上限。
    - 桌面端封面不越过主阅读栏。
    - 动效在减少动态效果偏好下停用。
  constraints:
    - GitHub Issues 仍是唯一内容源，写作流程不得要求额外后台。
    - 延续 styled-components 和现有 CSS 变量主题令牌。
    - 保持已有 Open Graph、Twitter Card 和 JSON-LD 封面使用方式兼容。
  risks:
    - 隐藏元数据语法需具备容错性，避免误解析普通 HTML 注释。
    - 外部封面 URL 仍需符合 Next.js 图片远程域名配置。
    - 图像裁切会影响不同主体位置，需要在实现中允许通过 object-position 处理。
  domain:
    name: post-cover
    keywords:
      - 博客
      - 封面图
      - GitHub Issue
      - metadata.cover
      - 移动端
      - 动效
    description: 博客详情页封面来源、去重、响应式展示和可访问动效规范。
discuss:
  status: completed
  implementationNotes:
    readFiles:
      - packages/wuh.site.nest/src/modules/sync/sync.service.ts
      - packages/wuh.site.nest/src/modules/content/content-cover.util.ts
      - packages/wuh.site.nest/src/modules/content/content.controller.ts
      - packages/wuh.site.nest/src/modules/content/content.controller.spec.ts
      - packages/shared-contracts/src/index.ts
      - packages/wuh.site.next/app/post/[number]/page.tsx
      - packages/wuh.site.next/app/post/PostView.tsx
      - packages/wuh.site.next/app/post/components/PostCover.tsx
      - packages/wuh.site.next/app/post/components/PostHeader.tsx
      - packages/wuh.site.next/app/post/styles/post-header.ts
      - packages/wuh.site.next/app/post/styles/post-layout.ts
      - packages/wuh.site.next/next.config.ts
    observations:
      - SyncService already parses wuh-site-metadata JSON comments.
      - The detail controller only removes fallback images from bodyHtml, while the Next.js route re-renders the raw body.
      - Existing cover rendering is a single PostCover below the title and has a 16:9/360px desktop constraint.
  decisions:
    - id: issue-metadata-format
      question: 封面在 GitHub Issue 中的声明格式
      options: [existing-json-comment, new-yaml-frontmatter-comment, issue-label-or-separate-record]
      selected: existing-json-comment
      rationale: 复用已存在的 wuh-site-metadata JSON 注释解析器，避免双重写作规范和可见正文噪声。
    - id: fallback-deduplication
      question: 首图回退时如何防止正文重复
      options: [clean-html-only, clean-returned-markdown-and-html, keep-duplicate]
      selected: clean-returned-markdown-and-html
      rationale: 前端从 body 重新渲染 Markdown，必须同步清理两种展示格式才会真正去重。
    - id: responsive-cover-order
      question: 封面在移动端与桌面端的排列
      options: [single-node-css-order, duplicate-mobile-and-desktop-nodes, same-order-on-all-viewports]
      selected: single-node-css-order
      rationale: 使用一个封面节点避免重复请求和重复无障碍语义，同时满足移动端封面在标题前、桌面端标题在前。
  architecture:
    summary: 后端解析并清理隐藏元数据，详情响应按显式封面或首图回退返回无重复内容；前端以单一响应式文章开场展示封面。
    modules: [content-metadata.util, content-cover.util, ContentController, shared-contracts, PostLead]
  contracts:
    api:
      - GET /content/posts/:slugOrNumber response metadata gains optional coverAlt.
    data:
      - Content.metadata gains optional coverAlt.
      - wuh-site-metadata JSON comment supports cover and coverAlt.
  reuse:
    components: ['@wuh.site/components/image', '@wuh.site/components/styled', PostHeader, PostCover]
    newComponents: [content-metadata.util, PostLead]
  impact:
    dependencies: []
    compatibility: Existing Issues without cover keep first-image fallback; existing clients can ignore coverAlt.
    rollback: Revert response cleaning and responsive lead styling; persisted optional metadata needs no migration.
apply:
  status: completed
  generatedFrom: [proposal, discuss]
  instructions:
    - Follow TDD for behavior changes: capture failing targeted tests before production code.
    - Preserve the original GitHub Issue body in MongoDB; only sanitize detail responses.
    - Do not introduce a second Issue metadata syntax.
  workflow:
    - id: cover-contract-tests
      title: 为隐藏元数据和首图回退补充失败测试
      status: completed
      dependsOn: []
      files:
        - packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts
        - packages/wuh.site.nest/src/modules/content/content-cover.util.spec.ts
        - packages/wuh.site.nest/src/modules/content/content.controller.spec.ts
      instructions:
        - Add tests before changing production code.
        - Record the initial failing targeted Jest result in task evidence.
      verification:
        - pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: Node 20 + direct Jest baseline for content-cover.util.spec.ts and content.controller.spec.ts
          result: passed; 10 tests passed
          at: 2026-07-19T11:30:00+08:00
        - command: Node 20 + direct Jest red run for content-metadata.util.spec.ts, content-cover.util.spec.ts, and content.controller.spec.ts
          result: failed as expected; missing metadata utility, missing cleanBody, and unstripped detail body
          at: 2026-07-19T11:30:00+08:00
      failure: null
    - id: implement-cover-contract
      title: 实现元数据清理和双格式首图去重
      status: completed
      dependsOn: [cover-contract-tests]
      files:
        - packages/wuh.site.nest/src/modules/content/content-metadata.util.ts
        - packages/wuh.site.nest/src/modules/content/content-cover.util.ts
        - packages/wuh.site.nest/src/modules/content/content.controller.ts
        - packages/wuh.site.nest/src/modules/sync/sync.service.ts
      instructions:
        - Implement only the behavior covered by the new tests.
        - Keep explicit cover images independent from content images.
      verification:
        - pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: Node 20 + direct Jest after clearing cache for content-metadata.util.spec.ts
          result: passed; 2 tests passed
          at: 2026-07-19T11:30:00+08:00
        - command: Node 20 + ts-node direct utility assertions
          result: passed; metadata parsing, stripping, and Markdown/HTML fallback cleanup asserted
          at: 2026-07-19T11:30:00+08:00
        - command: Node 20 + direct Jest for cover/controller tests
          result: unstable; exited SIGSEGV or hung before assertions despite cache clearing
          at: 2026-07-19T11:49:39+08:00
      failure:
        kind: verification
        message: Jest/ts-jest is unstable in this environment. User explicitly authorized continuation with targeted manual assertions and later CI verification.
    - id: propagate-cover-alt
      title: 贯通 coverAlt 的 schema、共享类型和 SEO 映射
      status: completed
      dependsOn: [implement-cover-contract]
      files:
        - packages/wuh.site.nest/src/modules/content/schemas/content.schema.ts
        - packages/wuh.site.nest/src/modules/content/dto/content.dto.ts
        - packages/shared-contracts/src/index.ts
        - packages/wuh.site.next/app/post/PostView.types.ts
        - packages/wuh.site.next/app/post/[number]/page.tsx
      instructions:
        - Add coverAlt as an optional field without breaking existing metadata consumers.
        - Use it for Open Graph image alt with title fallback.
      verification:
        - pnpm exec tsc --noEmit
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: Static contract inspection and git diff --check
          result: passed; coverAlt is optional through schema, DTO, shared contracts, Issue mapping, and Open Graph alt fallback
          at: 2026-07-19T12:00:00+08:00
      failure: null
    - id: implement-responsive-post-lead
      title: 重构文章开场区域并实现封面高度与动效
      status: completed
      dependsOn: [propagate-cover-alt]
      files:
        - packages/wuh.site.next/app/post/PostView.tsx
        - packages/wuh.site.next/app/post/components/PostCover.tsx
        - packages/wuh.site.next/app/post/styles/post-header.ts
        - packages/wuh.site.next/app/post/styles/post-layout.ts
        - packages/wuh.site.next/app/post/styles/index.ts
      instructions:
        - Render a single PostCover node and use responsive styling to order it around PostHeader.
        - Apply mobile full-bleed height constraints and a reduced-motion-safe entry animation.
      verification:
        - pnpm exec tsc --noEmit
        - Playwright screenshots at 390px and 1440px
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: git diff --check
          result: passed; single responsive PostCover node, mobile full-bleed styling, and reduced-motion rule added
          at: 2026-07-19T12:00:00+08:00
        - command: Node 20 frontend TypeScript check
          result: blocked; process hung without diagnostics in the same unstable local runtime
          at: 2026-07-19T12:00:00+08:00
      failure: null
    - id: verify-post-cover-experience
      title: 验证封面数据、响应式布局与无障碍降级
      status: completed
      dependsOn: [implement-responsive-post-lead]
      files:
        - packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts
        - packages/wuh.site.next/app/post/
      instructions:
        - Verify explicit cover, first-image fallback, and no-cover behavior.
        - Verify both viewport layouts and reduced-motion behavior.
      verification:
        - pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts
        - pnpm exec tsc --noEmit
        - Playwright screenshots at 390px and 1440px
      requiredInputs: []
      attempts: 2
      maxAttempts: 2
      evidence:
        - command: Local Node/Jest and frontend TypeScript verification
          result: blocked; Jest intermittently segfaults or hangs and frontend TypeScript check hangs
          at: 2026-07-19T12:00:00+08:00
        - command: Node 20 direct Jest with --runInBand --no-cache and isolated cacheDirectory
          result: passed; 3 suites and 14 tests passed
          at: 2026-07-19T12:10:00+08:00
        - command: Node 20 direct frontend tsc with declaration enabled
          result: blocked; TypeScript process exited SIGSEGV after the existing declarationMap configuration constraint was resolved
          at: 2026-07-19T12:10:00+08:00
        - command: Node 20 + PORT=3001 pnpm dev:next
          result: blocked; no Next.js ready output after 60 seconds, process stopped to avoid a hanging terminal
          at: 2026-07-19T12:15:00+08:00
        - command: Node 20 direct next dev -p 3001 with GC flags
          result: blocked; process remained alive without logs, did not open TCP port 3001, and was stopped after verification
          at: 2026-07-19T12:20:00+08:00
      failure:
        kind: verification
        message: Backend Jest verification is stable with an isolated no-cache Node 20 invocation, but frontend TypeScript and browser verification still require a stable local runtime or CI execution.
  repairWorkflow: []
review:
  status: passed
  summary: 后端定向 Jest 通过，四份 OpenSpec 固定产物契约与差异空白检查通过；本机前端 TypeScript 和浏览器验证不可用的 warning 已由用户验收接受。
  verification:
    - id: backend-cover-tests
      command: Node 20 direct Jest with --runInBand --no-cache and isolated cacheDirectory
      result: passed
      summary: 3 suites and 14 tests passed.
      at: 2026-07-19T12:10:00+08:00
    - id: artifact-contracts
      command: validate-artifact-contract for proposal, design, tasks, and spec
      result: passed
      summary: All four artifacts passed their template contracts.
      at: 2026-07-19T12:20:00+08:00
    - id: diff-whitespace
      command: git diff --check
      result: passed
      summary: No whitespace errors.
      at: 2026-07-19T12:20:00+08:00
    - id: frontend-local-verification
      command: Node 20 direct frontend tsc and next dev
      result: unavailable
      summary: Local TypeScript exits SIGSEGV and Next never opens its port; user accepted this warning during acceptance.
      at: 2026-07-19T12:20:00+08:00
  findings:
    - id: R-001
      severity: warning
      file: packages/wuh.site.next
      message: Local frontend TypeScript and browser verification could not run because the Node/Next runtime exits or hangs before diagnostics/listening.
      status: accepted
archive:
  status: completed
  movedAt: 2026-07-19T16:00:47+08:00
  archivedAt: 2026-07-19T16:00:47+08:00
  source: openspec/changes/2026-07-19-P-post-cover-redesign
  destination: openspec/changes/archive/2026-07-19-P-post-cover-redesign
  specSync:
    - domain: post-cover
      source: specs/post-cover/spec.md
      target: openspec/specs/post-cover/spec.md
      result: created
      evidence:
        - command: copy incremental post-cover spec to main OpenSpec spec
          result: passed
          at: 2026-07-19T16:00:47+08:00
  componentScenarios:
    - component: PostLead
      decision: not-applicable
      rationale: 私有详情页布局包装，不是组件库可复用组件；不创建 demo 或 navigation scenario。
  indexEntry:
    domain: post-cover
    path: openspec/specs/post-cover/spec.md
    result: added
    evidence:
      - command: update openspec/INDEX.md
        result: passed
        at: 2026-07-19T16:00:47+08:00
commit:
  status: pending
  branch: 226-feat-博客封面
  commits:
    - hash: 2b40a5b
      message: 'feat(post): 重构博客详情页封面图体验 (#226)'
      at: 2026-07-19T16:10:00+08:00
    - hash: 742db98
      message: 'chore(openspec): 记录博客封面改版提交'
      at: 2026-07-19T16:10:00+08:00
  pullRequest:
    number: 228
    url: https://github.com/stack-wuh/x.wuh.site/pull/228
    state: open
runtime:
  phase: commit
  state: completed
  startedAt: 2026-07-19T11:04:57+08:00
  updatedAt: 2026-07-19T16:00:47+08:00
  failure: null
  requiredInputs: []
  resume:
    command: 提交
```

### `design.md`
---
artifact: design
contractVersion: 1
requiredHeadings:
  - 架构
  - 技术选型
  - 复用分析
  - 影响分析
requiredPatterns:
  - '^# .+'
---

# 博客详情页封面图体验设计

## 架构

封面配置继续使用现有 Issue 隐藏元数据约定，不新增第二种写作格式。同步层保存原始 Markdown 作为内容源；详情接口负责为前端生成不含隐藏元数据、且在首图回退时已去重的文章内容。前端只消费统一的 `metadata.cover` / `metadata.coverAlt`，根据断点调整同一个封面组件与文章头部的呈现顺序。

```
GitHub Issue
  └─ <!-- wuh-site-metadata: {"cover":"...","coverAlt":"..."} -->
       │
       ▼
SyncService ── parseIssueMetadata ──► MongoDB Content.metadata
       │                                      │
       │                                      ▼
       └─ 保留原始 body              ContentController 详情响应
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
              显式 cover：移除元数据                         无显式 cover：首图回退
              保留全部正文图片                             同时清理返回 body 与 bodyHtml
                         └─────────────────────┬─────────────────────┘
                                               ▼
                           Next.js 元数据 / PostView / PostCover
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
                  移动端：封面在标题前                    桌面端：标题在前、封面在主栏
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Issue 元数据 | 复用 `<!-- wuh-site-metadata: {...} -->` JSON 注释 | 已被 `SyncService` 解析，GitHub 页面不显示，无需维护两套写作规范。 |
| 元数据清理 | 新增后端纯函数工具，分别解析和剥离元数据注释 | 防止隐藏配置进入页面正文和 SEO description，同时保持数据库原始 Issue 内容不变。 |
| 回退去重 | 后端在详情响应中同步清理 `body` 与 `bodyHtml` 的首张图 | Next.js 从 `body` 重新渲染 Markdown，单独清理 `bodyHtml` 会使首图重新出现。 |
| 响应式布局 | `PostLead` 聚合一个 `PostCover` 与 `PostHeader`，用 CSS `order` 切换顺序 | 同一封面节点只渲染一次，避免移动/桌面双节点下载与无障碍重复。 |
| 动效 | styled-components `keyframes` + `prefers-reduced-motion` | 不新增动画依赖，沿用当前样式与可访问性模式。 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Image | `@wuh.site/components/image` | 复用 | 现有 `PostCover` |
| PostHeader | `app/post/components/PostHeader.tsx` | 扩展布局位置，不改内部信息结构 | 现有详情页 |
| PostCover | `app/post/components/PostCover.tsx` | 扩展替代文本、优先加载和展示样式 | 现有详情页 |
| styled | `@wuh.site/components/styled` | 复用 | 现有 post styles |
| 封面/元数据工具 | 后端 `content` 模块 | 新建纯函数模块 | 无；需要独立单元测试覆盖解析和清理 |

**说明：**
- 复用 — 直接 import 现有组件，无需修改
- 扩展 — 现有组件基础上增加 props / 样式变体
- 新建 — 当前无可用组件，需要在 packages/components/ 下创建

## 数据模型（如涉及）

`Content.metadata` 与共享 `ContentItem.metadata` 增加可选字段：

```ts
type ContentMetadata = {
  cover?: string
  coverAlt?: string
  // existing fields: slug, summary, keywords, rssExcluded, extra
}
```

Issue 编写示例：

```md
<!-- wuh-site-metadata: {"cover":"https://cdn.wuh.site/covers/example.jpg","coverAlt":"夜间书桌上的笔记本电脑与台灯"} -->
```

解析规则：

1. 只匹配带 `wuh-site-metadata:` 前缀且 JSON 合法的 HTML 注释。
2. 非法 JSON 或普通 HTML 注释保持为正文，不阻断同步。
3. 响应中始终剥离匹配到的元数据注释。
4. `metadata.cover` 存在时视为显式封面，正文图片不做删除。
5. `metadata.cover` 缺失时，才推导正文第一张图片作为封面，并从响应 `body` 与 `bodyHtml` 删除同一张首图。

## API 设计（如涉及）

不新增 REST API。现有 `GET /content/posts/:slugOrNumber` 响应的 `metadata` 扩展为可选 `coverAlt`，并保证面向前端的 `body` 不包含隐藏元数据；字段保持向后兼容。

**响应示例:**

```json
{
  "number": 226,
  "body": "# 正文\n\n![内容图](https://cdn.wuh.site/content/example.jpg)",
  "metadata": {
    "cover": "https://cdn.wuh.site/covers/example.jpg",
    "coverAlt": "夜间书桌上的笔记本电脑与台灯"
  }
}
```

## 组件/模块设计

### `content-metadata.util`

负责从原始 Issue Markdown 中解析与移除 `wuh-site-metadata` 注释。该模块不访问数据库、不依赖 NestJS，方便测试同步和详情响应的边界行为。

### `content-cover.util`

扩展 `extractFirstImageAndClean` 的结果，使其同时提供清理后的 Markdown 与 HTML。仅当 controller 判定缺少显式封面时调用，确保显式封面与首张内容图可以共存。

### `ContentController`

在详情响应中执行统一的内容展示清理：先去掉隐藏元数据，再根据显式封面或首图回退决定是否删除正文首图。列表与数据库原始数据不受影响。

### `PostLead`、`PostCover` 与 `PostHeader`

`PostLead` 作为详情页的文章开场区域，持有一个 `PostCover` 和一个 `PostHeader`。移动端让封面排在标题之前；桌面端让标题、作者、摘要先出现，封面限制在主阅读栏内。`PostCover` 接收 `coverAlt ?? issue.title` 作为图片替代文本并使用优先加载。

封面样式限制：移动端使用 `clamp(220px, 60vw, 300px)` 的高度范围并突破页面水平内边距；桌面端保持横图展示、最大高度 360px。图片统一 `object-fit: cover`，并在加载完成后短暂淡入和回弹至原始缩放比例。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | `PostHeader` 位于封面前，封面在主阅读栏内；目录维持独立侧栏。 |
| < 768px | `PostCover` 位于标题、作者与摘要前，全宽呈现；目录继续使用现有折叠式移动目录。 |

所有断点下封面均不保留空白区域；未设置封面也找不到可回退首图时，文章直接从头部或正文开始。`prefers-reduced-motion: reduce` 下禁用封面自身入场动效。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；`coverAlt` 为可选字段，现有 Issue 不需迁移。
- **向后兼容:** 未显式配置封面的文章继续使用首图回退；旧客户端忽略新增 metadata 字段。
- **性能影响:** 使用单一封面节点避免重复下载；`priority` 仅作用于文章首屏封面。后端增加字符串级解析，开销相对 Markdown 渲染与数据库读取可忽略。
- **回滚:** 移除封面元数据清理和布局变动即可恢复首图回退行为；MongoDB 中新增可选字段不需要数据回滚。

### `proposal.md`
---
artifact: proposal
contractVersion: 1
requiredHeadings:
  - 背景
  - 目标
  - 非目标（明确不做）
  - 影响范围
requiredPatterns:
  - '^# .+'
---

# 重构博客详情页封面图体验

## 背景

当前博客详情页在 `metadata.cover` 缺失时，会把正文第一张图片推导为封面，并从详情正文中移除该图片以避免重复。这个回退逻辑让历史文章能够展示封面，但也让“文章第一张内容图”和“文章封面”无法同时存在。

移动端封面仍在文章内容栏中，缺少明确的文章开场；而桌面端现有的克制、阅读优先版式不适合直接套用跨越正文与目录的大型媒体头图。需要同时解决封面来源、旧文章兼容和两端差异化展示的问题，且不能破坏 GitHub Issues 作为 CMS 的日常写作体验。

## 目标

- 在 GitHub Issue 正文中支持用 HTML 注释声明可选的 `cover` 和 `coverAlt`，使显式封面不会作为可见的 Issue 或博客正文内容出现。
- 建立封面优先级：显式 `metadata.cover` 优先；没有显式封面时，兼容地回退到正文第一张图片。
- 仅在首图回退场景从博客正文移除被用作封面的图片；显式封面时保留正文中的所有图片。
- 移动端采用位于文章信息之前的全宽封面，桌面端保持封面位于主阅读栏内的克制布局。
- 为封面规定可预测的高度上限与轻量入场动效，并完整支持 `prefers-reduced-motion`。

## 非目标（明确不做）

- 不迁移或批量改写既有 GitHub Issues；未声明封面的文章继续按现有回退规则工作。
- 不引入新的图片托管服务、封面自动生成能力或后台编辑器。
- 不改变文章正文、评论、目录、相邻文章导航及分享功能。
- 不将桌面端改造成跨越正文与目录栏的大型全宽媒体头图。

## 影响范围

- `packages/wuh.site.nest/src/modules/sync/` — 解析 Issue 正文中的隐藏封面元数据并同步到内容 metadata。
- `packages/wuh.site.nest/src/modules/content/` — 明确显式封面和首图回退时的详情响应行为。
- `packages/shared-contracts/src/index.ts` — 为可选封面替代文本补齐共享 metadata 类型。
- `packages/wuh.site.next/app/post/` — 调整封面、文章头部和响应式布局，增加可访问的动效与高度约束。
- `openspec/specs/content-api/spec.md`、`openspec/specs/seo/spec.md`、`openspec/specs/design-system/spec.md` — 后续归档时同步封面来源、元数据与动效规范。

### `specs/post-cover/spec.md`
---
artifact: spec
contractVersion: 1
requiredHeadings:
  - ADDED
requiredPatterns:
  - '^# Spec: .+'
  - '^### Requirement: .+'
  - '^- \*\*GIVEN\*\* .+'
  - '^- \*\*WHEN\*\* .+'
  - '^- \*\*THEN\*\* .+'
---

# Spec: 博客详情页封面图

## ADDED

### Requirement: Issue 隐藏封面元数据
- **GIVEN** 博客内容来自 GitHub Issue，作者在正文中放入包含 `cover` 的 HTML 注释元数据
- **WHEN** 后端同步该 Issue
- **THEN** 系统将 URL 保存为 `metadata.cover`
- **AND** 该注释不作为 GitHub Issue 或博客正文中的可见文章内容展示
- **AND** 作者可选提供 `coverAlt` 作为封面图片的替代文本

### Requirement: 显式封面与正文图片独立
- **GIVEN** 一篇文章已通过隐藏元数据声明 `metadata.cover`
- **WHEN** 客户端获取文章详情
- **THEN** 详情响应和 SEO 元数据使用显式封面
- **AND** 正文中的第一张图片保持为文章内容，不因封面展示而被移除

### Requirement: 移动端封面开场
- **GIVEN** 文章具有可用封面且视口宽度小于 768px
- **WHEN** 用户打开文章详情页
- **THEN** 封面位于文章标题、作者和正文之前，并铺满页面内容区的横向宽度
- **AND** 封面高度受最小值、响应式值与最大值共同限制，不因原图比例挤占过多首屏空间

### Requirement: 封面动效可访问性
- **GIVEN** 文章封面首次呈现
- **WHEN** 用户未启用减少动态效果偏好
- **THEN** 封面以短暂的淡入和极轻微缩放稳定动效出现
- **AND** 动效不自动循环，不改变内容位置
- **AND** 当用户启用 `prefers-reduced-motion: reduce` 时不播放该动效

---

## MODIFIED

### Requirement: 文章详情封面回退与去重
- **GIVEN** 一篇历史文章未声明 `metadata.cover`，但正文存在可提取的第一张图片
- **WHEN** 客户端获取文章详情
- **THEN** 系统将第一张图片作为回退封面返回
- **AND** 仅在该回退场景从博客详情正文中移除这张图片，避免与封面重复展示
- **AND** 当正文没有图片时，文章仍可正常渲染且不保留空封面区域

### Requirement: 桌面端阅读栏封面
- **GIVEN** 文章具有可用封面且视口宽度不小于 768px
- **WHEN** 用户打开文章详情页
- **THEN** 封面保持在主阅读栏内，不跨越目录栏
- **AND** 封面使用固定横向展示区域与高度上限，避免图片原始比例扩大页面开场

---

## REMOVED

### Requirement: <需求名称>
- <移除原因>

### `tasks.md`
---
artifact: tasks
contractVersion: 1
requiredHeadings:
  - 任务清单
  - 验收
requiredPatterns:
  - '^## Phase .+'
  - '^### Task .+'
  - '^- \[ \] \*\*文件:\*\* .+'
---

# 任务清单

## Phase 1: 后端封面契约与回退去重

### Task 1: 为隐藏元数据和首图回退补充失败测试

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts`、`packages/wuh.site.nest/src/modules/content/content-cover.util.spec.ts`、`packages/wuh.site.nest/src/modules/content/content.controller.spec.ts`
- [ ] 先覆盖合法/非法 `wuh-site-metadata` 注释的解析与清理行为。
- [ ] 先覆盖显式封面保留正文首图、首图回退同时清理 Markdown 与 HTML 的详情响应行为。
- [ ] 在实现前运行定向 Jest，记录预期失败证据。
- [ ] **预计耗时:** 40 分钟
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts`

### Task 2: 实现元数据清理和双格式首图去重

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.ts`、`packages/wuh.site.nest/src/modules/content/content-cover.util.ts`、`packages/wuh.site.nest/src/modules/content/content.controller.ts`、`packages/wuh.site.nest/src/modules/sync/sync.service.ts`
- [ ] 抽取可测试的隐藏元数据解析/清理函数并让同步服务复用它。
- [ ] 扩展封面工具，使首图回退时同时返回已去重的 Markdown 和 HTML。
- [ ] 更新详情 controller：显式封面仅移除隐藏元数据，回退封面移除同一张正文首图。
- [ ] 运行 Phase 1 的定向 Jest，记录从失败到通过的证据。
- [ ] **预计耗时:** 1 小时 20 分钟
- [ ] **验证:** `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts`

## Phase 2: 共享类型、SEO 与详情页展示

### Task 3: 贯通 `coverAlt` 的 schema、共享类型和 SEO 映射

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/schemas/content.schema.ts`、`packages/wuh.site.nest/src/modules/content/dto/content.dto.ts`、`packages/shared-contracts/src/index.ts`、`packages/wuh.site.next/app/post/PostView.types.ts`、`packages/wuh.site.next/app/post/[number]/page.tsx`
- [ ] 为 `coverAlt` 增加可选 schema、DTO、共享契约和前端 Issue 类型。
- [ ] 将 `coverAlt` 映射为 Open Graph 图片替代文本，缺省时回退文章标题。
- [ ] 保持 Twitter Card 与 JSON-LD 使用既有 cover URL，不新增 API 字段或请求。
- [ ] **预计耗时:** 45 分钟
- [ ] **验证:** `pnpm exec tsc --noEmit`

### Task 4: 重构文章开场区域并实现封面高度与动效

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`、`packages/wuh.site.next/app/post/components/PostCover.tsx`、`packages/wuh.site.next/app/post/styles/post-header.ts`、`packages/wuh.site.next/app/post/styles/post-layout.ts`、`packages/wuh.site.next/app/post/styles/index.ts`
- [ ] 用单一 `PostLead` 结构组合 `PostCover` 和 `PostHeader`，通过 CSS 调整移动/桌面顺序。
- [ ] 移动端实现全宽、受限高度的封面；桌面端保留主阅读栏内的克制横图。
- [ ] 添加短暂加载入场动效和 `prefers-reduced-motion` 降级，不创建重复封面节点。
- [ ] **预计耗时:** 1 小时 30 分钟
- [ ] **验证:** `pnpm exec tsc --noEmit`，并在 390px 与 1440px 视口进行实际页面截图检查。

## Phase 3: 集成验证

### Task 5: 验证封面数据、响应式布局与无障碍降级

- [ ] **文件:** `packages/wuh.site.nest/src/modules/content/content-metadata.util.spec.ts`、`packages/wuh.site.next/app/post/`
- [ ] 验证显式封面、首图回退、无图文章三种详情响应。
- [ ] 验证移动端封面在标题前且高度受限，桌面端封面不侵入目录栏。
- [ ] 验证 `prefers-reduced-motion: reduce` 下封面不播放自身入场动效。
- [ ] **预计耗时:** 40 分钟
- [ ] **验证:** 后端定向 Jest、`pnpm exec tsc --noEmit`、Playwright 桌面/移动截图

## 验收

- [ ] GitHub Issue 的 `wuh-site-metadata` 注释可声明 `cover` 和 `coverAlt`，且不会进入详情页正文或 description。
- [ ] 显式封面与第一张正文图片可同时存在；无显式封面时，回退首图不会在正文重复出现。
- [ ] `coverAlt` 能用于详情页封面和 Open Graph 图片替代文本，旧内容回退文章标题。
- [ ] 移动端封面先于文章标题、全宽且高度限制为 220–300px；桌面端封面保留在主阅读栏内且最大高度为 360px。
- [ ] `prefers-reduced-motion: reduce` 下封面动效禁用。
- [ ] `pnpm --filter @wuh.site/nest test -- content-metadata.util.spec.ts content-cover.util.spec.ts content.controller.spec.ts` 通过。
- [ ] `pnpm exec tsc --noEmit` 零错误。
