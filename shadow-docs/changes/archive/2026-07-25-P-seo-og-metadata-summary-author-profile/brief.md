# SEO Batch C：OG 图片、metadata、语义摘要与作者档案

> 原始变更名：`2026-07-25-P-seo-og-metadata-summary-author-profile`

## 元数据
- 日期：历史记录未提供
- 类型：历史记录未提供
- 状态：历史记录未提供
- Issue：历史记录未提供

## 动机
当前博客详情页已经输出部分 Open Graph、Twitter Card 和 BlogPosting metadata，但仍存在以下问题：无封面文章没有稳定的分享图片；文章 metadata 没有完整表达作者、关键词和分类；摘要通过正则清理 Markdown，可能把代码块或结构符号带入摘要；`/about` 页面缺少可供搜索引擎识别的作者档案结构化数据。

Issue #253（Refs #233，前置集成 PR #252）将这些问题归入 SEO Batch C，目标是在不扩大本批次范围的前提下，提高内容分享展示质量、搜索结果摘要可读性和作者实体识别能力。

## 引用规范
- `specs/seo/spec.md`

## 决策
```text
ContentItem / GitHubProfileDto
          │
          ├── app/lib/markdown.ts
          │      └── extractFirstParagraphText()
          │
          └── app/lib/seo.ts
                 ├── buildArticleDescription()
                 ├── buildArticleMetadata()
                 ├── buildBlogPostingJsonLd()
                 └── buildProfilePageJsonLd()
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   app/layout.tsx   post/[number]/page.tsx  about/page.tsx
        │                 │                 │
   默认站点 metadata  文章 metadata + JSON-LD  ProfilePage JSON-LD
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 摘要解析 | 复用 `unified + remark-parse + remark-gfm` | 依赖已经存在，和正文渲染使用同一 Markdown 语义，不需要正则猜测结构 |
| AST 遍历 | 新增小型递归文本提取函数 | 只需要段落、文本和少量 inline 节点，不为一次性需求引入 `unist-util-visit` 或 `mdast-util-to-string` |
| SEO 规则 | `app/lib/seo.ts` 纯函数 | 页面逻辑只负责数据获取，规则可通过 Node test runner 独立验证 |
| 默认图片 | `public/og-default.png` | 静态资源部署稳定，适合社交平台抓取，尺寸固定为 1200×630 |
| 结构化数据 | 复用 `JsonLd` | 保持现有 JSON-LD 输出方式，避免新增组件或重复安全边界 |
| 测试 | `.mjs` + Node `node:test` | 匹配仓库现有测试方式，覆盖纯函数输入输出和关键页面源码契约 |

## 任务
### Phase 1: AST 与 SEO 纯函数
- [ ] **文件:** `packages/wuh.site.next/app/lib/markdown.ts`, `packages/wuh.site.next/test/markdown-summary.test.mjs`
- [ ] 在现有 Markdown processor 旁新增 `extractFirstParagraphText(markdown, maxLength = 160)`，使用 `remarkParse` 与 `remarkGfm` 解析 AST。
- [ ] 只接受根节点首个有效 `paragraph`；跳过 `heading`、`code`、空段落和仅空白节点。
- [ ] 递归提取普通文本、链接、强调、删除线和行内代码中的可读文字，归一化空白并按 160 字符截断。
- [ ] 没有有效段落时返回 `阅读这篇博客文章`。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/markdown-summary.test.mjs`；覆盖标题/代码块先出现、空段落、GFM inline 节点、截断和空正文。
- [ ] **文件:** `packages/wuh.site.next/app/lib/seo.ts`, `packages/wuh.site.next/test/seo-metadata.test.mjs`
- [ ] 新建 `DEFAULT_OG_IMAGE_PATH`、`buildArticleDescription`、`getArticleKeywords`、`getArticleCategory`、`getArticleImage`、`buildArticleMetadata`、`buildBlogPostingJsonLd` 和 `buildProfilePageJsonLd`。
- [ ] 实现字段优先级：CMS summary 优先自动摘要；CMS keywords 优先 labels；`metadata.extra.category` 优先首个 label；显式 cover 优先默认图片。
- [ ] Article metadata 返回 authors、keywords、category、canonical、Open Graph、Twitter Card；BlogPosting 与 metadata 使用同一 description/image/author 映射。
- [ ] ProfilePage 使用稳定 `@id`、mainEntity Person 和 GitHub `sameAs`，profile 为 null 时仍输出可识别实体。
- [ ] **预计耗时:** 1.5 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-metadata.test.mjs`；覆盖所有优先级组合、默认图回退、authors/category、BlogPosting 和 ProfilePage 结构。
### Phase 2: 页面接入与默认资源
- [ ] **文件:** `packages/wuh.site.next/public/og-default.png`, `packages/wuh.site.next/app/layout.tsx`, `packages/wuh.site.next/test/seo-source-contract.test.mjs`
- [ ] 创建尺寸固定为 1200×630 的全站默认分享图片，文件放在 Next public 目录并可通过 `/og-default.png` 访问。
- [ ] 在根 layout metadata 中设置默认 Open Graph image、Twitter `summary_large_image` card、Twitter image、siteName 和站点级描述，不覆盖已有 robots、metadataBase 和 RSS link。
- [ ] 通过源码契约测试确认默认资源路径、1200×630 资源存在、根 metadata 配置存在且没有动态标题图实现。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-source-contract.test.mjs`；使用图片解析或文件头检查确认 PNG 尺寸为 1200×630。
- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`, `packages/wuh.site.next/app/post/PostView.types.ts`, `packages/wuh.site.next/test/seo-metadata.test.mjs`
- [ ] 删除页面内基于正则的 `buildDescription`，改为调用 `app/lib/seo.ts` 的纯函数。
- [ ] 让 `generateMetadata` 在有 cover 时保留 cover，在无 cover 时同时写入默认 `openGraph.images` 与 `twitter.images`。
- [ ] 将 authors、keywords、category 写入文章 metadata，并保持 canonical、publishedTime、modifiedTime、twitter card 和 coverAlt 行为。
- [ ] 让 BlogPosting JSON-LD 复用同一摘要、图片和 Person `@id`，避免页面 metadata 与 JSON-LD 使用不同规则。
- [ ] **预计耗时:** 1.5 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-metadata.test.mjs`；`pnpm --filter @wuh.site/next run lint`。
- [ ] **文件:** `packages/wuh.site.next/app/about/page.tsx`, `packages/wuh.site.next/app/components/JsonLd.tsx`, `packages/wuh.site.next/test/seo-source-contract.test.mjs`
- [ ] 在 About 页面保留现有 profile/repositories 请求和可见内容，新增 `JsonLd` 输出 `ProfilePage` 数据。
- [ ] 使用 `buildProfilePageJsonLd(profile)`，将 `ProfilePage.mainEntity.@id` 固定到站点 Person，并将 GitHub profile 放入 `sameAs`。
- [ ] profile API 返回空数据时仍输出稳定的 Person 名称、站点 URL 和 GitHub profile 对应关系。
- [ ] 不修改 `JsonLd` 的脚本类型和现有序列化边界，除非测试证明需要最小安全修正。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-source-contract.test.mjs`；源码检查确认 `/about` 使用 `JsonLd` 和 `ProfilePage` builder。
### Phase 3: 集成验收
- [ ] **文件:** `packages/wuh.site.next/app/lib/markdown.ts`, `packages/wuh.site.next/app/lib/seo.ts`, `packages/wuh.site.next/app/layout.tsx`, `packages/wuh.site.next/app/post/[number]/page.tsx`, `packages/wuh.site.next/app/about/page.tsx`, `packages/wuh.site.next/test/`, `packages/wuh.site.next/public/og-default.png`
- [ ] 运行新增 Node 测试、Next Oxlint、全仓 TypeScript 类型检查和 git diff whitespace 检查。
- [ ] 检查根路由、无 cover 文章、有 cover 文章和 `/about` 的 metadata/JSON-LD 输出契约；确认没有后端 API、DTO 或数据库变更。
- [ ] 记录每项命令的实际输出作为 Apply evidence；若失败，按失败项创建 repair task，不跳过验证。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/*.test.mjs`；`pnpm --filter @wuh.site/next run lint`；`pnpm exec tsc --noEmit`；`git diff --check`。
- [ ] 根路由有可访问的 1200×630 默认 Open Graph 图片。
- [ ] 无 cover 文章同时有 `openGraph.images` 与 `twitter.images`，有 cover 文章优先使用显式 cover。
- [ ] 文章 metadata 可表达 authors、keywords、category，且 keywords 遵循 CMS 优先、labels 回退。
- [ ] 自动摘要来自首个有效 Markdown 段落，不从标题、代码块或空白内容生成。
- [ ] CMS `summary` 始终优先于自动摘要。
- [ ] `/about` 有 `ProfilePage` JSON-LD，mainEntity 对应站点 Person，并与 GitHub profile 建立关系。
- [ ] 新增测试、Oxlint、TypeScript 和 diff check 全部通过。
- [ ] 不新增后端 API、DTO 强制校验、数据库迁移、动态标题 OG 图或线上 Search Console 验收。

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
  id: 2026-07-25-P-seo-og-metadata-summary-author-profile
  title: SEO Batch C：OG 图片、metadata、语义摘要与作者档案
  type: feature
  status: committed
  createdAt: 2026-07-25T00:00:00+08:00
  issue: https://github.com/stack-wuh/x.wuh.site/issues/253

artifacts:
  proposal:
    path: openspec/changes/archive/2026-07-25-P-seo-og-metadata-summary-author-profile/proposal.md
    status: completed
    summary: 按 Issue #253 明确 SEO Batch C 的背景、目标、非目标和受影响包。
    template:
      id: proposal
      source: skills/shadow-dev-propose/templates/proposal.md
      contractVersion: 1
      digest: sha256:426c31b60cb50e7457a6e4aa6f86c9bd6718cdd6217f292d98f1b9739ad612fd
    validation:
      status: passed
      checkedAt: 2026-07-25T00:00:00+08:00
      missing: []
  design:
    path: openspec/changes/archive/2026-07-25-P-seo-og-metadata-summary-author-profile/design.md
    status: completed
    summary: 采用方案 A，抽取 Markdown 摘要与 SEO/JSON-LD 纯函数，页面仅负责数据获取和输出。
    template:
      id: design
      source: skills/shadow-dev-propose/templates/design.md
      contractVersion: 1
      digest: sha256:2483c466de2ab4e8e34a1e147e098a6cef61ff6b5a69d567f565987fdd77b3e4
    validation:
      status: passed
      checkedAt: 2026-07-25T00:00:00+08:00
      missing: []
  tasks:
    path: openspec/changes/archive/2026-07-25-P-seo-og-metadata-summary-author-profile/tasks.md
    status: completed
    summary: 按 AST、纯函数、页面接入和集成验收分为 6 个有依赖关系的任务。
    template:
      id: tasks
      source: skills/shadow-dev-propose/templates/tasks.md
      contractVersion: 1
      digest: sha256:d67578bdb054f235acd942e8cf1bb436abbd6831ff52469e30b82c9c845d37f9
    validation:
      status: passed
      checkedAt: 2026-07-25T00:00:00+08:00
      missing: []
  specs:
    status: completed
    entries:
      - path: openspec/changes/archive/2026-07-25-P-seo-og-metadata-summary-author-profile/specs/seo/spec.md
        template:
          id: spec
          source: skills/shadow-dev-propose/templates/spec.md
          contractVersion: 1
          digest: sha256:322bb9b2a379e72fa08f5ce84fbee689fddac788245ebf2c4d01153947072ea5
        validation:
          status: passed
          checkedAt: 2026-07-25T00:00:00+08:00
          missing: []

proposal:
  status: completed
  source:
    type: github_issue
    issueNumber: 253
  intent: 提升内容展示质量与搜索结果可读性，覆盖默认 OG 图片、文章 metadata、语义摘要和 About 作者档案。
  background: 现有博客 metadata 在无封面文章、作者/关键词/分类表达、Markdown 摘要质量和 About 作者实体识别方面不完整。
  goals:
    - 全站默认 1200×630 OG 图片，文章无封面时回退使用。
    - 文章 metadata 增加 authors、keywords、category，关键词优先 CMS、回退标签。
    - 使用 Markdown AST 提取首个有效段落，CMS summary 始终优先。
    - About 页面输出 ProfilePage JSON-LD，并关联 Person 与 GitHub profile。
    - 补充测试并通过 Oxlint、TypeScript 与 diff check。
  nonGoals:
    - 动态文章标题 OG 图片。
    - 本批次后端 DTO 强制校验 summary、keywords、coverAlt。
    - Search Console / Rich Results 线上验收。
    - 改造 CMS 内容编辑流程或新增可见 UI。
  scope:
    packages:
      - packages/wuh.site.next
    files:
      - packages/wuh.site.next/app/layout.tsx
      - packages/wuh.site.next/app/post/[number]/page.tsx
      - packages/wuh.site.next/app/about/layout.tsx
      - packages/wuh.site.next/app/about/page.tsx
      - packages/wuh.site.next/app/components/JsonLd.tsx
      - packages/wuh.site.next/public/
      - packages/wuh.site.next/test/
  acceptanceCriteria:
    - 根路由和无 cover 文章均有可用的 1200×630 Open Graph 图片。
    - 无 cover 文章同时有 openGraph.images 与 twitter.images。
    - 文章 metadata 可表达 authors、keywords、category，且关键词按 CMS 优先、标签回退。
    - 自动摘要来自 Markdown AST 首个有效段落，不从代码块或标题生成。
    - CMS summary 始终优先于自动摘要。
    - /about 输出包含 Person 与 GitHub profile 对应关系的 ProfilePage JSON-LD。
    - 新增测试、Oxlint、TypeScript 与 diff check 通过。
  constraints:
    - 遵循现有 Next.js App Router generateMetadata 与 JsonLd 实现。
    - 复用现有 seo、post-cover 和 blog-detail 规范，不破坏显式封面和 canonical URL 行为。
    - 不增加后端 API 或 DTO 变更。
    - 文档与测试使用中文语义说明，代码遵循现有 TypeScript 规范。
  risks:
    - Markdown AST 提取逻辑需要处理空段落、标题、代码块和异常 Markdown。
    - 默认 OG 图片的部署路径和 metadataBase 配置必须在静态资源与生产域名下均可访问。
    - About profile 数据可能来自远端 GitHub 服务，需要为缺失 profile 做稳定降级。
  domain:
    name: seo
    keywords:
      - SEO
      - Open Graph
      - Twitter Card
      - metadata
      - Markdown AST
      - JSON-LD
      - ProfilePage
    description: 统一博客分享 metadata、语义摘要和作者结构化数据。
  uiux:
    mode: skipped
    triggers: []
    rationale: 本批次只调整 SEO metadata、结构化数据和摘要生成，不改变可见页面布局或交互。

discuss:
  status: completed
  decisions:
    - id: seo-architecture
      question: SEO 与摘要逻辑放在哪里
      options:
        - A：抽取 app/lib/seo.ts 与 markdown.ts 纯函数，页面只负责组装
        - B：仅抽取 Markdown 摘要，metadata 与 JSON-LD 逻辑留在页面
        - C：新增独立共享 SEO 包
      selected: A
      rationale: 当前只有 Next 前端消费这些规则；纯函数便于测试，且避免页面逻辑重复，不引入额外包边界。
    - id: keyword-category-mapping
      question: 文章 keywords 与 category 的来源优先级
      options:
        - CMS keywords 优先、labels 回退；extra.category 优先、首个 label 回退
        - 仅使用 labels
        - 新增后端 DTO 字段和同步逻辑
      selected: CMS keywords 优先、labels 回退；extra.category 优先、首个 label 回退
      rationale: 复用现有 ContentItem 字段，不扩大本批次到后端模型和 CMS 编辑流程。
    - id: default-image
      question: 无封面文章的分享图片来源
      options:
        - public/og-default.png 静态 1200×630 图片
        - 运行时生成动态标题图片
        - 继续让图片字段为空
      selected: public/og-default.png 静态 1200×630 图片
      rationale: 满足 Batch C 验收，部署稳定，并明确排除动态标题 OG 图片。
  architecture:
    summary: 使用 app/lib/markdown.ts 解析首个有效 Markdown 段落，使用 app/lib/seo.ts 统一文章 metadata、BlogPosting 和 ProfilePage JSON-LD 规则；根 layout、文章页和 About 页通过纯函数与现有 JsonLd 接入。
    modules:
      - packages/wuh.site.next/app/lib/markdown.ts：AST 摘要提取
      - packages/wuh.site.next/app/lib/seo.ts：metadata、图片、作者、关键词、分类与 JSON-LD builder
      - packages/wuh.site.next/app/layout.tsx：全站默认 metadata
      - packages/wuh.site.next/app/post/[number]/page.tsx：文章 metadata 和 BlogPosting 接入
      - packages/wuh.site.next/app/about/page.tsx：ProfilePage JSON-LD 接入
      - packages/wuh.site.next/public/og-default.png：默认分享图片
  contracts:
    api: []
    data:
      - ContentItem.metadata.summary 继续优先于自动摘要
      - ContentItem.metadata.keywords 为空时使用 labels
      - ContentItem.metadata.extra.category 为空时使用首个 label
      - GitHubProfileDto 缺失时使用 stack-wuh 稳定降级实体
  reuse:
    components:
      - packages/wuh.site.next/app/components/JsonLd.tsx
      - packages/wuh.site.next/app/lib/markdown.ts 的 unified/remark processor
      - packages/shared-contracts/src/index.ts 的 ContentItem 与 GitHubProfileDto
      - 现有 contentService 与 reposService 数据获取
    newComponents:
      - packages/wuh.site.next/app/lib/seo.ts 纯函数模块
  implementationNotes:
    - 已读取 packages/wuh.site.next/app/layout.tsx、app/post/[number]/page.tsx、app/about/layout.tsx、app/about/page.tsx、app/components/JsonLd.tsx。
    - 已读取 packages/wuh.site.next/app/lib/markdown.ts、app/lib/slug.ts、shared-contracts/src/index.ts、Next package.json 和现有 Node tests。
    - 不需要调用 UI/UX 技能，因为 proposal.uiux.mode 为 skipped。
  impact:
    dependencies:
      - 无新增依赖；复用 unified、remark-parse、remark-gfm。
    compatibility: 不改变 API、DTO、数据库和可见 UI；保留显式 cover、canonical、旧 URL 和现有正文渲染。
    rollback: 删除 seo.ts、摘要提取函数、默认图片和三处页面接入即可回滚，不需要数据迁移。
  uiux:
    status: skipped
    triggers: []
    capabilities: []
    decisions: []
    accessibility: []
    acceptanceCriteria: []

apply:
  status: completed
  generatedFrom:
    - proposal
    - discuss
  instructions:
    - 按 workflow 的依赖顺序执行；Phase 2 的 default-og-metadata、article-metadata、about-profile-jsonld 在 seo-utilities 完成后可并行。
    - 每项任务完成后写入 evidence；失败必须记录 failure 并按 repairWorkflow 规则处理。
  workflow:
    - id: markdown-summary
      title: Markdown 首段 AST 摘要
      status: completed
      dependsOn: []
      files:
        - packages/wuh.site.next/app/lib/markdown.ts
        - packages/wuh.site.next/test/markdown-summary.test.mjs
      instructions:
        - 使用现有 remarkParse 和 remarkGfm 解析 AST。
        - 跳过 heading、code、空段落，提取首个有效 paragraph 的可读文本并按 160 字符截断。
        - 保留 renderMarkdown 现有行为。
      verification:
        - node --test packages/wuh.site.next/test/markdown-summary.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: cd packages/wuh.site.next && node --test test/markdown-summary.test.mjs
          result: failed as expected before implementation (Node could not load the missing export)
          at: 2026-07-25T00:00:00+08:00
        - command: cd packages/wuh.site.next && node --experimental-strip-types --test test/markdown-summary.test.mjs
          result: passed (4 tests, 0 failures)
          at: 2026-07-25T00:00:00+08:00
      failure: null
    - id: seo-utilities
      title: SEO metadata 与 JSON-LD 纯函数
      status: completed
      dependsOn:
        - markdown-summary
      files:
        - packages/wuh.site.next/app/lib/seo.ts
        - packages/wuh.site.next/test/seo-metadata.test.mjs
      instructions:
        - 集中实现默认图片、摘要、keywords、category、authors、article metadata、BlogPosting 和 ProfilePage builder。
        - 保持 CMS summary/keywords、cover、category 的既定优先级。
        - 对缺失 profile 输出稳定的 stack-wuh Person 降级实体。
      verification:
        - node --test packages/wuh.site.next/test/seo-metadata.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: cd packages/wuh.site.next && node --experimental-strip-types --test test/seo-metadata.test.mjs
          result: failed as expected before implementation (seo.ts did not exist)
          at: 2026-07-25T00:00:00+08:00
        - command: cd packages/wuh.site.next && node --experimental-strip-types --test test/seo-metadata.test.mjs
          result: passed (1 test, 7 assertions, 0 failures)
          at: 2026-07-25T00:00:00+08:00
      failure: null
    - id: default-og-metadata
      title: 全站默认 OG/Twitter metadata 与静态图片
      status: completed
      dependsOn:
        - seo-utilities
      files:
        - packages/wuh.site.next/public/og-default.png
        - packages/wuh.site.next/app/layout.tsx
        - packages/wuh.site.next/test/seo-source-contract.test.mjs
      instructions:
        - 创建 1200×630 的 public/og-default.png。
        - 在根 layout metadata 配置默认 Open Graph/Twitter 图片，不改动 robots、metadataBase 和 RSS。
        - 增加资源尺寸和源码契约检查。
      verification:
        - node --test packages/wuh.site.next/test/seo-source-contract.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: cd packages/wuh.site.next && node --test test/seo-source-contract.test.mjs
          result: failed as expected before asset and root metadata implementation (missing og-default.png)
          at: 2026-07-25T00:00:00+08:00
        - command: cd packages/wuh.site.next && node --test test/seo-source-contract.test.mjs
          result: passed (2 tests, 0 failures; PNG dimensions 1200x630)
          at: 2026-07-25T00:00:00+08:00
      failure: null
    - id: article-metadata
      title: 博客文章 metadata 接入
      status: completed
      dependsOn:
        - seo-utilities
      files:
        - packages/wuh.site.next/app/post/[number]/page.tsx
        - packages/wuh.site.next/app/post/PostView.types.ts
        - packages/wuh.site.next/test/seo-metadata.test.mjs
      instructions:
        - 删除页面内正则摘要逻辑，改用 seo.ts builder。
        - 让有 cover 的文章保留显式图片，无 cover 文章回退默认图片。
        - 写入 authors、keywords、category，并让 BlogPosting 复用同一 description/image/Person 映射。
      verification:
        - node --test packages/wuh.site.next/test/seo-metadata.test.mjs
        - pnpm --filter @wuh.site/next run lint
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: cd packages/wuh.site.next && node --test --test-name-pattern='文章页面' test/seo-metadata.test.mjs
          result: failed as expected before page integration (page did not reference SEO builders)
          at: 2026-07-25T00:00:00+08:00
        - command: node --input-type=module -e 'read and assert post page SEO builder/source contract'
          result: passed (builder integration and regex summary removal confirmed)
          at: 2026-07-25T00:00:00+08:00
        - command: pnpm --filter @wuh.site/next run lint
          result: passed (0 errors, 0 warnings)
          at: 2026-07-25T00:00:00+08:00
      failure: null
    - id: about-profile-jsonld
      title: About ProfilePage JSON-LD 接入
      status: completed
      dependsOn:
        - seo-utilities
      files:
        - packages/wuh.site.next/app/about/page.tsx
        - packages/wuh.site.next/app/components/JsonLd.tsx
        - packages/wuh.site.next/test/seo-source-contract.test.mjs
      instructions:
        - 保留 About 现有数据请求和可见内容，增加 ProfilePage JSON-LD。
        - mainEntity 使用站点 Person @id，sameAs 包含 GitHub profile。
        - profile 为空时仍输出稳定降级实体。
      verification:
        - node --test packages/wuh.site.next/test/seo-source-contract.test.mjs
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: cd packages/wuh.site.next && node --test --test-name-pattern='全站默认|About 页面' test/seo-source-contract.test.mjs
          result: failed as expected before About integration (ProfilePage builder/JsonLd missing)
          at: 2026-07-25T00:00:00+08:00
        - command: cd packages/wuh.site.next && node --test --test-name-pattern='全站默认|About 页面' test/seo-source-contract.test.mjs
          result: passed (2 tests, 0 failures)
          at: 2026-07-25T00:00:00+08:00
        - command: pnpm --filter @wuh.site/next run lint
          result: passed (0 errors, 0 warnings)
          at: 2026-07-25T00:00:00+08:00
      failure: null
    - id: full-verification
      title: 全量验证与 diff 检查
      status: completed
      dependsOn:
        - default-og-metadata
        - article-metadata
        - about-profile-jsonld
      files:
        - packages/wuh.site.next/app/lib/markdown.ts
        - packages/wuh.site.next/app/lib/seo.ts
        - packages/wuh.site.next/app/layout.tsx
        - packages/wuh.site.next/app/post/[number]/page.tsx
        - packages/wuh.site.next/app/about/page.tsx
        - packages/wuh.site.next/test/
        - packages/wuh.site.next/public/og-default.png
      instructions:
        - 运行所有新增测试、Next lint、全仓 TypeScript 和 git diff check。
        - 核对根路由、无 cover 文章、有 cover 文章和 About JSON-LD 契约。
        - 不引入后端 API、DTO 或数据库变化。
      verification:
        - node --test packages/wuh.site.next/test/*.test.mjs
        - pnpm --filter @wuh.site/next run lint
        - pnpm exec tsc --noEmit
        - git diff --check
      requiredInputs: []
      attempts: 1
      maxAttempts: 2
      evidence:
        - command: cd packages/wuh.site.next && node --test --test-concurrency=1 test/blog-filter-utils.test.mjs
          result: passed (4 tests, 0 failures)
          at: 2026-07-25T00:00:00+08:00
        - command: cd packages/wuh.site.next && node --test --test-concurrency=1 test/markdown-summary.test.mjs test/seo-metadata.test.mjs test/seo-source-contract.test.mjs
          result: passed (6 tests, 0 failures)
          at: 2026-07-25T00:00:00+08:00
        - command: cd packages/wuh.site.next && node --test --test-concurrency=1 test/site-header-theme-toggle.test.mjs
          result: passed (4 tests, 0 failures)
          at: 2026-07-25T00:00:00+08:00
        - command: pnpm --filter @wuh.site/next run lint
          result: passed (0 errors, 0 warnings)
          at: 2026-07-25T00:00:00+08:00
        - command: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc --noEmit --incremental false --declaration false --declarationMap false --pretty false
          result: passed (full repository type check via direct compiler invocation)
          at: 2026-07-25T00:00:00+08:00
        - command: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc --noEmit --incremental false --declaration false --declarationMap false --pretty false packages/wuh.site.next/app/lib/markdown.ts packages/wuh.site.next/app/lib/seo.ts packages/wuh.site.next/app/post/PostView.types.ts packages/wuh.site.next/app/post/[number]/page.tsx packages/wuh.site.next/app/about/page.tsx packages/wuh.site.next/app/layout.tsx
          result: passed (changed frontend files type check)
          at: 2026-07-25T00:00:00+08:00
        - command: git diff --check
          result: passed
          at: 2026-07-25T00:00:00+08:00
        - command: pnpm exec tsc --noEmit; pnpm --filter @wuh.site/next run build
          result: warning (both wrapper/build processes terminated by environment SIGSEGV; direct TypeScript compiler and changed-file check passed)
          at: 2026-07-25T00:00:00+08:00
      failure: null
  repairWorkflow: []
  checkpoint:
    lastCompletedTaskId: full-verification
    updatedAt: 2026-07-25T00:00:00+08:00

review:
  status: passed
  verification:
    - id: artifact-contracts
      command: node scripts/validate-artifact-contract.mjs for proposal.md, spec.md, design.md and tasks.md
      result: passed
      summary: 四份固定产物均通过模板契约校验。
      at: 2026-07-25T00:00:00+08:00
    - id: frontend-tests
      command: node --test --test-concurrency=1 test/blog-filter-utils.test.mjs; node --test --test-concurrency=1 test/markdown-summary.test.mjs test/seo-metadata.test.mjs test/seo-source-contract.test.mjs; node --test --test-concurrency=1 test/site-header-theme-toggle.test.mjs
      result: passed
      summary: 14 个测试通过，0 失败。
      at: 2026-07-25T00:00:00+08:00
    - id: oxlint
      command: pnpm --filter @wuh.site/next run lint
      result: passed
      summary: Oxlint 通过，0 errors，0 warnings。
      at: 2026-07-25T00:00:00+08:00
    - id: type-check-direct
      command: node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/bin/tsc --noEmit --incremental false --declaration false --declarationMap false --pretty false
      result: passed
      summary: 直接 TypeScript 编译器完成全仓类型检查。
      at: 2026-07-25T00:00:00+08:00
    - id: diff-check
      command: git diff --check
      result: passed
      summary: 无 whitespace 错误。
      at: 2026-07-25T00:00:00+08:00
    - id: package-wrapper-runtime
      command: pnpm exec tsc --noEmit; pnpm --filter @wuh.site/next run build
      result: unavailable
      summary: 两个 pnpm 包装进程均因当前环境 SIGSEGV 退出；直接 TypeScript 编译器和变更文件类型检查已通过，Next build 未获得结果。
      at: 2026-07-25T00:00:00+08:00
  findings:
    - id: R-001
      severity: warning
      file: package-manager runtime
      line: null
      message: pnpm wrapper 的 TypeScript 检查与 Next build 在当前运行环境中 SIGSEGV，无法取得 Next build 结果；需要用户决定接受该环境 warning，或先修复运行环境后再归档。
      status: accepted
  summary: 功能验收、测试、Oxlint、直接 TypeScript 编译和 diff check 均通过；用户已接受 package-manager/Next build 受环境 SIGSEGV 影响的 warning。

archive:
  status: completed
  archivedAt: 2026-07-25T00:00:00+08:00
  movedAt: 2026-07-25T00:00:00+08:00
  specSync:
    - domain: seo
      source: openspec/changes/archive/2026-07-25-P-seo-og-metadata-summary-author-profile/specs/seo/spec.md
      target: openspec/specs/seo/spec.md
      result: updated
      evidence:
        - command: "grep -n 'Requirement:' openspec/specs/seo/spec.md"
          result: passed
          at: 2026-07-25T00:00:00+08:00
        - command: git diff --check
          result: passed
          at: 2026-07-25T00:00:00+08:00
  indexEntry:
    path: openspec/INDEX.md
    result: updated
    evidence:
      - command: "grep -n -A3 '^## seo' openspec/INDEX.md"
        result: passed
        at: 2026-07-25T00:00:00+08:00
  componentScenarios:
    - decision: existing
      path: openspec/navigation-guide.yaml
      summary: 本变更只新增 SEO 公共函数和 metadata，不新增 UI 组件、props 组合或布局交互场景；导航索引已增加 SEO Metadata Builders 工具入口。
      evidence:
        - command: "grep -n -A4 'SEO Metadata Builders' openspec/navigation-guide.yaml"
          result: passed
          at: 2026-07-25T00:00:00+08:00

commit:
  status: completed
  branch: codex/253-feat-SEO元数据
  commits:
    - hash: 5063c91
      message: "feat(seo): improve metadata and author profile"
      at: 2026-07-25T00:00:00+08:00
  pullRequest:
    number: 254
    url: "https://github.com/stack-wuh/x.wuh.site/pull/254"
    state: open

runtime:
  phase: commit
  state: completed
  attempts: 0
  resume:
    taskId: null
    command: 继续归档
  requiredInputs:
    - key: review-warnings-decision
      description: 是否接受 pnpm/Next build 在当前环境 SIGSEGV 的 warning 后继续归档。
      supplied: true
  failure: null
  updatedAt: 2026-07-25T00:00:00+08:00
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

# SEO Batch C 技术设计

**目标：** 在不增加后端 API 和不改变可见 UI 的前提下，统一全站分享图片、文章 metadata、Markdown 摘要和 About 作者结构化数据。

**Architecture：** 将 SEO 规则集中到 Next 前端的纯函数模块，Markdown 摘要只依赖现有 unified/remark AST 管线；页面组件负责获取数据和把结构化数据交给现有 `JsonLd` 输出组件。

**Tech Stack：** Next.js 15 App Router、React 19、TypeScript 5、`unified`、`remark-parse`、`remark-gfm`、Node test runner。

## 架构

```text
ContentItem / GitHubProfileDto
          │
          ├── app/lib/markdown.ts
          │      └── extractFirstParagraphText()
          │
          └── app/lib/seo.ts
                 ├── buildArticleDescription()
                 ├── buildArticleMetadata()
                 ├── buildBlogPostingJsonLd()
                 └── buildProfilePageJsonLd()
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   app/layout.tsx   post/[number]/page.tsx  about/page.tsx
        │                 │                 │
   默认站点 metadata  文章 metadata + JSON-LD  ProfilePage JSON-LD
```

### 默认分享图片

- 在 `packages/wuh.site.next/public/og-default.png` 放置 1200×630 静态图片。
- 在 `app/layout.tsx` 设置全站默认 `openGraph.images`、`twitter.card` 和 `twitter.images`。
- 文章 metadata 通过同一个默认图片 URL 回退；有 `metadata.cover` 时继续优先使用显式封面。
- 通过已有 `metadataBase: https://wuh.site` 生成绝对 URL，不新增环境变量。

### Markdown 摘要

`app/lib/markdown.ts` 增加同步 AST 提取函数，处理流程如下：

1. 用现有 `remarkParse` 和 `remarkGfm` 解析 Markdown AST。
2. 仅检查根节点的直接子节点，跳过 `heading`、`code` 和空白节点。
3. 找到首个有效 `paragraph` 后递归拼接其文本子节点；保留链接、强调、删除线和行内代码中的可读文字。
4. 归一化空白并限制为 160 个字符；超出时使用 `...`。
5. 没有有效段落时回退到 `阅读这篇博客文章`。

### 文章 metadata

`app/lib/seo.ts` 负责纯函数映射：

- `summary`：非空 CMS `metadata.summary` 优先，否则调用 AST 摘要函数。
- `keywords`：`metadata.keywords` 非空时原样使用，否则使用全部 labels。
- `category`：优先使用 `metadata.extra.category` 的非空字符串，否则使用第一个 label。
- `authors`：由文章作者 login/name 生成 Next Metadata 的 author 对象，并附 GitHub profile URL。
- `images`：`metadata.cover` 优先，否则使用默认 OG 图片；封面 alt 优先使用 `coverAlt`，再回退文章标题。
- `BlogPosting.author` 使用站点 Person `@id`，并通过 `sameAs` 保持与 GitHub profile 的关联。

### About 作者档案

`about/page.tsx` 在现有 profile/repositories 并行请求完成后，输出一个 `ProfilePage` JSON-LD：

- `@id` 为 `https://wuh.site/about#profilepage`；
- `mainEntity` 为站点 Person `https://wuh.site/#person`；
- Person 的 `sameAs` 至少包含 `https://github.com/stack-wuh`；
- profile API 失败时使用稳定的 `stack-wuh`、站点 URL 和页面既有文案作为降级值；
- 继续复用 `app/components/JsonLd.tsx`，不引入第二套脚本输出逻辑。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 摘要解析 | 复用 `unified + remark-parse + remark-gfm` | 依赖已经存在，和正文渲染使用同一 Markdown 语义，不需要正则猜测结构 |
| AST 遍历 | 新增小型递归文本提取函数 | 只需要段落、文本和少量 inline 节点，不为一次性需求引入 `unist-util-visit` 或 `mdast-util-to-string` |
| SEO 规则 | `app/lib/seo.ts` 纯函数 | 页面逻辑只负责数据获取，规则可通过 Node test runner 独立验证 |
| 默认图片 | `public/og-default.png` | 静态资源部署稳定，适合社交平台抓取，尺寸固定为 1200×630 |
| 结构化数据 | 复用 `JsonLd` | 保持现有 JSON-LD 输出方式，避免新增组件或重复安全边界 |
| 测试 | `.mjs` + Node `node:test` | 匹配仓库现有测试方式，覆盖纯函数输入输出和关键页面源码契约 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Markdown 渲染管线 | `@/app/lib/markdown` | 扩展 | `packages/wuh.site.next/app/lib/markdown.ts` |
| JSON-LD 输出 | `@/app/components/JsonLd` | 复用 | `packages/wuh.site.next/app/components/JsonLd.tsx` |
| Next metadataBase | `next` metadata | 复用 | `packages/wuh.site.next/app/layout.tsx` |
| GitHub profile 数据 | `@wuh.site/shared-contracts` / `reposService` | 复用 | `packages/wuh.site.next/app/about/page.tsx` |
| 文章内容模型 | `ContentItem`、`Issue` | 复用 | `packages/shared-contracts/src/index.ts`、`app/post/PostView.types.ts` |
| SEO 规则工具 | `@/app/lib/seo` | 新建 | 无，作为本批次纯函数模块 |

**说明：** 本批次不新增组件包组件，也不改变后端 DTO、接口路径或数据库 schema。

## 数据模型（如涉及）

不新增数据模型。使用现有字段：

```ts
ContentItem.metadata?.summary?: string
ContentItem.metadata?.keywords?: string[]
ContentItem.metadata?.cover?: string
ContentItem.metadata?.coverAlt?: string
ContentItem.metadata?.extra?: Record<string, unknown>
ContentItem.labels: string[]
ContentItem.author: { login: string; url: string }
```

`category` 的运行时读取规则为：

```ts
const category =
  typeof item.metadata?.extra?.category === 'string' && item.metadata.extra.category.trim()
    ? item.metadata.extra.category.trim()
    : item.labels[0]
```

## API 设计（如涉及）

无 API 变更。继续调用现有服务：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | 现有 `contentService.getPost` | 获取文章及 metadata、labels、author |
| GET | 现有 `reposService.getProfile` | 获取 About 页 GitHub profile |

## 组件/模块设计

### `app/lib/markdown.ts`

- 保留 `renderMarkdown(md)` 的现有异步 HTML 渲染接口。
- 新增 `extractFirstParagraphText(md, maxLength = 160): string`。
- 函数必须是纯函数、同步、无浏览器 API 依赖，便于 metadata 生成和单元测试。

### `app/lib/seo.ts`

- 导出站点 URL、默认图片路径和默认描述常量。
- 导出文章摘要、关键词、分类、图片、metadata 和 BlogPosting JSON-LD builder。
- 导出 `buildProfilePageJsonLd(profile)`，支持 profile 为 `null` 的稳定降级。
- 只接受现有 DTO/view model，不发起网络请求。

### `app/post/[number]/page.tsx`

- 保留 `getIssue`、slug 解析、正文渲染和相邻文章查询。
- 删除页面内正则摘要逻辑，改为调用 `app/lib/seo.ts`。
- `generateMetadata` 和 BlogPosting JSON-LD 使用同一份 description、image、author、keywords、category 映射，避免 metadata 与正文脚本不一致。

### `app/about/page.tsx`

- 保留现有 profile/repositories 数据获取。
- 在 `AboutView` 前输出由 `buildProfilePageJsonLd(profile)` 生成的 `JsonLd`。
- 不改变 About 页面现有可见内容和交互。

## 响应式策略（如涉及）

不涉及可见 UI 或响应式布局变更。默认图片固定为 1200×630，页面展示行为由社交平台抓取 metadata 决定。

## 影响分析

- **新增依赖:** 无；复用现有 `unified`、`remark-parse`、`remark-gfm`。
- **破坏性变更:** 无；保留显式封面、canonical URL、现有正文渲染和 API 契约。
- **向后兼容:** 无 cover 的历史文章获得默认图片；CMS summary、keywords、coverAlt 和旧 URL 行为保持兼容。
- **性能影响:** AST 摘要只在文章 metadata/JSON-LD 生成时执行一次，数据量小；不新增请求，About profile 继续使用现有缓存策略。
- **回滚策略:** 删除新 SEO 工具、默认图片和调用点即可恢复现有 metadata；不涉及数据库迁移。

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

# SEO Batch C：OG 图片、metadata、语义摘要与作者档案

## 背景

当前博客详情页已经输出部分 Open Graph、Twitter Card 和 BlogPosting metadata，但仍存在以下问题：无封面文章没有稳定的分享图片；文章 metadata 没有完整表达作者、关键词和分类；摘要通过正则清理 Markdown，可能把代码块或结构符号带入摘要；`/about` 页面缺少可供搜索引擎识别的作者档案结构化数据。

Issue #253（Refs #233，前置集成 PR #252）将这些问题归入 SEO Batch C，目标是在不扩大本批次范围的前提下，提高内容分享展示质量、搜索结果摘要可读性和作者实体识别能力。

## 目标

- 新增全站默认 1200×630 Open Graph 图片；文章无显式封面时，`openGraph.images` 与 `twitter.images` 回退到该图片。
- 扩充文章 metadata，使其表达 `authors`、`keywords` 和 `category`；关键词优先使用 CMS metadata，缺失时回退到文章标签。
- 使用 Markdown AST 提取首个有效段落作为自动摘要，忽略代码块、标题和空白内容；CMS `summary` 始终优先。
- 在 `/about` 输出 `ProfilePage` JSON-LD，并将档案与站点 Person 实体及 GitHub profile 建立对应关系。
- 为上述 metadata、摘要和 JSON-LD 行为补充自动化测试，并保持 Oxlint、TypeScript 和 diff check 通过。

## 非目标（明确不做）

- 不在本批次实现动态文章标题 OG 图片。
- 不在本批次增加后端 DTO 对 `summary`、`keywords`、`coverAlt` 的强制校验；内容编辑模型统一后另行处理。
- 不进行 Search Console 或 Rich Results 的线上验收。
- 不改造 GitHub Issues CMS 的内容编辑流程、字段模型或同步协议。
- 不新增可见页面布局、组件视觉样式或交互流程。

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 增加全站默认分享图片的 metadata 配置或静态资源引用。
- `packages/wuh.site.next/app/post/[number]/page.tsx` — 统一文章 metadata、默认图片回退、作者/关键词/分类映射，并以 Markdown AST 生成摘要。
- `packages/wuh.site.next/app/about/layout.tsx` / `packages/wuh.site.next/app/about/page.tsx` — 输出 About 页的 `ProfilePage` JSON-LD，并关联 Person 与 GitHub profile。
- `packages/wuh.site.next/app/components/JsonLd.tsx` — 复用现有 JSON-LD 输出能力，必要时补充安全的结构化数据边界。
- `packages/wuh.site.next/public/` — 新增全站默认 1200×630 OG 图片资源（具体文件名在 discuss 阶段确定）。
- `packages/wuh.site.next/test/` — 新增 metadata、摘要 AST 和 JSON-LD 相关测试。
- `openspec/specs/seo/spec.md` — 在归档阶段合并本批次新增 SEO 需求。

### `specs/seo/spec.md`
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

# Spec: SEO Batch C

## ADDED

### Requirement: 全站默认 Open Graph 图片
- **GIVEN** 任意页面生成 Open Graph metadata，或博客文章没有显式封面
- **WHEN** Next.js 生成页面 metadata
- **THEN** `openGraph.images` 至少包含一张可访问的 1200×630 默认图片
- **AND** 文章存在显式封面时优先使用显式封面

### Requirement: 文章 Twitter 图片回退
- **GIVEN** 博客文章没有显式封面
- **WHEN** Next.js 生成 Twitter Card metadata
- **THEN** `twitter.images` 使用全站默认 1200×630 图片
- **AND** `twitter.card` 保持适合大图展示的卡片类型

### Requirement: 文章作者关键词与分类 metadata
- **GIVEN** 博客文章包含作者、CMS keywords、文章标签或可推导的分类信息
- **WHEN** 生成文章 metadata
- **THEN** metadata 可表达 `authors`、`keywords` 和 `category`
- **AND** `keywords` 优先使用 CMS metadata keywords
- **AND** CMS keywords 缺失时回退到文章标签

### Requirement: 语义 Markdown 自动摘要
- **GIVEN** 博客文章没有 CMS `summary` 且正文包含 Markdown 内容
- **WHEN** 生成 description 或 BlogPosting 的 description
- **THEN** 使用 Markdown AST 提取首个有效段落
- **AND** 忽略代码块、标题和空白内容
- **AND** 摘要长度遵守现有 metadata 展示上限并保持可读文本

### Requirement: CMS 摘要优先
- **GIVEN** 博客文章存在非空 CMS `summary`
- **WHEN** 生成 description 或 BlogPosting 的 description
- **THEN** 直接使用 CMS `summary`
- **AND** 不使用自动 Markdown 摘要覆盖 CMS 内容

### Requirement: About 作者档案结构化数据
- **GIVEN** 用户或搜索引擎访问 `/about`
- **WHEN** 页面输出 JSON-LD
- **THEN** 包含 `ProfilePage` 类型的结构化数据
- **AND** `ProfilePage` 的 mainEntity 对应站点 Person 实体
- **AND** Person 实体与 `https://github.com/stack-wuh` 建立 `sameAs` 或等价对应关系

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

# SEO Batch C Implementation Plan

> **For agentic workers:** 按 Apply DAG 逐项执行；每个任务完成后记录验证证据，不重复执行已完成任务。

**Goal:** 统一站点默认分享图、文章 metadata、语义摘要和 About 作者档案结构化数据。

**Architecture:** 复用现有 Markdown AST 管线，新增 `app/lib/seo.ts` 纯函数作为 metadata/JSON-LD 规则中心；页面文件只负责数据获取和输出。

**Tech Stack:** Next.js 15、TypeScript 5、unified、remark-parse、remark-gfm、Node `node:test`。

---

# 任务清单

## Phase 1: AST 与 SEO 纯函数

### Task 1: Markdown 首段 AST 摘要

- [ ] **文件:** `packages/wuh.site.next/app/lib/markdown.ts`, `packages/wuh.site.next/test/markdown-summary.test.mjs`
- [ ] 在现有 Markdown processor 旁新增 `extractFirstParagraphText(markdown, maxLength = 160)`，使用 `remarkParse` 与 `remarkGfm` 解析 AST。
- [ ] 只接受根节点首个有效 `paragraph`；跳过 `heading`、`code`、空段落和仅空白节点。
- [ ] 递归提取普通文本、链接、强调、删除线和行内代码中的可读文字，归一化空白并按 160 字符截断。
- [ ] 没有有效段落时返回 `阅读这篇博客文章`。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/markdown-summary.test.mjs`；覆盖标题/代码块先出现、空段落、GFM inline 节点、截断和空正文。

### Task 2: SEO metadata 与 JSON-LD 纯函数

- [ ] **文件:** `packages/wuh.site.next/app/lib/seo.ts`, `packages/wuh.site.next/test/seo-metadata.test.mjs`
- [ ] 新建 `DEFAULT_OG_IMAGE_PATH`、`buildArticleDescription`、`getArticleKeywords`、`getArticleCategory`、`getArticleImage`、`buildArticleMetadata`、`buildBlogPostingJsonLd` 和 `buildProfilePageJsonLd`。
- [ ] 实现字段优先级：CMS summary 优先自动摘要；CMS keywords 优先 labels；`metadata.extra.category` 优先首个 label；显式 cover 优先默认图片。
- [ ] Article metadata 返回 authors、keywords、category、canonical、Open Graph、Twitter Card；BlogPosting 与 metadata 使用同一 description/image/author 映射。
- [ ] ProfilePage 使用稳定 `@id`、mainEntity Person 和 GitHub `sameAs`，profile 为 null 时仍输出可识别实体。
- [ ] **预计耗时:** 1.5 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-metadata.test.mjs`；覆盖所有优先级组合、默认图回退、authors/category、BlogPosting 和 ProfilePage 结构。

## Phase 2: 页面接入与默认资源

### Task 3: 全站默认 OG/Twitter metadata 与静态图片

- [ ] **文件:** `packages/wuh.site.next/public/og-default.png`, `packages/wuh.site.next/app/layout.tsx`, `packages/wuh.site.next/test/seo-source-contract.test.mjs`
- [ ] 创建尺寸固定为 1200×630 的全站默认分享图片，文件放在 Next public 目录并可通过 `/og-default.png` 访问。
- [ ] 在根 layout metadata 中设置默认 Open Graph image、Twitter `summary_large_image` card、Twitter image、siteName 和站点级描述，不覆盖已有 robots、metadataBase 和 RSS link。
- [ ] 通过源码契约测试确认默认资源路径、1200×630 资源存在、根 metadata 配置存在且没有动态标题图实现。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-source-contract.test.mjs`；使用图片解析或文件头检查确认 PNG 尺寸为 1200×630。

### Task 4: 博客文章 metadata 接入

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx`, `packages/wuh.site.next/app/post/PostView.types.ts`, `packages/wuh.site.next/test/seo-metadata.test.mjs`
- [ ] 删除页面内基于正则的 `buildDescription`，改为调用 `app/lib/seo.ts` 的纯函数。
- [ ] 让 `generateMetadata` 在有 cover 时保留 cover，在无 cover 时同时写入默认 `openGraph.images` 与 `twitter.images`。
- [ ] 将 authors、keywords、category 写入文章 metadata，并保持 canonical、publishedTime、modifiedTime、twitter card 和 coverAlt 行为。
- [ ] 让 BlogPosting JSON-LD 复用同一摘要、图片和 Person `@id`，避免页面 metadata 与 JSON-LD 使用不同规则。
- [ ] **预计耗时:** 1.5 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-metadata.test.mjs`；`pnpm --filter @wuh.site/next run lint`。

### Task 5: About ProfilePage JSON-LD 接入

- [ ] **文件:** `packages/wuh.site.next/app/about/page.tsx`, `packages/wuh.site.next/app/components/JsonLd.tsx`, `packages/wuh.site.next/test/seo-source-contract.test.mjs`
- [ ] 在 About 页面保留现有 profile/repositories 请求和可见内容，新增 `JsonLd` 输出 `ProfilePage` 数据。
- [ ] 使用 `buildProfilePageJsonLd(profile)`，将 `ProfilePage.mainEntity.@id` 固定到站点 Person，并将 GitHub profile 放入 `sameAs`。
- [ ] profile API 返回空数据时仍输出稳定的 Person 名称、站点 URL 和 GitHub profile 对应关系。
- [ ] 不修改 `JsonLd` 的脚本类型和现有序列化边界，除非测试证明需要最小安全修正。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/seo-source-contract.test.mjs`；源码检查确认 `/about` 使用 `JsonLd` 和 `ProfilePage` builder。

## Phase 3: 集成验收

### Task 6: 全量验证与 diff 检查

- [ ] **文件:** `packages/wuh.site.next/app/lib/markdown.ts`, `packages/wuh.site.next/app/lib/seo.ts`, `packages/wuh.site.next/app/layout.tsx`, `packages/wuh.site.next/app/post/[number]/page.tsx`, `packages/wuh.site.next/app/about/page.tsx`, `packages/wuh.site.next/test/`, `packages/wuh.site.next/public/og-default.png`
- [ ] 运行新增 Node 测试、Next Oxlint、全仓 TypeScript 类型检查和 git diff whitespace 检查。
- [ ] 检查根路由、无 cover 文章、有 cover 文章和 `/about` 的 metadata/JSON-LD 输出契约；确认没有后端 API、DTO 或数据库变更。
- [ ] 记录每项命令的实际输出作为 Apply evidence；若失败，按失败项创建 repair task，不跳过验证。
- [ ] **预计耗时:** 1 小时；**实际耗时:** 0 小时（Apply 阶段更新）
- [ ] **验证:** `node --test packages/wuh.site.next/test/*.test.mjs`；`pnpm --filter @wuh.site/next run lint`；`pnpm exec tsc --noEmit`；`git diff --check`。

## 验收

- [ ] 根路由有可访问的 1200×630 默认 Open Graph 图片。
- [ ] 无 cover 文章同时有 `openGraph.images` 与 `twitter.images`，有 cover 文章优先使用显式 cover。
- [ ] 文章 metadata 可表达 authors、keywords、category，且 keywords 遵循 CMS 优先、labels 回退。
- [ ] 自动摘要来自首个有效 Markdown 段落，不从标题、代码块或空白内容生成。
- [ ] CMS `summary` 始终优先于自动摘要。
- [ ] `/about` 有 `ProfilePage` JSON-LD，mainEntity 对应站点 Person，并与 GitHub profile 建立关系。
- [ ] 新增测试、Oxlint、TypeScript 和 diff check 全部通过。
- [ ] 不新增后端 API、DTO 强制校验、数据库迁移、动态标题 OG 图或线上 Search Console 验收。
