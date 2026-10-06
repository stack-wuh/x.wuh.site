---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-refactor-responsive-layout-batch1",
  "type": "refactor",
  "scope": "apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/site/app/blog/styles/index.ts",
    "apps/site/app/components/ContactCard.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 495,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/495",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "d14f4576aa85d67536e1f0d0c4097a47abc444f6",
    "verifiedAt": "2026-10-06T12:27:51.268Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:495",
    "planHash": "fa70ba41556b476b7316224e94c5ef9daf4a70c51adfced54bbb1ad9ba25dca9",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 站点响应式替换批·1：blog 列表与 ContactCard 布局类 @media 迁 Flex",
      "titleRaw": "站点响应式替换批·1：blog 列表与 ContactCard 布局类 @media 迁 Flex",
      "supplement": "首次真实消费四档阶梯布局组件。从首批盘点 11 处 @media 中迁入 Flex 能干净承接的 3 处布局类（blog PostRow、ContactCard Body/Hints），reduced-motion/max-width/显隐/换行占满类保留。#5 width:100% 与 #7 display:none@767 暴露阶梯契约缺响应式显隐/换行原语，记为后批组件扩档候选。详见 shadow-docs/changes/20261006-refactor-responsive-layout-batch1/brief.md",
      "body": "## 动机\n布局组件族（#485/#491/#494，已在 main 并随 v1.4.66 部署）确立的四档阶梯契约至今零消费者。站点存量约 110 处手写 `@media` 是既定的分批替换对象。本批是**首次真实消费**：从首批盘点（blog/about/ContactCard，11 处）中挑出 Flex 现成能干净承接的 3 处布局类 @media 迁入，验证契约的可写性与等价性。其余批次各自独立提案。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`，边界 521/641/1024 由 BREAKPOINTS+1 派生；缺位槽跳过、低档媒体级联延续；「仅某档变」须补位到目标槽；顶层数组一律=阶梯槽，非对称盒式简写走 CSS 字符串\n  - 适用 scope: 本批 Flex props 写法\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 断点只用 BREAKPOINTS 语义常量禁裸数值；间距 token md~3xl 为 clamp；暗色随 data-color-scheme；淡化禁 --text-secondary\n  - 适用 scope: apps/site/app/blog/styles, apps/site/app/components/ContactCard\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: reduced-motion 与 print 必须降级；关键帧只在 MotionStyles（blog Root/YearGroup 既有动画保留，不属本批迁移）\n  - 适用 scope: 保留的 @media（prefers-reduced-motion）\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 根 `tsc --noEmit` 不覆盖 apps/site，检查站点必须 `cd apps/site && pnpm exec tsc --noEmit`\n  - 适用 scope: 验证阶段\n- norms/ui-patterns.md\n  - 当前结论: 只替换布局类；禁横向滚动、禁布局位移动画（本批保留的 transition/hover 不动）\n  - 适用 scope: 全批判定准绳\n\n## 决策\n- **选型:** `styled(Flex)` 包裹保留各组件既有非布局样式（hover/padding/border/animation/transition/reduced-motion），仅把方向/分布/对齐/间距/换行改为阶梯 props，不动 JSX 结构。三处映射：\n  1. **#4 `blog PostRow`**（原基线 align center+gap space-sm，`@≤520 flex-wrap:wrap; gap:6px`）→ `styled(Flex)` attrs：`alignItems='center'`、`wrap=[true,false]`、`gap=[6,'sm']`（base ≤520 wrap+gap6、sm≥521 不 wrap+gap space-sm）。\n  2. **#8 `ContactCard Body`**（原 grid `auto 1fr`+gap md+align start；`@≤640 1fr`+justify center+gap xs）→ `styled(Flex)` attrs：`direction=['column',,'row']`、`alignItems=['center',,'start']`、`gap=['xs',,'md']`；**Info 补 `flex:1`**（grid `1fr` 次列撑满 ≠ flex 默认，Info 现仅 min-width:0）。\n  3. **#9 `ContactCard Hints`**（原基线 row+gap base；`@≤640 flex-direction:column; gap:4px`）→ `styled(Flex)` attrs：`direction=['column',,'row']`、`gap=[4,,'base']`。\n- **本批不迁（保留/越界）**：#1/#2/#3/#11 四条 `prefers-reduced-motion`（动效降级，非布局）；#10 TypewriterMotto `max-width`（尺寸约束，非 Flex 范畴）；#5 blog PostTags `width:100%+margin-left`（换行占满，阶梯契约无此原语）；#7 about TimelineTrack `display:none@767`（响应式显隐原语缺失 + 767 野断点收编属组件侧决策）；#6 PostMeta margin 缩进（随 #4/#5 同属 PostTags/PostMeta 换行体系，本批不动以免半迁撕裂）。#5/#6/#7 记为**能力缺口候选**，交后批组件扩档或独立裁决。\n- **对比方案:** (a) JSX 层用 `<Flex>` 直接替换外层 div——需改 DOM 结构、影响测试选择器与 class 合并，面更大，未选；(b) 把 #5/#6/#7 也一并迁——但现成 Flex 无 width:100%/display:none 槽，强迁会退化成 `style` 内联或新增原语（越界，属契约变更），未选；(c) 整文件重写样式——违反小步快跑，未选。\n- **理由:** 本批定位「首次消费 + 等价验证」，只碰能无损表达为阶梯 props 的布局 @media；缺口项显式记录而非临时扩契约，保持 change 面可控（layout-components 卡「离散切换才用数组槽」，本批全是离散切换）。\n\n## 任务\n### Phase 1 — blog 列表\n- [ ] PostRow 迁 Flex — `apps/site/app/blog/styles/index.ts` — `styled(Flex)` attrs `alignItems/wrap=[true,false]/gap=[6,'sm']`，保留 hover/padding/transition/`@≤520` 内 reduced-motion；删除已承接的 `@media(max-width:520){flex-wrap;gap}` 块\n\n### Phase 2 — ContactCard（同文件两处 + 子项，串行）\n- [ ] Body 迁 Flex + Info 撑满 — `apps/site/app/components/ContactCard.tsx` — `styled(Flex)` attrs `direction=['column',,'row']/alignItems=['center',,'start']/gap=['xs',,'md']`；Info 增 `flex:1`；删 Body 的 `@media≤mobile` grid 块\n- [ ] Hints 迁 Flex — `apps/site/app/components/ContactCard.tsx` — `styled(Flex)` attrs `direction=['column',,'row']/gap=[4,,'base']`；保留 padding-top/border-top/animation；删 `@media≤mobile` flex 块\n\n### Phase 3 — 验证\n- [ ] 站点类型检查 — `cd apps/site && pnpm exec tsc --noEmit`（build-config：根 tsc 不覆盖 site）\n- [ ] 等价走查 — 三处替换前后逐 prop 对照（基线=原 mobile-first 反推、sm/md/lg 槽对应原 ≤520/≤640 断点），并 grep 确认 `apps/site/app/blog/styles/index.ts` 与 ContactCard 中**仅**布局类 @media 减少、reduced-motion/max-width/显隐/换行占满块原样保留\n\n## 补充\n首次真实消费四档阶梯布局组件。从首批盘点 11 处 @media 中迁入 Flex 能干净承接的 3 处布局类（blog PostRow、ContactCard Body/Hints），reduced-motion/max-width/显隐/换行占满类保留。#5 width:100% 与 #7 display:none@767 暴露阶梯契约缺响应式显隐/换行原语，记为后批组件扩档候选。详见 shadow-docs/changes/20261006-refactor-responsive-layout-batch1/brief.md\n\n完整 brief：shadow-docs/changes/20261006-refactor-responsive-layout-batch1/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-refactor-responsive-layout-batch1\",\"type\":\"refactor\",\"scope\":\"apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-refactor-responsive-layout-batch1/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/blog/styles/index.ts",
        "apps/site/app/components/ContactCard.tsx",
        "shadow-docs/changes/20261006-refactor-responsive-layout-batch1/brief.md",
        "shadow-docs/knowledge/layout-components.md"
      ],
      "message": "refactor(site): 站点响应式替换批·1 blog+ContactCard 布局 @media 迁 Flex (#495)",
      "title": "[refactor] 站点响应式替换批·1：blog 列表与 ContactCard 布局 @media 迁 Flex",
      "body": "Closes #495\n\n完整 brief：shadow-docs/changes/20261006-refactor-responsive-layout-batch1/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "首次真实消费四档阶梯（blog PostRow / ContactCard Body·Hints，3 处布局 @media 迁 Flex），apps/site tsc 计数持平 31=31 证明零新增、三处逐 prop 等价走查成立。消费暴露并沉淀 3 条跨后续站点批次必复用的迁移事实（grid 次列 1fr→Flex 补 flex:1 且定宽块 flex-shrink:0；align 词汇 flex-start 非 grid start；site tsc 计数持平台规），并入 layout-components.md 执行约束（首消费 #495 迁移备忘），source 追加本 brief、verified-scope 更新为含站点首消费。apply 预评估为无需变更，review 判定为更新（迁移备忘属跨变更稳定事实）。"
  }
}
---

# 站点响应式替换批·1 — blog 列表与 ContactCard 布局类 @media 迁移 Flex

## 动机

布局组件族（#485/#491/#494，已在 main 并随 v1.4.66 部署）确立的四档阶梯契约至今零消费者。站点存量约 110 处手写 `@media` 是既定的分批替换对象。本批是**首次真实消费**：从首批盘点（blog/about/ContactCard，11 处）中挑出 Flex 现成能干净承接的 3 处布局类 @media 迁入，验证契约的可写性与等价性。其余批次各自独立提案。

## 复杂度评级

- **评级:** M
- **理由:** 契约——不改任何组件/接口，纯消费既有 Flex，站点内局部行为需保持等价；触及面——apps/site 两文件的渲染层，非宿主核心/跨模块数据流；可发现性——替换改坏会立刻视觉可见（换行/分布/间距错乱），且本批无既有守卫、验证靠 tsc + 等价走查。综合定 M。
- **期望验证深度:** unit（apps/site `tsc --noEmit`）+ 三处替换前后 CSS 等价走查；runtime 目检随站点 dev 可起时补（见验证约束 SGN-001）

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`，边界 521/641/1024 由 BREAKPOINTS+1 派生；缺位槽跳过、低档媒体级联延续；「仅某档变」须补位到目标槽；顶层数组一律=阶梯槽，非对称盒式简写走 CSS 字符串
  - 适用 scope: 本批 Flex props 写法
- shadow-docs/knowledge/design-system.md
  - 当前结论: 断点只用 BREAKPOINTS 语义常量禁裸数值；间距 token md~3xl 为 clamp；暗色随 data-color-scheme；淡化禁 --text-secondary
  - 适用 scope: apps/site/app/blog/styles, apps/site/app/components/ContactCard
- shadow-docs/knowledge/animation-system.md
  - 当前结论: reduced-motion 与 print 必须降级；关键帧只在 MotionStyles（blog Root/YearGroup 既有动画保留，不属本批迁移）
  - 适用 scope: 保留的 @media（prefers-reduced-motion）
- shadow-docs/knowledge/build-config.md
  - 当前结论: 根 `tsc --noEmit` 不覆盖 apps/site，检查站点必须 `cd apps/site && pnpm exec tsc --noEmit`
  - 适用 scope: 验证阶段
- norms/ui-patterns.md
  - 当前结论: 只替换布局类；禁横向滚动、禁布局位移动画（本批保留的 transition/hover 不动）
  - 适用 scope: 全批判定准绳

## 决策

- **选型:** `styled(Flex)` 包裹保留各组件既有非布局样式（hover/padding/border/animation/transition/reduced-motion），仅把方向/分布/对齐/间距/换行改为阶梯 props，不动 JSX 结构。三处映射：
  1. **#4 `blog PostRow`**（原基线 align center+gap space-sm，`@≤520 flex-wrap:wrap; gap:6px`）→ `styled(Flex)` attrs：`alignItems='center'`、`wrap=[true,false]`、`gap=[6,'sm']`（base ≤520 wrap+gap6、sm≥521 不 wrap+gap space-sm）。
  2. **#8 `ContactCard Body`**（原 grid `auto 1fr`+gap md+align start；`@≤640 1fr`+justify center+gap xs）→ `styled(Flex)` attrs：`direction=['column',,'row']`、`alignItems=['center',,'start']`、`gap=['xs',,'md']`；**Info 补 `flex:1`**（grid `1fr` 次列撑满 ≠ flex 默认，Info 现仅 min-width:0）。
  3. **#9 `ContactCard Hints`**（原基线 row+gap base；`@≤640 flex-direction:column; gap:4px`）→ `styled(Flex)` attrs：`direction=['column',,'row']`、`gap=[4,,'base']`。
- **本批不迁（保留/越界）**：#1/#2/#3/#11 四条 `prefers-reduced-motion`（动效降级，非布局）；#10 TypewriterMotto `max-width`（尺寸约束，非 Flex 范畴）；#5 blog PostTags `width:100%+margin-left`（换行占满，阶梯契约无此原语）；#7 about TimelineTrack `display:none@767`（响应式显隐原语缺失 + 767 野断点收编属组件侧决策）；#6 PostMeta margin 缩进（随 #4/#5 同属 PostTags/PostMeta 换行体系，本批不动以免半迁撕裂）。#5/#6/#7 记为**能力缺口候选**，交后批组件扩档或独立裁决。
- **对比方案:** (a) JSX 层用 `<Flex>` 直接替换外层 div——需改 DOM 结构、影响测试选择器与 class 合并，面更大，未选；(b) 把 #5/#6/#7 也一并迁——但现成 Flex 无 width:100%/display:none 槽，强迁会退化成 `style` 内联或新增原语（越界，属契约变更），未选；(c) 整文件重写样式——违反小步快跑，未选。
- **理由:** 本批定位「首次消费 + 等价验证」，只碰能无损表达为阶梯 props 的布局 @media；缺口项显式记录而非临时扩契约，保持 change 面可控（layout-components 卡「离散切换才用数组槽」，本批全是离散切换）。

## 任务

### Phase 1 — blog 列表
- [x] PostRow 迁 Flex — `apps/site/app/blog/styles/index.ts` — `styled(Flex)` attrs `alignItems/wrap=[true,false]/gap=[6,'sm']`，保留 hover/padding/transition/`@≤520` 内 reduced-motion；删除已承接的 `@media(max-width:520){flex-wrap;gap}` 块

### Phase 2 — ContactCard（同文件两处 + 子项，串行）
- [x] Body 迁 Flex + Info 撑满 — `apps/site/app/components/ContactCard.tsx` — `styled(Flex)` attrs `direction=['column',,'row']/alignItems=['center',,'start']/gap=['xs',,'md']`；Info 增 `flex:1`；删 Body 的 `@media≤mobile` grid 块
- [x] Hints 迁 Flex — `apps/site/app/components/ContactCard.tsx` — `styled(Flex)` attrs `direction=['column',,'row']/gap=[4,,'base']`；保留 padding-top/border-top/animation；删 `@media≤mobile` flex 块

### Phase 3 — 验证
- [x] 站点类型检查 — `cd apps/site && pnpm exec tsc --noEmit`（build-config：根 tsc 不覆盖 site）
- [x] 等价走查 — 三处替换前后逐 prop 对照（基线=原 mobile-first 反推、sm/md/lg 槽对应原 ≤520/≤640 断点），并 grep 确认 `apps/site/app/blog/styles/index.ts` 与 ContactCard 中**仅**布局类 @media 减少、reduced-motion/max-width/显隐/换行占满块原样保留

## 结果

- 实际耗时: —
- 验证: —
- **待确认点（非阻塞）:** #5 width:100% 换行、#7 display:none@767 显隐暴露阶梯契约缺「响应式换行占满/显隐」原语——是否扩 Flex/Col 该能力属组件侧 change，与 design-system「767 随触碰收敛」联动，留后批裁决。

## 知识评估

- **预期影响:** 无需变更（本批是 layout-components 卡既有契约的首次消费验证，不产生新稳定事实；若消费中暴露契约缺陷另立组件 change）
- **候选卡片:** 无
- **理由:** 替换动作属一次性实现，卡片已覆盖四档阶梯写法与保留规则；站点侧无新增跨变更事实。verified-depth 无涉及卡更新。
