---
{
  "schema": "shadow-dev/v1",
  "name": "20261008-fix-post-cover-lead-dedupe",
  "type": "fix",
  "scope": "apps/site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261008-fix-post-cover-lead-dedupe",
  "files": [
    "apps/site/app/lib/postLeadDedupe.ts",
    "apps/site/app/post/[number]/page.tsx",
    "apps/site/test/post-lead-dedupe.test.mjs"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": 521,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/521"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e6f7b5c47cd0570c0a04eb755b5d3c7059c2a6b8",
    "verifiedAt": "2026-10-08T07:18:35.777Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:521",
    "planHash": "0381011701f25b095d08c1f5b309553736df50fbebe782fb0abb4869c9ff1ac7",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 博客详情页封面首屏去重（渲染层导语区收编）",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n最新博客《Vibe Coding Workflow 概述》（stack-wuh/blog #172）开始采用新的文档结构产出：**正文 markdown 自带大标题（`## <标题>`）、内嵌封面图（与 `metadata.cover` 同 URL 的导语首图）、文末 `wuh-site-metadata` JSON 注释**。详情页 chrome 本身已渲染 PostHeader h1 与 PostCover 杂志卡，叠加后首屏出现**同一张封面图 ×2、同一句标题文字 ×3**（图内文字 / h1 / 导语区 h2），目录 7 条目中「第壹节」被文档标题占位、正文六节从「贰」起跳。\n\n作者已确认**后续所有博客都会按此结构产出**——重复是系统性、持续性的，必须在渲染层固化为容错行为，而非个案修数据。现行 active 卡片 `post-cover.md` 的「正文首张图片不因封面展示被移除」条款基于\"封面 ≠ 正文图\"的旧假设，已被新文档结构击穿。\n\n原型对比图见 `shadow-docs/designs/20261008-post-cover-lead-dedupe/prototype.html|png`（现状 BEFORE vs 方案 A AFTER），用户已验收。\n\n## 引用规范\n- `shadow-docs/knowledge/post-cover.md`（verified 2026-08-23）\n  - 当前结论: 封面经正文 `wuh-site-metadata` 注释声明存为 `metadata.cover`；显式封面与正文图片独立、首图不因封面展示被移除（仅回退场景去重）；杂志卡 16:9 + 1px accent 细边 + 12px 圆角 + 底部轻渐变；加载失败隐藏不保留破图\n  - 适用 scope: apps/site/app/post/components/PostCover、styles/post-header.ts、PostView\n  - 本变更落地后需更新其「独立」条款为「导语区同 URL 图由渲染层去重」（数据层独立性保留），见「知识评估」\n- `shadow-docs/knowledge/blog-detail.md`（verified 2026-09-06）\n  - 当前结论: 排印变换为纯字符串/无 DOM 依赖、SSR 与客户端输出确定一致；h2/h3 眉线记号由 `articleTypography.ts` 注入并剥离手写编号前缀；章节记号、目录、锚点必须一起回归\n  - 适用 scope: apps/site/app/post\n- `shadow-docs/knowledge/blog-display.md`（浏览量/日期格式）——仅页头 meta 复刻涉及，不约束本变更\n- 通用 `norms/ui-patterns.md`——设计语言复刻已有实现、无新组件；`norms/code-style.md`——单文件单职责、不新增 any、不扩大类型绕过编译\n\n## 决策\n- **选型:** 方案 A——渲染层「导语区去重」。SSR 管线新增纯函数 `dedupeLeadArtifacts(html, { title, cover })`，在 `ensureRenderedBody` 之后、`useToc` 消费之前执行：\n  - 图片命中：导语区（**首个实质段落之前**的块组）内 `归一化(src) === metadata.cover` 的 `<img>`（含其空壳 `<p>`）→ 从渲染 html 移除；\n  - 标题命中：导语区首个 heading，剥离手写编号前缀（与 `articleTypography` 归一化同一套逻辑）后文本 === `issue.title` → 移除；\n  - 归一化：URL 去协议（`https?://`）/去查询串与 hash/小写域名，path 大小写敏感；标题文本 trim + 空白折叠。\n- **对比方案:**\n  - 方案 B（content API 出口清洗数据）——否决：去重是展示关注点，不应改写数据；RSS、导出全文、分享图将失去完整文档形态；直接违背 `post-cover.md` 数据层独立条款。\n  - 方案 C（识别\"文字卡封面\"降级为生成式封面）——否决：不解决正文重复，判定不可靠，治标不治本。\n  - 客户端 DOM 删除——否决：SSR 首帧仍闪重复、违反排印变换确定性约束。\n- **理由:** 新文档结构成为全站标准产出，渲染层容错一次到位；只删块不改样式，封面卡/页头/断点/主题表现零变化；存量未命中文章零 diff；与既有确定性变换（articleTypography）同构，可被 `.test.mjs` 离线单测覆盖。\n\n## 任务\n### Phase 1 — 去重内核\n\n- [ ] 新增 `apps/site/app/lib/postLeadDedupe.ts` — 纯函数：导语区扫描、封面同 URL 图移除、标题重复 heading 移除；URL/文本归一化 helper；与 `articleTypography.ts` 的编号剥离规则对齐（可提取共用）\n- [ ] 新增 `apps/site/test/post-lead-dedupe.test.mjs` — 命中/不命中/边界用例：#172 真实结构 fixture、正文中途同 URL 图不动、首行标题≠文章标题不动、无 metadata.cover 不动、导语区含多个 heading、HTML 实体与空白差异归一化\n\n### Phase 2 — 详情页接入\n\n- [ ] 修改 `apps/site/app/post/[number]/page.tsx` — `ensureRenderedBody` 出口接入 `dedupeLeadArtifacts`，上下文取 `issue.title` 与 `issue.metadata?.cover`；仅影响详情页正文 html，不改 `Issue.metadata` 与导出/分享数据源\n- [ ] 回归 `apps/site/app/post/hooks/useToc.ts` 消费链 — #172 目录 6 条目、编号从壹顺排、`seo-heading-hierarchy`/`post-typography-design-language` 既有测试不破\n\n### Phase 3 — 验证与知识\n\n- [ ] `pnpm exec tsc --noEmit` + 站点 `node --test` 全绿；`pnpm dev:next` 下 /post/172 首屏封面 ×1、h1 ×1、导语直落；抽查 2 篇无封面文（生成式封面分支不变）+ 1 篇有封面但正文首图不同 URL 的文（零 diff）\n- [ ] 更新 `shadow-docs/knowledge/post-cover.md` — 「正文首图不因封面展示被移除」条款改写为「导语区内与显式封面同 URL 的正文图由渲染层去重；数据层独立性保留」（archive 阶段随知识沉淀执行）\n\n完整 brief：shadow-docs/changes/20261008-fix-post-cover-lead-dedupe/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261008-fix-post-cover-lead-dedupe\",\"type\":\"fix\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261008-fix-post-cover-lead-dedupe/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "commit": {
      "files": [
        "apps/site/app/lib/postLeadDedupe.ts",
        "apps/site/app/post/[number]/page.tsx",
        "apps/site/test/post-lead-dedupe.test.mjs",
        "shadow-docs/changes/20261008-fix-post-cover-lead-dedupe/brief.md",
        "shadow-docs/designs/20261008-post-cover-lead-dedupe/cover172.png",
        "shadow-docs/designs/20261008-post-cover-lead-dedupe/prototype.html",
        "shadow-docs/designs/20261008-post-cover-lead-dedupe/prototype.png",
        "shadow-docs/knowledge/post-cover.md"
      ],
      "message": "fix(site): 博客详情页渲染层导语区去重——封面图与文档标题首屏不再重复"
    }
  },
  "knowledge": null
}
---

# 博客详情页封面首屏去重（渲染层导语区收编）

## 动机

最新博客《Vibe Coding Workflow 概述》（stack-wuh/blog #172）开始采用新的文档结构产出：**正文 markdown 自带大标题（`## <标题>`）、内嵌封面图（与 `metadata.cover` 同 URL 的导语首图）、文末 `wuh-site-metadata` JSON 注释**。详情页 chrome 本身已渲染 PostHeader h1 与 PostCover 杂志卡，叠加后首屏出现**同一张封面图 ×2、同一句标题文字 ×3**（图内文字 / h1 / 导语区 h2），目录 7 条目中「第壹节」被文档标题占位、正文六节从「贰」起跳。

作者已确认**后续所有博客都会按此结构产出**——重复是系统性、持续性的，必须在渲染层固化为容错行为，而非个案修数据。现行 active 卡片 `post-cover.md` 的「正文首张图片不因封面展示被移除」条款基于"封面 ≠ 正文图"的旧假设，已被新文档结构击穿。

原型对比图见 `shadow-docs/designs/20261008-post-cover-lead-dedupe/prototype.html|png`（现状 BEFORE vs 方案 A AFTER），用户已验收。

## 引用规范

- `shadow-docs/knowledge/post-cover.md`（verified 2026-08-23）
  - 当前结论: 封面经正文 `wuh-site-metadata` 注释声明存为 `metadata.cover`；显式封面与正文图片独立、首图不因封面展示被移除（仅回退场景去重）；杂志卡 16:9 + 1px accent 细边 + 12px 圆角 + 底部轻渐变；加载失败隐藏不保留破图
  - 适用 scope: apps/site/app/post/components/PostCover、styles/post-header.ts、PostView
  - 本变更落地后需更新其「独立」条款为「导语区同 URL 图由渲染层去重」（数据层独立性保留），见「知识评估」
- `shadow-docs/knowledge/blog-detail.md`（verified 2026-09-06）
  - 当前结论: 排印变换为纯字符串/无 DOM 依赖、SSR 与客户端输出确定一致；h2/h3 眉线记号由 `articleTypography.ts` 注入并剥离手写编号前缀；章节记号、目录、锚点必须一起回归
  - 适用 scope: apps/site/app/post
- `shadow-docs/knowledge/blog-display.md`（浏览量/日期格式）——仅页头 meta 复刻涉及，不约束本变更
- 通用 `norms/ui-patterns.md`——设计语言复刻已有实现、无新组件；`norms/code-style.md`——单文件单职责、不新增 any、不扩大类型绕过编译

## 决策

- **选型:** 方案 A——渲染层「导语区去重」。SSR 管线新增纯函数 `dedupeLeadArtifacts(html, { title, cover })`，在 `ensureRenderedBody` 之后、`useToc` 消费之前执行：
  - 图片命中：导语区（**首个实质段落之前**的块组）内 `归一化(src) === metadata.cover` 的 `<img>`（含其空壳 `<p>`）→ 从渲染 html 移除；
  - 标题命中：导语区首个 heading，剥离手写编号前缀（与 `articleTypography` 归一化同一套逻辑）后文本 === `issue.title` → 移除；
  - 归一化：URL 去协议（`https?://`）/去查询串与 hash/小写域名，path 大小写敏感；标题文本 trim + 空白折叠。
- **对比方案:**
  - 方案 B（content API 出口清洗数据）——否决：去重是展示关注点，不应改写数据；RSS、导出全文、分享图将失去完整文档形态；直接违背 `post-cover.md` 数据层独立条款。
  - 方案 C（识别"文字卡封面"降级为生成式封面）——否决：不解决正文重复，判定不可靠，治标不治本。
  - 客户端 DOM 删除——否决：SSR 首帧仍闪重复、违反排印变换确定性约束。
- **理由:** 新文档结构成为全站标准产出，渲染层容错一次到位；只删块不改样式，封面卡/页头/断点/主题表现零变化；存量未命中文章零 diff；与既有确定性变换（articleTypography）同构，可被 `.test.mjs` 离线单测覆盖。

## 任务

### Phase 1 — 去重内核

- [x] 新增 `apps/site/app/lib/postLeadDedupe.ts` — 纯函数：导语区扫描、封面同 URL 图移除、标题重复 heading 移除；URL/文本归一化 helper；与 `articleTypography.ts` 的编号剥离规则对齐（可提取共用）
- [x] 新增 `apps/site/test/post-lead-dedupe.test.mjs` — 命中/不命中/边界用例：#172 真实结构 fixture、正文中途同 URL 图不动、首行标题≠文章标题不动、无 metadata.cover 不动、导语区含多个 heading、HTML 实体与空白差异归一化

### Phase 2 — 详情页接入

- [x] 修改 `apps/site/app/post/[number]/page.tsx` — `ensureRenderedBody` 出口接入 `dedupeLeadArtifacts`，上下文取 `issue.title` 与 `issue.metadata?.cover`；仅影响详情页正文 html，不改 `Issue.metadata` 与导出/分享数据源
- [x] 回归 `apps/site/app/post/hooks/useToc.ts` 消费链 — #172 目录 6 条目、编号从壹顺排、`seo-heading-hierarchy`/`post-typography-design-language` 既有测试不破

### Phase 3 — 验证与知识

- [x] `pnpm exec tsc --noEmit` + 站点 `node --test`（与基线一致）+ /post/172 首屏效果与存量抽查。【review 校准：`pnpm dev:next` 真机不可行——本机无站点 env 与 Nest/Mongo 栈、生产 502；改用真实数据离线全链路冒烟（stripMetadata→renderMarkdown→dedupe→transformArticleTypography）+ 6 篇存量管线审计完成；合并后由 release 阶段 staging-test 真机兜底。原「有封面但首图不同 URL」形态存量不存在，该边界由单测覆盖】
- [x] 知识影响评估与记录完成（见「知识评估」：含 review 阶段对「回退推导位置在后端」的错误发现撤回与射程澄清）；`post-cover.md` 条款的最终改写按流程在 release/archive 阶段随知识沉淀执行，不属 review 门禁动作

## 结果

- 实际耗时: —
- 验证:
  - **TDD 红→绿**：`node --experimental-strip-types --test test/post-lead-dedupe.test.mjs` 15/15（先失败于模块缺失，实现后转绿；期间修正 test3 语义——无封面时标题规则应独立生效，与生成式封面承载 h1 的规范一致）
  - **站点全量回归**：`node --experimental-strip-types --test test/*.test.mjs` 204 例，fail 26 与 stash 基线完全一致（26 例为 Windows 存量环境失败，含「更新于」文案断言等，与本变更无关）；`seo-heading-hierarchy`/`post-typography-design-language`/`post-detail-runtime-regression`/`seo-post-cover-sizes` 定向回归通过
  - **类型与 lint**：`cd apps/site && pnpm exec tsc --noEmit` 新改文件 0 错（存量 35 错不变）；oxlint 2 文件 0/0
  - **真实链路离线冒烟**（替代真机 dev，本机无后端栈、生产 502）：#172 真实 body → stripIssueMetadata 复刻 → renderMarkdown → dedupeLeadArtifacts → transformArticleTypography——`removed 图1/标题1`、封面 URL 不再出现于正文 html、目录 6 节从壹顺排（工作流存在的意义?/启发式探索/渐进式披露/信号机制/自动迭代/基建任务）、首字下沉在真导语段、正文无 h1
  - **存量零 diff 审计**（#165/#155/#135/#121/#92/#65 真实数据过全管线）：无封面且结构正常者 0/0 或仅删重复标题（人工核对首行确系与 issue.title 等强的文档大标题，非真章节）；#165（酒红域旧文）同构命中 1/1——**证实重复现象早于 #172 即系统性存在，修复对全部存量生效**
  - **接入形态**：page.tsx 保持 `issue.body_html = await ensureRenderedBody(issue)` 守卫原样，去重为紧随其后的独立后置语句（post-detail-runtime-regression 守卫不破）
- **apply 遗留（review 已处置）**: `pnpm dev:next` 真机抽查经 review 阶段确认可行性穷尽（本机无 env/后端栈、生产与候选 API 源均 502），task-5 措辞校准为离线真实链路验证 + release 阶段 staging-test 真机兜底；review 同时撤回一条 apply 错误发现并澄清前端去重与后端派生的射程边界（见知识评估）
- **release 最终知识动作（已写入）**: `shadow-docs/knowledge/post-cover.md` 原位更新——声明语法修正为 `wuh-site-metadata` JSON 注释、显式封面「数据层独立 + 渲染层导语区去重」双层条款、后端 `withDerivedCover` 派生位置与两不叠加边界、文档标准结构事实；source 追加本 brief 并顺带修复 4 条历史 source 的失效路径（旧日期格式与缺 archive 前缀）；verified 2026-10-08。治理扫描通过：frontmatter 完整、5 source 全存在、关联链接有效、menu「博客详情」行路由命中（关键词含「封面」）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/post-cover.md`（导语区去重条款）；`shadow-docs/knowledge/blog-detail.md`（若编号剥离 helper 被提取共用则补注记）；新文档结构约定（标题 + 内嵌封面 + metadata 注释为全站标准产出）为跨端事实，评估是否并入 `content-api.md` 或新卡 `post-doc-structure.md`（apply 阶段按 domain+keywords+scope 查重后定）
- **理由:** 去重语义改变了 post-cover.md 的「独立」结论；作者确认所有后续博客按新结构产出，属长期有效项目事实
- **apply 发现（ship 阶段改写卡片时一并处理）:**
  - post-cover.md 所述声明语法 `<!-- cover: <URL> -->` 与代码事实不符——现行实现为 `<!-- wuh-site-metadata: {JSON} -->`（`content-metadata.util.ts` METADATA_RE，sync/content 链路均此形态）；卡片 source 有效但语法段过期，属**卡片条款过期**而非回归
  - ~~「封面回退推导不存在」~~ **review 阶段证伪并撤回**：回退推导真实存在且在**后端** `content.controller.withDerivedCover` + `content-cover.util.extractFirstImageAndClean`——无显式封面时首图升格为派生 cover 并从 body/bodyHtml 移除（卡片的回退条款有效，只是实现位置在后端）。由此明确前端去重的射程：仅显式封面文章会带着正文重复首图到达前端（#172/#165 形态）；派生封面文章的图在后端已移除，前端比对天然 no-op，**两层无叠加误删风险**
  - 审计确认导语区结构（`## 标题` + 内嵌封面图 + 文末 metadata 注释）至少自 #65 起即存在，「最新规范」实为长期惯例被 #172 显性化——知识改写建议按"文档标准结构 + 渲染层收编"表述
  - **存量零 diff 审计的方法论注记**：audit 以 gh 原始 body 模拟管线，「无显式封面」组与真实链路有差（真实 API 会派生 cover 并删首图）——该组结论按上条射程界定重读：#92/#65 真实形态是"派生封面文章 + 前端标题去重"，heading 移除结论不变；#155/#135/#121 真无图文章行为不变；「显式封面」组（#165/#172）audit 即真实链路

## 待确认点（不并入本 change）

- #172 正文另有 6 张 `./assets/fig-0X-*.png` **相对路径**配图，详情页按相对 URL 解析将破图——属发布管线资产改写问题，若后续文章同样携带相对路径配图，需另立变更核实（渲染层或 publish 管线改写为绝对 CDN URL）。
