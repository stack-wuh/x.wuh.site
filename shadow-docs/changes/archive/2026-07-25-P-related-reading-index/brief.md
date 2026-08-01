# 阅读余韵索引：文章页相关文章重设计

> 原始变更名：`2026-07-25-P-related-reading-index`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
文章详情页的“相关文章”模块当前仍呈现通用组件列表的语气，与站内衬线标题、留白、纸张感和连续阅读节奏不一致。用户已确认采用“阅读余韵索引”方案：以正文结束后的阅读延伸替代推荐卡片或产品信息流。

## 引用规范
- `specs/blog-detail/spec.md`

## 决策
本次变更仅替换文章详情页中 `relatedPosts` 的表现层。服务端仍以标签查询候选、按共享标签和时间排序、去重后最多保留三篇；页面继续在 `ArticleCard` 后、版权信息前渲染模块。

```text
getRelatedPosts / selectRelatedPosts（保持不变）
                    │
                    ▼
PostView.relatedPosts
                    │
                    ▼
RelatedPostsSection
├─ RelatedPostsHeader（继续阅读 + 数量 + 菱形分隔）
└─ RelatedPostLink × 1..3
   ├─ RelatedPostIndex（01–03）
   ├─ RelatedPostContent
   │  ├─ RelatedPostTitle
   │  ├─ RelatedPostSummary（可选）
   │  └─ RelatedPostLabels
   └─ RelatedPostArrow（aria-hidden）
```

每项保持单一链接语义：标题、摘要、标签和箭头均属于同一个可点击目标。无摘要时不渲染摘要节点，避免占位留白。

| 维度 | 选择 | 理由 |
|------|------|------|
| 样式承载 | styled-components 与现有 post 样式模块 | 保持项目样式架构和主题变量解析方式一致。 |
| 视觉语言 | 编辑型索引、细分隔线、序号、低强调标签文本 | 贴合文章详情页的纸张感和衬线阅读节奏，避免产品卡片语言。 |
| 布局 | CSS Grid：序号 / 弹性内容 / 箭头 | 桌面与窄屏均能稳定保留阅读索引层级。 |
| 摘要 | 复用 `RelatedPost.summary`，CSS 两行截断 | 无需 API 或类型扩展，可提高继续阅读判断效率。 |
| 动效 | 仅箭头 160–200ms 色彩/3px 位移 | ui-ux-pro-max 建议减少同屏动效；不干扰阅读。 |
| 无障碍 | 整项链接、focus-visible、reduced-motion、44px 触达 | 支持键盘、触屏与减少动态偏好。 |

## 任务
### Phase 1: 回归约束与模块结构
- [ ] **文件:** `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
- [ ] 将现有“轻量列表”断言升级为索引头部、数量、序号、可选摘要、文本标签和无卡片约束。
- [ ] 断言整项链接有可访问名称，箭头为非交互装饰，样式包含 reduced-motion 分支。
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待执行。
- [ ] **验证:** `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs` 在生产代码变更前失败。
- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 将“相关文章”标题替换为“继续阅读”索引头部，显示准确数量和菱形装饰语义。
- [ ] 为每项渲染两位序号、标题、仅在有值时出现的摘要、格式化共享标签与 aria-hidden 箭头。
- [ ] 保持 `relatedPosts.length > 0` 条件、`buildPostUrl` 内链和单一整项链接语义。
- [ ] **预计耗时:** 35 分钟；**实际耗时:** 待执行。
- [ ] **验证:** 阅读 JSX，确认无额外链接、无数据层或 API 修改。
### Phase 2: 视觉、响应式与无障碍实现
- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-article.ts`, `packages/wuh.site.next/app/post/styles/index.ts`
- [ ] 使用现有 token 实现分隔线、CSS 菱形、三列 grid、两行摘要截断、文本标签和整项焦点状态。
- [ ] 删除或替换现有相关文章通用列表样式，确保无卡片背景、外层圆角、阴影与抬升 transform。
- [ ] 在 640px、420px 和 reduced-motion 媒体规则中处理换行、44px 触达和箭头动效降级。
- [ ] **预计耗时:** 50 分钟；**实际耗时:** 待执行。
- [ ] **验证:** 复查样式只使用既有 CSS token；不产生横向滚动选择器风险。
### Phase 3: 集成验证
- [ ] **文件:** `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`, `packages/wuh.site.next/app/post/PostView.tsx`, `packages/wuh.site.next/app/post/styles/post-article.ts`
- [ ] 运行相关文章回归测试与相关结构化数据测试，确认 SEO 内链和 Breadcrumb JSON-LD 不受影响。
- [ ] 执行差异检查，检查无意外修改和样式契约。
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待执行。
- [ ] **验证:**
- [ ] 有相关文章时，正文后展示“继续阅读”和准确的文章数量；无相关文章时不显示模块。
- [ ] 每项为一个可聚焦的整行链接，包含序号、标题、可选摘要、文本化共享标签和装饰箭头。
- [ ] 桌面端无外层卡片、背景、阴影、圆角容器或 hover 抬升。
- [ ] 375px 视口无横向滚动，单项触达高度不低于 44px。
- [ ] 减少动态偏好下不发生箭头位移。
- [ ] 相关文章选择、上限、站内 canonical 内链和结构化数据保持不变。

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
  id: 2026-07-25-P-related-reading-index
  title: 阅读余韵索引：文章页相关文章重设计
  type: feature
  status: archived
  createdAt: 2026-07-25T09:50:00+08:00
  issue: https://github.com/stack-wuh/x.wuh.site/issues/263

artifacts:
  proposal:
    path: openspec/changes/archive/2026-07-25-P-related-reading-index/proposal.md
    status: completed
    summary: 将相关文章从通用列表重构为低动效、无卡片的阅读余韵索引。
    template:
      id: proposal
      source: skills/shadow-dev-propose/templates/proposal.md
      contractVersion: 1
      digest: sha256:426c31b60cb50e7457a6e4aa6f86c9bd6718cdd6217f292d98f1b9739ad612fd
    validation: { status: passed, checkedAt: 2026-07-25T09:50:00+08:00, missing: [] }
  design:
    path: openspec/changes/archive/2026-07-25-P-related-reading-index/design.md
    status: completed
    summary: 以单一整项链接和编辑型索引替换通用相关文章列表，复用既有 RelatedPost 数据。
    template:
      id: design
      source: skills/shadow-dev-propose/templates/design.md
      contractVersion: 1
      digest: sha256:2483c466de2ab4e8e34a1e147e098a6cef61ff6b5a69d567f565987fdd77b3e4
    validation: { status: passed, checkedAt: 2026-07-25T10:05:00+08:00, missing: [] }
  tasks:
    path: openspec/changes/archive/2026-07-25-P-related-reading-index/tasks.md
    status: completed
    summary: 四个串并行受控任务：测试契约、JSX、样式导出与集成验证。
    template:
      id: tasks
      source: skills/shadow-dev-propose/templates/tasks.md
      contractVersion: 1
      digest: sha256:d67578bdb054f235acd942e8cf1bb436abbd6831ff52469e30b82c9c845d37f9
    validation: { status: passed, checkedAt: 2026-07-25T10:05:00+08:00, missing: [] }
  specs:
    status: completed
    entries:
      - path: openspec/changes/archive/2026-07-25-P-related-reading-index/specs/blog-detail/spec.md
        template:
          id: spec
          source: skills/shadow-dev-propose/templates/spec.md
          contractVersion: 1
          digest: sha256:322bb9b2a379e72fa08f5ce84fbee689fddac788245ebf2c4d01153947072ea5
        validation: { status: passed, checkedAt: 2026-07-25T09:50:00+08:00, missing: [] }

proposal:
  status: completed
  source: { type: manual, issueNumber: 263 }
  intent: 将博客详情页相关文章重设计为阅读余韵索引，恢复与站内阅读风格一致的层级与交互。
  background: 现有相关文章模块仍像通用产品列表，缺少与文章页纸张感、衬线标题和留白节奏的联系。
  goals:
    - 保留相关文章功能与内链，重构展示为阅读索引。
    - 使用摘要、共享标签和序号提升继续阅读判断。
    - 覆盖键盘、移动端和减少动态偏好。
  nonGoals:
    - 不改变相关文章数据来源、排序、上限或服务端请求。
    - 不引入新 API、依赖、字体、颜色或组件库。
  scope:
    packages: [packages/wuh.site.next]
    files:
      - packages/wuh.site.next/app/post/PostView.tsx
      - packages/wuh.site.next/app/post/styles/post-article.ts
      - packages/wuh.site.next/app/post/styles/index.ts
      - packages/wuh.site.next/test/seo-p12-related-posts.test.mjs
  acceptanceCriteria:
    - 正文后显示无卡片的继续阅读索引。
    - 索引项提供序号、标题、可选摘要、共享标签和箭头。
    - 每项可键盘访问，窄屏无横向滚动，减少动态偏好下无位移动画。
  constraints:
    - 复用 --font-serif、--text-*、--primary-color、--accent-color 和 --space-* 令牌。
    - 保持相关文章选择逻辑和现有 SEO 内链不变。
  risks:
    - 增加摘要可能使窄屏列表变高，需用两行截断与响应式网格控制。
    - 样式选择器变化可能影响主题组合，需验证 wine/plain × light/dark。
  domain:
    name: blog-detail
    keywords: [博客详情, 相关文章, 阅读体验, UI, 响应式, 可访问性]
    description: 博客详情页中相关文章索引的展示、交互和可访问性规范。
  uiux:
    mode: required
    triggers: [组件, 视觉, UI, 交互, 响应式, 无障碍]
    rationale: 本变更直接重设计文章详情页的可见模块、阅读层级与交互反馈。

discuss:
  status: completed
  decisions:
    - id: related-reading-index
      question: 相关文章应以何种视觉与交互形式呈现？
      options: [阅读余韵索引, 脚注式延伸阅读, 摘录式同题阅读]
      selected: 阅读余韵索引
      rationale: 用户已确认方案 A；它保留继续阅读判断信息，同时避免卡片语言干扰文章阅读节奏。
  architecture:
    summary: PostView 复用现有 relatedPosts 数据，渲染索引头部和单一链接项目；post-article 样式承载三列网格、响应式与低动效。
    modules: [RelatedPostsSection, RelatedPostsHeader, RelatedPostLink, RelatedPostIndex, RelatedPostContent, RelatedPostSummary, RelatedPostLabels, RelatedPostArrow]
  contracts:
    api: []
    data: [RelatedPost.number, RelatedPost.title, RelatedPost.summary, RelatedPost.sharedLabels]
  reuse:
    components: [PostView, buildPostUrl, RelatedPost, styled-components, CSS theme tokens]
    newComponents: []
  implementationNotes:
    - 已读 packages/wuh.site.next/app/post/PostView.tsx、post-article.ts、styles/index.ts、seo-p12-related-posts.test.mjs 与 related-posts.ts。
    - UI/UX 设计输入已使用 ui-ux-pro-max；采用编辑型索引、可见焦点、单一低动效和 prefers-reduced-motion。
  impact:
    dependencies: []
    compatibility: 不改变数据选择、内链、结构化数据或 API；summary 缺失时仅省略摘要节点。
    rollback: 回滚 PostView 与 post-article 样式即可恢复现有轻量列表，数据层不受影响。
  uiux:
    status: completed
    triggers: [组件, 视觉, UI, 交互, 响应式, 无障碍]
    capabilities: [ui-ux-pro-max: ux, ui-ux-pro-max: style]
    decisions: [单一整项链接, 细分隔线与 CSS 菱形, 序号加可选摘要, 文本化共享标签, 箭头仅 3px 低动效]
    accessibility: [focus-visible 覆盖整项, 键盘顺序与视觉一致, 44px 触达, aria-hidden 箭头, reduced-motion 无位移]
    acceptanceCriteria: [无外层卡片背景阴影或抬升, 摘要两行截断, 窄屏无横向滚动, 使用现有主题令牌]

apply:
  status: completed
  generatedFrom: [proposal, discuss]
  instructions: [先运行 Task T1 的红灯验证，再修改生产代码；仅修改 YAML 所列文件。]
  workflow:
    - id: T1
      title: 建立阅读余韵索引回归契约
      status: completed
      dependsOn: []
      files: [packages/wuh.site.next/test/seo-p12-related-posts.test.mjs]
      instructions: [补充索引头部、数量、序号、可选摘要、文本标签、单一链接、reduced-motion 和无卡片约束断言。]
      verification: [node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs]
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs
          result: failed as expected before implementation; missing reading-index structure and styles
          at: 2026-07-25T10:18:00+08:00
      failure: null
    - id: T2
      title: 实现详情页索引语义结构
      status: completed
      dependsOn: [T1]
      files: [packages/wuh.site.next/app/post/PostView.tsx]
      instructions: [渲染继续阅读头部、数量、序号、可选摘要、格式化共享标签和 aria-hidden 箭头；保持单一链接与 buildPostUrl。]
      verification: [阅读 JSX 结构，确认无额外链接和数据层修改。]
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence:
        - command: JSX inspection
          result: passed; rendered index header, count, sequence, optional summary, text labels, aria label and decorative arrow while preserving buildPostUrl
          at: 2026-07-25T10:23:00+08:00
      failure: null
    - id: T3
      title: 实现编辑型索引样式与导出
      status: completed
      dependsOn: [T1]
      files: [packages/wuh.site.next/app/post/styles/post-article.ts, packages/wuh.site.next/app/post/styles/index.ts]
      instructions: [实现 token 化细分隔、菱形、三列 grid、摘要截断、整项焦点、窄屏和 reduced-motion；移除卡片式表现。]
      verification: [检查仅使用既有 CSS token，且无卡片背景、阴影或 transform 抬升。]
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence:
        - command: style inspection
          result: passed; token-only editorial grid, 44px target, responsive breakpoints and reduced-motion guard added without card background, shadow or lift
          at: 2026-07-25T10:23:00+08:00
      failure: null
    - id: T4
      title: 集成验证阅读余韵索引
      status: completed
      dependsOn: [T2, T3]
      files: [packages/wuh.site.next/test/seo-p12-related-posts.test.mjs, packages/wuh.site.next/app/post/PostView.tsx, packages/wuh.site.next/app/post/styles/post-article.ts]
      instructions: [运行相关文章与结构化数据回归测试，并检查差异。]
      verification: [node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs, node --experimental-strip-types --test packages/wuh.site.next/test/seo-p1-structured-data.test.mjs, git diff --check]
      requiredInputs: []
      attempts: 0
      maxAttempts: 2
      evidence:
        - command: node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs
          result: passed (3/3)
          at: 2026-07-25T10:25:00+08:00
        - command: node --experimental-strip-types --test packages/wuh.site.next/test/seo-p1-structured-data.test.mjs
          result: passed (7/7)
          at: 2026-07-25T10:25:00+08:00
        - command: git diff --check
          result: passed
          at: 2026-07-25T10:25:00+08:00
      failure: null
  repairWorkflow: []
  checkpoint: { lastCompletedTaskId: T4, updatedAt: 2026-07-25T10:25:00+08:00 }

review:
  status: passed
  verification:
    - id: artifact-contracts
      command: validate-artifact-contract.mjs (proposal, design, tasks, spec)
      result: passed
      summary: 四份固定产物均重新通过模板契约校验。
      at: 2026-07-25T10:35:00+08:00
    - id: related-posts-regression
      command: node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs
      result: passed
      summary: 3/3；覆盖索引结构、摘要回退、无卡片与 reduced-motion 契约。
      at: 2026-07-25T10:35:00+08:00
    - id: structured-data-regression
      command: node --experimental-strip-types --test packages/wuh.site.next/test/seo-p1-structured-data.test.mjs
      result: passed
      summary: 7/7；Breadcrumb JSON-LD 与文章结构化数据不受影响。
      at: 2026-07-25T10:35:00+08:00
    - id: diff-check
      command: git diff --check
      result: passed
      summary: 未发现空白或冲突标记问题。
      at: 2026-07-25T10:35:00+08:00
    - id: type-check
      command: PATH=$HOME/.nvm/versions/node/v20.20.2/bin:$PATH ../../node_modules/.bin/tsc --noEmit
      result: unavailable
      summary: 隔离 worktree 缺少完整 workspace 依赖；全仓报出既有 console/nest 模块解析失败，无法作为本变更类型检查结论。
      at: 2026-07-25T10:35:00+08:00
  findings:
    - id: R-001
      severity: warning
      file: packages/wuh.site.next/app/post/PostView.tsx
      message: 未能在完整依赖环境中执行类型检查或启动真实浏览器，对四主题组合与 375px 视觉表现尚无运行时证据；源码检查与回归测试未发现实现偏离。
      status: accepted
  summary: 代码实现符合已确认的阅读余韵索引结构、数据复用、无卡片、单一链接、键盘焦点和 reduced-motion 约束；R-001 环境验证 warning 已由用户明确接受。
archive:
  status: completed
  archivedAt: 2026-07-25T10:45:00+08:00
  movedAt: 2026-07-25T10:45:00+08:00
  specSync:
    - domain: blog-detail
      source: openspec/changes/archive/2026-07-25-P-related-reading-index/specs/blog-detail/spec.md
      target: openspec/specs/blog-detail/spec.md
      result: updated
      evidence:
        - command: validate-artifact-contract.mjs --template spec.md --artifact archived spec
          result: passed
          at: 2026-07-25T10:45:00+08:00
  indexEntry:
    domain: blog-detail
    path: openspec/INDEX.md
    result: updated
    evidence:
      - command: rg blog-detail openspec/INDEX.md
        result: passed
        at: 2026-07-25T10:45:00+08:00
  componentScenarios:
    - component: PostView related reading index
      decision: not_applicable
      reason: 页面专属表现层调整，未新增通用组件、props 组合或可复用 demo 场景。
      evidence:
        - command: inspect design.md reuse analysis and navigation-guide.yaml
          result: passed
          at: 2026-07-25T10:45:00+08:00

commit:
  status: pending
  branch: codex/263-feat-阅读余韵索引
  commits:
    - hash: 655a9e736d940b8a2b762f2bf25f9c6c079ca4e3
      message: feat(next): add related reading index
      at: 2026-07-25T10:56:00+08:00
    - hash: 4a28959
      message: chore(openspec): record related reading commit
      at: 2026-07-25T10:58:00+08:00
  pullRequest:
    number: 265
    url: https://github.com/stack-wuh/x.wuh.site/pull/265
    state: open

runtime:
  phase: commit
  state: completed
  attempts: 1
  resume: { taskId: null, command: 提交代码 }
  requiredInputs:
    - key: review-warnings-decision
      description: 用户已接受 R-001；完整依赖环境中的类型与运行时视觉验收交由 CI 或部署环境完成。
      supplied: true
  failure: null
  updatedAt: 2026-07-25T11:00:00+08:00
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

# 阅读余韵索引设计文档

## 架构

本次变更仅替换文章详情页中 `relatedPosts` 的表现层。服务端仍以标签查询候选、按共享标签和时间排序、去重后最多保留三篇；页面继续在 `ArticleCard` 后、版权信息前渲染模块。

```text
getRelatedPosts / selectRelatedPosts（保持不变）
                    │
                    ▼
PostView.relatedPosts
                    │
                    ▼
RelatedPostsSection
├─ RelatedPostsHeader（继续阅读 + 数量 + 菱形分隔）
└─ RelatedPostLink × 1..3
   ├─ RelatedPostIndex（01–03）
   ├─ RelatedPostContent
   │  ├─ RelatedPostTitle
   │  ├─ RelatedPostSummary（可选）
   │  └─ RelatedPostLabels
   └─ RelatedPostArrow（aria-hidden）
```

每项保持单一链接语义：标题、摘要、标签和箭头均属于同一个可点击目标。无摘要时不渲染摘要节点，避免占位留白。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 样式承载 | styled-components 与现有 post 样式模块 | 保持项目样式架构和主题变量解析方式一致。 |
| 视觉语言 | 编辑型索引、细分隔线、序号、低强调标签文本 | 贴合文章详情页的纸张感和衬线阅读节奏，避免产品卡片语言。 |
| 布局 | CSS Grid：序号 / 弹性内容 / 箭头 | 桌面与窄屏均能稳定保留阅读索引层级。 |
| 摘要 | 复用 `RelatedPost.summary`，CSS 两行截断 | 无需 API 或类型扩展，可提高继续阅读判断效率。 |
| 动效 | 仅箭头 160–200ms 色彩/3px 位移 | ui-ux-pro-max 建议减少同屏动效；不干扰阅读。 |
| 无障碍 | 整项链接、focus-visible、reduced-motion、44px 触达 | 支持键盘、触屏与减少动态偏好。 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| `PostView` | `packages/wuh.site.next/app/post/PostView.tsx` | 扩展 | 文章正文后模块组织方式 |
| `RelatedPost` 数据类型 | `packages/wuh.site.next/app/lib/related-posts.ts` | 复用 | 已含 `summary` 与 `sharedLabels` |
| `buildPostUrl` | `packages/wuh.site.next/app/lib/slug.ts` | 复用 | 维持 canonical 站内内链 |
| post 样式导出 | `packages/wuh.site.next/app/post/styles/index.ts` | 扩展 | 新增索引表现层导出 |
| post 样式模块 | `packages/wuh.site.next/app/post/styles/post-article.ts` | 扩展 | 复用主题 token 与文章布局上下文 |

**说明：**
- 复用 — 不修改数据选择、URL 生成或主题系统。
- 扩展 — 仅增加相关文章表现层样式与 JSX 结构。
- 新建 — 不在 `packages/components` 中新增通用组件；该模块是文章详情页专属场景。

## 数据模型（如涉及）

不新增 DTO、Schema 或接口。复用现有 `RelatedPost`：

```ts
type RelatedPost = {
  number: number
  title: string
  labels: string[]
  updatedAt: string
  summary?: string | null
  sharedLabels: string[]
}
```

`summary` 为空、仅空白或不存在时不渲染摘要区域；`sharedLabels` 最多显示两个，并格式化为 `#标签一 · #标签二`。

## API 设计（如涉及）

本变更不涉及 API、请求参数或响应格式变更。

## 组件/模块设计

### RelatedPostsSection

职责：提供正文后阅读延伸的语义 section 与装饰分隔。无外层背景、阴影、圆角容器或 hover 抬升。

### RelatedPostsHeader

职责：显示“继续阅读”、相关文章数量和 CSS 菱形分隔。标题采用 `--font-serif`；数量采用 `--text-muted`，不承担唯一语义。

### RelatedPostLink

职责：作为单一链接承载项目所有内容。使用三列 grid；`aria-label` 为“继续阅读：{title}”。Hover 仅改变标题和箭头颜色并使箭头右移 3px；focus-visible 覆盖整项。

### RelatedPostContent

职责：容纳标题、可选摘要与标签。标题单行截断，摘要两行截断，标签允许在窄屏换行。

### RelatedPostIndex / RelatedPostArrow

职责：分别提供索引节奏和方向暗示。箭头使用文本或 CSS 图形且 `aria-hidden="true"`，不增加单独焦点目标。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| > 640px | 三列 grid，标题计数同一行，标签与摘要位于内容列。 |
| ≤ 640px | 计数自然换行；序号、内容、箭头保留；内容列最小宽度为 0 以避免溢出。 |
| ≤ 420px | 单项最小高度 44px；摘要最多两行；标签可换行；不产生横向滚动。 |
| `prefers-reduced-motion: reduce` | 移除箭头 transform transition，保留颜色和焦点反馈。 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；数据选择、链接和 section 出现条件保持不变。
- **向后兼容:** `RelatedPost.summary` 已为可选字段；缺失时降级为标题与标签索引。
- **性能影响:** 仅增加少量静态 DOM 和 CSS；不新增请求、图片或客户端状态。
- **视觉验收:** 使用 `--font-serif`、`--text-*`、`--primary-color`、`--accent-color`、`--space-*`；无 raw hex、新字体、外层卡片、阴影和抬升动效。
- **回滚:** 可仅回滚 `PostView.tsx` 与 post-article 样式改动，数据层不受影响。

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

# 阅读余韵索引：文章页相关文章重设计

## 背景

文章详情页的“相关文章”模块当前仍呈现通用组件列表的语气，与站内衬线标题、留白、纸张感和连续阅读节奏不一致。用户已确认采用“阅读余韵索引”方案：以正文结束后的阅读延伸替代推荐卡片或产品信息流。

## 目标

- 将相关文章模块重构为无卡片、无阴影、低动效的阅读索引。
- 复用现有相关文章排序、数量上限和站内内链，只调整展示结构、样式与交互。
- 利用已有摘要和共享标签帮助读者判断下一篇是否值得阅读。
- 满足键盘访问、移动端 44px 触达、主题令牌复用与 reduced-motion 要求。

## 非目标（明确不做）

- 不改变相关文章的服务端查询、排序、去重或三篇上限。
- 不新增 API、DTO、图片封面、评分、点赞或异步加载。
- 不调整正文、版权、分享、评论和上下篇导航模块。
- 不引入新的字体、色板、阴影体系或第三方依赖。

## 影响范围

- `packages/wuh.site.next/app/post/PostView.tsx` — 调整相关文章模块的语义结构与可访问性属性。
- `packages/wuh.site.next/app/post/styles/post-article.ts` — 实现阅读余韵索引的视觉、响应式与动效约束。
- `packages/wuh.site.next/app/post/styles/index.ts` — 导出新增或调整后的样式模块。
- `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs` — 覆盖展示、无卡片约束与交互结构回归。

### `specs/blog-detail/spec.md`
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

# Spec: 博客详情页阅读余韵索引

## ADDED

### Requirement: 相关文章以阅读余韵索引呈现
- **GIVEN** 博客详情页存在至少一篇相关文章
- **WHEN** 用户阅读完正文卡片
- **THEN** 页面应在正文之后、来源与版权信息之前展示“继续阅读”模块
- **AND** 模块应展示相关文章数量与低对比度装饰分隔线
- **AND** 模块不应使用外层卡片背景、阴影或圆角容器

### Requirement: 索引项提供阅读判断信息
- **GIVEN** 一篇相关文章包含标题、可选摘要和共享标签
- **WHEN** 相关文章索引项渲染
- **THEN** 应展示两位序号、标题、共享标签和非交互箭头
- **AND** 有摘要时摘要最多显示两行
- **AND** 无摘要时不得留下摘要空白区域
- **AND** 共享标签应以低强调文本呈现，不应使用彩色胶囊标签

### Requirement: 索引项可访问且具备克制反馈
- **GIVEN** 用户以鼠标、键盘或触屏访问相关文章索引
- **WHEN** 用户悬停、聚焦或激活某一索引项
- **THEN** 整项应作为单个可点击链接
- **AND** 键盘焦点应具有清晰的 focus-visible 状态
- **AND** hover 只改变标题与箭头的颜色，并使箭头轻微右移
- **AND** 不得使用卡片抬升、阴影或大面积背景变化

### Requirement: 索引在窄屏和减少动态偏好下保持可用
- **GIVEN** 视口宽度不大于 640px 或用户启用减少动态偏好
- **WHEN** 模块渲染或被交互
- **THEN** 文字不应造成横向滚动且单项触达高度不低于 44px
- **AND** 摘要最多显示两行，标签可自然换行
- **AND** 在 prefers-reduced-motion 下不得执行箭头位移动画

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

## Phase 1: 回归约束与模块结构

### Task 1: 建立阅读余韵索引回归契约

- [ ] **文件:** `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
- [ ] 将现有“轻量列表”断言升级为索引头部、数量、序号、可选摘要、文本标签和无卡片约束。
- [ ] 断言整项链接有可访问名称，箭头为非交互装饰，样式包含 reduced-motion 分支。
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待执行。
- [ ] **验证:** `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs` 在生产代码变更前失败。

### Task 2: 实现详情页索引语义结构

- [ ] **文件:** `packages/wuh.site.next/app/post/PostView.tsx`
- [ ] 将“相关文章”标题替换为“继续阅读”索引头部，显示准确数量和菱形装饰语义。
- [ ] 为每项渲染两位序号、标题、仅在有值时出现的摘要、格式化共享标签与 aria-hidden 箭头。
- [ ] 保持 `relatedPosts.length > 0` 条件、`buildPostUrl` 内链和单一整项链接语义。
- [ ] **预计耗时:** 35 分钟；**实际耗时:** 待执行。
- [ ] **验证:** 阅读 JSX，确认无额外链接、无数据层或 API 修改。

## Phase 2: 视觉、响应式与无障碍实现

### Task 3: 实现编辑型索引样式与导出

- [ ] **文件:** `packages/wuh.site.next/app/post/styles/post-article.ts`, `packages/wuh.site.next/app/post/styles/index.ts`
- [ ] 使用现有 token 实现分隔线、CSS 菱形、三列 grid、两行摘要截断、文本标签和整项焦点状态。
- [ ] 删除或替换现有相关文章通用列表样式，确保无卡片背景、外层圆角、阴影与抬升 transform。
- [ ] 在 640px、420px 和 reduced-motion 媒体规则中处理换行、44px 触达和箭头动效降级。
- [ ] **预计耗时:** 50 分钟；**实际耗时:** 待执行。
- [ ] **验证:** 复查样式只使用既有 CSS token；不产生横向滚动选择器风险。

## Phase 3: 集成验证

### Task 4: 验证相关文章行为与视觉契约

- [ ] **文件:** `packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`, `packages/wuh.site.next/app/post/PostView.tsx`, `packages/wuh.site.next/app/post/styles/post-article.ts`
- [ ] 运行相关文章回归测试与相关结构化数据测试，确认 SEO 内链和 Breadcrumb JSON-LD 不受影响。
- [ ] 执行差异检查，检查无意外修改和样式契约。
- [ ] **预计耗时:** 20 分钟；**实际耗时:** 待执行。
- [ ] **验证:**
  - `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p12-related-posts.test.mjs`
  - `node --experimental-strip-types --test packages/wuh.site.next/test/seo-p1-structured-data.test.mjs`
  - `git diff --check`

## 验收

- [ ] 有相关文章时，正文后展示“继续阅读”和准确的文章数量；无相关文章时不显示模块。
- [ ] 每项为一个可聚焦的整行链接，包含序号、标题、可选摘要、文本化共享标签和装饰箭头。
- [ ] 桌面端无外层卡片、背景、阴影、圆角容器或 hover 抬升。
- [ ] 375px 视口无横向滚动，单项触达高度不低于 44px。
- [ ] 减少动态偏好下不发生箭头位移。
- [ ] 相关文章选择、上限、站内 canonical 内链和结构化数据保持不变。
