---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-fix-soft-navigation-audio-continuity",
  "type": "fix",
  "scope": "apps/site,packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261006-fix-soft-navigation-audio-continuity",
  "files": [
    "apps/site/app/HomeView/WereadSection.tsx",
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/components/BackHomeLink/index.tsx",
    "apps/site/app/error.tsx",
    "apps/site/app/not-found.tsx",
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/post/[number]/error.tsx",
    "apps/site/app/post/components/PostHeader/index.tsx",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/post-toolbar.ts",
    "apps/site/test/soft-navigation.test.mjs",
    "packages/components/layout/footer.tsx",
    "packages/components/layout/specs.tsx",
    "packages/components/pagination/styles/index.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 501,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/501",
    "pullRequest": 505,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/505"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "d59c8c6b81ee0fc8dcc10278dd74acab926c7620",
    "verifiedAt": "2026-10-07T01:02:23.921Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:505",
    "planHash": "8791523baea9617cf431b934ce2355c877ee4efaf7f760a4fa4b90bef876208f",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 播放中切换路由音乐中断——站内导航 7 面裸 <a>/styled.a 全文档重载，全量软化 next/link + 守卫",
      "titleRaw": "播放中切换路由音乐中断——站内导航 7 面裸 <a>/styled.a 全文档重载，全量软化 next/link + 守卫",
      "supplement": "见 shadow-docs/changes/20261006-fix-soft-navigation-audio-continuity/brief.md：AudioPlayerProvider 挂根布局、软导航实测播放不断（顶导航 Link 面），但页脚导航/文章上下篇/话题题签/SpreadSide/RelatedPostLink/博客分页/Button 站内 href 消费面为裸 <a> 或 styled.a，点击即全文档重载杀播放器。方案 A：逐面改 next/link（styled(Link)、Button as={Link} 透传）+ 新守卫 apps/site/test/soft-navigation.test.mjs 禁止站内路径裸锚点 + IAB 探针法 runtime 复测。",
      "body": "## 动机\n点击播放音乐后切换路由，音乐中断。根因实测（localhost dev + IAB 探针法）：`AudioPlayerProvider` 与 `new Audio()` 挂根布局（AppProviders），架构正确——顶导航 `styled(Link)` 软导航实测同一文档存活、播放不断；但站内仍有 7 面站内路径渲染为裸 `<a>` / `styled.a`（页脚导航、文章上/下篇、话题题签、展开式上下篇 SpreadSide、相关文章 RelatedPostLink、博客分页 NavLink/LetterLink、Button 站内 href 消费面），点击触发全文档重载 → 根 provider 重建 → 队列重拉、播放归零。用户在任何一条硬导航路径上都会撞见断音。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 播放器生命周期——Provider 挂根布局、音频元素挂载期一次性创建，provider 不卸载是跨路由连续播放的前提；守卫正则措辞勿含 banned 标识符与 hex 形 token（守卫措辞陷阱）。\n  - 适用 scope: packages/components/audio-player（本单只读不改）\n- shadow-docs/knowledge/next.md\n  - 当前结论: 组件导入不带 `/index`；站内优先 `@/*` 别名；Next 16.3.2 App Router。\n  - 适用 scope: apps/site, packages/components\n- shadow-docs/knowledge/components.md\n  - 当前结论: 组件包经 exports map 以 `@wuh.site/components/<name>` 消费；包内引入 next 模块已有先例（image/registry/analytics 分别 import next/image、next/navigation、next/web-vitals），footer/pagination 直接 import next/link 与先例同型。\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 方案 A — 逐面软化 + 守卫。7 面站内导航全部改走 next/link（裸 `<a> → <Link>`、`styled.a → styled(Link)`、Button 站内消费 `<Button as={Link}>`），新增静态守卫钉死「站内路径禁裸 <a>/styled.a」。\n- **对比方案:** 方案 B（根级全局锚点拦截 document click → router.push）否决：隐性魔法契约、修饰键/target/download/同路径等边界易错、与 Next 自身拦截叠层后排障成本高，不合项目「显式静态规则」风格。方案 C（Service Worker 保活）否决：重型，且不解决整页闪跳的体验本源。\n- **理由:** 硬导航面已全量普查枚举（有限清单机械替换）；顶导航/博客标题/筛选 chips/留言簿 BackLink 的 Link 先例证明形态可行；外部链接（target=_blank）、资源链接（/api/rss.xml、备案、CC 许可）保留裸 <a> 语义正确；守卫防未来回归。\n- **待确认点（apply 时红灯优先）:** packages/components 内 pagination/footer 直接 `import Link from 'next/link'` 需过包 typecheck 守卫（layout-typecheck/pagination index.test），next 在 components 包为 workspace hoist 依赖——若有类型解析失败，回退方案为组件出口收 props 由消费侧传入渲染元素（同 BackHomeLink 的 as={Link} 模式）。\n\n## 任务\n### Phase 1 — 软化七面\n\n- [ ] post 域软化 — `apps/site/app/post/PostView/index.tsx`、`apps/site/app/post/components/PostHeader/index.tsx`、`apps/site/app/post/styles/post-toolbar.ts`、`apps/site/app/post/styles/post-article.ts` — 上/下篇裸 `<a>`×2 与话题题签裸 `<a>` 改 `<Link>`；SpreadSide、RelatedPostLink 定义改 `styled(Link)`（SpreadSide 禁用分支 `as='span'` 保留）\n- [ ] 包域软化 — `packages/components/layout/footer.tsx`、`packages/components/layout/specs.tsx`、`packages/components/pagination/styles/index.tsx` — footer navItems 站内三项（博客/音乐/关于）经 Link 渲染、RSS/外链保持裸 <a>（specs navItems 形态可加字段区分）；pagination NavLink/LetterLink 改 `styled(Link)`\n- [ ] Button 消费面 — `apps/site/app/error.tsx`、`apps/site/app/not-found.tsx`、`apps/site/app/post/[number]/error.tsx`、`apps/site/app/HomeView/index.tsx`、`apps/site/app/HomeView/WereadSection.tsx`、`apps/site/app/components/BackHomeLink/index.tsx` — 站内 href 的 `<Button>` 加 `as={Link}`（BackHomeLink 内部 Button 统一处理，覆盖其消费方）；外链带 target 的不动\n\n### Phase 2 — 守卫与复测\n\n- [ ] 守卫测试 — `apps/site/test/soft-navigation.test.mjs`（新建）— 静态扫描 apps/site/app 与 packages/components 源文件：站内路径字面量/构造器的渲染根必须为 Link（裸 `<a`、`styled.a` 定义且无 as={Link} 者红灯），allowlist：外部 http(s)、/api/rss.xml、备案/公安/CC 许可、ShareIconButton `as='a'`（target=_blank 外发）；再断言本单 7 面各自的 Link 形态在场。措辞遵 music-player.md 守卫陷阱（无 banned token、正则限定反引号模板）\n- [ ] runtime 复测 — 无文件 — localhost dev + IAB 探针法（window 文档指纹 + `window.__audio` 引用存续）：页脚、上/下篇、话题题签、分页、HomeView Button 面逐一点验同文档存续；对照面（外部链接）仍全载。注意环境陷阱：IAB 经 127.0.0.1 会被 Next dev 403 全部 chunk（整树不水合、一切点击硬导航的假象），必须走 localhost\n\n## 补充\n见 shadow-docs/changes/20261006-fix-soft-navigation-audio-continuity/brief.md：AudioPlayerProvider 挂根布局、软导航实测播放不断（顶导航 Link 面），但页脚导航/文章上下篇/话题题签/SpreadSide/RelatedPostLink/博客分页/Button 站内 href 消费面为裸 <a> 或 styled.a，点击即全文档重载杀播放器。方案 A：逐面改 next/link（styled(Link)、Button as={Link} 透传）+ 新守卫 apps/site/test/soft-navigation.test.mjs 禁止站内路径裸锚点 + IAB 探针法 runtime 复测。\n\n完整 brief：shadow-docs/changes/20261006-fix-soft-navigation-audio-continuity/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-fix-soft-navigation-audio-continuity\",\"type\":\"fix\",\"scope\":\"apps/site,packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-fix-soft-navigation-audio-continuity/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/post/PostView/index.tsx",
        "apps/site/app/post/components/PostHeader/index.tsx",
        "apps/site/app/post/styles/post-article.ts",
        "apps/site/app/post/styles/post-toolbar.ts",
        "apps/site/test/soft-navigation.test.mjs",
        "packages/components/button/index.tsx",
        "packages/components/layout/footer.tsx",
        "packages/components/layout/specs.tsx",
        "packages/components/pagination/index.tsx",
        "packages/components/pagination/styles/index.tsx",
        "shadow-docs/changes/20261006-fix-soft-navigation-audio-continuity/brief.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/knowledge/site-navigation.md",
        "shadow-docs/menu.md",
        "shadow-docs/signals.md"
      ],
      "message": "fix(nav): 站内导航全量软化——同源裸锚点七面全文档重载改 next/link，保根播放器跨路由连续播放 (#501)",
      "title": "fix(nav): 播放中切路由不再断音——站内七面裸锚点全量软化 next/link + soft-nav 守卫",
      "body": "Closes #501\n\n完整 brief：shadow-docs/changes/20261006-fix-soft-navigation-audio-continuity/brief.md"
    }
  },
  "knowledge": {
    "action": "新增",
    "target": "shadow-docs/knowledge/site-navigation.md",
    "reason": "复核（main d59c8c6，含 #505 squash e6d2a2e 与后续并行单）：七面软化+守卫+知识卡均已落地 main；用户确认发布完成；交付结论与信号并轨已入 brief 结果段"
  }
}
---

# 站内导航全量软化——修复播放中切路由断音（裸 <a> 全文档重载）

## 动机

点击播放音乐后切换路由，音乐中断。根因实测（localhost dev + IAB 探针法）：`AudioPlayerProvider` 与 `new Audio()` 挂根布局（AppProviders），架构正确——顶导航 `styled(Link)` 软导航实测同一文档存活、播放不断；但站内仍有 7 面站内路径渲染为裸 `<a>` / `styled.a`（页脚导航、文章上/下篇、话题题签、展开式上下篇 SpreadSide、相关文章 RelatedPostLink、博客分页 NavLink/LetterLink、Button 站内 href 消费面），点击触发全文档重载 → 根 provider 重建 → 队列重拉、播放归零。用户在任何一条硬导航路径上都会撞见断音。

## 复杂度评级

- **评级:** M
- **理由:** 无公共契约变更（Button `href` 消费面走 styled-components 原生 `as` 透传；`styled.a → styled(Link)` 不改 props 面）；但触及面跨 apps/site（post 域 4 文件 + 消费面 6 文件）与 packages/components（footer、pagination）两包共 12 文件 + 新守卫 1 文件；可发现性强（全站导航与播放器都受影响）。
- **期望验证深度:** runtime（IAB 探针法实测各软化面同文档存续；守卫红绿 + 根 tsc）

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 播放器生命周期——Provider 挂根布局、音频元素挂载期一次性创建，provider 不卸载是跨路由连续播放的前提；守卫正则措辞勿含 banned 标识符与 hex 形 token（守卫措辞陷阱）。
  - 适用 scope: packages/components/audio-player（本单只读不改）
- shadow-docs/knowledge/next.md
  - 当前结论: 组件导入不带 `/index`；站内优先 `@/*` 别名；Next 16.3.2 App Router。
  - 适用 scope: apps/site, packages/components
- shadow-docs/knowledge/components.md
  - 当前结论: 组件包经 exports map 以 `@wuh.site/components/<name>` 消费；包内引入 next 模块已有先例（image/registry/analytics 分别 import next/image、next/navigation、next/web-vitals），footer/pagination 直接 import next/link 与先例同型。
  - 适用 scope: packages/components

## 决策

- **选型:** 方案 A — 逐面软化 + 守卫。7 面站内导航全部改走 next/link（裸 `<a> → <Link>`、`styled.a → styled(Link)`、Button 站内消费 `<Button as={Link}>`），新增静态守卫钉死「站内路径禁裸 <a>/styled.a」。
- **对比方案:** 方案 B（根级全局锚点拦截 document click → router.push）否决：隐性魔法契约、修饰键/target/download/同路径等边界易错、与 Next 自身拦截叠层后排障成本高，不合项目「显式静态规则」风格。方案 C（Service Worker 保活）否决：重型，且不解决整页闪跳的体验本源。
- **理由:** 硬导航面已全量普查枚举（有限清单机械替换）；顶导航/博客标题/筛选 chips/留言簿 BackLink 的 Link 先例证明形态可行；外部链接（target=_blank）、资源链接（/api/rss.xml、备案、CC 许可）保留裸 <a> 语义正确；守卫防未来回归。
- **待确认点（apply 时红灯优先）:** packages/components 内 pagination/footer 直接 `import Link from 'next/link'` 需过包 typecheck 守卫（layout-typecheck/pagination index.test），next 在 components 包为 workspace hoist 依赖——若有类型解析失败，回退方案为组件出口收 props 由消费侧传入渲染元素（同 BackHomeLink 的 as={Link} 模式）。

## 任务

### Phase 1 — 软化七面

- [x] post 域软化 — `apps/site/app/post/PostView/index.tsx`、`apps/site/app/post/components/PostHeader/index.tsx`、`apps/site/app/post/styles/post-toolbar.ts`、`apps/site/app/post/styles/post-article.ts` — 上/下篇裸 `<a>`×2 与话题题签裸 `<a>` 改 `<Link>`；SpreadSide、RelatedPostLink 定义改 `styled(Link)`（SpreadSide 禁用分支 `as='span'` 保留）
- [x] 包域软化 — `packages/components/layout/footer.tsx`、`packages/components/layout/specs.tsx`、`packages/components/pagination/styles/index.tsx` — footer navItems 站内三项（博客/音乐/关于）经 Link 渲染、RSS/外链保持裸 <a>（specs navItems 形态可加字段区分）；pagination NavLink/LetterLink 改 `styled(Link)`
- [x] Button 消费面 — `apps/site/app/error.tsx`、`apps/site/app/not-found.tsx`、`apps/site/app/post/[number]/error.tsx`、`apps/site/app/HomeView/index.tsx`、`apps/site/app/HomeView/WereadSection.tsx`、`apps/site/app/components/BackHomeLink/index.tsx` — 站内 href 的 `<Button>` 加 `as={Link}`（BackHomeLink 内部 Button 统一处理，覆盖其消费方）；外链带 target 的不动

### Phase 2 — 守卫与复测

- [x] 守卫测试 — `apps/site/test/soft-navigation.test.mjs`（新建）— 静态扫描 apps/site/app 与 packages/components 源文件：站内路径字面量/构造器的渲染根必须为 Link（裸 `<a`、`styled.a` 定义且无 as={Link} 者红灯），allowlist：外部 http(s)、/api/rss.xml、备案/公安/CC 许可、ShareIconButton `as='a'`（target=_blank 外发）；再断言本单 7 面各自的 Link 形态在场。措辞遵 music-player.md 守卫陷阱（无 banned token、正则限定反引号模板）
- [x] runtime 复测 — 无文件 — localhost dev + IAB 探针法（window 文档指纹 + `window.__audio` 引用存续）：页脚、上/下篇、话题题签、分页、HomeView Button 面逐一点验同文档存续；对照面（外部链接）仍全载。注意环境陷阱：IAB 经 127.0.0.1 会被 Next dev 403 全部 chunk（整树不水合、一切点击硬导航的假象），必须走 localhost

## 结果

- 实际耗时: ~70min（含根因 runtime 实测与基线甄别）
- 验证:
  - **守卫红→绿**：`soft-navigation.test.mjs` 五测试先红（基线五面全违）后绿 5/5；styled.a 白名单 + 裸 `<a` 扫描（target/hash/资源豁免，页脚 native 分支 FILE_EXEMPT + 专项结构断言）
  - **触及包域**：button/pagination/empty/layout-typecheck 4/4 绿——包内 `import Link from 'next/link'` 经 layout 域 tsc 守卫通过，propose 待确认点解除
  - **站点全套 189 测试**：19 失败——标签化 stash 基线对比证实全部为 main 既有红（SiteHeader 外观组 #497 后守卫未同步等），本单**零新增回归**；随后 pop 恢复
  - **tsc**：node24 exit 139 一次 → mise node22 一遍 exit 0（SGN-001 重试有效）；**oxlint**：apps/site 123 文件 0/0、packages 触及面 15 文件 0/0
  - **runtime（localhost dev + IAB 文档指纹探针 + Audio 对象引用存续）**：页脚「博客」→ /blog 同文档存续；BackHomeLink/Empty 动作 Button（href='/'）→ / 存续；HomeView Button「查看博客」→ /blog 存续；对照——RSS 原生资源锚点文档替换（语义保留，探针灭）。上/下篇、话题题签、相关文章、分页面因后端 :3200 未运行不可达，静态守卫已钉死其 Link 形态，随生产目检积压合并复验
- 偏离记录:
  1. **task-3 实施改为 Button 根判定**（`isInternalHref`：站内路径 as 注入 Link，绝对/协议相对地址维持原生 anchor）——原「消费面逐处 as={Link}」无法覆盖 Empty 组件动作数据面（BlogListView `href:'/'`、WereadSection `href:'/weread'` 经数据传 href、消费侧无注入点）；新触及 `packages/components/button/index.tsx`；原声明 6 个消费文件零改动（根判定自动覆盖，未改）
  2. `packages/components/pagination/index.tsx` 追加禁用态 `as={hasPrev ? undefined : 'span'}`——styled(Link) 下 href undefined 会让 Link 抛错，须摘除；原声明外新触及
  3. 根因诊断阶段确认：断音机制=全文档重载杀根 provider；IAB 经 127.0.0.1 访问 Next dev 全部 chunk 403→整树不水合→一切点击硬导航假象，复测必须 localhost（已写入 task-5 注记）
- 信号命中记录（供 review 写回）: SGN-001 二次命中（tsc 139→node22）；新负信号候选——残留 `pnpm exec` 僵尸进程可致后续 `pnpm dev:next` 无限挂起，绕行直接调用 `apps/site/node_modules/.bin/next dev`
- 交付发布: PR #505 squash 合并 e6d2a2e；合并含 main 并轨（3d24faa 携带 #502/#503）——signals.md 编号冲突已解（本单两条信号改号 SGN-005/006、吸收 esbuild 实包升级陈述），合并后复测 softnav+button+pagination+flex+cursor 25/25 绿 → Release v1.4.70（https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.70）→ 部署链 run 37496890422 **红×2**：首试 build-next+build-nest 同秒掉线（`remote command exited without exit status`，纯 SSH 会话故障）；`rerun --failed` 后 build-nest 绿、build-next 仍挂（64s 无错误日志截断 ELIFECYCLE exit 1，CI 日志无真实编译错误）。同型失败在本单合并前的 v1.4.69（16:13，未含本单代码）已存在（双 job 同分钟掉线 exit 255）——判定为**部署机环境故障（内存悬崖/SSH 不稳，SGN-001 谱系），非本单代码**；本地 `next build`（node22、清 `.next`）在 Collecting page data 段 SIGSEGV 复现同型环境崩溃佐证。按纪律：部署未绿 → 停止、不归档，待部署机环境恢复后重触发 release 链复验。

## 知识评估

- **预期影响:** 新增 + 更新
- **候选卡片:** 新增 shadow-docs/knowledge/site-navigation.md；更新 shadow-docs/knowledge/music-player.md
- **理由:** 站内导航必须客户端软导航（next/link 或 styled(Link)/as={Link}）是全站级长期事实——同源裸 <a>/styled.a 即全文档重载，杀全局 provider 状态与播放；本单守卫固化该纪律，宜立独立卡（domain: frontend/routing，scope: apps/site + packages/components），music-player.md 播放器生命周期段加引用。附带事实：IAB dev 探针须经 localhost 访问（127.0.0.1 触发 chunk 403 假象）。
