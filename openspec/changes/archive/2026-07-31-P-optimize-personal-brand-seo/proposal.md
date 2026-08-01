# 优化吴尒红（Shadow）个人品牌 SEO

## 背景

当前站点的默认 metadata、核心页面 description 与 JSON-LD 主要使用 `wuh.site`、`shadow` 或 `stack-wuh`，没有稳定出现真实姓名“吴尒红”。搜索引擎难以将站点内容、作者实体和 GitHub 身份归并到同一个个人品牌，也无法从页面摘要中明确识别站点所有者。

本次变更以“吴尒红（Shadow）”作为统一公开身份，在不堆砌关键词、不破坏文章差异化摘要的前提下，补齐所有可索引页面的个人品牌语义。

## 目标

- 所有可索引的站点级、列表级页面 description 自然包含“吴尒红（Shadow）”，并保持页面主题差异化。
- 全局 authors、creator 以及 WebSite、Person、ProfilePage、BlogPosting JSON-LD 使用一致的作者身份，并关联 `https://github.com/stack-wuh`。
- Open Graph 与 Twitter Card description 和页面主 description 保持一致，避免社交摘要遗漏姓名。
- 文章详情保留 CMS summary 或正文摘要，不在正文摘要中机械追加姓名，通过作者 metadata 与结构化数据表达作者身份。
- 建立自动化回归检查，防止后续新增或修改可索引页面时再次遗漏姓名关键词。

## 非目标（明确不做）

- 不修改页面可见正文、导航、标题或视觉设计。
- 不将“吴尒红（Shadow）”加入内部 `noindex` 调试页面。
- 不为每篇文章的 description 强制追加作者姓名，也不改写 CMS summary。
- 不调整 canonical、sitemap、页面索引策略或 API。
- 不引入第三方 SEO 依赖或关键词堆砌策略。

## 影响范围

- `packages/wuh.site.next/app/layout.tsx` — 统一全站默认 description、authors、creator 与社交 metadata。
- `packages/wuh.site.next/app/page.tsx` — 优化首页个人品牌 description。
- `packages/wuh.site.next/app/blog/page.tsx`、`packages/wuh.site.next/app/topics/[label]/page.tsx` — 为博客与主题集合页加入自然的作者归属。
- `packages/wuh.site.next/app/about/layout.tsx`、`packages/wuh.site.next/app/about/page.tsx` — 明确 About 页面对应吴尒红（Shadow）的个人档案。
- `packages/wuh.site.next/app/weread/page.tsx`、`packages/wuh.site.next/app/footprint/layout.tsx`、`packages/wuh.site.next/app/guestbook/page.tsx` — 在各自页面主题下补充个人品牌归属。
- `packages/wuh.site.next/app/lib/seo.ts`、`packages/wuh.site.next/app/lib/structured-data.ts` — 统一文章作者、Person/ProfilePage/WebSite JSON-LD 身份。
- `packages/wuh.site.next/test/` — 增加 metadata 与结构化数据的姓名覆盖回归测试。
- `openspec/specs/seo/spec.md` — 归档后补充个人品牌 SEO 规范。
