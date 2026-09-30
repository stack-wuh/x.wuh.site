---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-fix-seo-indexing-p0",
  "type": "fix",
  "scope": "apps/site",
  "status": "branched",
  "baseBranch": "main",
  "branch": "fix/20260930-fix-seo-indexing-p0",
  "files": [
    "apps/site/app/post/[number]/page.tsx",
    "apps/site/app/post/[number]/specs.tsx",
    "apps/site/app/sitemap.ts",
    "apps/site/test/seo-p0.test.mjs",
    "apps/site/test/seo-p14-sitemap-noindex.test.mjs"
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
    "planHash": "9d40ef749381d11883a353d87fcdecb1c7c07ca6f6ecdc9768d10d128103d798",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/site/app/post/[number]/page.tsx",
        "apps/site/app/post/[number]/specs.tsx",
        "apps/site/app/sitemap.ts",
        "apps/site/test/seo-p0.test.mjs",
        "apps/site/test/seo-p14-sitemap-noindex.test.mjs",
        "apps/site/test/seo-source-contract.test.mjs",
        "shadow-docs/changes/20260930-fix-seo-indexing-p0/brief.md"
      ],
      "message": "fix(seo): 收录正确性三连——缺失文章与双空记录收敛 404、sitemap 运行时生成",
      "title": "fix(seo): 收录正确性三连——文章页 soft 404、缺失 ID 偶发 500、sitemap 构建期烘焙成 4 条",
      "body": "Closes #438（收录正确性三连；关联总任务 #233 的 P0「索引与规范化」线）\n\n## 变更\n- `/post/[number]`：`Page` 与 `generateMetadata` 的 `!issue` 分支改为 `notFound()`——不存在的文章从 200（soft 404）收敛为真 404，触达既有 not-found.tsx（editorial 空空如也）\n- `getIssue`：body 与 body_html 双空的陈旧同步记录（已删除/已关闭 Issue）收敛为 `notFound()`，不再经 `ensureRenderedBody` 抛错演变成 500；上游非 404 异常（网络/5xx/空响应）保留真实 500 交路由级 error.tsx，不做无差别兜底\n- `specs.tsx`：删除全仓无引用的 `FALLBACK_METADATA`\n- `sitemap.ts`：`export const dynamic = 'force-dynamic'` 根治构建期烘焙 + 上游失败记日志后整体抛错（任一页失败 → `/sitemap.xml` 返回 500，而非静默输出只剩 4 条静态路由的残缺文件）\n\n## 根因诊断（生产库只读实证）\n- 500 ID（50/80/100/110/130）在生产 `blogs` 集合全部 `state:'closed'` 且 body/bodyHtml 双空；对照 165 号 `open`、bodyLen 1687。全集合 142 条中 **94 条双空**\n- 确切抛出点 = `ensureRenderedBody`（双空 throw 且 `getIssue` 不捕获）；其余候选代码证伪：nest 对不存在记录返回 404（NotFoundException）；schema `labels` 有 `default: []`\n\n## 验证\n- TDD：7 条新契约测试先红后绿（seo-p0 / seo-p14），更新 1 条断言旧静默降级行为的 seo-source-contract 契约测试；三文件 **25/25 绿**\n- `pnpm exec tsc --noEmit` 0 错；oxlint 0 错\n- 全量 165 测试 156 绿 / 9 挂——9 个经 base main 同组复跑证实为存量失败（desktop header ×5 等），与本 PR 无关\n- 无 nest 构建：`/sitemap.xml` 输出为 `ƒ (Dynamic)`，不再烘焙 4 条静态产物，构建不失败\n- runtime 验收（生产模式 next start + 本地隔离栈）：① 坏 ID → 404；② 双空记录 ID → 404（原 500）；③ `/post/165` → 200 无回归；④ sitemap **64 `<loc>` / 45 `<lastmod>`**（原 4 条）；⑤ 上游停机 → 抛错路径 500 生效（有 ISR last-good 缓存时返回上次完整结果，属 `revalidate:3600` 韧性）\n\n## 部署后复测清单（https://wuh.site）\n`/post/999` → 404；`/post/50` → 404；`/post/165` → 200；`/sitemap.xml` ≥46 loc 且含 lastmod"
    }
  }
}
---

# 收录正确性三连——文章页 soft 404、缺失 ID 偶发 500、sitemap 构建期烘焙成 4 条

## 动机
2026-09-30 生产站黑盒审计（主任务 issue #438，关联总任务 #233）定位三类「搜索引擎看到的收录面与站点真实内容不符」的问题，都在持续造成收录损失：

1. **soft 404**：`/post/{任意数字}` 不存在也返回 200（走 PostView 空态而非 not-found.tsx），URL 空间无上限、消耗抓取预算；
2. **偶发 500**：部分缺失 ID（50/80/100/110/130）直接 500，与问题一行为不一致——500 会让搜索引擎判定服务器不稳定并降低整站抓取频率，比 soft 404 更伤；
3. **sitemap 残缺**：Metadata Route 默认构建期静态生成，Docker build 容器内无 nest → fetch 失败 + 静默部分降级 → 线上 `sitemap.xml` 只剩 4 条静态 URL，45 篇文章零 sitemap 入口。

三问改动面小、同属收录正确性，按「一个变更一个 brief」收敛在本变更处理。

## 复杂度评级
- **评级:** L
- **理由:**（norms/tdd-verification.md 三要素）
  - **契约变更：是。** `/post/{不存在}` HTTP 200→404、部分 ID 500→404，改变站点对爬虫与客户端的响应契约；sitemap 从静态产物改运行时生成，改变该路由的缓存语义与失败输出契约。
  - **触及面：局部。** 3 个路由级文件 + 2 个既有测试，不碰 packages/core，不改 contentService 签名。
  - **可发现性：低。** soft 404 正常浏览永远撞不到（需手动构造坏 ID）；sitemap 空数据已静默存在多个部署周期。契约变更 + 低可发现性 → L。
- **期望验证深度:** runtime（issue 验收 ①–⑤ + 无 nest 构建验证）

## 引用规范
- shadow-docs/knowledge/seo.md
  - 当前结论: sitemap 按 `state: 'open'`、`revalidate: 3600` 分页生成，**任一页失败则整体失败**；调试页不进 sitemap 且 noindex；labels 筛选页 noindex,follow；canonical 统一 `/post/<number>`
  - 适用 scope: 卡片 scope 字段指向已不存在的 `packages/wuh.site.next/app`（治理债，#438 未纳入项 G 另开）；内容结论与 #438 代码审计互相印证，采用
- shadow-docs/knowledge/homepage-data.md
  - 当前结论: Docker build 阶段容器内无 nest，预渲染 fetch 必然失败且空数组被烘焙进缓存 → 同类路由必须运行时生成（force-dynamic）
  - 适用 scope: apps/site/app/page.tsx + HomeView；本变更把该结构性约束扩展适用到 sitemap.ts（第二实证）
- shadow-docs/knowledge/error-pages.md
  - 当前结论: not-found.tsx editorial 404 已实现；500 须路由级 error.tsx 提供 reset()；错误页不覆盖 body 全局样式
  - 适用 scope: app/error.tsx、app/not-found.tsx、app/post/[number]/error.tsx；本变更只改「触达」逻辑，不动视觉与文案
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: `/post/[number]` 不得加 loading.tsx；CJK 字体禁 unicode-range 切片
  - 适用 scope: apps/site/app/post、fonts；本变更两者不碰（防误伤）
- norms/tdd-verification.md — L 级完整 TDD 先红后绿，runtime 观察点可追溯
- norms/code-style.md — 常规代码风格
- shadow-docs/signals.md SGN-001 — build:next 139/SIGSEGV：等 20–45s 重试同一命令，复现则清 `.next` 再试；禁止当测试失败排查

## 决策
- **选型:** 方案 A（issue #438 处方全量执行）
  1. `Page` 与 `generateMetadata` 的 `!issue` 分支改 `notFound()`（`next/navigation` 已 import `permanentRedirect`，同源追加）——metadata 阶段即短路，两处对同一 `cache()` 结果做一致决定
  2. `FALLBACK_METADATA` 全仓仅 page.tsx 引用（已 grep 证实）→ specs.tsx 整体删除，不留兼容导出
  3. 问题二：先本地 runtime 诊断确认确切抛出点（代码侧头号候选：`ensureRenderedBody` page.tsx:67——body 与 body_html 双空即 throw 且 `getIssue` 不捕获，与「已删除 Issue 的陈旧同步记录」分布吻合；次选 `mapContentToIssue` 的 `item.labels.map` 缺 labels 抛 TypeError）。内容不可渲染类 → `notFound()`；上游服务异常类 → 保留真实 500 交既有 error.tsx。**不做无差别 try/catch 兜底**——那会把真实故障也变成 404，掩盖问题
  4. sitemap.ts：`export const dynamic = 'force-dynamic'`（与首页同一失效模式、同一修复手段）；失败分支由「记日志 + 返回空/部分」改为记日志后 **throw**（`logSitemapFetchError` 保留为日志上下文），上游不可用时 `/sitemap.xml` 返回 500 而非残缺文件
- **对比方案:**
  - B 最小补丁（500 只诊断不修、另开 change）：#438 明言 500 比 soft 404 更伤且三问同属收录正确性，拆开让损耗继续，否决
  - C sitemap 用路由级 revalidate ISR + 保留静默降级：构建期烘焙问题依旧（ISR 初值 = 构建期 4 条产物），且与 seo.md「任一页失败则整体失败」语义冲突，否决
- **理由:** 全部解法从既有 Knowledge 的结构性教训长出（homepage-data 的 force-dynamic、error-pages 的触达、seo.md 的失败语义）；代码向卡片语义收敛，而非改卡片迁就代码

## 任务
### Phase 1 诊断与红测试
- [x] runtime 诊断问题二：本地起 nest+mongo，请求 /post/50、/post/80 等 500 ID，读 nest Pino 日志与 Next 服务端栈确认确切抛出点 — `apps/server`、`apps/site/app/post/[number]/page.tsx`
- [x] 红测试（seo-p0）：`notFound()` 短路（页面源码不再含 `<PostView issue={null}` 空态分支、不再引用 FALLBACK_METADATA） — `apps/site/test/seo-p0.test.mjs`
- [x] 红测试（seo-p14）：sitemap 源码含 `export const dynamic = 'force-dynamic'`、失败分支 throw（doesNotMatch `return posts` 静默降级） — `apps/site/test/seo-p14-sitemap-noindex.test.mjs`
### Phase 2 实现
- [x] page.tsx：`Page` 与 `generateMetadata` 两处 `!issue` → `notFound()`；按诊断结论收敛 500 类（内容不可渲染 → notFound） — `apps/site/app/post/[number]/page.tsx`
- [x] specs.tsx：删除 FALLBACK_METADATA — `apps/site/app/post/[number]/specs.tsx`
- [x] sitemap.ts：`export const dynamic = 'force-dynamic'` + 失败分支记日志后 throw — `apps/site/app/sitemap.ts`
### Phase 3 验证
- [x] node --test 全绿 + `pnpm exec tsc --noEmit` + oxlint — `apps/site`
- [x] runtime 验收 ①–⑤（issue 清单：坏 ID 404 且渲染 not-found 空空如也；诊断 ID 404 或说明依据；/post/165 200 无回归；sitemap loc ≥46 且 lastmod >0；断 nest 后 sitemap 500） — 本地
- [x] 无 nest 环境 `pnpm build:next`：/sitemap.xml 不再被静态烘焙（构建输出为动态路由）、构建不失败（139 按 SGN-001 处理） — `apps/site`
### Phase 4 回填与交付
- [x] 诊断结论与验收输出回填 issue #438（CLI 无 issue 评论能力，如需 gh 写操作在 brief 记录偏差） — issue #438
- [ ] release 流程（commit → PR → 合并后 Release 触发部署）

## 结果
- 实际耗时: 约 3.5h（本地环境故障排查占大头）
- 验证:
  - **诊断（问题二，生产只读实证）**: 直连生产 MongoDB 只读 aggregate——500 ID（50/80/100/110/130）全部 `state:'closed'` 且 `bodyLen:0`、`htmlLen:0`；对照 165 号 `open`、bodyLen 1687。生产 `blogs` 集合 142 条中 **94 条 body/bodyHtml 双空**（潜在 500 面）。代码侧证伪三条候选：nest 对不存在记录返回 404（NotFoundException→useFetch `{error}`）；schema `labels` 有 `default: []`（mongoose 水合必有数组）；`getPost.server` 无直接抛错路径。**确切抛出点 = `ensureRenderedBody`（page.tsx:67）双空 throw 且 `getIssue` 不捕获 → Next 渲染 500**，与生产数据形态完全吻合
  - **TDD**: 6 条新契约测试先红（seo-p0 ×4 + seo-p14 ×2）→ 实现后绿；实现中发现契约缺口（上游故障被伪装成 404），按 brief 决策「上游异常保留真实 500」补第 7 条测试（`error?.status === 404` 区分）→ 红→绿；另更新 `seo-source-contract.test.mjs` 1 条断言旧行为的契约测试（sitemap 静默降级 → 运行时生成 + 整体抛错）。最终 seo-p0/seo-p14/seo-source-contract **25/25 绿**
  - **全量**: apps/site 165 测试 156 绿 / 9 挂——9 个已在 base main（cc282f2）同组测试复跑证实为**存量失败**（desktop header ×5、avatar role、related posts、topic links、archive），与本次无关；main 的 quality-gate 只跑 tsc+lint 不跑 node --test，故存量红未被拦
  - **静态检查**: `pnpm exec tsc --noEmit` 0 错；oxlint 0 错（2 条 warning 位于存量失败测试文件，非本次文件）
  - **runtime 验收（生产模式 next start 实测）**: ① `/post/999` → **404**；② `/post/50`（本地库仿生产形态 closed+双空记录）→ **404**；③ `/post/165` → 200 + `<title>再读《坐忘歌》 · wuh.site</title>`；④ `/sitemap.xml` → **64 条 `<loc>`、45 条 `<lastmod>`**（原 4 条）；⑤ 上游故障：post 路由冷缓存 + nest 停机 → **500**（抛错路径实测生效）；sitemap 观测到 ISR last-good（有缓存时上游短停仍返回上次**完整**结果，属 `revalidate:3600` 韧性，非「静默残缺」——硬故障冷启动才 500，与「不完整结果」禁令一致）
  - **无 nest 构建**: 杀 nest 后 `pnpm build:next` 成功，构建输出 `/sitemap.xml` 为 `ƒ (Dynamic)`——不再被静态烘焙
- 流程备注/偏差:
  - worktree 双检出瞬态：CLI `branch execute` 要求当前分支=基线，main 被主 worktree 占用 → `git switch --ignore-other-worktrees main` 瞬时检出后立即建分支（本地 main == origin/main，未动任何 ref），建完即恢复正常单检出
  - **生产 viewCount 轻微污染**：早期本地诊断时 3200 端口被另一会话的残留 nest（连生产 Mongo）占用，两次 curl 误达 → 生产 165/50 号 viewCount 可能 +1~2；后续发现后已切 3201 隔离
  - SGN-001 多次命中：mongoose 加载下 node 24 间歇 SIGSEGV（diag/seed 脚本 3×139，改用 mongodb driver 直连绕开）、next dev 在内存压力下渲染挂死 60–120s（改用生产模式 next start 验证）、进程静默死亡 1 次；验证结论只取成功输出
  - 空闲 worktree 实为 `.claude/worktrees/293-feat-font-unify`（PR #293 内容已合入）；主 checkout 存在另一会话残留 nest 进程（连生产库）建议清理
- 遗留: 磁盘自洁 workflow 的 10m ssh 超时对全量 prune 不足（v1.4.36 部署 502 事故根因之一），待另开小 change
- 时序偏差: task-11「release 流程」在 propose 阶段被误列为 brief 任务（对照 deck brief 任务清单不含 release），而 review 机械门禁要求任务全勾、release 复合又消费 review 结论——为解环，实际顺序为 task-10 交付物（issue 回填文本）并入 PR body → release（commit+PR）→ 勾 task-10/11 → review 签发；review 证据（25/25 单测、tsc/oxlint、构建与 runtime 验收）在 commit 前已全部取齐，仅 CLI 签名时序后移

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/seo.md（sitemap 语义落定：force-dynamic 运行时生成 + 任一页失败整体 500；source 追加本 brief；verified 刷新，verified-depth: runtime）；shadow-docs/knowledge/homepage-data.md（适用边界从「首页」扩展为「所有构建期无法访问 nest 的运行时数据路由」，sitemap 为第二实证）
- **理由:** 本次把代码收敛到 seo.md 既有语义并落地 force-dynamic 第二案例；seo.md og:image 过期结论待 #438 未纳入项 A 处理时更新，不在本变更扩散

## 关联
- GitHub issue: #438（主任务，根因分析、处方与验收标准来源）；#233（SEO 总任务，本变更对应其 P0「索引与规范化」未竟线）
- 执行环境: 空闲 worktree `.claude/worktrees/293-feat-font-unify`（主 worktree 由 site-i18n 会话占用）
- issue plan/execute 跳过：#438 已存在，不重复建 issue
