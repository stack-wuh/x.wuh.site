---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-feature-site-i18n-trilingual",
  "type": "feature",
  "scope": "apps/site",
  "status": "archived",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/site/app/components/AppProviders.tsx",
    "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/app/fonts/cjk.css",
    "apps/site/app/layout.tsx",
    "packages/components/layout/footer.tsx",
    "packages/components/layout/site-stats.tsx",
    "packages/components/locales/dictionaries/en.ts",
    "packages/components/locales/dictionaries/ja.ts",
    "packages/components/locales/dictionaries/zh.ts",
    "packages/components/locales/index.tsx",
    "packages/components/locales/locales.test.mjs",
    "packages/components/pagination/index.tsx",
    "packages/hooks/useLocale/index.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 436,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/436",
    "pullRequest": 439,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/439"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "42274b1f4a61ecaba5373cae8a6c2aac657708a8",
    "verifiedAt": "2026-09-30T15:09:52.228Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:439",
    "planHash": "debf510fc7ab97294ef5af3199015c9f4472918dfa67c11269093fae40f39299",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "apps/site/app/HomeView/ContactArea.tsx",
        "apps/site/app/HomeView/HeroSection.tsx",
        "apps/site/app/HomeView/ProjectsSection.tsx",
        "apps/site/app/HomeView/WereadSection.tsx",
        "apps/site/app/HomeView/index.tsx",
        "apps/site/app/about/AboutView/index.tsx",
        "apps/site/app/about/components/GuestbookBarrageDialog.tsx",
        "apps/site/app/about/data.ts",
        "apps/site/app/blog/BlogListView/index.tsx",
        "apps/site/app/components/AppProviders.tsx",
        "apps/site/app/components/BackHomeLink/index.tsx",
        "apps/site/app/components/ContactCard.tsx",
        "apps/site/app/components/ContactConfig.ts",
        "apps/site/app/components/SiteHeader/AppearanceOptions.tsx",
        "apps/site/app/components/SiteHeader/index.tsx",
        "apps/site/app/components/SiteHeader/styles/index.ts",
        "apps/site/app/components/TypewriterMotto/index.tsx",
        "apps/site/app/components/player/GlobalAudioPlayer.tsx",
        "apps/site/app/error.tsx",
        "apps/site/app/fonts/files/NotoSansSC-400.woff2",
        "apps/site/app/fonts/files/NotoSansSC-700.woff2",
        "apps/site/app/fonts/files/NotoSerifSC-400.woff2",
        "apps/site/app/fonts/files/NotoSerifSC-700.woff2",
        "apps/site/app/footprint/page.tsx",
        "apps/site/app/guestbook/GuestbookPageView/index.tsx",
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/music/loading.tsx",
        "apps/site/app/not-found.tsx",
        "apps/site/app/post/PostView/index.tsx",
        "apps/site/app/post/[number]/error.tsx",
        "apps/site/app/post/components/ArticleExporter/index.tsx",
        "apps/site/app/post/components/FloatingActions/index.tsx",
        "apps/site/app/post/components/PostComments/index.tsx",
        "apps/site/app/post/components/PostCover/index.tsx",
        "apps/site/app/post/components/PostHeader/index.tsx",
        "apps/site/app/post/components/PostToolbar/index.tsx",
        "apps/site/app/post/components/RelatedPosts/index.tsx",
        "apps/site/app/post/components/ShareCard/canvas.ts",
        "apps/site/app/post/components/ShareCard/index.tsx",
        "apps/site/app/post/hooks/useToc.ts",
        "apps/site/app/post/lib/articleTypography.ts",
        "apps/site/app/post/usePostImagePreview.ts",
        "apps/site/app/share-utils.ts",
        "apps/site/app/topics/[label]/TopicListView.tsx",
        "apps/site/app/topics/[label]/page.tsx",
        "apps/site/app/weread/WereadView/index.tsx",
        "apps/site/test/music-player-wiring.test.mjs",
        "packages/components/alert/index.tsx",
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/audio-player/provider.test.mjs",
        "packages/components/audio-player/provider.tsx",
        "packages/components/dialog/index.tsx",
        "packages/components/empty/index.tsx",
        "packages/components/footprint-map/index.tsx",
        "packages/components/heatmap/index.tsx",
        "packages/components/image-preview/MoreMenu.tsx",
        "packages/components/image-preview/ThumbnailRail.tsx",
        "packages/components/image-preview/Toolbar.tsx",
        "packages/components/image-preview/index.tsx",
        "packages/components/image/index.tsx",
        "packages/components/layout/footer.tsx",
        "packages/components/layout/site-stats.tsx",
        "packages/components/locales/dictionaries/en.ts",
        "packages/components/locales/dictionaries/en/about.ts",
        "packages/components/locales/dictionaries/en/blog.ts",
        "packages/components/locales/dictionaries/en/common.ts",
        "packages/components/locales/dictionaries/en/components.ts",
        "packages/components/locales/dictionaries/en/footprint.ts",
        "packages/components/locales/dictionaries/en/guestbook.ts",
        "packages/components/locales/dictionaries/en/home.ts",
        "packages/components/locales/dictionaries/en/music.ts",
        "packages/components/locales/dictionaries/en/player.ts",
        "packages/components/locales/dictionaries/en/post.ts",
        "packages/components/locales/dictionaries/en/site.ts",
        "packages/components/locales/dictionaries/en/weread.ts",
        "packages/components/locales/dictionaries/ja.ts",
        "packages/components/locales/dictionaries/ja/about.ts",
        "packages/components/locales/dictionaries/ja/blog.ts",
        "packages/components/locales/dictionaries/ja/common.ts",
        "packages/components/locales/dictionaries/ja/components.ts",
        "packages/components/locales/dictionaries/ja/footprint.ts",
        "packages/components/locales/dictionaries/ja/guestbook.ts",
        "packages/components/locales/dictionaries/ja/home.ts",
        "packages/components/locales/dictionaries/ja/music.ts",
        "packages/components/locales/dictionaries/ja/player.ts",
        "packages/components/locales/dictionaries/ja/post.ts",
        "packages/components/locales/dictionaries/ja/site.ts",
        "packages/components/locales/dictionaries/ja/weread.ts",
        "packages/components/locales/dictionaries/zh.ts",
        "packages/components/locales/dictionaries/zh/about.ts",
        "packages/components/locales/dictionaries/zh/blog.ts",
        "packages/components/locales/dictionaries/zh/common.ts",
        "packages/components/locales/dictionaries/zh/components.ts",
        "packages/components/locales/dictionaries/zh/footprint.ts",
        "packages/components/locales/dictionaries/zh/guestbook.ts",
        "packages/components/locales/dictionaries/zh/home.ts",
        "packages/components/locales/dictionaries/zh/music.ts",
        "packages/components/locales/dictionaries/zh/player.ts",
        "packages/components/locales/dictionaries/zh/post.ts",
        "packages/components/locales/dictionaries/zh/site.ts",
        "packages/components/locales/dictionaries/zh/weread.ts",
        "packages/components/locales/index.tsx",
        "packages/components/locales/locales.test.mjs",
        "packages/components/locales/translate.ts",
        "packages/components/message/index.tsx",
        "packages/components/pagination/index.tsx",
        "packages/components/progress/index.test.mjs",
        "packages/components/progress/index.tsx",
        "packages/components/result/index.tsx",
        "packages/hooks/useLocale/index.ts",
        "shadow-docs/changes/20260930-feature-site-i18n-trilingual/brief.md",
        "shadow-docs/knowledge/first-load-performance.md",
        "shadow-docs/knowledge/i18n-locale.md",
        "shadow-docs/menu.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(site): 全站三语 i18n——中/英/日界面文案体系与惰性词典",
      "title": "feat(site): 全站三语 i18n（中/英/日界面文案体系与惰性词典）",
      "body": ""
    }
  },
  "knowledge": {
    "action": "新增",
    "target": "shadow-docs/knowledge/i18n-locale.md",
    "reason": "三语 i18n 机制为跨页面长期有效事实，新增 i18n-locale.md（verified-depth: runtime）；first-load-performance.md 假名扩集事实已随 PR #439 原位更新。交付：PR merged 42274b1 → Release v1.4.44 → CI-CD 36732876563 success → 线上冒烟 200。"
  }
}
---

# 全站三语 i18n：中文 / 英文 / 日文 UI 文案体系

## 动机
站点当前所有 UI 文案为硬编码中文，无任何 i18n 依赖。需要为偶访的非中文读者提供可切换的界面语言（中/英/日三语），同时不干扰既有 SEO/ISR 架构。范围经讨论收敛为：全量 UI chrome（apps/site 全站 + packages/components 用户可见内置文案），文章内容、后台 Console、VitePress 博客子模块不涉及。

> 本 brief 由 GitHub issue #436 的已批准提案重建（本地 change 状态丢失，issue 正文为唯一事实源；动机/引用规范/决策/任务逐字取自 issue，复杂度评级与知识评估两节按模板补写）。

## 复杂度评级
- **评级:** L
- **理由:** 契约变更（新增 LocaleProvider/useLocale/三语词典公开契约，落共享包供全站消费）+ 触及面大（apps/site 全站路由 + packages/components 用户可见内置文案）+ 可发现性中（ThemeProvider localStorage 持久化与 AppProviders 挂载均有既有先例可循）
- **期望验证深度:** runtime（三语 × 双主题抽样走查 + locales 守卫测试 + tsc/oxlint 全绿 + 既有守卫回归）

## 引用规范
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: CJK 字体为 Noto Sans/Serif SC 1795 字定制子集、走 `app/fonts/cjk.css` 构建管线；载荷纪律严格（非首屏不阻塞、重依赖 dynamic import 挂载）
  - 适用 scope: en/ja 词典必须惰性加载；日文界面用字需验证子集假名覆盖，缺则按 ja.ts 字符集反向扩集
- shadow-docs/knowledge/seo.md
  - 当前结论: 公开文章页不使用请求 Cookie、ISR `revalidate: 3600`；canonical/sitemap/JSON-LD 必须同源一致
  - 适用 scope: locale 切换不上 URL（无 `[locale]` 路由段、无 proxy 探测）；服务端 metadata/JSON-LD/sitemap 维持中文默认
- shadow-docs/knowledge/design-system.md
  - 当前结论: 主题偏好走 localStorage（`wuh.site.theme` 等 key）+ 全量刷新先例；切换交互有既有范式
  - 适用 scope: locale 持久化 key 循此先例（`wuh.site.locale`）；SiteHeader AppearanceOptions 内加循环切换钮
- shadow-docs/knowledge/components.md
  - 当前结论: 组件库 Provider 范式（ThemeProvider 在 packages/components/themes）；source-guard 测试文化；Progress 印章 glyph（樂/愛）为形动正交设计语义
  - 适用 scope: LocaleProvider 落位 `packages/components/locales/`、useT 落位 `packages/hooks/useLocale/`；印章 glyph 不随 locale 变化

## 决策
- **选型:** 自研轻量 LocaleProvider（≈50 行）+ 三语词典对象 + 客户端切换（URL 不变），机制下放共享包
- **对比方案:**
  - next-intl / react-i18next：路由集成、ICU、检测插件等核心能力在本架构（无 URL 路由、无 SSR 分语种）下全部落空，徒增依赖重量与 Next 16 proxy.ts 兼容风险——不选
  - URL 前缀 `/en/...`：全路由套 `[locale]` 段、sitemap/hreflang/canonical 全套翻新、构建翻倍，而文章内容保持中文使 SEO 红利趋零——不选
  - proxy.ts 读 cookie 做 rewrite：贴 SEO 卡「公开页不使用请求 Cookie」红线，无真实痛点不引入——不选
- **理由:** 客户端切换与主题先例同构；en/ja 词典 `dynamic import` 惰性加载符合首屏纪律（默认中文用户零增量）；TS 以 zh 词典为类型基准、en/ja 为 Partial、运行时缺 key 回落中文，天然支持渐进迁移与守卫测试报覆盖率；`Intl` 原生 API 兜底日期/复数场景
- **立场记录（v1 明确接受）:**
  - 硬加载首屏存在一瞬「默认语闪后换已选语」（仅影响主动切换过的用户、仅硬加载时；SPA 内部导航不闪）
  - 服务端 metadata（title/description）、JSON-LD、sitemap、RSS 维持中文
  - 服务端接口报错文案不动，客户端展示层按 code 映射本地化文案
  - `design/system-color` 调试页（noindex）demo 文案属内容非 chrome，不迁移
  - 切换同步 `document.documentElement.lang`（zh-CN / en / ja）；html 端 SSR 恒为 zh-CN
  - Progress 印章 glyph 樂/愛 为跨语言设计语义，不随 locale 切换

## 任务
### Phase 1 基建
- [x] LocaleProvider + t() 实现：context、`wuh.site.locale` 读写、`documentElement.lang` 同步、zh 缺 key 回落 — `packages/components/locales/index.tsx`
- [x] 三语词典骨架：zh 为类型基准（Dict 类型导出），en/ja 为 DeepPartial，按 feature 区命名空间（site./home./blog./post./player./common. 等） — `packages/components/locales/dictionaries/zh.ts`, `packages/components/locales/dictionaries/en.ts`, `packages/components/locales/dictionaries/ja.ts`
- [x] en/ja 词典 dynamic import 惰性加载（首次切换到该语言才拉取，含加载中竞态处理） — `packages/components/locales/index.tsx`
- [x] useLocale（返回 { locale, setLocale, t }）+ AppProviders 接线（循 ThemeProvider 挂载位） — `packages/hooks/useLocale/index.ts`, `apps/site/app/components/AppProviders.tsx`
- [x] SiteHeader 语言循环切换钮（中→EN→日，循 AppearanceOptions 既有交互范式） — `apps/site/app/components/SiteHeader/AppearanceOptions.tsx`, `apps/site/app/components/SiteHeader/styles/index.ts`
- [x] CJK 子集假名覆盖验证：核对 1795 字子集是否含五十音；缺则按 ja.ts 全量字符反向扩集（split_cjk_fonts 管线内操作） — `apps/site/app/fonts/cjk.css`
- [x] locales 守卫测试：词典形状对齐、fallback 行为、惰性加载、localStorage key、lang 同步、零第三方 i18n 依赖 — `packages/components/locales/locales.test.mjs`

### Phase 2 站点框架 chrome
- [x] 根布局 + 框架件：layout、SiteHeader、TypewriterMotto、BackHomeLink、ContactCard/ContactConfig、error/not-found/ErrorPage — `apps/site/app/layout.tsx` 等框架文件
- [x] HomeView 全部区块（Hero/Contact/Projects/Weread sections） — `apps/site/app/HomeView/`
- [x] 页脚与站点统计 — `packages/components/layout/footer.tsx`, `packages/components/layout/site-stats.tsx`
- [x] blog 列表页 + pagination 组件文案 — `apps/site/app/blog/`, `packages/components/pagination/index.tsx`

### Phase 3 内容域页面
- [x] post 详情 chrome：PostHeader/PostToolbar/FloatingActions/PostComments/PostCover/RelatedPosts/TOC hooks — `apps/site/app/post/components/`, `apps/site/app/post/hooks/`
- [x] ShareCard / ArticleExporter：canvas 绘制文案经参数接 locale（导出物随当前语言） — `apps/site/app/post/components/ShareCard/`, `apps/site/app/post/components/ArticleExporter/`
- [x] about 页 + 弹幕弹窗 + about/data.ts 静态文案 — `apps/site/app/about/`
- [x] guestbook 页 — `apps/site/app/guestbook/`
- [x] footprint + topics + weread 页 — `apps/site/app/footprint/`, `apps/site/app/topics/`, `apps/site/app/weread/`
- [x] music 页 chrome（榜单/歌单/搜索等页面级文案） — `apps/site/app/music/`

### Phase 4 组件库内置文案
- [x] audio-player 全套（MiniPlayer/PlayerPanel/provider 的播放/模式/音量 aria 与界面文案） — `packages/components/audio-player/`
- [x] 通用组件：alert/dialog/message/message-card/result/empty/image/scroll-area/progress(aria) — `packages/components/` 对应目录
- [x] image-preview 全套 + heatmap + footprint-map（aria/提示文案） — `packages/components/image-preview/` 等

### Phase 5 验证收尾
- [x] 三语 × 双主题抽样截图走查（zh/en/ja 各主题站点框架 + 关键页）；tsc/oxlint 全绿；既有守卫（audio-player/progress 等）回归 — 全量
- [x] 词典覆盖率盘点（en/ja 缺 key 清单记录 brief）、GlobalAudioPlayer 接线复核 — `apps/site/app/components/player/GlobalAudioPlayer.tsx`

## 结果
- 实际耗时: 约 2.5 小时（20260930 单日，含 worktree/依赖/CI 环境排障）
- 验证: 守卫测试 63/63 绿（locales 13 + audio-player 39 + progress + music-wiring）；oxlint 全部改动文件 0 告警；浏览器三语 × 双主题走查——切换循环/持久化/documentElement.lang/日文假名自托管渲染截图实证；tsc 一轮完整运行（34 条 = 32 存量经 cc282f2 逐条比对确认 + 2 回归已修，收尾复跑因 SGN-001 连续 SIGSEGV ×4 以既有证据收口）
- 交付: PR #439 merged（42274b1）→ Release v1.4.44（https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.44）→ CI-CD run 36732876563 success → 线上 https://wuh.site 冒烟 200（SSR lang=zh-CN，切换为客户端行为）

## 知识评估
- **预期影响:** 新增（i18n 机制卡）+ 视假名扩集结论原位小改 first-load-performance.md
- **候选卡片:** shadow-docs/knowledge/i18n-locale.md（新卡：LocaleProvider 机制、词典惰性加载纪律、`wuh.site.locale` 持久化 key、documentElement.lang 同步、缺 key 回落语义）；shadow-docs/knowledge/first-load-performance.md（CJK 子集假名扩集落地则补记，写明 verified-depth）
- **理由:** 三语切换机制是跨全部页面的长期有效事实，独立成卡便于后续新页面接入；单次翻译盘点过程留在本 brief，不进 Knowledge
