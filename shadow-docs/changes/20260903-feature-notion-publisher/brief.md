---
{
  "schema": "shadow-dev/v1",
  "name": "20260903-feature-notion-publisher",
  "type": "feature",
  "scope": "apps/server,packages/publisher",
  "status": "proposed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/server/.env.example",
    "apps/server/src/app.module.ts",
    "apps/server/src/modules/publisher/publication.schema.ts",
    "apps/server/src/modules/publisher/publisher.controller.ts",
    "apps/server/src/modules/publisher/publisher.module.ts",
    "apps/server/src/modules/publisher/publisher.service.ts",
    "apps/server/src/modules/publisher/rescue.service.ts",
    "packages/publisher/package.json",
    "packages/publisher/src/frontmatter.spec.ts",
    "packages/publisher/src/frontmatter.ts",
    "packages/publisher/src/images.spec.ts",
    "packages/publisher/src/images.ts",
    "packages/publisher/src/markdown.ts",
    "packages/publisher/src/notion.ts",
    "packages/publisher/src/oss.ts",
    "packages/publisher/src/publish.ts",
    "packages/publisher/src/source.ts",
    "packages/publisher/tsconfig.json"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": null,
    "planHash": null,
    "updatedAt": null,
    "lastError": null
  }
}
---

# Notion 发布中枢与图片永久化（语雀镜像迁移）

## 动机

博客真相源是 `stack-wuh/blog` 的 markdown 文件，GitHub Issues（本仓库）/ 语雀 / 微信公众号 / Notion 均为发布镜像。当前痛点：贴入 issue 的图片被 GitHub 重写为 `user-attachments.githubusercontent.com` / `camo` 域名，数据会被平台清理导致永久丢图。

本变更要完成四件事：

1. 定义**源文件固定结构**（frontmatter 规范）：一源多端需要封面图、文档类型、发布矩阵等声明式元数据，现状源文件无 frontmatter（`# H1` 当标题、`> 摘要：` blockquote 当摘要、命名中英混用、带 BOM）；
2. 在发布矩阵中新增 **Notion 目标端**，回填语雀那批文章（源都在 GitHub，无需从语雀导出任何数据，语雀镜像直接退役）；
3. 图片统一转存**阿里云 OSS（cdn.wuh.site）**实现永久化——包括 Notion 页面（Notion API 返回签名 URL 会过期，必须落 external CDN 链接）；
4. **存量 issue 图片抢救**：下载现有 github 域名图片 → OSS → 改写 issue body → 重同步。

后续将出现 Desktop 工具作为博客系统统一操作台（维护/发布/推送），因此管线核心沉淀为共享包 `packages/publisher`，`apps/server` 只做薄 admin API 封装，本次不做 console UI。

## 引用规范

- `shadow-docs/knowledge/content-api.md`
  - 当前结论: 分页统一 `PaginatedResult<T>`；封面推导链 metadata.cover → bodyHtml 首图 → markdown 首图，推导值不写回数据库；站点已支持 metadata.slug 查询（content.service.ts:83）
  - 适用 scope: apps/server content 域；本变更不改 content API；图片抢救改写 issue body 后重同步时，必须保持 metadata 解析（`<!-- wuh-site-metadata: {...} -->` 注释）与封面推导链不变
- shadow-dev-workflow 通用规范 `norms/code-style.md`：禁止新增 `any`；跨包仅经 workspace 声明的公开入口消费；共享包不依赖应用包；不为未来场景提前抽象
- shadow-dev-workflow 通用规范 `norms/api-design.md`：新端点走全局 `/v2` 前缀、名词复数路由、DTO 用 class-validator、错误统一走 HttpExceptionFilter
- shadow-dev-workflow 通用规范 `norms/code-style-database.md`：新增 publications 集合（Mongoose Schema）命中数据库变更规范
- 实施时按命中的分规范追加执行：`norms/code-style-backend.md`、`norms/code-style-packages.md`

## 待确认点（代码事实与 Knowledge 冲突记录）

- `content-api.md` 卡片 scope 写的 `packages/wuh.site.nest/src/modules/content`、`packages/shared-contracts` 已与实际结构不符（现为 `apps/server/src/modules/content`）；卡片 source 路径因归档目录加 `P-` 前缀而漂移（`20260501-P-standardize-api-and-migrate-frontend`）。结论本身仍有效，卡片待更新。

## 决策

- **选型:** 方案 A 微调版——`packages/publisher` 共享库 + `apps/server` 薄封装 admin API，一次变更覆盖源文件规范、Notion 发布、OSS 图片管线、存量 issue 抢救；不做 console UI（未来 Desktop 工具为统一操作台，直接引用共享包本地运行或调 server API）
- **源文件规范:** 分层原则——frontmatter 只装**声明式元数据**（人写），运行时数据不进源文件（机器写）。发布状态进 MongoDB `publications` 集合；评论留在平台（issue）+ MongoDB，如需防平台清理做独立定期导出备份，不混入内容管线
- **frontmatter 承载字段:** `slug`（稳定幂等键）、`title`（缺省取 H1）、`summary`（缺省取 `> 摘要：` blockquote，兼容存量惯例）、`cover`/`coverAlt`（封面唯一来源）、`tags`（→ issue labels / Notion multi-select）、`date`（权威发布日期，issue createdAt 会被编辑行为扰动）、`updated`、`type`（post=博客全平台 | note=知识笔记只进 Notion | draft=不发布）、`publish` 矩阵（可选，覆盖 type 默认）、`rssExcluded`（沿用站点已有字段）。全部字段可选 + 推导规则，存量文章零补齐兼容；解析器 strip BOM。**规范已先行落地为 `stack-wuh/blog` 仓库 `FRONTMATTER.md`（v1，2026-09-03），源文件可立即按其优化，本变更解析器以该文档为准**
- **幂等键:** slug（frontmatter 显式声明 > 文件名推导），站点已用 `metadata.slug` 查询，Notion upsert / issue 映射 / publications 集合全平台统一用它
- **对比方案:**
  - 方案 B（只做 Notion 发布、图片治理后置）：会把会死的 github 图链原样复制进 Notion，违背本变更动机，否决
  - 方案 C（一步到位 Publisher 抽象 + 同时实现 Issue 发布器）：范围翻倍且当前无 Issue 自动化需求，YAGNI 否决；共享包形态已为该演进留缝
  - 全部逻辑放 server：未来 Desktop 必须依赖 server 在线才能发布，否决
  - 逻辑放 Desktop 侧：与已确认的「x.wuh.site 发布中枢」方向冲突，否决
  - 源文件规范之「全部进源文件」（发布日志/评论写进 frontmatter）：机器每次发布/评论都要改 md 提交，diff 脏、易冲突，git 历史被运行时数据淹没，否决
  - 源文件规范之「最小化三字段」（只定 slug/cover/type）：发布矩阵控制力与日期稳定性不足，否决
- **理由:** 单一真相源在 `stack-wuh/blog`，图片永久化必须在转存层统一解决；Notion 签名 URL 过期问题决定了图片必须以 external CDN 链接落库；共享包形态同时满足 server API 与 Desktop 本地运行两条消费路径；slug 幂等键让"文件改名/移动"不破坏各平台已有映射

### 关键技术约束

- frontmatter 解析：gray-matter；宽松解析全字段可选；推导规则 title←H1、summary←`> 摘要：` blockquote、date←文件名日期前缀/目录、cover←正文首图、slug←文件名；strip BOM；解析优先级 frontmatter > 惯例推导
- Notion：`@notionhq/client` + `@tryfabric/martian`（md→blocks）；database 以 slug property 为幂等键做 upsert；图片 block 用 external URL 指 `cdn.wuh.site`，不用 Notion 文件上传；API 约 3 rps，全量回填需节流
- OSS：`ali-oss` SDK，`existsObject` 幂等跳过已上传文件；`cdn.wuh.site` 已在站点 image-proxy 白名单与 next.config remotePatterns 中
- 图片 URL 改写必须跳过 `<!-- wuh-site-metadata: {...} -->` 注释段（`parseIssueMetadata` 依赖），且二次执行幂等
- publications 集合：slug → `{ notion: { pageId, url, lastSyncedAt }, issues: { number, lastSyncedAt } }`，仅由发布中枢机器写入
- 环境前置（用户准备）：Notion integration token + database（共享给 integration，含 slug property）、OSS AccessKey（bucket 真实名称与 region 待确认）、`GITHUB_PERSONAL_TOKEN` 需含 `stack-wuh/blog` 读取权限

## 任务

### Phase 1 — packages/publisher 骨架与图片管线

- [ ] 初始化 packages/publisher（package.json、tsconfig、exports 入口，workspace 协议依赖声明） — `packages/publisher/package.json` — 新建
- [ ] OSS 上传封装（existsObject 幂等跳过、put 上传、返回 cdn.wuh.site URL） — `packages/publisher/src/oss.ts` — 新建
- [ ] markdown 图片 URL 提取/下载/改写器（跳过 HTML 注释段、内容 hash 命名、幂等改写） — `packages/publisher/src/images.ts` — 新建
- [ ] images 单测：metadata 注释保护、二次改写幂等、外链域名过滤 — `packages/publisher/src/images.spec.ts` — 新建

### Phase 2 — 源文件规范与 Notion 写入

- [ ] frontmatter schema 类型定义与宽松解析器（对齐 stack-wuh/blog 的 FRONTMATTER.md v1：gray-matter、全字段可选、推导规则、strip BOM） — `packages/publisher/src/frontmatter.ts` — 新建
- [ ] frontmatter 单测：推导规则、BOM 处理、无 frontmatter 存量文章兼容 — `packages/publisher/src/frontmatter.spec.ts` — 新建
- [ ] 源仓库拉取（Octokit 递归读 stack-wuh/blog 的 docs/**/*.md，目录类型识别：年份目录=post、$前缀=note） — `packages/publisher/src/source.ts` — 新建
- [ ] Notion client 封装（按 slug 查页、upsert properties、blocks 分段写入、3 rps 节流） — `packages/publisher/src/notion.ts` — 新建
- [ ] martian md→blocks 集成与降级策略（mermaid/数学公式降级为代码块） — `packages/publisher/src/markdown.ts` — 新建
- [ ] publishArticle 编排（拉取→图片转存→转换→upsert，slug 幂等）+ 幂等单测 — `packages/publisher/src/publish.ts` — 新建

### Phase 3 — server 薄封装、发布状态与存量抢救

- [ ] publications 集合（Mongoose Schema + service：slug → 平台映射 + lastSyncedAt，upsert） — `apps/server/src/modules/publisher/publication.schema.ts` — 新建
- [ ] publisher 模块骨架与 DI（复用现有 auth/admin 守卫） — `apps/server/src/modules/publisher/publisher.module.ts` — 新建
- [ ] admin API：POST 单篇发布、POST 全量回填、GET 图片体检报告（DTO + class-validator + /v2 前缀） — `apps/server/src/modules/publisher/publisher.controller.ts`、`apps/server/src/modules/publisher/publisher.service.ts` — 新建
- [ ] issue 图片抢救（扫 github 图片域名→OSS→改写 body 跳过 metadata→update issue→syncIssue 重同步，支持 dry-run 预览 diff） — `apps/server/src/modules/publisher/rescue.service.ts` — 新建
- [ ] 模块注册 + env 声明（NOTION_TOKEN、NOTION_DATABASE_ID、OSS_*、BLOG_SOURCE_REPO_OWNER/NAME） — `apps/server/src/app.module.ts`、`apps/server/.env.example` — 修改
- [ ] 本地 dry-run 验证：全量回填 Notion + 抢救预览 diff + tsc 类型检查 — 无新文件 — 验证

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 新增 + 更新
- **候选卡片:** `shadow-docs/knowledge/publishing-pipeline.md`（新增：真相源/镜像模型、源文件 frontmatter 规范与分层原则、图片 OSS 永久化规范、slug 幂等键与节流约束，或拆出独立 source-frontmatter 卡片）；`shadow-docs/knowledge/content-api.md`（更新：scope 路径漂移修正 `packages/wuh.site.nest` → `apps/server`）
- **理由:** 首次引入发布管线域、源文件规范契约与跨包共享库形态，属长期有效的项目事实；content-api 卡片 scope 已与实际结构不符，本次触及 content 相关行为时应一并修正
