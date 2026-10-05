---
{
  "schema": "shadow-dev/v1",
  "name": "20261005-style-nav-section-icons",
  "type": "style",
  "scope": "apps/site,packages/components",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20261005-style-nav-section-icons",
  "files": [
    "apps/site/app/HomeView/ProjectsSection.tsx",
    "apps/site/app/HomeView/WereadSection.tsx",
    "apps/site/app/HomeView/index.tsx",
    "apps/site/app/components/SiteHeader/index.tsx",
    "apps/site/app/components/SiteHeader/styles/index.ts",
    "apps/site/app/styles/index.ts",
    "packages/components/icons/index.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 472,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/472",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "eca1fea032f0f48994c5cfdfae58dbbb724885b8",
    "verifiedAt": "2026-10-05T14:44:26.687Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:472",
    "planHash": "d666a653386b136bedca87114c67cdbc1f26ef56998760be260962e68b14e7b7",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] Header 导航与首页模块标题加描边 Icon",
      "titleRaw": "Header 导航与首页模块标题加描边 Icon",
      "supplement": "为桌面 Header 四项导航与首页四个模块标题加线框装饰图标，方案与任务见 brief：shadow-docs/changes/20261005-style-nav-section-icons/brief.md",
      "body": "## 动机\n路由栏与模块栏标题目前是纯文字，视觉单调。按用户确认的方向：导航栏（桌面 Header）与首页模块栏标题文案左侧加一批线框 Icon，一次点亮「静默条」和首页分区的可读性，与站点既有纸墨语言协调。\n\n## 引用规范\n- shadow-docs/knowledge/icon-system.md\n  - 当前结论: 全站图标线框风格（stroke=currentColor、strokeWidth 2、round cap/join），业务需要的新通用图标在 `icons/index.tsx` 从 lucide-react 按需具名导出，禁止业务目录散落 SVG。\n  - 适用 scope: packages/components/icons + 本次消费方（apps/site）\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: Header 为「静默条」——字号 `--header-fs`、行盒高度固定、下划线是一支运笔（`aria-current='page'` 常驻）；淡化统一 `--text-color` 72% mix；间距/圆角只经 `--space-*`/`--border-radius-*`；颜色禁止硬编码。新图标必须继承文字 currentColor、不得改变行盒节奏与下划线语言。\n  - 适用 scope: apps/site/app/components/SiteHeader\n- shadow-docs/knowledge/i18n-locale.md\n  - 当前结论: 词典只装用户可见文案与 aria；图标属渲染层，不进词典。本次 locale 三语零影响。\n  - 适用 scope: packages/components/locales（零改动，仅作为约束遵循）\n- norms/ui-patterns.md\n  - 当前结论: 图标按钮须 aria-label——本处为纯装饰图标（文字标签已在），用 `aria-hidden='true'`，不新增无障碍噪音；禁止布局位移类动画。\n  - 适用 scope: 全部 UI 变更\n- norms/code-style.md / code-style-frontend.md\n  - 当前结论: 不为未来场景提前抽象；styled-components transient props；渐进式治理不顺手扩面。\n  - 适用 scope: apps/site + packages/components\n\n## 决策\n- **选型:** 方案 A——组件侧就近绑定。Header 四个桌面 NavLink 与首页四个 SectionTitle 左侧内联渲染图标；图标映射写在组件处（绑定 href/section key），缺口图标在 `icons/index.tsx` 补 lucide 具名导出。\n- **对比方案:** B（抽通用 SectionHeading 组件进组件包）——最小圈仅 4 个使用点，提前抽象违反 code-style，公共 API 验证面翻倍，等推广多页再抽；C（图标名进 i18n 词典/配置驱动）——图标不是文案，违反 i18n 卡片词典边界，直接排除。\n- **理由:** 改动面最小、locale 零影响、完全落在 icon-system 与 design-system 既有语言内。\n- **图标映射（已定）:**\n  - Header：博客→`IconArticle`（现有）；音乐→新增 lucide `Music as IconNote`（避开品牌 IconMusic 撞名，导航统一 lucide 线框语言）；关于→新增 `User as IconUser`；知识库→新增 `BookMarked as IconBookMarked`（与首页微信读书的 IconLibrary 区分；外链尾部 `ExternalMark`「↗」保留，去向标记与装饰图标职责不同）。\n  - 首页：精选博客→`IconArticle`；年度总结→`IconCalendar`（现有）；精选项目→`IconFolderGit2`（现有）；微信读书→`IconLibrary`（现有）。\n  - 尺寸：NavLink 图标 14px、SectionTitle 图标 16px，`strokeWidth=2` 默认，`currentColor` 随文字淡化语言；`aria-hidden='true'`。\n- **边界（用户已确认）:** 桌面 Header 导航行无「首页」项（Brand logo 即回首页），本次只加四项；移动抽屉、Footer、其他页面模块栏不在范围内；词典零改动。\n\n## 任务\n### Phase 1 — 实现\n\n- [ ] icons 库补 lucide 具名导出（Music/User/BookMarked） — `packages/components/icons/index.tsx`\n- [ ] SiteHeader 桌面 NavLink ×4 前缀图标 + NavIcon 样式（inline-flex、gap 用 `--space-*`，行盒高度与下划线笔顺不动） — `apps/site/app/components/SiteHeader/index.tsx`、`apps/site/app/components/SiteHeader/styles/index.ts`\n- [ ] HomeView 四个模块标题前缀图标（精选博客/年度总结在 index.tsx，精选项目/微信读书在两 Section 文件；SectionTitle 加 flex align） — `apps/site/app/HomeView/index.tsx`、`apps/site/app/HomeView/ProjectsSection.tsx`、`apps/site/app/HomeView/WereadSection.tsx`、`apps/site/app/styles/index.ts`\n\n### Phase 2 — 验证\n\n- [ ] `pnpm exec tsc --noEmit` + oxlint + 相关守卫回归（locales 守卫确认零改动通过）\n- [ ] 浏览器 field 走查：四主题（wine/plain × light/dark）截图 Header 与首页模块栏；核对行盒不抖动、暗色下图标对比度、下划线语言不变\n\n## 补充\n为桌面 Header 四项导航与首页四个模块标题加线框装饰图标，方案与任务见 brief：shadow-docs/changes/20261005-style-nav-section-icons/brief.md\n\n完整 brief：shadow-docs/changes/20261005-style-nav-section-icons/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261005-style-nav-section-icons\",\"type\":\"style\",\"scope\":\"apps/site,packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261005-style-nav-section-icons/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/HomeView/ProjectsSection.tsx",
        "apps/site/app/HomeView/WereadSection.tsx",
        "apps/site/app/HomeView/index.tsx",
        "apps/site/app/components/SiteHeader/index.tsx",
        "apps/site/app/components/SiteHeader/styles/index.ts",
        "apps/site/app/styles/index.ts",
        "packages/components/icons/index.tsx",
        "shadow-docs/changes/20261005-style-nav-section-icons/brief.md"
      ],
      "message": "[style] Header 导航与首页模块标题加描边 Icon",
      "title": "[style] Header 导航与首页模块标题加描边 Icon",
      "body": "Closes #472\n\n完整 brief：shadow-docs/changes/20261005-style-nav-section-icons/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "图标映射与方案A一致，icon-system/design-system/i18n 约束全部遵循并经四主题 field 验证；对齐修复回归 brief 声明的 flex align 语言；无新的长期事实需入卡（装饰图标 currentColor 淡化属既有结论正常消费）"
  }
}
---

# Header 导航与首页模块标题加描边 Icon

## 动机

路由栏与模块栏标题目前是纯文字，视觉单调。按用户确认的方向：导航栏（桌面 Header）与首页模块栏标题文案左侧加一批线框 Icon，一次点亮「静默条」和首页分区的可读性，与站点既有纸墨语言协调。

## 复杂度评级

- **评级:** S
- **理由:** 无契约变更（不动 API、词典、公共组件接口）；触及面窄——SiteHeader、HomeView 三处标题渲染 + 样式 + icons 库一行级补导出，均为展示层；可发现性高（图标就近绑定 href/section key，检索即得）。
- **期望验证深度:** field（四主题 × 明暗目检截图）

## 引用规范

- shadow-docs/knowledge/icon-system.md
  - 当前结论: 全站图标线框风格（stroke=currentColor、strokeWidth 2、round cap/join），业务需要的新通用图标在 `icons/index.tsx` 从 lucide-react 按需具名导出，禁止业务目录散落 SVG。
  - 适用 scope: packages/components/icons + 本次消费方（apps/site）
- shadow-docs/knowledge/design-system.md
  - 当前结论: Header 为「静默条」——字号 `--header-fs`、行盒高度固定、下划线是一支运笔（`aria-current='page'` 常驻）；淡化统一 `--text-color` 72% mix；间距/圆角只经 `--space-*`/`--border-radius-*`；颜色禁止硬编码。新图标必须继承文字 currentColor、不得改变行盒节奏与下划线语言。
  - 适用 scope: apps/site/app/components/SiteHeader
- shadow-docs/knowledge/i18n-locale.md
  - 当前结论: 词典只装用户可见文案与 aria；图标属渲染层，不进词典。本次 locale 三语零影响。
  - 适用 scope: packages/components/locales（零改动，仅作为约束遵循）
- norms/ui-patterns.md
  - 当前结论: 图标按钮须 aria-label——本处为纯装饰图标（文字标签已在），用 `aria-hidden='true'`，不新增无障碍噪音；禁止布局位移类动画。
  - 适用 scope: 全部 UI 变更
- norms/code-style.md / code-style-frontend.md
  - 当前结论: 不为未来场景提前抽象；styled-components transient props；渐进式治理不顺手扩面。
  - 适用 scope: apps/site + packages/components

## 决策

- **选型:** 方案 A——组件侧就近绑定。Header 四个桌面 NavLink 与首页四个 SectionTitle 左侧内联渲染图标；图标映射写在组件处（绑定 href/section key），缺口图标在 `icons/index.tsx` 补 lucide 具名导出。
- **对比方案:** B（抽通用 SectionHeading 组件进组件包）——最小圈仅 4 个使用点，提前抽象违反 code-style，公共 API 验证面翻倍，等推广多页再抽；C（图标名进 i18n 词典/配置驱动）——图标不是文案，违反 i18n 卡片词典边界，直接排除。
- **理由:** 改动面最小、locale 零影响、完全落在 icon-system 与 design-system 既有语言内。
- **图标映射（已定）:**
  - Header：博客→`IconArticle`（现有）；音乐→新增 lucide `Music as IconNote`（避开品牌 IconMusic 撞名，导航统一 lucide 线框语言）；关于→新增 `User as IconUser`；知识库→新增 `BookMarked as IconBookMarked`（与首页微信读书的 IconLibrary 区分；外链尾部 `ExternalMark`「↗」保留，去向标记与装饰图标职责不同）。
  - 首页：精选博客→`IconArticle`；年度总结→`IconCalendar`（现有）；精选项目→`IconFolderGit2`（现有）；微信读书→`IconLibrary`（现有）。
  - 尺寸：NavLink 图标 14px、SectionTitle 图标 16px，`strokeWidth=2` 默认，`currentColor` 随文字淡化语言；`aria-hidden='true'`。
- **边界（用户已确认）:** 桌面 Header 导航行无「首页」项（Brand logo 即回首页），本次只加四项；移动抽屉、Footer、其他页面模块栏不在范围内；词典零改动。

## 任务

### Phase 1 — 实现

- [x] icons 库补 lucide 具名导出（Music/User/BookMarked） — `packages/components/icons/index.tsx`
- [x] SiteHeader 桌面 NavLink ×4 前缀图标 + NavIcon 样式（inline-flex、gap 用 `--space-*`，行盒高度与下划线笔顺不动） — `apps/site/app/components/SiteHeader/index.tsx`、`apps/site/app/components/SiteHeader/styles/index.ts`
- [x] HomeView 四个模块标题前缀图标（精选博客/年度总结在 index.tsx，精选项目/微信读书在两 Section 文件；SectionTitle 加 flex align） — `apps/site/app/HomeView/index.tsx`、`apps/site/app/HomeView/ProjectsSection.tsx`、`apps/site/app/HomeView/WereadSection.tsx`、`apps/site/app/styles/index.ts`

### Phase 2 — 验证

- [x] `pnpm exec tsc --noEmit` + oxlint + 相关守卫回归（locales 守卫确认零改动通过）
- [x] 浏览器 field 走查：四主题（wine/plain × light/dark）截图 Header 与首页模块栏；核对行盒不抖动、暗色下图标对比度、下划线语言不变

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 图标映射为单点消费决策，不改变 icon-system/design-system 卡片既有结论；若 apply/review 中发现「装饰图标随 currentColor 淡化」需要固化，再评估更新 design-system 卡片。
