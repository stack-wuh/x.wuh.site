---
{
  "schema": "shadow-dev/v1",
  "name": "20261014-chore-layout-grid-retirement",
  "type": "chore",
  "scope": "packages/components",
  "status": "published",
  "baseBranch": "main",
  "branch": "chore/20261014-chore-layout-grid-retirement",
  "files": [
    "AGENTS.md",
    "packages/components/col",
    "packages/components/flex/index.tsx",
    "packages/components/flex/readme.md",
    "packages/components/layout-typecheck.test.mjs",
    "packages/components/row",
    "packages/components/stagger",
    "packages/components/test/structure-baseline.json",
    "shadow-docs/knowledge/component-standard.md",
    "shadow-docs/knowledge/layout-components.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 539,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/539",
    "pullRequest": 540,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/540"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "d8de906b00b29b76c4616fcd5a6cfff97a1f5c1a",
    "verifiedAt": "2026-10-14T08:42:21.672Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:540",
    "planHash": "e0d03051f6ab7c83c9b7667fd9c8e90ef5e2b2ab0e260773f731ea89b1293a90",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[chore] chore(components): Row/Col/Stagger 布局零消费组件退役",
      "titleRaw": "chore(components): Row/Col/Stagger 布局零消费组件退役",
      "supplement": "全仓三形态 grep 证死三组件自创建零消费;三目录整删(557 行)+baseline/守卫注释/flex 文本引用/AGENTS.md/知识卡联动;共享地基(Flex/responsive 编译口/阶梯)保留。完整 brief:shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md",
      "body": "## 动机\n上一轮组件退役(20261014-chore-dead-components-retirement)判定分组的遗留候选「Row/Col/Stagger 删除或补消费者」,经用户复核裁决删除。复核证据链:\n\n- 全仓三形态 grep(包路径/相对路径/JSX,覆盖 apps/site、apps/console、apps/desktop、packages)三组件**自创建起零消费**——`apps/desktop` 的 `<Row>` 命中为本地 styled.div(Heatmap.tsx:58 等),与组件库无关;site 组件展示页(ContactCard)用的也是 Flex。\n- 布局迁移五批次(#495/#504 + 批次3-5 + 组件库清扫)实证:每一处存量 `@media` 替换场景都自然落在 Flex 或 `responsive()` 编译口上(连 music 九宫格也是 grid 载体+编译口),12 分栏词汇在站点布局语法中从未出现真实需求。\n- 真正值钱的共享地基(themes/responsive.ts 编译口、RESPONSIVE_LADDER、spacing、breakpoints/OFF_LADDER)**全部保留不动**;Row/Col/Stagger 只是 grid-column span 与 nth-child 动效的薄壳,git history 即备份,将来出现分栏版面从历史拣回或照契约重写均约一小时。\n- 保留的隐性成本=持续误读「已实现组件」清单(退役五组件的同一教训)+18 例守卫维护无人消费的分支。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 布局族「四层组合」契约(Flex/Row+Col/Stagger/断点阶梯);共享地基 themes/responsive.ts + breakpoints.ts 为站点编译口直用载体(Link/grid/伪元素族)的真实依赖,本次不动;卡内 Row/Col/Stagger 族段落与替换词汇表「分栏 → Row/Col、错峰入场 → Stagger」需退役收口。\n  - 适用 scope: packages/components/{row,col,stagger}/(删),packages/components/themes/*(保留)\n- shadow-docs/knowledge/component-standard.md\n  - 当前结论: 结构守卫棘轮——目录删除=动态扫描自然出账,但 baseline 登记项随文件删除须同步除名防「已修好未红」;row/col/stagger 现登记于 missing-types/dual-export/styles-inline 三名单。\n  - 适用 scope: packages/components/test/structure-baseline.json\n\n## 决策\n- **选型:** 方案 A——三目录整删 + baseline/文本引用/AGENTS.md/知识卡五面联动,复刻五组件退役同型链路。\n- **对比方案:** 方案 B(删 Row/Col、留 Stagger)——Stagger 同样零消费,且其组合承诺(as={Row})随 Row 消失半边;保留=制造新的零消费结构,违背退役动机段「保留=持续误读」原则,否决。方案 C(移入 _graveyard 观察期)——前例已否决(违反结构守卫语义),否决。\n- **理由:** 零消费已由三形态 grep 穷尽证死;地基(Flex/编译口/阶梯)完整保留,删除不损失任何未来能力,仅损失薄壳代码本身,而 git history 承载之。\n\n## 任务\n### Phase 1 — 删除与联动同步\n\n- [ ] 1.1 删除 `packages/components/row/`、`packages/components/col/`、`packages/components/stagger/` 三目录整删(含各自 index.tsx/readme.md/index.test.mjs,合计 557 行;布局族守卫 40 例 → 22 例)\n- [ ] 1.2 `packages/components/test/structure-baseline.json` — 三名单(missing-types/dual-export/styles-inline)移除 row/col/stagger 登记项(flex/cursor 等其余登记原样),运行 structure 守卫确认绿\n- [ ] 1.3 `packages/components/layout-typecheck.test.mjs` — 首行域注释更新(去 row+col+stagger 字样)\n- [ ] 1.4 `packages/components/flex/index.tsx` — :174 注释「让位给 @wuh.site/components/row 的栅格 Row」改为历史事实表述(去悬空包指针)\n- [ ] 1.5 `packages/components/flex/readme.md` — :63「方向别名归 @wuh.site/components/row」同步去悬空引用\n- [ ] 1.6 `AGENTS.md` — 已实现组件清单去除 `Row`/`Col`(12 分栏栅格)与 `Stagger`(错峰入场)两项,退役名单注释同步;「布局族契约见 layout-components 卡」指向保留\n\n### Phase 2 — 知识收口\n\n- [ ] 2.1 `shadow-docs/knowledge/layout-components.md` — scope 去除三目录;当前结论「四层组合」收成「Flex 分布原语 + themes 编译口」双层;删 Row/Col/Stagger 族段落;替换词汇表「分栏 → Row/Col、错峰入场 → Stagger」改为退役注记;keywords 收敛;source 追加本 change;verified 行按实际重验更新(守卫 40→22)\n- [ ] 2.2 `shadow-docs/knowledge/component-standard.md` — :37 过渡形态现存名单「row/col/flex/stagger 等」收窄(按删后 baseline 实际)\n\n### Phase 3 — 回归(S 级:结构、引用、构建)\n\n- [ ] 3.1 残留引用扫描:全仓 grep `components/(row|col|stagger)` 与相对 `'../(row|col|stagger)'` 与 JSX `<Row|<Col|<Stagger`(排除 node_modules/自身历史/archive) = 0 命中\n- [ ] 3.2 根 `pnpm exec tsc --noEmit` RC=0(漏引用必红,删除类最强兜底);`pnpm run lint:next` 0/0;`pnpm build:next`(SGN-012 直调配方 `apps/site/node_modules/.bin/next build`)RC=0 全路由出\n- [ ] 3.3 守卫网:structure 18 例、breakpoint-raw-scan 6 例、布局族余下 22 例(responsive 10+spacing 3+flex 8+layout typecheck guard)、hooks 两波 20 例全绿;site 名集基线 diff `comm -23` 空(零新增红,SGN-011 法)\n\n## 补充\n全仓三形态 grep 证死三组件自创建零消费;三目录整删(557 行)+baseline/守卫注释/flex 文本引用/AGENTS.md/知识卡联动;共享地基(Flex/responsive 编译口/阶梯)保留。完整 brief:shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md\n\n完整 brief：shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261014-chore-layout-grid-retirement\",\"type\":\"chore\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "chore"
      ]
    },
    "commit": {
      "files": [
        "shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md",
        "shadow-docs/signals.md"
      ],
      "message": "docs(signals): SGN-006 命中+1、SGN-016 新录 canary 错误签名纪律"
    },
    "release": {
      "files": [
        "AGENTS.md",
        "packages/components/col",
        "packages/components/flex/index.tsx",
        "packages/components/flex/readme.md",
        "packages/components/layout-typecheck.test.mjs",
        "packages/components/row",
        "packages/components/stagger",
        "packages/components/test/structure-baseline.json",
        "packages/components/tsconfig.layout.guard.json",
        "shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md",
        "shadow-docs/knowledge/component-standard.md",
        "shadow-docs/knowledge/layout-components.md",
        "shadow-docs/signals.md"
      ],
      "message": "chore(components): retire zero-consumption Row/Col/Stagger layout family",
      "title": "chore(components): retire zero-consumption Row/Col/Stagger layout family",
      "body": "## 变更\n- Row/Col/Stagger 三目录整删(自创建起全仓零消费,三形态 grep 证死;合计 557 行,布局族守卫 40→22)\n- 联动同步:structure-baseline 三名单除名(missing-types/dual-export/styles-inline)、layout-typecheck 守卫域注释与 tsconfig include 死 glob 三条移除、flex index/readme 悬空包指针改写为历史事实、AGENTS.md 组件清单出账(退役注释留档)\n- 知识收口:layout-components 卡「四层组合」收成 Flex+编译口双层(栅格段改退役注记,重写契约要点留档)、component-standard 过渡形态名单收窄\n- 保留不动:themes/responsive 编译口、RESPONSIVE_LADDER、spacing、OFF_LADDER 登记制\n\n## 影响\n- 行为/触发面变化:无(被删组件无任何页面/组件消费;desktop 同名 Row 为本地 styled 定义)\n- 将来再现分栏/错峰需求:从 git history 拣回或照卡内退役注记契约重写\n\n## 验证\n- 守卫网:structure 18/18、breakpoint-raw-scan 6/6、布局族 22/22、hooks 两波 20/20 全绿\n- 根 tsc RC=0、lint:next 0/0、next build RC=0 全路由(SGN-012 直调)\n- 残留引用三形态 0 命中;site 名集基线 diff head 独有=空(零新增红,SGN-011 法;基线独有 5 项为解包树缺 @wuh.site/core 依赖伪影)\n\nCloses #539\nbrief: shadow-docs/changes/20261014-chore-layout-grid-retirement/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "布局族契约双层化、栅格三目录退役事实、过渡形态名单收窄均已按删后实测落卡（守卫 40→22、structure 18 复跑绿）；SGN-006 命中+1 与 SGN-016 新录随本 change 写回"
  }
}
---

# Row/Col/Stagger 布局零消费组件退役

## 动机

上一轮组件退役(20261014-chore-dead-components-retirement)判定分组的遗留候选「Row/Col/Stagger 删除或补消费者」,经用户复核裁决删除。复核证据链:

- 全仓三形态 grep(包路径/相对路径/JSX,覆盖 apps/site、apps/console、apps/desktop、packages)三组件**自创建起零消费**——`apps/desktop` 的 `<Row>` 命中为本地 styled.div(Heatmap.tsx:58 等),与组件库无关;site 组件展示页(ContactCard)用的也是 Flex。
- 布局迁移五批次(#495/#504 + 批次3-5 + 组件库清扫)实证:每一处存量 `@media` 替换场景都自然落在 Flex 或 `responsive()` 编译口上(连 music 九宫格也是 grid 载体+编译口),12 分栏词汇在站点布局语法中从未出现真实需求。
- 真正值钱的共享地基(themes/responsive.ts 编译口、RESPONSIVE_LADDER、spacing、breakpoints/OFF_LADDER)**全部保留不动**;Row/Col/Stagger 只是 grid-column span 与 nth-child 动效的薄壳,git history 即备份,将来出现分栏版面从历史拣回或照契约重写均约一小时。
- 保留的隐性成本=持续误读「已实现组件」清单(退役五组件的同一教训)+18 例守卫维护无人消费的分支。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更=无(零消费者,删除面由类型系统兜底);触及面=3 目录整删 + 6 处联动同步(baseline/2 处 flex 文本引用/1 处守卫注释/AGENTS.md/2 张知识卡);可发现性=tsc 全仓 + structure/breakpoint 守卫直接覆盖,无静默风险。
- **期望验证深度:** code-read + 守卫回归 + 根 tsc/build(S 级无 runtime 观察点——被删组件本无页面,同五组件退役先例)。

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 布局族「四层组合」契约(Flex/Row+Col/Stagger/断点阶梯);共享地基 themes/responsive.ts + breakpoints.ts 为站点编译口直用载体(Link/grid/伪元素族)的真实依赖,本次不动;卡内 Row/Col/Stagger 族段落与替换词汇表「分栏 → Row/Col、错峰入场 → Stagger」需退役收口。
  - 适用 scope: packages/components/{row,col,stagger}/(删),packages/components/themes/*(保留)
- shadow-docs/knowledge/component-standard.md
  - 当前结论: 结构守卫棘轮——目录删除=动态扫描自然出账,但 baseline 登记项随文件删除须同步除名防「已修好未红」;row/col/stagger 现登记于 missing-types/dual-export/styles-inline 三名单。
  - 适用 scope: packages/components/test/structure-baseline.json

## 决策

- **选型:** 方案 A——三目录整删 + baseline/文本引用/AGENTS.md/知识卡五面联动,复刻五组件退役同型链路。
- **对比方案:** 方案 B(删 Row/Col、留 Stagger)——Stagger 同样零消费,且其组合承诺(as={Row})随 Row 消失半边;保留=制造新的零消费结构,违背退役动机段「保留=持续误读」原则,否决。方案 C(移入 _graveyard 观察期)——前例已否决(违反结构守卫语义),否决。
- **理由:** 零消费已由三形态 grep 穷尽证死;地基(Flex/编译口/阶梯)完整保留,删除不损失任何未来能力,仅损失薄壳代码本身,而 git history 承载之。

## 任务

### Phase 1 — 删除与联动同步

- [x] 1.1 删除 `packages/components/row/`、`packages/components/col/`、`packages/components/stagger/` 三目录整删(含各自 index.tsx/readme.md/index.test.mjs,合计 557 行;布局族守卫 40 例 → 22 例)
- [x] 1.2 `packages/components/test/structure-baseline.json` — 三名单(missing-types/dual-export/styles-inline)移除 row/col/stagger 登记项(flex/cursor 等其余登记原样),运行 structure 守卫确认绿
- [x] 1.3 `packages/components/layout-typecheck.test.mjs` — 首行域注释更新(去 row+col+stagger 字样)
- [x] 1.4 `packages/components/flex/index.tsx` — :174 注释「让位给 @wuh.site/components/row 的栅格 Row」改为历史事实表述(去悬空包指针)
- [x] 1.5 `packages/components/flex/readme.md` — :63「方向别名归 @wuh.site/components/row」同步去悬空引用
- [x] 1.6 `AGENTS.md` — 已实现组件清单去除 `Row`/`Col`(12 分栏栅格)与 `Stagger`(错峰入场)两项,退役名单注释同步;「布局族契约见 layout-components 卡」指向保留

### Phase 2 — 知识收口

- [x] 2.1 `shadow-docs/knowledge/layout-components.md` — scope 去除三目录;当前结论「四层组合」收成「Flex 分布原语 + themes 编译口」双层;删 Row/Col/Stagger 族段落;替换词汇表「分栏 → Row/Col、错峰入场 → Stagger」改为退役注记;keywords 收敛;source 追加本 change;verified 行按实际重验更新(守卫 40→22)
- [x] 2.2 `shadow-docs/knowledge/component-standard.md` — :37 过渡形态现存名单「row/col/flex/stagger 等」收窄(按删后 baseline 实际)

### Phase 3 — 回归(S 级:结构、引用、构建)

- [x] 3.1 残留引用扫描:全仓 grep `components/(row|col|stagger)` 与相对 `'../(row|col|stagger)'` 与 JSX `<Row|<Col|<Stagger`(排除 node_modules/自身历史/archive) = 0 命中
- [x] 3.2 根 `pnpm exec tsc --noEmit` RC=0(漏引用必红,删除类最强兜底);`pnpm run lint:next` 0/0;`pnpm build:next`(SGN-012 直调配方 `apps/site/node_modules/.bin/next build`)RC=0 全路由出
- [x] 3.3 守卫网:structure 18 例、breakpoint-raw-scan 6 例、布局族余下 22 例(responsive 10+spacing 3+flex 8+layout typecheck guard)、hooks 两波 20 例全绿;site 名集基线 diff `comm -23` 空(零新增红,SGN-011 法)

## 结果

- 实际耗时: propose→apply 单会话约 40 分钟
- 偏差登记: 联动文件新增 `packages/components/tsconfig.layout.guard.json`——守卫域 tsconfig 的 include 硬列 `row/**/*.tsx`/`col/**/*.tsx`/`stagger/**/*.tsx` 三条 glob(tsc 对空 glob 静默忽略,构成守卫注释之外的死引用,残留正则扫描模式 `components/(row|…)` 亦探不到);与 task 1.3 同源,三行移除,include 收为 themes+flex。
- 验证:
  - 守卫网全绿:structure 18(含「台账与现状一致」断言——baseline 三名单除名正确)、breakpoint-raw-scan 6、布局族 22(responsive 10+spacing 3+flex 8+layout-typecheck guard 1,40→22 与预期吻合)、hooks 两波 20(event 9+wave2 11)。
  - 根 `tsc --noEmit` RC=0、`lint:next` 0/0(124 文件)、`next build` RC=0 全路由出(SGN-012 直调 `apps/site/node_modules/.bin/next build`)。
  - 残留扫描:包路径形态 0、相对导入形态 0;JSX `<Row>` 命中仅 apps/desktop 五处,逐一核实为本地 styled 定义(Heatmap/CapsulePanel/SettingRow/PickerShell 局部 const Row,与组件库无关)。
  - 名集基线 diff(SGN-011 法,base=main@2795ab1 解树):基线 31 红 vs head 26 红,`comm -23` head 独有 = **空(零新增红)**;基线独有 5 项(seo-p1/p14/p17 文件级折叠 + 2 条 sitemap 测试级)实测原因为解包树缺 workspace 链接 `ERR_MODULE_NOT_FOUND @wuh.site/core`,伪影非修复,类别与本轮无关。

## 知识评估

- **预期影响:** 更新 2 卡——`layout-components.md`(族契约双层化,主任务 2.1)、`component-standard.md`(过渡形态名单收窄,任务 2.2);`AGENTS.md` 为仓库文档非 Knowledge。
- **候选卡片:** shadow-docs/knowledge/layout-components.md, shadow-docs/knowledge/component-standard.md
- **理由:** 卡内消费现实随删除改变,不更新即持续误导;两卡更新均在 apply/review 阶段以删后实际重验落笔,propose 不写卡。
