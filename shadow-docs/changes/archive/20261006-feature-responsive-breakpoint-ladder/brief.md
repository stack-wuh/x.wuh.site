---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-responsive-breakpoint-ladder",
  "type": "feature",
  "scope": "packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20261006-feature-responsive-breakpoint-ladder",
  "files": [
    "packages/components/col/index.test.mjs",
    "packages/components/col/index.tsx",
    "packages/components/col/readme.md",
    "packages/components/flex/index.test.mjs",
    "packages/components/flex/index.tsx",
    "packages/components/flex/readme.md",
    "packages/components/flex/specs.tsx",
    "packages/components/row/index.test.mjs",
    "packages/components/row/index.tsx",
    "packages/components/row/readme.md",
    "packages/components/stagger/readme.md",
    "packages/components/themes/responsive.test.mjs",
    "packages/components/themes/responsive.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 488,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/488",
    "pullRequest": 491,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/491"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "560639d6ec1121b416555a350774dbbd7dc4bc3e",
    "verifiedAt": "2026-10-06T12:53:46.705Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:491",
    "planHash": "9263b44d8b9ce206fd16c68a7f5791401c4f02b77d1cd86a7984ba678bb577b2",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 断点阶梯扩档：TResponsive 两槽升四档 [base, sm, md, lg]",
      "titleRaw": "断点阶梯扩档：TResponsive 两槽升四档 [base, sm, md, lg]",
      "supplement": "布局组件族的 [base, tablet] 两槽契约被首批站点消费证伪——真实布局切换集中在 ≤520/≤640 负声明档。本 change 扩为四档正向阶梯（边界 521/641/1024 由 BREAKPOINTS +1 派生），组件零消费者窗口期完成契约修订，为站点替换批铺路。详细方案见 shadow-docs/changes/20261006-feature-responsive-breakpoint-ladder/brief.md",
      "body": "## 动机\n布局组件族（20261006-feature-responsive-layout-components，已归档）确立的断点数组只开两槽 `[base, tablet]`（切换线 1024）。首批站点消费盘点（blog 列表 / about / ContactCard，11 处 @media）证明：真实布局切换集中在 **≤520 与 ≤640 负声明档**——两槽契约吃不下，「超窄档由 clamp 兜底」的假设对列数/换行/显隐不成立。经 propose 会话裁决：组件先扩档，站点替换批随后独立提案（方案 α + 767 收编）。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 两槽契约「只开两槽：超窄 small 档由 clamp 间距与基线堆叠承担，布局 props 不开第三槽」——**首批消费证明该结论不完整**，本 change 即其修订\n  - 适用 scope: packages/components/themes/responsive.ts 及 flex/row/col\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: BREAKPOINTS 三档语义常量（mobile:640 max / small:520 max / tablet:1024 min），禁新裸断点数值——阶梯边界必须由常量 +1 派生，不落新字面量\n  - 适用 scope: packages/components/themes\n- norms/ui-patterns.md\n  - 当前结论: 响应式三档（移动/平板/桌面）必须覆盖；本 change 恰是把移动档细分（520/640）纳入契约\n  - 适用 scope: 全部布局组件\n- norms/tdd-verification.md / norms/code-style-packages.md\n  - 当前结论: M 级绿灯测试 + 走查；改共享包必须检查全部 workspace 消费者的类型/构建/运行时影响（当前消费者为空集，tsc 全仓兜底）\n  - 适用 scope: 全流程\n\n## 决策\n- **选型:** 方案 α——四档正向阶梯数组。`TResponsive<T> = T | [T] | [T, T?] | [T, T?, T?] | [T, T?, T?, T?]`，槽位语义按视口升序：\n  - index0 `base`：0+ 基线（含超窄段）\n  - index1 `sm`：`min-width: BREAKPOINTS.small + 1`（521，即原 ≤520 负声明档的转正）\n  - index2 `md`：`min-width: BREAKPOINTS.mobile + 1`（641，原 ≤640 档转正）\n  - index3 `lg`：`min-width: BREAKPOINTS.tablet`（1024，原 tablet 槽语义迁移至此）\n  - `responsive()` 按非 undefined 槽生成基线声明 + 至多三个 media 块；缺位槽顺延（sparse 槽跳过，不继承）——**注意**：与两槽版「tablet 缺位沿 base」同理，某槽 undefined 时该 media 块不生成、前一较低生效档延续。\n- **对比方案:** β 语义键对象（`{ small, mobile, tablet }`）——与存量负声明逐字对齐零视觉裁量，但违背已批准的数组偏好且 API 冗长，未选（用户选定 α）。\n- **理由:** 站点三处真实切换（≤640 单列、≤520 wrap/margin）等价翻译为升序阶梯；组件零消费者窗口期改契约无迁移成本；767 野断点按 design-system「随触碰逐步收敛」规则收编至 641 档（641~767 带时间轴将显示，属后批站点变更的裁决，本卡不落地）。\n- **边界事实:** index1 语义变更（原 `[base, tablet]` 第二槽=1024 → 新第二槽=521）。零消费者 + 同批修订全部文档/守卫/卡片，无残留风险。\n\n## 任务\n### Phase 1 — 契约本体\n- [ ] 阶梯实现 — `packages/components/themes/responsive.ts` — TResponsive 四槽类型；边界由 BREAKPOINTS +1 派生（禁新裸数值）；`responsive()` 生成至多 3 个 media 块；`responsiveSlots`/`hasTabletSlot` 泛化为 `ladderSlots`/`hasUpperSlot` 或删除（以守卫为准） — `packages/components/themes/responsive.ts`\n- [ ] 阶梯单测 — `packages/components/themes/responsive.test.mjs` — 四档编译：单标量/一槽/两槽/三槽/四槽、sparse undefined 槽跳过、边界字符串断言（521/641/1024px 均出自常量派生）、两槽旧用法 `[base, lg]` 语义迁移验证\n### Phase 2 — 消费面同步（组件包内）\n- [ ] Flex 类型跟随 — `packages/components/flex/specs.tsx` `packages/components/flex/readme.md` — props 类型经泛型自动四档；注释与文档示例改写为阶梯语义\n- [ ] Row/Col 文档跟随 — `packages/components/row/readme.md` `packages/components/col/readme.md` `packages/components/stagger/readme.md` — `[base, tablet]` 示例改 `[base, sm, md, lg]` 阶梯；row/col index.tsx 仅当 tsc 报缺口才动\n- [ ] 守卫更新 — `packages/components/flex/index.test.mjs` `packages/components/row/index.test.mjs` `packages/components/col/index.test.mjs` — 纪律断言（剥注释零裸断点、禁 @media 字面量）适配新边界派生写法；responsive.ts 允许出现由 +1 派生的表达式\n### Phase 3 — 验证与知识\n- [ ] 全量验证 — 根 tsc --noEmit + 全部 36+ 守卫 + oxlint，贴命令输出；grep 确认无组件源码残留两槽旧语义表述\n- [ ] 知识修订 — `shadow-docs/knowledge/layout-components.md` — 「只开两槽/超窄不开第三槽」结论改写为四档阶梯契约（本 change 为 source；propose 阶段不写卡，release 落实）\n\n## 补充\n布局组件族的 [base, tablet] 两槽契约被首批站点消费证伪——真实布局切换集中在 ≤520/≤640 负声明档。本 change 扩为四档正向阶梯（边界 521/641/1024 由 BREAKPOINTS +1 派生），组件零消费者窗口期完成契约修订，为站点替换批铺路。详细方案见 shadow-docs/changes/20261006-feature-responsive-breakpoint-ladder/brief.md\n\n完整 brief：shadow-docs/changes/20261006-feature-responsive-breakpoint-ladder/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-responsive-breakpoint-ladder\",\"type\":\"feature\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-responsive-breakpoint-ladder/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "packages/components/col/index.test.mjs",
        "packages/components/col/index.tsx",
        "packages/components/col/readme.md",
        "packages/components/flex/readme.md",
        "packages/components/flex/specs.tsx",
        "packages/components/row/index.tsx",
        "packages/components/row/readme.md",
        "packages/components/stagger/readme.md",
        "packages/components/themes/responsive.test.mjs",
        "packages/components/themes/responsive.ts",
        "shadow-docs/changes/20261006-feature-responsive-breakpoint-ladder/brief.md",
        "shadow-docs/knowledge/layout-components.md"
      ],
      "message": "feat(components): 断点阶梯扩档 TResponsive 两槽升四档 [base,sm,md,lg] (#488)",
      "title": "[feature] 断点阶梯扩档：TResponsive 两槽升四档 [base, sm, md, lg]",
      "body": "Closes #488\n\n完整 brief：shadow-docs/changes/20261006-feature-responsive-breakpoint-ladder/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "main 复核（560639d，#491 代码已随 v1.4.66 部署 success）：四档阶梯契约卡已由 #491 建立、并经 #496 首消费补迁移备忘。本次仅重钉 verifiedCommit 以过归档门禁，知识动作维持更新。"
  }
}
---

# 断点阶梯扩档——TResponsive 两槽升四档 [base, sm, md, lg]

## 动机

布局组件族（20261006-feature-responsive-layout-components，已归档）确立的断点数组只开两槽 `[base, tablet]`（切换线 1024）。首批站点消费盘点（blog 列表 / about / ContactCard，11 处 @media）证明：真实布局切换集中在 **≤520 与 ≤640 负声明档**——两槽契约吃不下，「超窄档由 clamp 兜底」的假设对列数/换行/显隐不成立。经 propose 会话裁决：组件先扩档，站点替换批随后独立提案（方案 α + 767 收编）。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——改 `TResponsive` 公开 API 形状，但组件族**零消费者**（上一批刚建、未接入站点），无在用契约被破坏；触及面——仅 packages/components 共享包内类型与 helper，flex/row/col 源码因泛型自动兼容大概率零改动；可发现性——阶梯单测 + 纪律守卫即时可验。三要素均局部，维持 M。
- **期望验证深度:** unit

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 两槽契约「只开两槽：超窄 small 档由 clamp 间距与基线堆叠承担，布局 props 不开第三槽」——**首批消费证明该结论不完整**，本 change 即其修订
  - 适用 scope: packages/components/themes/responsive.ts 及 flex/row/col
- shadow-docs/knowledge/design-system.md
  - 当前结论: BREAKPOINTS 三档语义常量（mobile:640 max / small:520 max / tablet:1024 min），禁新裸断点数值——阶梯边界必须由常量 +1 派生，不落新字面量
  - 适用 scope: packages/components/themes
- norms/ui-patterns.md
  - 当前结论: 响应式三档（移动/平板/桌面）必须覆盖；本 change 恰是把移动档细分（520/640）纳入契约
  - 适用 scope: 全部布局组件
- norms/tdd-verification.md / norms/code-style-packages.md
  - 当前结论: M 级绿灯测试 + 走查；改共享包必须检查全部 workspace 消费者的类型/构建/运行时影响（当前消费者为空集，tsc 全仓兜底）
  - 适用 scope: 全流程

## 决策

- **选型:** 方案 α——四档正向阶梯数组。`TResponsive<T> = T | [T] | [T, T?] | [T, T?, T?] | [T, T?, T?, T?]`，槽位语义按视口升序：
  - index0 `base`：0+ 基线（含超窄段）
  - index1 `sm`：`min-width: BREAKPOINTS.small + 1`（521，即原 ≤520 负声明档的转正）
  - index2 `md`：`min-width: BREAKPOINTS.mobile + 1`（641，原 ≤640 档转正）
  - index3 `lg`：`min-width: BREAKPOINTS.tablet`（1024，原 tablet 槽语义迁移至此）
  - `responsive()` 按非 undefined 槽生成基线声明 + 至多三个 media 块；缺位槽顺延（sparse 槽跳过，不继承）——**注意**：与两槽版「tablet 缺位沿 base」同理，某槽 undefined 时该 media 块不生成、前一较低生效档延续。
- **对比方案:** β 语义键对象（`{ small, mobile, tablet }`）——与存量负声明逐字对齐零视觉裁量，但违背已批准的数组偏好且 API 冗长，未选（用户选定 α）。
- **理由:** 站点三处真实切换（≤640 单列、≤520 wrap/margin）等价翻译为升序阶梯；组件零消费者窗口期改契约无迁移成本；767 野断点按 design-system「随触碰逐步收敛」规则收编至 641 档（641~767 带时间轴将显示，属后批站点变更的裁决，本卡不落地）。
- **边界事实:** index1 语义变更（原 `[base, tablet]` 第二槽=1024 → 新第二槽=521）。零消费者 + 同批修订全部文档/守卫/卡片，无残留风险。

## 任务

### Phase 1 — 契约本体
- [x] 阶梯实现 — `packages/components/themes/responsive.ts` — TResponsive 四槽类型；边界由 BREAKPOINTS +1 派生（禁新裸数值）；`responsive()` 生成至多 3 个 media 块；`responsiveSlots`/`hasTabletSlot` 泛化为 `ladderSlots`/`hasUpperSlot` 或删除（以守卫为准） — `packages/components/themes/responsive.ts`
- [x] 阶梯单测 — `packages/components/themes/responsive.test.mjs` — 四档编译：单标量/一槽/两槽/三槽/四槽、sparse undefined 槽跳过、边界字符串断言（521/641/1024px 均出自常量派生）、两槽旧用法 `[base, lg]` 语义迁移验证
### Phase 2 — 消费面同步（组件包内）
- [x] Flex 类型跟随 — `packages/components/flex/specs.tsx` `packages/components/flex/readme.md` — props 类型经泛型自动四档；注释与文档示例改写为阶梯语义
- [x] Row/Col 文档跟随 — `packages/components/row/readme.md` `packages/components/col/readme.md` `packages/components/stagger/readme.md` — `[base, tablet]` 示例改 `[base, sm, md, lg]` 阶梯；row/col index.tsx 仅当 tsc 报缺口才动
- [x] 守卫更新 — `packages/components/flex/index.test.mjs` `packages/components/row/index.test.mjs` `packages/components/col/index.test.mjs` — 纪律断言（剥注释零裸断点、禁 @media 字面量）适配新边界派生写法；responsive.ts 允许出现由 +1 派生的表达式
### Phase 3 — 验证与知识
- [x] 全量验证 — 根 tsc --noEmit + 全部 36+ 守卫 + oxlint，贴命令输出；grep 确认无组件源码残留两槽旧语义表述
- [x] 知识修订 — `shadow-docs/knowledge/layout-components.md` — 「只开两槽/超窄不开第三槽」结论改写为四档阶梯契约（本 change 为 source；propose 阶段不写卡，release 落实）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新（修订，非新增）
- **候选卡片:** `shadow-docs/knowledge/layout-components.md`
- **理由:** 该卡「断点数组语法」段的槽位结论被首批消费证伪，属同事实的完整化修订；原位更新并追加本 brief 为第二 source，verified 更新、depth 维持 unit（runtime 目检仍随首个站点消费 change 升档）。
