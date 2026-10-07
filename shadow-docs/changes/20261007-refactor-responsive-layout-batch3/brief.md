---
{
  "schema": "shadow-dev/v1",
  "name": "20261007-refactor-responsive-layout-batch3",
  "type": "refactor",
  "scope": "packages/components,apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20261007-refactor-responsive-layout-batch3",
  "files": [
    "apps/site/app/about/components/guestbook-barrage.styles.ts",
    "apps/site/app/components/TypewriterMotto/styles.ts",
    "apps/site/app/guestbook/GuestbookPageView/styles/index.tsx",
    "apps/site/app/styles/index.ts",
    "packages/components/flex/index.test.mjs",
    "packages/components/flex/index.tsx",
    "packages/components/flex/specs.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 508,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/508",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "ec07c0f47c35c5eee49a14517826a3c05f3a9956",
    "verifiedAt": "2026-10-07T03:16:19.433Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:508",
    "planHash": "ea80a0c6893c2f1194f5e636d48f7f978c7f94af2b012ca1e42cef058660bf61",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 响应式布局替换批次3 — home/guestbook 净位 8 处 + Flex maxWidth 契约扩档",
      "titleRaw": "[refactor] 响应式布局替换批次3 — home/guestbook 净位 8 处 + Flex maxWidth 契约扩档",
      "supplement": "按 shadow-dev 提案收敛创建，详细方案与任务拆解见 shadow-docs/changes/20261007-refactor-responsive-layout-batch3/brief.md。范围：Flex 新增 maxWidth 阶梯 prop；站点迁移 home PostRow/PostMeta/PostTags/ProjectLink/ProjectMeta、guestbook PageWrapper、TypewriterMotto max-width、GuestbookCard 气泡宽度；伪元素几何/Trigger grid 二维落位/reduced-motion 保留。复杂度 M · 验证 unit。",
      "body": "## 动机\n站点手写 `@media` 替换批次推进：批次1（#496 blog/ContactCard 3 处）、批次2（#506 #5/#6/#7）之后，本批清扫 **home 模块**（样式母文件 `apps/site/app/styles/index.ts`，6 块）与 **guestbook 域**（GuestbookPageView 4 块 + guestbook-barrage 3 块布局语义）中的干净布局位。盘点前提修正：`HomeView/` 目录本身 0 `@media`，首页存量实际在 `app/styles/index.ts`（五个 section 均为 `'use client'` 消费）。同时补 Flex 契约词汇 `maxWidth`（与 #503 `width` 同构），解锁 TypewriterMotto 与 GuestbookCard 两处尺寸断点。\n\n逐块射程判定（本批只替换布局类，reduced-motion 块按既定决策保留）：\n\n- **迁移 8 处**：home PostRow（≤520 wrap+gap）、PostMeta（≤520 margin-left）、PostTags（≤520 margin-left+width:100%，同 #504 blog 配方）、ProjectLink（≤520 wrap）、ProjectMeta（≤520 margin-left auto→0）、PageWrapper（≤640 padding）、TypewriterMotto Container（≤520 max-width）、GuestbookCard（≤640 max-width）。\n- **保留 3 类**：ProjectDesc `white-space`（非布局 prop）；guestbook timeline 伪元素几何（`::before` left / 圆点尺寸，Flex 无 position 语义）；barrage Trigger 条 `grid auto minmax(0,1fr) auto` + `grid-column:2` 二维落位（Row 均分 1fr 词汇表达不了）。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`，边界 `RESPONSIVE_LADDER = [521, 641, 1024]`；本批词汇：≤520 存量段 → sm 槽（index1），≤640 段 → md 槽（index2）；「仅上档变」缺位槽留 `undefined`，非两槽直写\n  - 适用 scope: packages/components/flex、apps/site/app（迁移位）\n  - 执行约束命中：组件源码零 `@media`/裸断点；纯 styled 布局组件文件挂 `'use client'`；迁移备忘 ①（定宽块 flex-shrink:0 写 css 块、勿用自身 flex prop 即备忘 ④）、②（flex 词汇）、③（站点 tsc 计数持平 = 零新增证明）、⑤（含空格/括号/CSS 关键字的 margin/width 串透传）\n- shadow-docs/knowledge/site-navigation.md\n  - 当前结论: 站内导航必须走 Next 软导航，裸锚点触发全文档重载\n  - 适用 scope: home PostRow（styled(Link) 锚点行）→ Flex 化必须经 `attrs({ as: Link })` 保留 Next Link\n- shadow-docs/knowledge/guestbook-barrage.md\n  - 当前结论: 消息卡片视觉只维护在 `packages/components/message-card`，弹窗与独立页共享\n  - 适用 scope: GuestbookCard（styled(MessageCard) 气泡）→ 不 Flex 化载体、不改组件库，尺寸断点改在站点侧消费编译口\n- shadow-docs/knowledge/first-load-performance.md\n  - 当前结论: 首屏主体数据优先\n  - 适用 scope: home Flex 化前提核查——HomeView 五 section 已全 `'use client'`，客户端岛早已存在，本批不新增首屏 JS\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 共享内核禁 `--motion-*` 引用\n  - 适用 scope: Phase 1 组件改动不涉及任何 motion/hex；站点文件的 `--motion-*` 引用原样保留\n- norms/tdd-verification.md：M 级 = 绿灯测试 + 走查 + unit 深度\n- norms/code-style-frontend.md：styled-components transient `$` props；`'use client'` 边界\n\n## 决策\n- **选型:** 单 change 双契约机制、两 Phase 顺序（Phase 1 组件扩档 → Phase 2 站点消费），沿用「#503 扩契约 + #506 消费同时做」的用户先例，一次 release 交付。\n  - **机制 A（Flex-ify + attrs 阶梯 props）**：home 5 处（apply 实证修订：PostRow/ProjectLink 载体为 styled(Link)/styled.a，**不可** Flex 化——SC v6 的 `as` 是目标替换，会把布局 props 灌给 Link→<a>；其 wrap/gap/尺寸走 themes/responsive 编译口直用，其余三处 Flex-ify）+ PageWrapper（column + padding 阶梯）+ TypewriterMotto Container（column + maxWidth 阶梯）。`app/styles/index.ts` 首行补 `'use client'`（其导出将挂 styled(Flex)；五个消费文件本已 client，无边界扩散）。\n  - **机制 B（编译口直用，仅限载体不可 Flex 化）**：GuestbookCard css 内 `${responsive(['calc(100% - 44px)', undefined, 'min(68%, 620px)'], (v) => \\`max-width: ${v};\\`)}`，import `@wuh.site/components/themes/responsive`——站点深导入 `themes/*` 已有 8 处先例（`themes/breakpoints`）；仍是「编译口唯一」内核，源码零裸断点。\n- **对比方案:**\n  - B′（不做 maxWidth 扩档，TypewriterMotto/GuestbookCard 留手写）——用户已在范围轮否掉（选 A）。\n  - `MessageCard.withComponent(Flex)` / 组件库给 message-card 加 maxWidth——把气泡内部 display block→flex，违反 guestbook-barrage 卡「视觉只维护在 message-card」且波及 console 等其他消费者，触及面失控，否。\n  - TypewriterMotto 也走机制 B 编译口直用——则 Phase 1 新增的 `maxWidth` prop 无 prop 通路消费者、词汇断档；maxWidth 与 width 同构入 Flex 契约是长期正确，否。\n  - SiteHeader（12 块）/ post 主战场（~25 块）——风险面大，用户已选小批先行，留后续批次。\n- **理由:** 每块配方全部有先例（#504 PostTags/TimelineTrack、#503 width 阶梯）；语义零变化：锚点行与气泡均保持原载体 DOM，仅断点声明改经唯一编译口，逐块 prop 对等走查可穷尽。\n\n## 任务\n### Phase 1 — Flex 契约扩档 `maxWidth`（packages/components/flex）\n\n- [ ] 1.1 `packages/components/flex/specs.tsx` — 增 `maxWidth?: TResponsive<string | number>`，注释与 width 同构（number→px、CSS 长度/关键字直通、数组=断点槽）；契约注释无需改（顶层数组语义统一）\n- [ ] 1.2 `packages/components/flex/index.tsx` — `$maxWidth` transient + 编译段紧随 width/height：`${(props) => responsive(props.$maxWidth, (v) => \\`max-width: ${lengthValue(v, props.theme)};\\`)}`；forwardRef 解构清单补 `maxWidth`（杜绝泄入 DOM）\n- [ ] 1.3 `packages/components/flex/index.test.mjs` — 增用例：maxWidth 标量直编 / 阶梯 `[320px, none]` 出 sm media 块且关键字直通 / 稀疏槽跳过 / maxWidth 不出现在 DOM props；跑 `node --test` themes + flex/row/col/stagger 全守卫 + `layout-typecheck.test.mjs` + oxlint，全绿方可进 Phase 2\n\n### Phase 2 — 站点迁移 8 处\n\n- [ ] 2.1 `apps/site/app/styles/index.ts` — 首行 `'use client'`；PostRow → 保持 `styled(Link)` 载体，css 内编译口直用 `responsive([true,false], …)` + `responsive(['6px', 'var(--space-sm)'], …)`（apply 修订，理由见决策；原 padding/hover/transition 保留）；PostMeta → `styled(Flex).attrs({ alignItems: 'center', gap: 'xs', margin: ['0 0 0 calc(6px + var(--space-sm))', '0'] })` + css 块保留 `flex-shrink: 0`（备忘④：自身侧 shrink 不走 prop）；PostTags → `styled(Flex).attrs({ gap: 4, width: ['100%', 'auto'], margin: ['0 0 0 calc(6px + var(--space-sm))', '0'] })` + css `flex-shrink: 0`；ProjectLink → 保持 `styled.a` 载体（外链原生锚语义），css 编译口 `responsive([true,false], …)`（apply 修订）；ProjectMeta → `styled(Flex).attrs({ margin: [0, '0 0 0 auto'] })` + css 保留字号/色/shrink；ProjectDesc 不动。验收：本文件布局类裸 `@media` 清零，HomeView 五处 JSX 零改动\n- [ ] 2.2 `apps/site/app/guestbook/GuestbookPageView/styles/index.tsx` — PageWrapper → `styled(Flex).attrs({ direction: 'column', padding: ['32px 16px 64px', undefined, '48px 24px 80px'] })` + css 保留 `max-width: 720px; margin: 0 auto`；timeline 伪元素几何 3 块保留并在块旁注明射程外原因\n- [ ] 2.3 `apps/site/app/components/TypewriterMotto/styles.ts` — Container → `styled(Flex).attrs({ direction: 'column', maxWidth: ['320px', 'none'] })`；走查居中语义（text-align:center 与 `::after` margin auto 在 column-flex 下的等价性）与 `min-height`/`padding` 保留\n- [ ] 2.4 `apps/site/app/about/components/guestbook-barrage.styles.ts` — GuestbookCard max-width 阶梯改机制 B 编译口直用（见决策）；本文件其余 reduced-motion / Trigger grid 二维落位保留\n- [ ] 2.5 全量验证 — `apps/site tsc --noEmit` 错误计数与基线持平（约 31，pointermove 存量）；Phase 1 守卫套件复跑；四文件剥注释扫描无裸断点布局块残留（reduced-motion 除外）；oxlint\n\n### Phase 3 — Knowledge 落卡（review 通过后随 release）\n\n- [ ] 3.1 `shadow-docs/knowledge/layout-components.md` — 词汇段补 `maxWidth`；迁移备忘增 ⑥ 锚点行不可 Flex 化（SC v6 as 即目标替换）走编译口（PostRow/ProjectLink 实证）、⑦ 非可换基座载体直用编译口（GuestbookCard 实证）、⑧ CSS 注释反引号会终结 styled 模板字面量、⑨ 新 worktree 缺 node_modules 时 layout-typecheck 守卫空转假绿需手动域 tsc 复核；词汇段/验证方式/verified-scope 同步（已按此落卡）\n\n## 补充\n按 shadow-dev 提案收敛创建，详细方案与任务拆解见 shadow-docs/changes/20261007-refactor-responsive-layout-batch3/brief.md。范围：Flex 新增 maxWidth 阶梯 prop；站点迁移 home PostRow/PostMeta/PostTags/ProjectLink/ProjectMeta、guestbook PageWrapper、TypewriterMotto max-width、GuestbookCard 气泡宽度；伪元素几何/Trigger grid 二维落位/reduced-motion 保留。复杂度 M · 验证 unit。\n\n完整 brief：shadow-docs/changes/20261007-refactor-responsive-layout-batch3/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261007-refactor-responsive-layout-batch3\",\"type\":\"refactor\",\"scope\":\"packages/components,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261007-refactor-responsive-layout-batch3/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/about/components/guestbook-barrage.styles.ts",
        "apps/site/app/components/TypewriterMotto/styles.ts",
        "apps/site/app/guestbook/GuestbookPageView/styles/index.tsx",
        "apps/site/app/styles/index.ts",
        "packages/components/flex/index.test.mjs",
        "packages/components/flex/index.tsx",
        "packages/components/flex/specs.tsx",
        "shadow-docs/changes/20261007-refactor-responsive-layout-batch3/brief.md",
        "shadow-docs/knowledge/layout-components.md"
      ],
      "message": "refactor(layout): 响应式布局批次3——Flex maxWidth 扩档与 home/guestbook 八处阶梯迁移",
      "title": "refactor(layout): 响应式布局批次3 — Flex maxWidth 扩档 + home/guestbook 八处迁移 (#508)",
      "body": "Closes #508\n\n完整 brief：shadow-docs/changes/20261007-refactor-responsive-layout-batch3/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "Flex 公开词汇新增 maxWidth（与 width 同口同构、TypewriterMotto 首消费）；站点替换批沉淀四条长期事实：⑥锚点行(styled(Link)/styled.a)不可 Flex 化——SC v6 as 即目标替换，断点改走 themes/responsive 编译口（PostRow/ProjectLink 实证）；⑦非可换基座载体（message-card 气泡）同理直用编译口不动组件库；⑧CSS 块注释内反引号会终结 styled 模板字面量；⑨新 worktree 缺 node_modules 时 layout-typecheck 守卫空转假绿须手动域 tsc 复核。brief 2.1/3.1 文本已按实证机制修订并标注 apply 修订。验证：守卫 39/39、域 tsc 手动 EXIT=0、site tsc 35=35 错误位集相同、oxlint 0/0、剥注释扫描射程内清零——M 级 unit+走查达标。"
  }
}
---

# 响应式布局替换批次3 — home/guestbook 净位 + Flex maxWidth 契约扩档

## 动机

站点手写 `@media` 替换批次推进：批次1（#496 blog/ContactCard 3 处）、批次2（#506 #5/#6/#7）之后，本批清扫 **home 模块**（样式母文件 `apps/site/app/styles/index.ts`，6 块）与 **guestbook 域**（GuestbookPageView 4 块 + guestbook-barrage 3 块布局语义）中的干净布局位。盘点前提修正：`HomeView/` 目录本身 0 `@media`，首页存量实际在 `app/styles/index.ts`（五个 section 均为 `'use client'` 消费）。同时补 Flex 契约词汇 `maxWidth`（与 #503 `width` 同构），解锁 TypewriterMotto 与 GuestbookCard 两处尺寸断点。

逐块射程判定（本批只替换布局类，reduced-motion 块按既定决策保留）：

- **迁移 8 处**：home PostRow（≤520 wrap+gap）、PostMeta（≤520 margin-left）、PostTags（≤520 margin-left+width:100%，同 #504 blog 配方）、ProjectLink（≤520 wrap）、ProjectMeta（≤520 margin-left auto→0）、PageWrapper（≤640 padding）、TypewriterMotto Container（≤520 max-width）、GuestbookCard（≤640 max-width）。
- **保留 3 类**：ProjectDesc `white-space`（非布局 prop）；guestbook timeline 伪元素几何（`::before` left / 圆点尺寸，Flex 无 position 语义）；barrage Trigger 条 `grid auto minmax(0,1fr) auto` + `grid-column:2` 二维落位（Row 均分 1fr 词汇表达不了）。

## 复杂度评级

- **评级:** M
- **理由:** 契约——Flex 仅**新增**可选 prop `maxWidth`（与既有 width 共用 `lengthValue` + `responsive()` 编译口，既有 props 语义零变化、零回归）；触及面——共享组件 1 prop + 4 站点样式文件，不改 message-card 组件库；可发现性——守卫单测钉死编译输出 + 站点 tsc 计数持平 + 逐 prop 等价走查。对照 batch2（#506，getSpacingValue 透传扩口）同判 M。
- **期望验证深度:** unit

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`，边界 `RESPONSIVE_LADDER = [521, 641, 1024]`；本批词汇：≤520 存量段 → sm 槽（index1），≤640 段 → md 槽（index2）；「仅上档变」缺位槽留 `undefined`，非两槽直写
  - 适用 scope: packages/components/flex、apps/site/app（迁移位）
  - 执行约束命中：组件源码零 `@media`/裸断点；纯 styled 布局组件文件挂 `'use client'`；迁移备忘 ①（定宽块 flex-shrink:0 写 css 块、勿用自身 flex prop 即备忘 ④）、②（flex 词汇）、③（站点 tsc 计数持平 = 零新增证明）、⑤（含空格/括号/CSS 关键字的 margin/width 串透传）
- shadow-docs/knowledge/site-navigation.md
  - 当前结论: 站内导航必须走 Next 软导航，裸锚点触发全文档重载
  - 适用 scope: home PostRow（styled(Link) 锚点行）→ Flex 化必须经 `attrs({ as: Link })` 保留 Next Link
- shadow-docs/knowledge/guestbook-barrage.md
  - 当前结论: 消息卡片视觉只维护在 `packages/components/message-card`，弹窗与独立页共享
  - 适用 scope: GuestbookCard（styled(MessageCard) 气泡）→ 不 Flex 化载体、不改组件库，尺寸断点改在站点侧消费编译口
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏主体数据优先
  - 适用 scope: home Flex 化前提核查——HomeView 五 section 已全 `'use client'`，客户端岛早已存在，本批不新增首屏 JS
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 共享内核禁 `--motion-*` 引用
  - 适用 scope: Phase 1 组件改动不涉及任何 motion/hex；站点文件的 `--motion-*` 引用原样保留
- norms/tdd-verification.md：M 级 = 绿灯测试 + 走查 + unit 深度
- norms/code-style-frontend.md：styled-components transient `$` props；`'use client'` 边界

## 决策

- **选型:** 单 change 双契约机制、两 Phase 顺序（Phase 1 组件扩档 → Phase 2 站点消费），沿用「#503 扩契约 + #506 消费同时做」的用户先例，一次 release 交付。
  - **机制 A（Flex-ify + attrs 阶梯 props）**：home 5 处（apply 实证修订：PostRow/ProjectLink 载体为 styled(Link)/styled.a，**不可** Flex 化——SC v6 的 `as` 是目标替换，会把布局 props 灌给 Link→<a>；其 wrap/gap/尺寸走 themes/responsive 编译口直用，其余三处 Flex-ify）+ PageWrapper（column + padding 阶梯）+ TypewriterMotto Container（column + maxWidth 阶梯）。`app/styles/index.ts` 首行补 `'use client'`（其导出将挂 styled(Flex)；五个消费文件本已 client，无边界扩散）。
  - **机制 B（编译口直用，仅限载体不可 Flex 化）**：GuestbookCard css 内 `${responsive(['calc(100% - 44px)', undefined, 'min(68%, 620px)'], (v) => \`max-width: ${v};\`)}`，import `@wuh.site/components/themes/responsive`——站点深导入 `themes/*` 已有 8 处先例（`themes/breakpoints`）；仍是「编译口唯一」内核，源码零裸断点。
- **对比方案:**
  - B′（不做 maxWidth 扩档，TypewriterMotto/GuestbookCard 留手写）——用户已在范围轮否掉（选 A）。
  - `MessageCard.withComponent(Flex)` / 组件库给 message-card 加 maxWidth——把气泡内部 display block→flex，违反 guestbook-barrage 卡「视觉只维护在 message-card」且波及 console 等其他消费者，触及面失控，否。
  - TypewriterMotto 也走机制 B 编译口直用——则 Phase 1 新增的 `maxWidth` prop 无 prop 通路消费者、词汇断档；maxWidth 与 width 同构入 Flex 契约是长期正确，否。
  - SiteHeader（12 块）/ post 主战场（~25 块）——风险面大，用户已选小批先行，留后续批次。
- **理由:** 每块配方全部有先例（#504 PostTags/TimelineTrack、#503 width 阶梯）；语义零变化：锚点行与气泡均保持原载体 DOM，仅断点声明改经唯一编译口，逐块 prop 对等走查可穷尽。

## 任务

### Phase 1 — Flex 契约扩档 `maxWidth`（packages/components/flex）

- [x] 1.1 `packages/components/flex/specs.tsx` — 增 `maxWidth?: TResponsive<string | number>`，注释与 width 同构（number→px、CSS 长度/关键字直通、数组=断点槽）；契约注释无需改（顶层数组语义统一）
- [x] 1.2 `packages/components/flex/index.tsx` — `$maxWidth` transient + 编译段紧随 width/height：`${(props) => responsive(props.$maxWidth, (v) => \`max-width: ${lengthValue(v, props.theme)};\`)}`；forwardRef 解构清单补 `maxWidth`（杜绝泄入 DOM）
- [x] 1.3 `packages/components/flex/index.test.mjs` — 增用例：maxWidth 标量直编 / 阶梯 `[320px, none]` 出 sm media 块且关键字直通 / 稀疏槽跳过 / maxWidth 不出现在 DOM props；跑 `node --test` themes + flex/row/col/stagger 全守卫 + `layout-typecheck.test.mjs` + oxlint，全绿方可进 Phase 2

### Phase 2 — 站点迁移 8 处

- [x] 2.1 `apps/site/app/styles/index.ts` — 首行 `'use client'`；PostRow → 保持 `styled(Link)` 载体，css 内编译口直用 `responsive([true,false], …)` + `responsive(['6px', 'var(--space-sm)'], …)`（apply 修订，理由见决策；原 padding/hover/transition 保留）；PostMeta → `styled(Flex).attrs({ alignItems: 'center', gap: 'xs', margin: ['0 0 0 calc(6px + var(--space-sm))', '0'] })` + css 块保留 `flex-shrink: 0`（备忘④：自身侧 shrink 不走 prop）；PostTags → `styled(Flex).attrs({ gap: 4, width: ['100%', 'auto'], margin: ['0 0 0 calc(6px + var(--space-sm))', '0'] })` + css `flex-shrink: 0`；ProjectLink → 保持 `styled.a` 载体（外链原生锚语义），css 编译口 `responsive([true,false], …)`（apply 修订）；ProjectMeta → `styled(Flex).attrs({ margin: [0, '0 0 0 auto'] })` + css 保留字号/色/shrink；ProjectDesc 不动。验收：本文件布局类裸 `@media` 清零，HomeView 五处 JSX 零改动
- [x] 2.2 `apps/site/app/guestbook/GuestbookPageView/styles/index.tsx` — PageWrapper → `styled(Flex).attrs({ direction: 'column', padding: ['32px 16px 64px', undefined, '48px 24px 80px'] })` + css 保留 `max-width: 720px; margin: 0 auto`；timeline 伪元素几何 3 块保留并在块旁注明射程外原因
- [x] 2.3 `apps/site/app/components/TypewriterMotto/styles.ts` — Container → `styled(Flex).attrs({ direction: 'column', maxWidth: ['320px', 'none'] })`；走查居中语义（text-align:center 与 `::after` margin auto 在 column-flex 下的等价性）与 `min-height`/`padding` 保留
- [x] 2.4 `apps/site/app/about/components/guestbook-barrage.styles.ts` — GuestbookCard max-width 阶梯改机制 B 编译口直用（见决策）；本文件其余 reduced-motion / Trigger grid 二维落位保留
- [x] 2.5 全量验证 — `apps/site tsc --noEmit` 错误计数与基线持平（约 31，pointermove 存量）；Phase 1 守卫套件复跑；四文件剥注释扫描无裸断点布局块残留（reduced-motion 除外）；oxlint

### Phase 3 — Knowledge 落卡（review 通过后随 release）

- [x] 3.1 `shadow-docs/knowledge/layout-components.md` — 词汇段补 `maxWidth`；迁移备忘增 ⑥ 锚点行不可 Flex 化（SC v6 as 即目标替换）走编译口（PostRow/ProjectLink 实证）、⑦ 非可换基座载体直用编译口（GuestbookCard 实证）、⑧ CSS 注释反引号会终结 styled 模板字面量、⑨ 新 worktree 缺 node_modules 时 layout-typecheck 守卫空转假绿需手动域 tsc 复核；词汇段/验证方式/verified-scope 同步（已按此落卡）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/layout-components.md
- **理由:** Flex 公开词汇面扩 `maxWidth`；站点消费新增两条机制备忘（as=Link 软导航锚点行、编译口直用不可 Flex 化载体）；不改 animation-system / guestbook-barrage / site-navigation 卡结论，仅引用为约束。verified-depth 维持 unit（三断点公共 DNS 目视仍未解锁，沿用既有待补记）。
