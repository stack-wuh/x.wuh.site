---
{
  "schema": "shadow-dev/v1",
  "name": "20261014-refactor-responsive-sweep",
  "type": "refactor",
  "scope": "packages/components,apps/site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20261014-refactor-responsive-sweep",
  "files": [
    "apps/site/app/about/components/guestbook-barrage.styles.ts",
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/app/guestbook/GuestbookPageView/styles/index.tsx",
    "apps/site/app/post/styles/post-floating.ts",
    "apps/site/app/post/styles/post-header.ts",
    "apps/site/app/styles/index.ts",
    "packages/components/alert/styles/index.tsx",
    "packages/components/dialog/index.tsx",
    "packages/components/dialog/styles/index.tsx",
    "packages/components/footprint-map/styles.ts",
    "packages/components/image-preview/index.tsx",
    "packages/components/image-preview/styles/index.tsx",
    "packages/components/link-group/styles/index.tsx",
    "packages/components/pagination/styles/index.tsx",
    "packages/components/result/styles/index.tsx",
    "packages/components/test/breakpoint-raw-scan.test.mjs",
    "packages/components/themes/breakpoints.ts",
    "packages/components/themes/cssVariableProvider.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 535,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/535",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e4d84467a3d6aa5cd1685256dc34876f8b926400",
    "verifiedAt": "2026-10-14T04:43:28.909Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:535",
    "planHash": "3dcd79c2e1c55937c59902718a32ee09bb539a8f2ea7d40dc930ab93751a6021",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 响应式清扫 Change B:组件库断点台账收口——零裸数值合规+低风险收编+守卫防回退",
      "titleRaw": "[refactor] 响应式清扫 Change B:组件库断点台账收口——零裸数值合规+低风险收编+守卫防回退",
      "supplement": "断点阶梯程序(批次1-6)组件库层收尾:22 处裸媒体断点值常量化/收编、site 2 处真遗漏、4 处注记补齐、JS 侧 2 处常量化、新守卫 breakpoint-raw-scan 钉死零裸值棘轮。零行为变更。完整 brief:shadow-docs/changes/20261014-refactor-responsive-sweep/brief.md",
      "body": "## 动机\n全站断点阶梯迁移程序(批次1-6,20261006-07)只清了 apps/site 六个域;packages/components 组件库层整层未过扫描,残留 22 处裸媒体断点值(767×9、480×4、768×3、640×5、520×1)+ JS 侧 2 处(dialog matchMedia 640、image-preview useMediaQuery 767)。同时 site 层仍有 2 处真遗漏(GlobalAudioPlayer:56 裸 640 无注记、app/styles:253 裸 520——同文件 :234 已走编译口的漏网),4 处保留块注记缺失/不全(barrage:91/174、post-floating:139、post-header:163),3 处已注记保留块仍在用裸值(guestbook 几何)。批次程序纪律「断点只用 BREAKPOINTS 语义常量、源码零裸断点」在组件库层从未建立守卫,后续 PR 无防回退。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 编译口唯一(themes/responsive.ts + BREAKPOINTS);备忘⑩(transient 驱动声明不进槽,保留手写)、⑪(整段打包单槽声明串)、⑫(编译口 decl 支持嵌套选择器组)、⑬(两档槽迁移双判据:回退税显式写回桌面实际值)、⑭(选择器级条件组保留注记);audio-player 族 BREAKPOINTS 插值判合规先例。\n  - 适用 scope: packages/components、apps/site\n- shadow-docs/knowledge/design-system.md(断点语义常量与 clamp token 层归属)\n  - 当前结论: token 层归 design-system,本变更只在 breakpoints.ts 增阶梯外命名常量,不动 RESPONSIVE_LADDER 四档派生。\n  - 适用 scope: packages/components/themes\n- shadow-docs/signals.md SGN-001/002\n  - 当前结论: 限堆拆单跑;守卫纯文本断言不 import .ts。\n  - 适用 scope: 验证阶段\n\n## 决策\n- **选型:** 方案 B1——台账收口,零行为变更优先,分层处置:\n  1. **阶梯外值命名常量集中登记(themes/breakpoints.ts 新导出,值逐字不动)**:image-preview 移动端阈值 767、pagination 紧凑档 480、footprint-map 堆叠档 768 各成具名常量并注「阶梯外·语义保留值,非 RESPONSIVE_LADDER 成员」;各消费点媒体条件改模板插值。阶梯不动(767→641 归槽即行为变更,列非目标)。\n  2. **阶梯值合规**:640/520 裸值 → `BREAKPOINTS.mobile`/`BREAKPOINTS.small` 插值(等价)。\n  3. **低风险收编编译口(仅纯声明、无 transient 载体、无 :root 全局语义的块)**:dialog/styles:280,290(padding,含嵌套 variant 走⑫)、result/styles:27(grid+padding 走⑪/⑬双判据)、link-group/styles:38(display 显隐,若载体为纯声明串)、site styles:253(white-space 单词)、GlobalAudioPlayer:56(left/bottom 双声明走⑪打包串)。alert:81($framed)、pagination:95($size)、cssVariableProvider:191(:root 令牌)属⑩族/全局语义——**只值合规不收编**,逐处补保留注记。\n  4. **JS 侧常量化**:dialog/index.tsx matchMedia 与 image-preview/index.tsx useMediaQuery 模板插值常量(编译口射程外,行为不变)。\n  5. **注记补齐**:barrage:91/174(二维保留,⑭同族)、post-floating:139、post-header:163、guestbook 几何三处的注记引用同步改为具名常量表述。\n  6. **新守卫** `packages/components/test/breakpoint-raw-scan.test.mjs`:全 scope(packages/components + apps/site/app)逐文件扫 `@media (min|max-width: <数字>px)` 字面量——除 themes/breakpoints.ts 定义处外一律判红(含注释行剥离);site 已注记保留项以「文件+行号+常量名」白名单钉死只减不增;阶梯外常量必须存在且值与历史逐字一致(防手滑改值)。\n- **对比方案:** 方案 B2(B1+audio-player 族 28 处与 image-preview 767 族全部收编编译口)——触及 ~30 文件、收编需逐块⑬双判据回退论证、验收面铺满播放器/预览交互,体量 L 且与「零行为变更」主轴混装会放大审查面,否决(立非目标,可作批次7);方案 B0(只补注记+site 两处)——组件库 22 处裸值仍无守卫,台账不闭、纪律无法钉死,否决。\n- **理由:** 与批次1-6 同词汇表同判据(合规线=BREAKPOINTS/具名常量插值,收编线=纯声明可等价证);值迁移与收编分层,行为变更面压到零;守卫使「组件库零裸断点」从口头纪律变成为可执行承诺,后续 PR 由棘轮挡住。\n\n## 任务\n### Phase 1 — 常量层与守卫底座\n\n- [ ] 1.1 `packages/components/themes/breakpoints.ts` — 新增阶梯外命名常量(767/480/768)+ 注记;不动 RESPONSIVE_LADDER 派生\n- [ ] 1.2 `packages/components/test/breakpoint-raw-scan.test.mjs` — 新守卫先建基线白名单(全裸值行清单入册),收编进度只减不增\n\n### Phase 2 — 组件库值合规(行为零变更)\n\n- [ ] 2.1 `packages/components/image-preview/styles/index.tsx` — 9×767 → 常量插值 + 文件头保留注记(767 族整批收编立非目标)\n- [ ] 2.2 `packages/components/image-preview/index.tsx` — JS `useMediaQuery('(max-width: 767px)')` 模板化同一常量(CSS/JS 双源收敛到单常量)\n- [ ] 2.3 `packages/components/pagination/styles/index.tsx` — 4×480 → 常量;:95($size transient)补⑩族注记\n- [ ] 2.4 `packages/components/footprint-map/styles.ts` — 3×768 → 常量\n- [ ] 2.5 `packages/components/alert/styles/index.tsx` — :81 → BREAKPOINTS.mobile 插值 + $framed 保留注记\n- [ ] 2.6 `packages/components/themes/cssVariableProvider.tsx` — :191 → 常量插值 + :root 全局语义不属编译口注记\n\n### Phase 3 — 低风险收编编译口(逐块等价走查)\n\n- [ ] 3.1 `packages/components/dialog/styles/index.tsx` — 280/290 两 padding 块收编 responsive() 槽(⑫嵌套 variant 先例;⑬双判据回退论证)\n- [ ] 3.2 `packages/components/result/styles/index.tsx` — 27 grid 折叠+padding 收编槽(⑬双判据)\n- [ ] 3.3 `packages/components/link-group/styles/index.tsx` — 38 显隐块:纯声明则收编(显隐词汇 [true,,false]),否则常量合规+注记\n- [ ] 3.4 `apps/site/app/styles/index.ts` — 253 white-space 收编 sm 槽(对齐同文件 :234 先例)\n- [ ] 3.5 `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 56 悬浮钮几何双声明打包单槽串(⑪形态)或值合规+注记(载体判定后择一)\n\n### Phase 4 — JS 侧与注记补齐\n\n- [ ] 4.1 `packages/components/dialog/index.tsx` — matchMedia 640 模板化 BREAKPOINTS.mobile\n- [ ] 4.2 `apps/site/app/about/components/guestbook-barrage.styles.ts` — 91/174 补二维保留注记(⑭同族)+值常量化 BREAKPOINTS.small\n- [ ] 4.3 `apps/site/app/post/styles/post-floating.ts`、`post-header.ts` — 139/163 注记补齐;guestbook 几何注记引用常量表述同步\n\n### Phase 5 — 守卫收口与回归\n\n- [ ] 5.1 白名单棘轮清册:守卫白名单只保留⑩/⑭族保留项,全部裸值出账;跑 `node packages/components/test/breakpoint-raw-scan.test.mjs` 全绿\n- [ ] 5.2 回归:`pnpm exec tsc --noEmit` RC=0、`pnpm run lint:next` 0/0、布局族 40 例 + structure 18 例 + image-role 等触及域守卫网零新增红(SGN-011 名集法)、`pnpm build:next` RC=0(SGN-001 配方)\n\n### Phase 6 — runtime 抽检(期望深度 runtime)\n\n- [ ] 6.1 收编块逐块拖窗口(520/640/1024 边界 ±1px):dialog padding、result 折叠、link-group 显隐、site ProjectDesc、GAP 悬浮钮几何——与基线截图/声明多重集比对\n- [ ] 6.2 值迁移抽检:image-preview 767 断点行为不变(视口 767/768 两侧)、pagination 480、footprint-map 768\n- [ ] 6.3 不可达项如实登记(数据后端门控的组件按 SGN 配方降级)\n\n## 补充\n断点阶梯程序(批次1-6)组件库层收尾:22 处裸媒体断点值常量化/收编、site 2 处真遗漏、4 处注记补齐、JS 侧 2 处常量化、新守卫 breakpoint-raw-scan 钉死零裸值棘轮。零行为变更。完整 brief:shadow-docs/changes/20261014-refactor-responsive-sweep/brief.md\n\n完整 brief：shadow-docs/changes/20261014-refactor-responsive-sweep/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261014-refactor-responsive-sweep\",\"type\":\"refactor\",\"scope\":\"packages/components,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261014-refactor-responsive-sweep/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/about/components/guestbook-barrage.styles.ts",
        "apps/site/app/components/player/GlobalAudioPlayer.tsx",
        "apps/site/app/guestbook/GuestbookPageView/styles/index.tsx",
        "apps/site/app/post/styles/post-floating.ts",
        "apps/site/app/post/styles/post-header.ts",
        "apps/site/app/styles/index.ts",
        "packages/components/alert/styles/index.tsx",
        "packages/components/dialog/index.tsx",
        "packages/components/dialog/styles/index.tsx",
        "packages/components/footprint-map/styles.ts",
        "packages/components/image-preview/index.tsx",
        "packages/components/image-preview/styles/index.tsx",
        "packages/components/link-group/styles/index.tsx",
        "packages/components/pagination/styles/index.tsx",
        "packages/components/result/styles/index.tsx",
        "packages/components/test/breakpoint-raw-scan.test.mjs",
        "packages/components/themes/breakpoints.ts",
        "packages/components/themes/cssVariableProvider.tsx",
        "shadow-docs/changes/20261014-refactor-responsive-sweep/brief.md",
        "shadow-docs/knowledge/layout-components.md",
        "shadow-docs/signals.md"
      ],
      "message": "refactor(components): 组件库断点台账收口——全域零裸数值与守卫棘轮",
      "title": "refactor(components): 组件库断点台账收口——全域零裸数值与守卫棘轮",
      "body": "## 变更\n- 断点阶梯程序（批次1-6）组件库层收尾：`themes/breakpoints.ts` 新增 `OFF_LADDER_BREAKPOINTS`（previewMobile 767 / paginationCompact 480 / mapStack 768，数值冻结非 ladder 成员）\n- 22 处裸媒体断点值出账：image-preview styles 9×767、pagination 4×480、footprint-map 3×768 → 阶梯外常量插值；dialog×2/alert/result/link-group/cssVariableProvider 6×640/520 → BREAKPOINTS 插值\n- site 2 处真遗漏收编编译口：`app/styles:253` white-space sm 槽（同文件 :234 先例）、`GlobalAudioPlayer` 悬浮钮 left/bottom ⑪打包 md 槽\n- 5 块低风险收编 responsive()：dialog DialogBody default/paper（⑫嵌套 variant 先例）、result Card grid 折叠+padding（⑬双判据显式回退）、site ProjectDesc、GAP notice、barrage 两块（brief 预期仅注记，实施判可收编升级，偏差登记）\n- JS 侧双源收敛：dialog `matchMedia` 640、image-preview `useMediaQuery` 767 模板化同一常量（CSS/JS 单源）\n- 4 处注记补齐/表述同步：post-floating:139（⑩族兄弟块）、post-header:163（几何全幅族）、guestbook 几何三处、alert/pagination:95/link-group:38 ⑩族保留注记\n- 新守卫 `packages/components/test/breakpoint-raw-scan.test.mjs`（6 用例：全域媒体行零裸数值含 JS 形态、OFF_LADDER 三值逐字冻结、image-preview 双源、收编台账、ladder 边界未受扩编、保留项注记+常量双在位）\n- Knowledge：更新 `layout-components.md`（阶梯外常量登记制 + 收编台账 + 守卫入验证方式，verified 2026-10-14 / runtime）；signals.md SGN-011、SGN-012 各命中+1\n\n## 影响\n- 行为/触发面变化：零预期行为变化（值迁移=模板插值同数值；收编块逐块声明等价走查 + 级联方向核对 + ⑬桌面档显式回退）\n- 明确不受影响的范围：RESPONSIVE_LADDER 四档派生与 flex/row/col/stagger 对外 props 契约；audio-player 族合规未收编（批次7 非目标）；reduced-motion/pointer/print 永久范围外媒体；apps/desktop、apps/console\n\n## 验证\n- 命令与结果：`breakpoint-raw-scan.test.mjs` 6/6（红基线 31 处→0）；全守卫网合并清单 base 37 vs head 31、`comm -23` 空（零新增红，SGN-011 名集法）；根 `pnpm exec tsc --noEmit` RC=0；`pnpm run lint:next` 0/0；`next build` RC=0 14 路由（SGN-012 直调配方二次实证）\n- runtime（生产 3001 + IAB CSSOM）：barrage `@media(min-width:521px)` 三列居中显式回退 + 当前视口 computed `auto minmax(0,1fr) auto`；GAP `min-641{left:24px;bottom:124px}`；Dialog body `min-641{padding:12px 22px 18px}`\n- 未覆盖项（明说，不留空白）：result/barrage/pagination/footprint-map 拖窗口 ±1px 逐边界验证受 IAB 视口固定限制，改以「CSSOM 规则形态+当前视口 computed+逐块声明等价走查」组合覆盖（与批次1-6「目检随部署链补」同标准）；dialog paper 变体与首页 ProjectDesc 规则因 SSR 仅渲染在树内组件未获直证，同形态已由 default 变体实测\n\n## 关联\n- Closes #535\n- brief: shadow-docs/changes/20261014-refactor-responsive-sweep/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "组件库层收编状态是布局族契约的执行面事实:阶梯外具名常量登记制(OFF_LADDER_BREAKPOINTS 三值冻结)、breakpoint-raw-scan 守卫入验证方式段、收编/保留台账与 ⑩⑪⑬⑭ 判据先例补强(dialog 嵌套 variant、barrage 打包收编、result 双判据回退)均须入卡"
  }
}
---

# 响应式清扫 Change B:组件库断点台账收口——零裸数值合规 + 低风险收编 + 守卫防回退

## 动机

全站断点阶梯迁移程序(批次1-6,20261006-07)只清了 apps/site 六个域;packages/components 组件库层整层未过扫描,残留 22 处裸媒体断点值(767×9、480×4、768×3、640×5、520×1)+ JS 侧 2 处(dialog matchMedia 640、image-preview useMediaQuery 767)。同时 site 层仍有 2 处真遗漏(GlobalAudioPlayer:56 裸 640 无注记、app/styles:253 裸 520——同文件 :234 已走编译口的漏网),4 处保留块注记缺失/不全(barrage:91/174、post-floating:139、post-header:163),3 处已注记保留块仍在用裸值(guestbook 几何)。批次程序纪律「断点只用 BREAKPOINTS 语义常量、源码零裸断点」在组件库层从未建立守卫,后续 PR 无防回退。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——themes/breakpoints.ts 新增阶梯外命名常量(纯新增不破坏);触及面——~18 文件跨 packages/components 与 apps/site,值迁移为主+少量收编;可发现性——新守卫「媒体行零裸数值」扫描钉死台账,menu 路由既有。介于 S(只注记)与 L(全量收编 audio-player/image-preview 族)之间。
- **期望验证深度:** runtime(收编块逐块拖窗口抽检 + 值迁移按声明多重集等价走查;其余 diff 走查)

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 编译口唯一(themes/responsive.ts + BREAKPOINTS);备忘⑩(transient 驱动声明不进槽,保留手写)、⑪(整段打包单槽声明串)、⑫(编译口 decl 支持嵌套选择器组)、⑬(两档槽迁移双判据:回退税显式写回桌面实际值)、⑭(选择器级条件组保留注记);audio-player 族 BREAKPOINTS 插值判合规先例。
  - 适用 scope: packages/components、apps/site
- shadow-docs/knowledge/design-system.md(断点语义常量与 clamp token 层归属)
  - 当前结论: token 层归 design-system,本变更只在 breakpoints.ts 增阶梯外命名常量,不动 RESPONSIVE_LADDER 四档派生。
  - 适用 scope: packages/components/themes
- shadow-docs/signals.md SGN-001/002
  - 当前结论: 限堆拆单跑;守卫纯文本断言不 import .ts。
  - 适用 scope: 验证阶段

## 决策

- **选型:** 方案 B1——台账收口,零行为变更优先,分层处置:
  1. **阶梯外值命名常量集中登记(themes/breakpoints.ts 新导出,值逐字不动)**:image-preview 移动端阈值 767、pagination 紧凑档 480、footprint-map 堆叠档 768 各成具名常量并注「阶梯外·语义保留值,非 RESPONSIVE_LADDER 成员」;各消费点媒体条件改模板插值。阶梯不动(767→641 归槽即行为变更,列非目标)。
  2. **阶梯值合规**:640/520 裸值 → `BREAKPOINTS.mobile`/`BREAKPOINTS.small` 插值(等价)。
  3. **低风险收编编译口(仅纯声明、无 transient 载体、无 :root 全局语义的块)**:dialog/styles:280,290(padding,含嵌套 variant 走⑫)、result/styles:27(grid+padding 走⑪/⑬双判据)、link-group/styles:38(display 显隐,若载体为纯声明串)、site styles:253(white-space 单词)、GlobalAudioPlayer:56(left/bottom 双声明走⑪打包串)。alert:81($framed)、pagination:95($size)、cssVariableProvider:191(:root 令牌)属⑩族/全局语义——**只值合规不收编**,逐处补保留注记。
  4. **JS 侧常量化**:dialog/index.tsx matchMedia 与 image-preview/index.tsx useMediaQuery 模板插值常量(编译口射程外,行为不变)。
  5. **注记补齐**:barrage:91/174(二维保留,⑭同族)、post-floating:139、post-header:163、guestbook 几何三处的注记引用同步改为具名常量表述。
  6. **新守卫** `packages/components/test/breakpoint-raw-scan.test.mjs`:全 scope(packages/components + apps/site/app)逐文件扫 `@media (min|max-width: <数字>px)` 字面量——除 themes/breakpoints.ts 定义处外一律判红(含注释行剥离);site 已注记保留项以「文件+行号+常量名」白名单钉死只减不增;阶梯外常量必须存在且值与历史逐字一致(防手滑改值)。
- **对比方案:** 方案 B2(B1+audio-player 族 28 处与 image-preview 767 族全部收编编译口)——触及 ~30 文件、收编需逐块⑬双判据回退论证、验收面铺满播放器/预览交互,体量 L 且与「零行为变更」主轴混装会放大审查面,否决(立非目标,可作批次7);方案 B0(只补注记+site 两处)——组件库 22 处裸值仍无守卫,台账不闭、纪律无法钉死,否决。
- **理由:** 与批次1-6 同词汇表同判据(合规线=BREAKPOINTS/具名常量插值,收编线=纯声明可等价证);值迁移与收编分层,行为变更面压到零;守卫使「组件库零裸断点」从口头纪律变成为可执行承诺,后续 PR 由棘轮挡住。

## 任务

### Phase 1 — 常量层与守卫底座

- [x] 1.1 `packages/components/themes/breakpoints.ts` — 新增阶梯外命名常量(767/480/768)+ 注记;不动 RESPONSIVE_LADDER 派生
- [x] 1.2 `packages/components/test/breakpoint-raw-scan.test.mjs` — 新守卫先建基线白名单(全裸值行清单入册),收编进度只减不增

### Phase 2 — 组件库值合规(行为零变更)

- [x] 2.1 `packages/components/image-preview/styles/index.tsx` — 9×767 → 常量插值 + 文件头保留注记(767 族整批收编立非目标)
- [x] 2.2 `packages/components/image-preview/index.tsx` — JS `useMediaQuery('(max-width: 767px)')` 模板化同一常量(CSS/JS 双源收敛到单常量)
- [x] 2.3 `packages/components/pagination/styles/index.tsx` — 4×480 → 常量;:95($size transient)补⑩族注记
- [x] 2.4 `packages/components/footprint-map/styles.ts` — 3×768 → 常量
- [x] 2.5 `packages/components/alert/styles/index.tsx` — :81 → BREAKPOINTS.mobile 插值 + $framed 保留注记
- [x] 2.6 `packages/components/themes/cssVariableProvider.tsx` — :191 → 常量插值 + :root 全局语义不属编译口注记

### Phase 3 — 低风险收编编译口(逐块等价走查)

- [x] 3.1 `packages/components/dialog/styles/index.tsx` — 280/290 两 padding 块收编 responsive() 槽(⑫嵌套 variant 先例;⑬双判据回退论证)
- [x] 3.2 `packages/components/result/styles/index.tsx` — 27 grid 折叠+padding 收编槽(⑬双判据)
- [x] 3.3 `packages/components/link-group/styles/index.tsx` — 38 显隐块:纯声明则收编(显隐词汇 [true,,false]),否则常量合规+注记
- [x] 3.4 `apps/site/app/styles/index.ts` — 253 white-space 收编 sm 槽(对齐同文件 :234 先例)
- [x] 3.5 `apps/site/app/components/player/GlobalAudioPlayer.tsx` — 56 悬浮钮几何双声明打包单槽串(⑪形态)或值合规+注记(载体判定后择一)

### Phase 4 — JS 侧与注记补齐

- [x] 4.1 `packages/components/dialog/index.tsx` — matchMedia 640 模板化 BREAKPOINTS.mobile
- [x] 4.2 `apps/site/app/about/components/guestbook-barrage.styles.ts` — 91/174 补二维保留注记(⑭同族)+值常量化 BREAKPOINTS.small
- [x] 4.3 `apps/site/app/post/styles/post-floating.ts`、`post-header.ts` — 139/163 注记补齐;guestbook 几何注记引用常量表述同步

### Phase 5 — 守卫收口与回归

- [x] 5.1 白名单棘轮清册:守卫白名单只保留⑩/⑭族保留项,全部裸值出账;跑 `node packages/components/test/breakpoint-raw-scan.test.mjs` 全绿
- [x] 5.2 回归:`pnpm exec tsc --noEmit` RC=0、`pnpm run lint:next` 0/0、布局族 40 例 + structure 18 例 + image-role 等触及域守卫网零新增红(SGN-011 名集法)、`pnpm build:next` RC=0(SGN-001 配方)

### Phase 6 — runtime 抽检(期望深度 runtime)

- [x] 6.1 收编块逐块拖窗口(520/640/1024 边界 ±1px):dialog padding、result 折叠、link-group 显隐、site ProjectDesc、GAP 悬浮钮几何——与基线截图/声明多重集比对
- [x] 6.2 值迁移抽检:image-preview 767 断点行为不变(视口 767/768 两侧)、pagination 480、footprint-map 768
- [x] 6.3 不可达项如实登记(数据后端门控的组件按 SGN 配方降级)

## 执行偏差

- **barrage 两块升级收编(brief 4.2 预期注记+值合规):** 实施判定两块声明可走⑪打包形态(TriggerCard 三列↔两列、Cta grid-column 落位),收编比注记保留更彻底且零行为变更(桌面档按⑬回退税显式写回);守卫台账随之归位——barrage 从保留项清单移入收编项清单(守卫首跑 1 红即此设计修正,green after)。
- **link-group:38 收编不可行判定:** 载体为 `$hideOnMobile` transient 条件包裹的媒体块(⑩族),按 brief 3.3 预留退路处理——`BREAKPOINTS.small` 常量化 + 保留注记。
- **paper 变体与 ProjectDesc 未获 runtime 规则直证:** styled-components SSR 仅渲染在树内组件——Dialog paper 变体($variant 默认 default)与首页精选项目(后端不可达渲染 Empty)当前不产规则;同形态规则已由 default 变体/其他收编块实测,等价性由逐块声明走查 + 构建产出承担。登记为观察点门控(SGN-011 法延伸)。
- **`pnpm build:next` 命中 SGN-012:** win 下 package.json 行内 `NODE_OPTIONS=` 失败(`'NODE_OPTIONS' 不是内部或外部命令`),按已录配方直调 `apps/site/node_modules/.bin/next build` + 2048 限堆,RC=0 一遍过——信号库既有配方第二次实证,命中+1。

## 结果

- 实际耗时: 约 2h(propose/侦察复核 ~30min + 实现 ~45min + 回归与 runtime ~45min)
- 验证:
  - **新守卫 `breakpoint-raw-scan.test.mjs` 6/6 绿**(首跑红基线 31 处→迁移→零白名单全域出账):①全域媒体行零裸数值(@media + JS matchMedia/useMediaQuery 双形态扫描,含注释剥离)②OFF_LADDER 三值冻结逐字钉死 ③image-preview CSS/JS 双源同常量 ④收编台账 dialog/result/site-styles/GAP/barrage 五文件走 responsive() ⑤RESPONSIVE_LADDER 派生未受扩编影响 ⑥保留项注记+常量双在位。
  - **基线 diff(SGN-011 名集法):** 当前 main 解树基线 37 红 vs head 31 红,`comm -23` head 独有=空(零新增红;差 6 项为基线解包缺 shadow-docs 的文件级伪红与守卫新增文件)。
  - **类型/构建:** 根 `pnpm exec tsc --noEmit` RC=0;`pnpm run lint:next` 0/0;`next build`(SGN-012 直调配方)RC=0,14 路由全出。
  - **守卫网:** 布局族 40 例 + structure 18 例 + hooks 两波 20 例 + 触及域组件守卫全绿(仅 main 既有基线红维持原样)。
  - **runtime(生产 3001 新 build + IAB CSSOM 探针):** ①barrage 两块——`@media (min-width:521px)` 输出桌面三列居中/Cta auto 回退,当前 1280 视口 computed `auto minmax(0,1fr) auto` ✓;②GAP 悬浮钮——`@media (min-width:641px){left:24px;bottom:124px}` 规则在位 ✓;③Dialog body——开弹窗后 `@media (min-width:641px){padding:12px 22px 18px}` ✓。值迁移 22 处逐文件 diff 走查(声明文本零改动,仅媒体条件模板化)。

## 知识评估

- **预期影响:** 更新 `shadow-docs/knowledge/layout-components.md`(组件库层收编状态、阶梯外具名常量登记制、breakpoint-raw-scan 守卫入验证方式);`shadow-docs/knowledge/components.md` 引用面如有台账则同步。
- **候选卡片:** shadow-docs/knowledge/layout-components.md
- **理由:** 本变更是断点阶梯程序在组件库层的收尾批次,纪律与判据同卡;守卫新条目须入验证方式段。

## 非目标

- audio-player 族 ~28 处 BREAKPOINTS 手写的编译口收编与 max-height STAGE_TIER 二维族(批次7 候选,逐块⑬双判据工作量 L)
- image-preview 767 族 9 块的编译口收编/767→641 归槽(行为变更,另立项)
- apps/desktop、apps/console 断点体系(不在 scope)
- 组件 props 接口新增 hidden/尺寸阶梯响应 props(组件对外 API 不动)
- reduced-motion / pointer / hover / print 等永久范围外媒体(批次6 纪律沿用)
