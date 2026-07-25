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
