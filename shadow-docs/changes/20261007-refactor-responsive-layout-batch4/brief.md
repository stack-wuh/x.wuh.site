---
{
  "schema": "shadow-dev/v1",
  "name": "20261007-refactor-responsive-layout-batch4",
  "type": "refactor",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20261007-refactor-responsive-layout-batch4",
  "files": [
    "apps/site/app/post/styles/post-article.ts",
    "apps/site/app/post/styles/post-floating.ts",
    "apps/site/app/post/styles/post-header.ts",
    "apps/site/app/post/styles/post-toc.ts",
    "apps/site/app/post/styles/post-toolbar.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 512,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/512",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "dd5b2457754180c53ae534763ef0eb20aec9ca42",
    "verifiedAt": "2026-10-07T05:12:15.242Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:512",
    "planHash": "0b162891846081a11aba6831e12a5c2763e95358b41f39710a5dd1d357d06a4c",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 响应式布局替换批次4 — post 域净位 10 块（编译口主导 + TopRow Flex-ify）",
      "titleRaw": "[refactor] 响应式布局替换批次4 — post 域净位 10 块（编译口主导 + TopRow Flex-ify）",
      "supplement": "按 shadow-dev 提案收敛创建，方案与逐块配方见 shadow-docs/changes/20261007-refactor-responsive-layout-batch4/brief.md。范围：post-toolbar/toc/article/header/floating 五文件 10 处布局类 @media；aside/details/Link/grid 载体走 themes/responsive 编译口直用（9 处），TopRow 唯一 Flex-ify；Header order、TagGroup 几何、ContentGrid 非均分、 动态值、reduced-motion 明示保留。复杂度 M · 验证 unit。",
      "body": "## 动机\n批次3 后站点剩余手写 `@media` 集中在三个大模块：music(23)、post 域(约 19)、SiteHeader(12)。用户确认批次4 取 **post 域净位批**：先吃掉词汇射程内、无二维重排的 10 块；TrackRow 九宫格（music）、Spread 类双栏网格之外的 fixed/sticky 几何、SiteHeader（用户曾明示排除）各留后续批次或专项设计轮。\n\n本批载体特殊性（决定机制配比）：9 处载体是 **aside / details / Link / grid-div**——均不可 Flex 化（备忘⑥⑦语义：landmark/details/锚点语义与网格排版保持），走 `themes/responsive` 编译口直用；唯一 `styled.div` 行容器 TopRow 走 Flex-ify（机制 A 保留一个词汇集合内的真消费样例）。\n\n逐块清单（断点换算：small=520→sm 槽 521、mobile=640→md 槽 641、tablet=1024→lg 槽 1024）：\n\n| # | 文件:行 | 组件 | 原块 | 机制/配方 |\n|---|---|---|---|---|\n| 1 | post-toolbar.ts:77 | Spread | ≥1024 `display:none` | B：`responsive([false,undefined,undefined,true], v=>v?'display:none;':'display:grid;')` |\n| 2 | post-toolbar.ts:81 | Spread | ≤640 `grid-template-columns:1fr; gap:0` | B：`responsive(['grid-template-columns: minmax(0, 1fr); gap: 0;', undefined, 'grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr); gap: clamp(14px, 3vw, 32px);', '同 md'], v=>v)`（base 含 ≤520/521-640 两段同值，md/lg 桌面三列） |\n| 3 | post-toolbar.ts:93 | SpreadDivider | ≤640 宽线↔高线互换 | B：`responsive(['width: auto; height: 1px; justify-self: stretch;', undefined, 'width: 1px; height: 44px; justify-self: center;'], v=>v)`；`background: hairline` 留 css 常量 |\n| 4 | post-toolbar.ts:109 | SpreadSide(styled Link) | ≤640 `padding:12px 0` | B：`padding:['12px 0', undefined, '0']` 经 `responsive(…, v=>\\`padding: ${v};\\`)`；`$next/$disabled` transient 与非对称声明不动 |\n| 5 | post-toc.ts:9 | TocAside(styled.aside) | ≥1024 整段显形+sticky 组 | B：`responsive([false,undefined,undefined,true], v=> v? 'display:flex; flex-direction:column; position:sticky; top:88px; align-self:start; max-height:calc(100vh - 112px);':'display:none;')`（aside landmark 保留，不 Flex 化） |\n| 6 | post-toc.ts:202 | TocMobile(styled.details) | ≥1024 `display:none` | B：`responsive([false,undefined,undefined,true], v=>v?'display:none;':'')`（details 语义保留） |\n| 7 | post-article.ts:42 | RelatedPostsHeader | ≤640 双列→单列折叠 | B：`responsive(['grid-template-columns: minmax(0, 1fr); gap: 2px;', undefined, 'grid-template-columns: minmax(0, 1fr) auto; gap: var(--space-sm);'], v=>v)` |\n| 8 | post-article.ts:176 | ColophonTools | ≥1024 `display:none` | B：同 #6 模式 |\n| 9 | post-header.ts:28 | TopRow | ≤520 转列 + align/gap 变 | **A**：`styled(Flex).attrs({ direction:['column','row'], alignItems:['flex-start','center'], justifyContent:'space-between', gap:['10px','sm'], wrap:true })`；animation write-fade/delay 与 margin-bottom 留 css；消费端 `<TopRow>` 仅 children ✓ 已核 |\n| 10 | post-floating.ts:158 | FloatingButtonGroup | ≥641 `width:fit-content` | B：`responsive(['100%', undefined, 'fit-content'], v=>\\`width: ${v};\\`)`（base `width:100%` 声明并入阶梯；fit-content 注释保留） |\n\n明示保留（射程外，块旁注记）：Header `order:1/2`（order 非阶梯词汇，扩档需另立契约 change）、TagGroup 负 margin 几何、ContentGrid 非均分双列、FloatingButton/LikeButton 的 `$compact` 动态值块、全部 reduced-motion 块。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`、边界 `[521, 641, 1024]`；显隐→hidden 语义、尺寸/分布断点→阶梯槽；「仅上档变」缺位槽 undefined\n  - 执行约束命中: 备忘②（flex 词汇 align/justify）、⑥⑦（不可 Flex 化载体直用 `themes/responsive` 编译口——本批 9 处即此型）、⑧（CSS 注释禁反引号）；站点深导入 `themes/breakpoints` 先例（同目录文件本就 import）\n  - 适用 scope: apps/site/app/post/styles/*\n- shadow-docs/knowledge/blog-detail.md 与 post 域卡（review/apply 时按 menu「博客详情」路由复核工具栏/目录/排版约束：详情页禁止 scroll/resize 监听、TocScroller 机制不得触碰——本批仅改显隐/折叠声明，不碰滚动逻辑）\n- shadow-docs/knowledge/site-navigation.md\n  - 当前结论: 站内导航必须 next/link / styled(Link) / 消费侧 as=Link\n  - 适用 scope: SpreadSide（styled(Link) 载体保留，锚点语义零变化）\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 关键帧只在 MotionStyles；TopRow 的 write-fade 引用原样保留\n- norms/tdd-verification.md：M 级 = 绿灯测试 + 走查 + unit\n- norms/code-style-frontend.md：transient props / 'use client' 边界（涉及文件已在既有客户端边界内）\n\n## 决策\n- **选型:** 单 change、一 Phase 站点迁移 + 一 Phase 验证。9 处编译口直用（载体语义不可动：aside/details/Link/grid-div）+ TopRow 唯一 Flex-ify。\n- **对比方案:**\n  - 全批 Flex-ify：aside→div 丢 landmark、details 不可 Flex、Link 遇备忘⑥目标替换陷阱——否；\n  - 顺带 Flex 契约扩 order 阶梯解 Header 块：order 响应式消费仅此一例，扩档收益不配契约面——留观察，如批次5+ 再遇才扩；\n  - 并入 music TrackRow 九宫格：二维重排需专项 Row/Col 落位设计（词汇映射未验证），风险与批不符——另立设计轮；\n  - SiteHeader：用户曾明示排除，且显隐块与 rm 块混杂需逐块再设计——不动。\n- **理由:** 全部 10 块配方有批次2/3 先例（编译口直用＝GuestbookCard/PostRow；Flex-ify＝PostRow blog 版）；DOM/JSX 双零改动，验收＝每文件 raw-@media 布局块清零 + 位集持平。\n\n## 任务\n### Phase 1 — post 域 10 块迁移\n- [ ] 1.1 `apps/site/app/post/styles/post-toolbar.ts` — Spread ×2 / SpreadDivider / SpreadSide 按配方编译口化；`import { responsive } from '@wuh.site/components/themes/responsive'`；BREAKPOINTS import 若该文件仅剩 rm 块则移除\n- [ ] 1.2 `apps/site/app/post/styles/post-toc.ts` — TocAside / TocMobile ×2 编译口化；BREAKPOINTS import 视残留重算\n- [ ] 1.3 `apps/site/app/post/styles/post-article.ts` — RelatedPostsHeader / ColophonTools 编译口化\n- [ ] 1.4 `apps/site/app/post/styles/post-header.ts` — TopRow → `styled(Flex).attrs({direction:['column','row'], alignItems:['flex-start','center'], justifyContent:'space-between', gap:['10px','sm'], wrap:true})`，css 保留 animation/margin；Header/TagGroup 保留并注记\n- [ ] 1.5 `apps/site/app/post/styles/post-floating.ts` — FloatingButtonGroup width 阶梯；FloatingButton/LikeButton 保留注记（$compact 动态值非阶梯语义）\n- [ ] 1.6 验证 — 五文件剥注释扫描：布局类 raw `@media` 仅余明示保留清单；`apps/site tsc --noEmit` 错误位集与基线逐条相同（当前基线 35，双跑对照，139 时按 SGN-001 堆上限配方）；oxlint 0/0；守卫套件不受影响复跑（components 零改动）；JSX 消费端零 diff（git status 不含 .tsx）\n\n## 补充\n按 shadow-dev 提案收敛创建，方案与逐块配方见 shadow-docs/changes/20261007-refactor-responsive-layout-batch4/brief.md。范围：post-toolbar/toc/article/header/floating 五文件 10 处布局类 @media；aside/details/Link/grid 载体走 themes/responsive 编译口直用（9 处），TopRow 唯一 Flex-ify；Header order、TagGroup 几何、ContentGrid 非均分、 动态值、reduced-motion 明示保留。复杂度 M · 验证 unit。\n\n完整 brief：shadow-docs/changes/20261007-refactor-responsive-layout-batch4/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261007-refactor-responsive-layout-batch4\",\"type\":\"refactor\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261007-refactor-responsive-layout-batch4/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/post/styles/post-article.ts",
        "apps/site/app/post/styles/post-floating.ts",
        "apps/site/app/post/styles/post-header.ts",
        "apps/site/app/post/styles/post-toc.ts",
        "apps/site/app/post/styles/post-toolbar.ts",
        "shadow-docs/changes/20261007-refactor-responsive-layout-batch4/brief.md",
        "shadow-docs/knowledge/layout-components.md",
        "shadow-docs/signals.md"
      ],
      "message": "refactor(post): 响应式布局批次4——post 域十处手写断点收编阶梯契约",
      "title": "refactor(post): 响应式布局批次4 — post 域十处净位收编编译口/阶梯 (#512)",
      "body": "Closes #512\n\n完整 brief：shadow-docs/changes/20261007-refactor-responsive-layout-batch4/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "批次4 十块迁移逐块等价走查通过（两类有意归一：640/641 边界翻转含首个 min-width 正声明形态、1fr→minmax(0,1fr) 防溢出归一；±1px 窗口归阶梯契约所有，属收编设计）。新增长期事实待落卡：⑩ 编译口 decl 只吃阶梯槽值、不吃实例 transient——$compact 型动态断点非编译口射程（FloatingButton/LikeButton 实证）；⑪ 整段显形组可单槽声明串表达（TocAside lg 槽一条串打包 display+flex-direction+sticky 组，aside/details/grid 载体不适用 Flex 时的通用形态）。验证真实可查：worktree site tsc EXIT=2 且错误位集与基线逐条相同（零新增）、oxlint 0/0、主仓守卫 39 例复跑全绿、剥注释扫描仅剩保留清单 4 处、JSX 消费端零 diff——M 级 unit+走查达标。"
  }
}
---

# 响应式布局替换批次4 — post 域净位批（10 块 / 5 文件，编译口主导）

## 动机

批次3 后站点剩余手写 `@media` 集中在三个大模块：music(23)、post 域(约 19)、SiteHeader(12)。用户确认批次4 取 **post 域净位批**：先吃掉词汇射程内、无二维重排的 10 块；TrackRow 九宫格（music）、Spread 类双栏网格之外的 fixed/sticky 几何、SiteHeader（用户曾明示排除）各留后续批次或专项设计轮。

本批载体特殊性（决定机制配比）：9 处载体是 **aside / details / Link / grid-div**——均不可 Flex 化（备忘⑥⑦语义：landmark/details/锚点语义与网格排版保持），走 `themes/responsive` 编译口直用；唯一 `styled.div` 行容器 TopRow 走 Flex-ify（机制 A 保留一个词汇集合内的真消费样例）。

逐块清单（断点换算：small=520→sm 槽 521、mobile=640→md 槽 641、tablet=1024→lg 槽 1024）：

| # | 文件:行 | 组件 | 原块 | 机制/配方 |
|---|---|---|---|---|
| 1 | post-toolbar.ts:77 | Spread | ≥1024 `display:none` | B：`responsive([false,undefined,undefined,true], v=>v?'display:none;':'display:grid;')` |
| 2 | post-toolbar.ts:81 | Spread | ≤640 `grid-template-columns:1fr; gap:0` | B：`responsive(['grid-template-columns: minmax(0, 1fr); gap: 0;', undefined, 'grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr); gap: clamp(14px, 3vw, 32px);', '同 md'], v=>v)`（base 含 ≤520/521-640 两段同值，md/lg 桌面三列） |
| 3 | post-toolbar.ts:93 | SpreadDivider | ≤640 宽线↔高线互换 | B：`responsive(['width: auto; height: 1px; justify-self: stretch;', undefined, 'width: 1px; height: 44px; justify-self: center;'], v=>v)`；`background: hairline` 留 css 常量 |
| 4 | post-toolbar.ts:109 | SpreadSide(styled Link) | ≤640 `padding:12px 0` | B：`padding:['12px 0', undefined, '0']` 经 `responsive(…, v=>\`padding: ${v};\`)`；`$next/$disabled` transient 与非对称声明不动 |
| 5 | post-toc.ts:9 | TocAside(styled.aside) | ≥1024 整段显形+sticky 组 | B：`responsive([false,undefined,undefined,true], v=> v? 'display:flex; flex-direction:column; position:sticky; top:88px; align-self:start; max-height:calc(100vh - 112px);':'display:none;')`（aside landmark 保留，不 Flex 化） |
| 6 | post-toc.ts:202 | TocMobile(styled.details) | ≥1024 `display:none` | B：`responsive([false,undefined,undefined,true], v=>v?'display:none;':'')`（details 语义保留） |
| 7 | post-article.ts:42 | RelatedPostsHeader | ≤640 双列→单列折叠 | B：`responsive(['grid-template-columns: minmax(0, 1fr); gap: 2px;', undefined, 'grid-template-columns: minmax(0, 1fr) auto; gap: var(--space-sm);'], v=>v)` |
| 8 | post-article.ts:176 | ColophonTools | ≥1024 `display:none` | B：同 #6 模式 |
| 9 | post-header.ts:28 | TopRow | ≤520 转列 + align/gap 变 | **A**：`styled(Flex).attrs({ direction:['column','row'], alignItems:['flex-start','center'], justifyContent:'space-between', gap:['10px','sm'], wrap:true })`；animation write-fade/delay 与 margin-bottom 留 css；消费端 `<TopRow>` 仅 children ✓ 已核 |
| 10 | post-floating.ts:158 | FloatingButtonGroup | ≥641 `width:fit-content` | B：`responsive(['100%', undefined, 'fit-content'], v=>\`width: ${v};\`)`（base `width:100%` 声明并入阶梯；fit-content 注释保留） |

明示保留（射程外，块旁注记）：Header `order:1/2`（order 非阶梯词汇，扩档需另立契约 change）、TagGroup 负 margin 几何、ContentGrid 非均分双列、FloatingButton/LikeButton 的 `$compact` 动态值块、全部 reduced-motion 块。

## 复杂度评级

- **评级:** M
- **理由:** 契约——组件库零改动（maxWidth 等词汇批次3 已就绪，本批纯消费）；触及面——5 个站点样式文件、10 个块的等价改写，载体 DOM 全部不变；可发现性——断点切换布局肉眼可见但静态验证可穷尽（剥注释扫描 + tsc 位集持平 + 逐块等价走查）。
- **期望验证深度:** unit

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`、边界 `[521, 641, 1024]`；显隐→hidden 语义、尺寸/分布断点→阶梯槽；「仅上档变」缺位槽 undefined
  - 执行约束命中: 备忘②（flex 词汇 align/justify）、⑥⑦（不可 Flex 化载体直用 `themes/responsive` 编译口——本批 9 处即此型）、⑧（CSS 注释禁反引号）；站点深导入 `themes/breakpoints` 先例（同目录文件本就 import）
  - 适用 scope: apps/site/app/post/styles/*
- shadow-docs/knowledge/blog-detail.md 与 post 域卡（review/apply 时按 menu「博客详情」路由复核工具栏/目录/排版约束：详情页禁止 scroll/resize 监听、TocScroller 机制不得触碰——本批仅改显隐/折叠声明，不碰滚动逻辑）
- shadow-docs/knowledge/site-navigation.md
  - 当前结论: 站内导航必须 next/link / styled(Link) / 消费侧 as=Link
  - 适用 scope: SpreadSide（styled(Link) 载体保留，锚点语义零变化）
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 关键帧只在 MotionStyles；TopRow 的 write-fade 引用原样保留
- norms/tdd-verification.md：M 级 = 绿灯测试 + 走查 + unit
- norms/code-style-frontend.md：transient props / 'use client' 边界（涉及文件已在既有客户端边界内）

## 决策

- **选型:** 单 change、一 Phase 站点迁移 + 一 Phase 验证。9 处编译口直用（载体语义不可动：aside/details/Link/grid-div）+ TopRow 唯一 Flex-ify。
- **对比方案:**
  - 全批 Flex-ify：aside→div 丢 landmark、details 不可 Flex、Link 遇备忘⑥目标替换陷阱——否；
  - 顺带 Flex 契约扩 order 阶梯解 Header 块：order 响应式消费仅此一例，扩档收益不配契约面——留观察，如批次5+ 再遇才扩；
  - 并入 music TrackRow 九宫格：二维重排需专项 Row/Col 落位设计（词汇映射未验证），风险与批不符——另立设计轮；
  - SiteHeader：用户曾明示排除，且显隐块与 rm 块混杂需逐块再设计——不动。
- **理由:** 全部 10 块配方有批次2/3 先例（编译口直用＝GuestbookCard/PostRow；Flex-ify＝PostRow blog 版）；DOM/JSX 双零改动，验收＝每文件 raw-@media 布局块清零 + 位集持平。

## 任务

### Phase 1 — post 域 10 块迁移
- [x] 1.1 `apps/site/app/post/styles/post-toolbar.ts` — Spread ×2 / SpreadDivider / SpreadSide 按配方编译口化；`import { responsive } from '@wuh.site/components/themes/responsive'`；BREAKPOINTS import 若该文件仅剩 rm 块则移除
- [x] 1.2 `apps/site/app/post/styles/post-toc.ts` — TocAside / TocMobile ×2 编译口化；BREAKPOINTS import 视残留重算
- [x] 1.3 `apps/site/app/post/styles/post-article.ts` — RelatedPostsHeader / ColophonTools 编译口化
- [x] 1.4 `apps/site/app/post/styles/post-header.ts` — TopRow → `styled(Flex).attrs({direction:['column','row'], alignItems:['flex-start','center'], justifyContent:'space-between', gap:['10px','sm'], wrap:true})`，css 保留 animation/margin；Header/TagGroup 保留并注记
- [x] 1.5 `apps/site/app/post/styles/post-floating.ts` — FloatingButtonGroup width 阶梯；FloatingButton/LikeButton 保留注记（$compact 动态值非阶梯语义）
- [x] 1.6 验证 — 五文件剥注释扫描：布局类 raw `@media` 仅余明示保留清单；`apps/site tsc --noEmit` 错误位集与基线逐条相同（当前基线 35，双跑对照，139 时按 SGN-001 堆上限配方）；oxlint 0/0；守卫套件不受影响复跑（components 零改动）；JSX 消费端零 diff（git status 不含 .tsx）

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 无需变更（预判）
- **候选卡片:** shadow-docs/knowledge/layout-components.md
- **理由:** 编译口直用与 Flex-ify 词汇批次3 已沉淀（备忘⑥⑦）；本批若无新长期事实（如 aside/details 载体的等价性实证），卡片不再动；review 阶段按实际发现裁定，若有新事实（例如 lg 槽显隐整段组迁移模式）则改判「更新」
