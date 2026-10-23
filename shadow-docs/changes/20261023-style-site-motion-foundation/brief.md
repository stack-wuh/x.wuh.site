---
{
  "schema": "shadow-dev/v1",
  "name": "20261023-style-site-motion-foundation",
  "type": "style",
  "scope": "apps/site",
  "status": "published",
  "baseBranch": "main",
  "branch": "style/20261023-style-site-motion-foundation",
  "files": [
    "apps/site/app/about/components/guestbook-barrage.styles.ts",
    "apps/site/app/about/styles.ts",
    "apps/site/app/blog/styles/index.ts",
    "apps/site/app/components/BackHomeLink/styles/index.tsx",
    "apps/site/app/components/ContactCard.tsx",
    "apps/site/app/components/PageHeader/styles.ts",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "apps/site/app/components/TypewriterMotto/styles.ts",
    "apps/site/app/components/theme/ThemeModeProvider.tsx",
    "apps/site/app/design/system-color/styles/index.tsx",
    "apps/site/app/footprint/styles/index.tsx",
    "apps/site/app/guestbook/GuestbookPageView/styles/index.tsx",
    "apps/site/app/music/styles.ts",
    "apps/site/app/post/components/ArticleExporter/styles.ts",
    "apps/site/app/post/components/ShareCard/styles.ts",
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/post-floating.ts",
    "apps/site/app/post/styles/post-header.ts",
    "apps/site/app/post/styles/post-layout.ts",
    "apps/site/app/post/styles/post-markdown.ts",
    "apps/site/app/post/styles/post-toc.ts",
    "apps/site/app/post/styles/post-toolbar.ts",
    "apps/site/app/styles/index.ts",
    "packages/components/components/button/styles/index.tsx",
    "packages/components/components/dialog/styles/index.tsx",
    "packages/components/components/image-preview/styles/index.tsx",
    "packages/components/components/image/styles/index.tsx",
    "packages/components/components/layout/styles/index.tsx",
    "packages/components/components/link-group/styles/index.tsx",
    "packages/components/components/message/styles/index.tsx",
    "packages/components/components/pagination/styles/index.tsx",
    "packages/components/components/progress/styles/index.tsx",
    "packages/components/components/scroll-area/styles.ts",
    "packages/components/themes/cssVariableProvider.tsx",
    "packages/components/themes/index.ts",
    "shadow-docs/designs/20261023-motion-language/index.html"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 549,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/549",
    "pullRequest": 550,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/550"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "09d6a2376c831469f7ace82a05ddf67ee7633534",
    "verifiedAt": "2026-10-23T15:42:52.189Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:550",
    "planHash": "ae3955f3fca44584eb2c06bc5d9c67c132e9c083b446d5a8e20f64a3515dda2a",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 站点动效地基与静交互词表统一（静交互×浓时刻 一期）",
      "titleRaw": "站点动效地基与静交互词表统一（静交互×浓时刻 一期）",
      "supplement": "拆除 cssVariableProvider 通配过渡税、令牌归一（新增 --motion-dur-base 220ms、退役 --transition-fast、裸 ease/裸时长清零）、静交互词表（墨显/浮墨/落按/行墨/换墨）全站扫荡、TOC 行墨补位。设计定稿视觉稿 shadow-docs/designs/20261023-motion-language/index.html（构 2·晕开为后继变更）。详见 shadow-docs/changes/20261023-style-site-motion-foundation/brief.md",
      "body": "## 动机\n全站交互动效长期「三方言并存」：51 处正规 motion 令牌、53 处裸 `ease`、23 处裸时长与 `--transition-fast` 旁路令牌，叠加 `cssVariableProvider` 的通配 `* { transition: … 0.3s ease }` 过渡税，全站 hover/状态反馈迟钝发闷、手感不一致（用户实测「非常不满意」）。统一为与 desktop 同源的家族语法「静交互 × 浓时刻」（方向 B，浓时刻构 2·晕开拆后继变更），本期先行：拆税、令牌归一、静交互词表全站扫荡、行墨补位。\n\n## 引用规范\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 全站动画「微光呼吸 × 书写显现」，MotionStyles 唯一来源，packages 共享组件不得引用 `--motion-*`（audio-player 例外自持）\n  - 适用 scope: apps/site/app/styles/motion.ts、themes、HomeView\n  - **有意变更（本期修订）:** 「Dialog/Message 等共享组件维持自有节奏不入规范」→ 共享组件经 fallback 形式纳入静交互词表（console 安全不破）；audio-player 自持例外保持。词表、新令牌与换墨 scoped 入卡，归 ship 阶段落。\n\n## 决策\n- **选型:** 方向 B「静交互 × 浓时刻」（视觉稿三构对比后用户选定；浓时刻构 2·晕开拆后继变更 20261023-style-site-motion-moments，依赖本期新令牌）\n- **对比方案:** A 墨语全谱（交互层也讲纸墨——密度过高易腻，否决）；C 净面现代（去隐喻，与 desktop 家族语言分叉，否决）；地基+浓时刻合为一个变更（PR 过大回归面失控，否决——拆两个）。\n- **理由:** 与 desktop 已验证性格同声（静交互快而克制、动效预算留给时刻）；地基是机械扫荡可独立回归。\n- **设计定稿清单（shadow-dev-design 定稿，视觉稿 shadow-docs/designs/20261023-motion-language/index.html）:**\n  1. 拆通配过渡税 → 换墨 scoped（cssVariableProvider 通配块删除 + `html[data-theme-switching]` scoped 块；ThemeModeProvider 挂/卸）\n  2. `--motion-dur-base: 220ms` 新增（themes/index.ts motion 段，Layer3 自动发射）\n  3. `--transition-fast` 退役（定义删除；引用改 `var(--motion-dur-quick, 150ms)`）\n  4. 静交互词表全站扫荡（墨显/浮墨/落按/行墨 替换三方言）\n  5. 共享组件 fallback 形式（`var(--motion-*, fallback)`，console 安全）\n  6. 行墨补位（TOC 当前章等 0ms 跳变 → 220ms）\n  7. 视觉稿随 PR 留档（真 token、三构、手感对照条、换墨实装演示）\n\n## 任务\n### Phase 1 — 地基（令牌与换墨）\n- [ ] task 1 — `packages/components/themes/index.ts` — motion 段新增 `dur-base: 220ms`\n- [ ] task 2 — `packages/components/themes/cssVariableProvider.tsx` — 删通配 `*{transition}` 税块；删 `--transition-fast` 定义；增 `html[data-theme-switching]` scoped 换墨块（300ms ease-in-out-soft）\n- [ ] task 3 — `apps/site/app/components/theme/ThemeModeProvider.tsx` — 外观/主题切换瞬间挂 `data-theme-switching`、340ms 后卸载（reduced-motion 直接跳过）\n\n### Phase 2 — 站点样式扫荡（词表归一）\n- [ ] task 4 — `apps/site/app/components/SiteHeader/styles/index.ts` — transition-fast/裸值 → 令牌（墨显/浮墨/落按语义对位）\n- [ ] task 5 — `apps/site/app/post/styles/`（post-article/post-header/post-toc/post-floating/post-toolbar/post-layout/post-markdown） — 180ms/0.2s/ease → 令牌\n- [ ] task 6 — `apps/site/app/blog/styles/index.ts`、`about/styles.ts`、`about/components/guestbook-barrage.styles.ts`、`music/styles.ts`、`footprint/styles/index.tsx`、`guestbook/GuestbookPageView/styles/index.tsx`、`design/system-color/styles/index.tsx` — 同\n- [ ] task 7 — `apps/site/app/styles/index.ts`、`components/BackHomeLink/styles/index.tsx`、`components/TypewriterMotto/styles.ts`、`components/ContactCard.tsx`、`components/PageHeader/styles.ts`、`post/components/ShareCard/styles.ts`、`post/components/ArticleExporter/styles.ts` — 同\n\n### Phase 3 — 共享组件扫荡（fallback 形式）\n- [ ] task 8 — `packages/components/components/`（button/dialog/pagination/progress/message/image/image-preview/link-group/layout/scroll-area 等 transition 命中件） — `var(--motion-*, fallback)` + ease 归一（audio-player 不动）\n\n### Phase 4 — 行墨补位\n- [ ] task 9 — `apps/site/app/post/styles/post-toc.ts` — 当前章/选中态 0ms 跳变 → 行墨 220ms（color/border/bg）\n\n### Phase 5 — 验证\n- [ ] task 10 — 探针与走查 — grep 三连（通配税零 / `--transition-fast` 零 / 裸 ease 清零且白名单=audio-player）+ `pnpm dev` 四主题明暗真机走查（对照视觉稿 vocab 手感对照）+ reduced-motion + print\n\n## 补充\n拆除 cssVariableProvider 通配过渡税、令牌归一（新增 --motion-dur-base 220ms、退役 --transition-fast、裸 ease/裸时长清零）、静交互词表（墨显/浮墨/落按/行墨/换墨）全站扫荡、TOC 行墨补位。设计定稿视觉稿 shadow-docs/designs/20261023-motion-language/index.html（构 2·晕开为后继变更）。详见 shadow-docs/changes/20261023-style-site-motion-foundation/brief.md\n\n完整 brief：shadow-docs/changes/20261023-style-site-motion-foundation/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261023-style-site-motion-foundation\",\"type\":\"style\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261023-style-site-motion-foundation/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "worktree": "/Users/wuhong/shadow-desktop/github/x.wuh.site/.claude/worktrees/20261023-style-site-motion-foundation",
    "release": {
      "files": [
        "apps/site/app/about/components/guestbook-barrage.styles.ts",
        "apps/site/app/about/components/guestbook-trigger-hover.test.mjs",
        "apps/site/app/about/styles.ts",
        "apps/site/app/blog/components/TitleWithTooltip/styles/index.tsx",
        "apps/site/app/blog/styles/index.ts",
        "apps/site/app/components/ContactCard.tsx",
        "apps/site/app/components/SiteHeader/styles/index.ts",
        "apps/site/app/components/TypewriterMotto/styles.ts",
        "apps/site/app/components/theme/ThemeModeProvider.tsx",
        "apps/site/app/design/system-color/styles/index.tsx",
        "apps/site/app/music/styles.ts",
        "apps/site/app/post/styles/post-article.ts",
        "apps/site/app/post/styles/post-layout.ts",
        "apps/site/app/post/styles/post-markdown.ts",
        "apps/site/app/post/styles/post-toc.ts",
        "apps/site/app/post/styles/post-toolbar.ts",
        "apps/site/app/styles/index.ts",
        "apps/site/test/header-quiet-bar.test.mjs",
        "packages/components/button/styles/index.tsx",
        "packages/components/button/tokens.ts",
        "packages/components/dialog/styles/index.tsx",
        "packages/components/image-preview/styles/index.tsx",
        "packages/components/image/styles/index.tsx",
        "packages/components/layout/styles/index.tsx",
        "packages/components/link-group/styles/index.tsx",
        "packages/components/message/styles/index.tsx",
        "packages/components/pagination/styles/index.tsx",
        "packages/components/progress/index.test.mjs",
        "packages/components/progress/styles/index.tsx",
        "packages/components/scroll-area/styles.ts",
        "packages/components/tag/styles/index.tsx",
        "packages/components/themes/cssVariableProvider.tsx",
        "packages/components/themes/index.ts",
        "packages/components/themes/tokens.ts",
        "shadow-docs/designs/20261023-motion-language/",
        "shadow-docs/knowledge/animation-system.md",
        "shadow-docs/menu.md"
      ],
      "message": "style(site): 全站动效地基与静交互词表统一（静交互×浓时刻 一期）",
      "title": "style(site): 全站动效地基与静交互词表统一（静交互×浓时刻 一期）",
      "body": "## 动效地基与静交互词表统一（静交互 × 浓时刻 · 一期）\n\n全站交互动效统一为与桌面端素笺同源的家族语法。设计定稿经三构视觉稿对比（[designs/20261023-motion-language](shadow-docs/designs/20261023-motion-language/index.html)，本地起静态服务可预览三场景与手感对照条）。\n\n### 地基\n\n- **拆除通配过渡税**：删除 `cssVariableProvider` 的全局 `* { transition: … 0.3s ease }`——此前全站每一次 hover/状态变化都被拖慢 300ms 且起步迟缓。主题切换平滑改由 **scoped 换墨**承担：`ThemeModeProvider` 在切换瞬间挂 `html[data-theme-switching]`（300ms ease-in-out-soft，340ms 自动卸载，reduced-motion 跳过），切完即净、交互零负担。\n- **令牌归一**：motion 令牌新增 `--motion-dur-base: 220ms`（状态过渡基档）；退役 `--transition-fast: 180ms` 旁路令牌（定义与全仓引用清零）；裸 `ease`/裸时长清零，缓动统一 `ease-out-soft`。\n\n### 静交互词表（全站唯一交互语法）\n\n| 词 | 态 | 规格 |\n|---|---|---|\n| 墨显 | 悬停文字/行 | color/bg 150ms |\n| 浮墨 | 悬停卡片/钮 | 边框/阴影/位移≤2px 150–220ms |\n| 落按 | 按压 | translateY(1px) ≤100ms |\n| 行墨 | 状态切换 | 220ms（TOC 当前章 0ms 跳变补位） |\n| 换墨 | 主题切换 | scoped 300ms，仅切换瞬间 |\n\n### 扫荡范围\n\n- site 样式 ~19 文件（SiteHeader/post 全族/blog/about/留言弹幕/music/design 页/styles 基座/TypewriterMotto/ContactCard/TitleWithTooltip）\n- packages 共享组件 11 件（button/dialog/pagination/progress/message/image/image-preview/link-group/layout/scroll-area/tag），motion 引用一律 **fallback 形式** `var(--motion-*, fallback)`——console 不注入主题变量仍可渲染\n- audio-player 既有自持例外保持不动\n\n### 验证\n\n- grep 三连：通配税仅剩两块 scoped · `transition-fast` 零引用 · 裸 ease 清零（白名单 = audio-player + image:55 源码测试锁定既有节奏）\n- `tsc --noEmit` rc=0；受影响探针测试全绿（progress 27 用例批 + guestbook/header 触及断言；6 个失败经 main 对照实验归因为存量债务，与本 PR 无关）\n- 真机四主题走查：hover 跟手 / 换墨 scoped / TOC 行墨，已通过\n- 既有源码级探针断言同步 3 处（断言目标等价改写为新令牌契约）\n\n### 知识闭环\n\n- `animation-system.md`：静交互词表 + dur-base + 换墨 scoped + 通配税禁令 + 共享组件 fallback 规则修订（verified: runtime）\n- `menu.md` 动画域路由扩词\n\n### 后继\n\n浓时刻构 2·晕开（题名墨线一划 + 内容洇开）拆后继变更 `20261023-style-site-motion-moments`，依赖本期令牌。\n\nCloses #549"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/animation-system.md",
    "reason": "全站交互动效统一为家族语法：五词静交互词表（墨显/浮墨/落按/行墨/换墨）+ --motion-dur-base 220ms 新增 + --transition-fast 退役 + 通配过渡税拆除（换墨改 data-theme-switching scoped）+ 共享组件经 fallback 形式纳入（console 安全，旧禁令有意修订）；真机走查 + grep 探针 + tsc 全绿，verified-depth: runtime"
  }
}
---

# 站点动效地基与静交互词表统一（家族语言 · 静交互 × 浓时刻 一期）

## 动机

全站交互动效长期「三方言并存」：51 处正规 motion 令牌、53 处裸 `ease`、23 处裸时长与 `--transition-fast` 旁路令牌，叠加 `cssVariableProvider` 的通配 `* { transition: … 0.3s ease }` 过渡税，全站 hover/状态反馈迟钝发闷、手感不一致（用户实测「非常不满意」）。统一为与 desktop 同源的家族语法「静交互 × 浓时刻」（方向 B，浓时刻构 2·晕开拆后继变更），本期先行：拆税、令牌归一、静交互词表全站扫荡、行墨补位。

## 复杂度评级

- **评级:** L
- **理由:** 契约变更（motion 令牌新增 dur-base、全局通配过渡策略移除、`--transition-fast` 退役）；触及面横跨 apps/site 与 packages/components 约 30 个样式文件；可发现性 = 全站手感与主题切换行为。
- **期望验证深度:** runtime（grep 契约探针 + `pnpm dev` 四主题明暗真机走查 + reduced-motion；对照视觉稿 vocab 场景）

## 领域模型

- **限界上下文:** 站点前端表现层（apps/site 页面样式 + packages/components 主题与共享组件）— 全站视觉动效呈现。上游 themes 令牌注入层，下游页面/组件消费；反腐边界：不改 console 语义（共享组件走 fallback）、不碰业务逻辑与数据层、不加关键帧（浓时刻归后继变更）。
- **统一语言增量:** **墨显**=悬停文字/行 color/bg 150ms ease-out-soft；**浮墨**=悬停卡片/钮 边框/阴影/位移≤2px 150–220ms；**落按**=按压 translateY(1px) ≤100ms；**行墨**=状态切换（TOC 当前章/选中）220ms；**换墨**=主题切换 scoped 300ms；`--motion-dur-base: 220ms`（状态过渡基档）。
- **聚合与不变量:**
  - `MotionStyles`（全站动画唯一来源聚合）：通配 `*{transition}` 选择器不存在；主题过渡仅存于 `html[data-theme-switching]` 且切换后 ≤340ms 自动卸载；关键帧仍唯一来源（本期不新增）；reduced-motion/print 降级保持。
  - `Themes 令牌`（packages/components/themes）：motion 令牌是时长/缓动唯一来源——`--transition-fast` 定义与引用清零、裸 `ease`/裸时长清零（audio-player 自持例外不变）；共享组件引用 motion 一律 fallback 形式 `var(--motion-*, fallback)`（console 不注入令牌仍可渲染）。
  - `正文阅读区`：阅读区/评论区不做入场动画约束不变（本期只改交互过渡，不改入场）。
- **领域事件:** 主题切换瞬间（ThemeModeProvider 挂 `data-theme-switching` → ~300ms 后卸载；此后全站交互零过渡税）。

## 引用规范

- shadow-docs/knowledge/animation-system.md
  - 当前结论: 全站动画「微光呼吸 × 书写显现」，MotionStyles 唯一来源，packages 共享组件不得引用 `--motion-*`（audio-player 例外自持）
  - 适用 scope: apps/site/app/styles/motion.ts、themes、HomeView
  - **有意变更（本期修订）:** 「Dialog/Message 等共享组件维持自有节奏不入规范」→ 共享组件经 fallback 形式纳入静交互词表（console 安全不破）；audio-player 自持例外保持。词表、新令牌与换墨 scoped 入卡，归 ship 阶段落。

## 决策

- **选型:** 方向 B「静交互 × 浓时刻」（视觉稿三构对比后用户选定；浓时刻构 2·晕开拆后继变更 20261023-style-site-motion-moments，依赖本期新令牌）
- **对比方案:** A 墨语全谱（交互层也讲纸墨——密度过高易腻，否决）；C 净面现代（去隐喻，与 desktop 家族语言分叉，否决）；地基+浓时刻合为一个变更（PR 过大回归面失控，否决——拆两个）。
- **理由:** 与 desktop 已验证性格同声（静交互快而克制、动效预算留给时刻）；地基是机械扫荡可独立回归。
- **设计定稿清单（shadow-dev-design 定稿，视觉稿 shadow-docs/designs/20261023-motion-language/index.html）:**
  1. 拆通配过渡税 → 换墨 scoped（cssVariableProvider 通配块删除 + `html[data-theme-switching]` scoped 块；ThemeModeProvider 挂/卸）
  2. `--motion-dur-base: 220ms` 新增（themes/index.ts motion 段，Layer3 自动发射）
  3. `--transition-fast` 退役（定义删除；引用改 `var(--motion-dur-quick, 150ms)`）
  4. 静交互词表全站扫荡（墨显/浮墨/落按/行墨 替换三方言）
  5. 共享组件 fallback 形式（`var(--motion-*, fallback)`，console 安全）
  6. 行墨补位（TOC 当前章等 0ms 跳变 → 220ms）
  7. 视觉稿随 PR 留档（真 token、三构、手感对照条、换墨实装演示）

## 任务

### Phase 1 — 地基（令牌与换墨）
- [x] task 1 — `packages/components/themes/index.ts` — motion 段新增 `dur-base: 220ms`
- [x] task 2 — `packages/components/themes/cssVariableProvider.tsx` — 删通配 `*{transition}` 税块；删 `--transition-fast` 定义；增 `html[data-theme-switching]` scoped 换墨块（300ms ease-in-out-soft）
- [x] task 3 — `apps/site/app/components/theme/ThemeModeProvider.tsx` — 外观/主题切换瞬间挂 `data-theme-switching`、340ms 后卸载（reduced-motion 直接跳过）

### Phase 2 — 站点样式扫荡（词表归一）
- [x] task 4 — `apps/site/app/components/SiteHeader/styles/index.ts` — transition-fast/裸值 → 令牌（墨显/浮墨/落按语义对位）
- [x] task 5 — `apps/site/app/post/styles/`（post-article/post-header/post-toc/post-floating/post-toolbar/post-layout/post-markdown） — 180ms/0.2s/ease → 令牌
- [x] task 6 — `apps/site/app/blog/styles/index.ts`、`about/styles.ts`、`about/components/guestbook-barrage.styles.ts`、`music/styles.ts`、`footprint/styles/index.tsx`、`guestbook/GuestbookPageView/styles/index.tsx`、`design/system-color/styles/index.tsx` — 同
- [x] task 7 — `apps/site/app/styles/index.ts`、`components/BackHomeLink/styles/index.tsx`、`components/TypewriterMotto/styles.ts`、`components/ContactCard.tsx`、`components/PageHeader/styles.ts`、`post/components/ShareCard/styles.ts`、`post/components/ArticleExporter/styles.ts` — 同

### Phase 3 — 共享组件扫荡（fallback 形式）
- [x] task 8 — `packages/components/components/`（button/dialog/pagination/progress/message/image/image-preview/link-group/layout/scroll-area 等 transition 命中件） — `var(--motion-*, fallback)` + ease 归一（audio-player 不动）

### Phase 4 — 行墨补位
- [x] task 9 — `apps/site/app/post/styles/post-toc.ts` — 当前章/选中态 0ms 跳变 → 行墨 220ms（color/border/bg）

### Phase 5 — 验证
- [x] task 10 — 探针与走查 — grep 三连（通配税零 / `--transition-fast` 零 / 裸 ease 清零且白名单=audio-player）+ `pnpm dev` 四主题明暗真机走查（对照视觉稿 vocab 手感对照）+ reduced-motion + print

## 结果

- 实际耗时: —
- 验证: —（L 级逐条对账：每条不变量 → 观察点命令与输出摘要，或标注证据缺口与替代观察点）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/animation-system.md（词表 + dur-base + 换墨 scoped + 通配税禁令 + 共享组件 fallback 纳入的适用边界修订）；design-system.md 视词表引用决定
- **理由:** 令牌与全站交互语法是长期有效事实；通配过渡策略与「共享组件不入规范」结论被本期有意修订
