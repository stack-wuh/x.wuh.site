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
