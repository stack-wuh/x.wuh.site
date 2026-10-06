---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-flex-hidden-primitives",
  "type": "feature",
  "scope": "packages/components",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "packages/components/flex/index.test.mjs",
    "packages/components/flex/index.tsx",
    "packages/components/flex/readme.md",
    "packages/components/flex/specs.tsx",
    "packages/components/flex/tsconfig.guard.json",
    "packages/components/flex/typecheck.test.mjs",
    "shadow-docs/knowledge/layout-components.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 499,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/499",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "ef62462d270b95d38a5c407969c5982cbb7227df",
    "verifiedAt": "2026-10-06T16:14:57.236Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:499",
    "planHash": "cdd0fc5b6cadcdfee21b3f69695ff8be844fa478fde388e5d0cb7085d39442ca",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] Flex 阶梯响应式扩展：hidden 与响应式 width/height",
      "titleRaw": "Flex 阶梯响应式扩展：hidden 与响应式 width/height",
      "supplement": "站点替换批·1 暴露两处现成 Flex 吃不了的布局 @media（blog width:100% 换行、about display:none 显隐）。本 change 给 Flex 补响应式 hidden 与响应式 width/height 两个原语，为下一站点批铺路。契约纯追加+加宽（零消费者），沿用 #491 方式；新增 flex 域 tsconfig.guard+typecheck 拉入 CI 类型门。详见 shadow-docs/changes/20261006-feature-flex-hidden-primitives/brief.md",
      "body": "## 动机\n站点替换批·1（#496）首次真实消费四档阶梯，暴露两处「现成 Flex 无法干净承接」的 @media：blog `PostTags` `@≤520 width:100%`（换行占满）、about `TimelineTrack` `@≤767 display:none`（响应式显隐）。这两处属布局类，但阶梯契约里没有对应原语——前批 review 明确记为「后批组件扩档候选」。本 change 补上，作为**下一站点批·2 的前置依赖**（把 #5/#7 一并接掉），零消费者窗口期继续按 #491 的方式改契约。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`、缺位跳过、低档媒体级联延续；「顶层数组一律=阶梯槽，非对称盒式简写走 CSS 字符串」；本 change 补 `hidden`/响应式 `width` 约束\n  - 适用 scope: packages/components/flex/themes\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 断点只用 BREAKPOINTS 语义常量派生；gap/padding/margin 经 getSpacingValue 走 spaces token——`width` 复用同一 lengthValue 通路，但需放行 CSS 关键字（`auto/fit-content/max-content/min-content`），避免被误拼成 `autopx`\n  - 适用 scope: packages/components/themes, packages/components/flex\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 组件域守卫配方 `tsconfig.guard.json` + `typecheck.test.mjs`（audio-player 首发）；根 tsc 不覆盖 packages/components——本 change 为 flex 域单独立 guard\n  - 适用 scope: packages/components/flex\n- norms/code-style-frontend.md\n  - 当前结论: transient props `$` 前缀；亮/暗与 reduced-motion 全覆盖\n  - 适用 scope: 本包\n- norms/ui-patterns.md\n  - 当前结论: 只替换布局类；本 change 只加显隐/尺寸布局原语，不涉排版\n  - 适用 scope: 全批\n\n## 决策\n- **选型:** Flex-only 最小扩档（YAGNI；Row/Col/Stagger 无站点需求，后批需要时再补，模式一致）：\n  1. `IFlexProps` 新增 `hidden?: TResponsive<boolean>`。\n  2. `IFlexProps.width` / `IFlexProps.height` 由 `string | number` 升 `TResponsive<string | number>`。\n  3. `lengthValue` 放行 CSS 关键字：`auto | fit-content | max-content | min-content`（以及 `%` 已在 `getSpacingValue` 内正则直通）；其余保持既有 px 折算 / spaces token 语义。\n  4. Flex 模板中 `hidden` 编译放**最后**（`display: none` / 按 `$inline` 恢复 `flex`/`inline-flex`），媒体级联覆盖默认 display——`hidden=[true,,false]` 即「基线隐藏、md 复显」，等价 `@media(min-width:641)` 反转。\n  5. 新增 `packages/components/flex/tsconfig.guard.json` + `packages/components/flex/typecheck.test.mjs`（audio-player 同法，域内错误清零），把 Flex 也拉进 CI 类型门。\n- **对比方案:** (B) 通用 `display?: TResponsive<'none'|'flex'|'inline-flex'|...>` 词汇更宽但每处要写恢复态、易错；(C) 另立 `<Hidden>` 组件包一层 DOM，破坏「Flex 直给 props」契约。二者均拒。\n- **理由:** 阶梯「离散切换才用数组槽」原则下，`hidden` 与 `width` 都是**离散**开关（显/隐、整行/自动），正合阶梯槽位语义；恢复值由 `$inline` 已知态内推，调用点零样板。767→641 收编属 #491 站点批已授权的野断点收敛原则延伸。\n\n## 任务\n### Phase 1 — 契约本体（packages/components/flex）\n- [ ] specs 类型扩展 — `packages/components/flex/specs.tsx` — 增 `hidden?: TResponsive<boolean>`；`width/height` 升 `TResponsive<string|number>`；注释说明「基线=窄端首槽、hidden=true display:none、false 恢复 flex/inline-flex」\n- [ ] 实现 — `packages/components/flex/index.tsx` — transient `$hidden/$width/$height`；`lengthValue` 放行 CSS 关键字；hidden 编译段放最后；`FLEX_ONLY_KEYS` 增补\n- [ ] 守卫 — `packages/components/flex/index.test.mjs` — 断言 `hidden` 段位于模板尾部、`lengthValue` 含关键字白名单、`responsive(props.$width` 编译口、无 @media 字面量与裸断点（剥注释扫描）\n- [ ] 域内类型 guard — `packages/components/flex/tsconfig.guard.json` `packages/components/flex/typecheck.test.mjs` — 照 audio-player 配方，Flex 目录 tsc 域内错误清零\n\n### Phase 2 — 文档与知识\n- [ ] Flex 文档 — `packages/components/flex/readme.md` — 新增「响应式显隐 hidden / 响应式 width」段 + `[true,,false]` 稀疏槽用法示例（TimelineTrack 场景）+ `width=['100%','auto']` 换行占满示例（PostTags 场景）\n- [ ] 卡同步 — `shadow-docs/knowledge/layout-components.md` — 执行约束补：Flex 提供 `hidden`（媒体级联复显）、`width/height` 响应式（含 CSS 关键字直通）；Row/Col/Stagger 未提供，需要时按同法追加\n\n### Phase 3 — 验证\n- [ ] 全量 — layout 域全套守卫（含新增 flex typecheck）+ 根 tsc + 全组件套件回归 + oxlint，贴命令输出\n\n## 补充\n站点替换批·1 暴露两处现成 Flex 吃不了的布局 @media（blog width:100% 换行、about display:none 显隐）。本 change 给 Flex 补响应式 hidden 与响应式 width/height 两个原语，为下一站点批铺路。契约纯追加+加宽（零消费者），沿用 #491 方式；新增 flex 域 tsconfig.guard+typecheck 拉入 CI 类型门。详见 shadow-docs/changes/20261006-feature-flex-hidden-primitives/brief.md\n\n完整 brief：shadow-docs/changes/20261006-feature-flex-hidden-primitives/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-flex-hidden-primitives\",\"type\":\"feature\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-flex-hidden-primitives/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "packages/components/flex/index.test.mjs",
        "packages/components/flex/index.tsx",
        "packages/components/flex/readme.md",
        "packages/components/flex/specs.tsx",
        "shadow-docs/changes/20261006-feature-flex-hidden-primitives/brief.md",
        "shadow-docs/knowledge/layout-components.md"
      ],
      "message": "feat(components): Flex 响应式 hidden + width/height 阶梯原语 (#499)",
      "title": "[feature] Flex 阶梯响应式扩展：hidden 与响应式 width/height",
      "body": "Closes #499\n\n完整 brief：shadow-docs/changes/20261006-feature-flex-hidden-primitives/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "Flex 新增响应式 hidden 与 width/height 阶梯原语，补齐站点批暴露的显隐/换行占满缺口；四段卡更新（当前结论 Flex 段、执行约束迁移词汇行、source 追加本 brief、verified-scope）。验证：layout 域守卫 34/34、布局 typecheck guard 0 错（且此 guard 抓到 hidden 撞原生 HTML hidden 属性的真实 TS2769，已用解构剔除修复）、根 tsc 0 错、oxlint 0/0。"
  }
}
---

# Flex 阶梯响应式扩展——hidden 与响应式 width/height

## 动机

站点替换批·1（#496）首次真实消费四档阶梯，暴露两处「现成 Flex 无法干净承接」的 @media：blog `PostTags` `@≤520 width:100%`（换行占满）、about `TimelineTrack` `@≤767 display:none`（响应式显隐）。这两处属布局类，但阶梯契约里没有对应原语——前批 review 明确记为「后批组件扩档候选」。本 change 补上，作为**下一站点批·2 的前置依赖**（把 #5/#7 一并接掉），零消费者窗口期继续按 #491 的方式改契约。

## 复杂度评级

- **评级:** M
- **理由:** 契约——Flex props 面**纯追加**（`hidden`）+ **加宽**（`width/height` 由标量升 TResponsive），零消费者、无破坏性变更；触及面——`packages/components/flex` 共享包 + 站点侧无（本 change 只动组件包与卡）；可发现性——阶梯单测 + 域内 guard tsc + 既有语义守卫钉死。M。
- **期望验证深度:** unit

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 四档阶梯 `[base, sm?, md?, lg?]`、缺位跳过、低档媒体级联延续；「顶层数组一律=阶梯槽，非对称盒式简写走 CSS 字符串」；本 change 补 `hidden`/响应式 `width` 约束
  - 适用 scope: packages/components/flex/themes
- shadow-docs/knowledge/design-system.md
  - 当前结论: 断点只用 BREAKPOINTS 语义常量派生；gap/padding/margin 经 getSpacingValue 走 spaces token——`width` 复用同一 lengthValue 通路，但需放行 CSS 关键字（`auto/fit-content/max-content/min-content`），避免被误拼成 `autopx`
  - 适用 scope: packages/components/themes, packages/components/flex
- shadow-docs/knowledge/build-config.md
  - 当前结论: 组件域守卫配方 `tsconfig.guard.json` + `typecheck.test.mjs`（audio-player 首发）；根 tsc 不覆盖 packages/components——本 change 为 flex 域单独立 guard
  - 适用 scope: packages/components/flex
- norms/code-style-frontend.md
  - 当前结论: transient props `$` 前缀；亮/暗与 reduced-motion 全覆盖
  - 适用 scope: 本包
- norms/ui-patterns.md
  - 当前结论: 只替换布局类；本 change 只加显隐/尺寸布局原语，不涉排版
  - 适用 scope: 全批

## 决策

- **选型:** Flex-only 最小扩档（YAGNI；Row/Col/Stagger 无站点需求，后批需要时再补，模式一致）：
  1. `IFlexProps` 新增 `hidden?: TResponsive<boolean>`。
  2. `IFlexProps.width` / `IFlexProps.height` 由 `string | number` 升 `TResponsive<string | number>`。
  3. `lengthValue` 放行 CSS 关键字：`auto | fit-content | max-content | min-content`（以及 `%` 已在 `getSpacingValue` 内正则直通）；其余保持既有 px 折算 / spaces token 语义。
  4. Flex 模板中 `hidden` 编译放**最后**（`display: none` / 按 `$inline` 恢复 `flex`/`inline-flex`），媒体级联覆盖默认 display——`hidden=[true,,false]` 即「基线隐藏、md 复显」，等价 `@media(min-width:641)` 反转。
  5. 新增 `packages/components/flex/tsconfig.guard.json` + `packages/components/flex/typecheck.test.mjs`（audio-player 同法，域内错误清零），把 Flex 也拉进 CI 类型门。
- **对比方案:** (B) 通用 `display?: TResponsive<'none'|'flex'|'inline-flex'|...>` 词汇更宽但每处要写恢复态、易错；(C) 另立 `<Hidden>` 组件包一层 DOM，破坏「Flex 直给 props」契约。二者均拒。
- **理由:** 阶梯「离散切换才用数组槽」原则下，`hidden` 与 `width` 都是**离散**开关（显/隐、整行/自动），正合阶梯槽位语义；恢复值由 `$inline` 已知态内推，调用点零样板。767→641 收编属 #491 站点批已授权的野断点收敛原则延伸。

## 任务

### Phase 1 — 契约本体（packages/components/flex）
- [x] specs 类型扩展 — `packages/components/flex/specs.tsx` — 增 `hidden?: TResponsive<boolean>`；`width/height` 升 `TResponsive<string|number>`；注释说明「基线=窄端首槽、hidden=true display:none、false 恢复 flex/inline-flex」
- [x] 实现 — `packages/components/flex/index.tsx` — transient `$hidden/$width/$height`；`lengthValue` 放行 CSS 关键字；hidden 编译段放最后；`FLEX_ONLY_KEYS` 增补
- [x] 守卫 — `packages/components/flex/index.test.mjs` — 断言 `hidden` 段位于模板尾部、`lengthValue` 含关键字白名单、`responsive(props.$width` 编译口、无 @media 字面量与裸断点（剥注释扫描）
- [x] 域内类型 guard — `packages/components/flex/tsconfig.guard.json` `packages/components/flex/typecheck.test.mjs` — 照 audio-player 配方，Flex 目录 tsc 域内错误清零

### Phase 2 — 文档与知识
- [x] Flex 文档 — `packages/components/flex/readme.md` — 新增「响应式显隐 hidden / 响应式 width」段 + `[true,,false]` 稀疏槽用法示例（TimelineTrack 场景）+ `width=['100%','auto']` 换行占满示例（PostTags 场景）
- [x] 卡同步 — `shadow-docs/knowledge/layout-components.md` — 执行约束补：Flex 提供 `hidden`（媒体级联复显）、`width/height` 响应式（含 CSS 关键字直通）；Row/Col/Stagger 未提供，需要时按同法追加

### Phase 3 — 验证
- [x] 全量 — layout 域全套守卫（含新增 flex typecheck）+ 根 tsc + 全组件套件回归 + oxlint，贴命令输出

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/layout-components.md`（补 `hidden`/响应式 `width` 两条布局原语；Row/Col/Stagger 未提供，未来按需补）
- **理由:** Flex 组件契约新增两原语是跨变更长期事实（下批站点消费直接引此），属既有卡的完整化，非新增卡。verified-depth 维持 unit（组件仍无站点消费者，runtime 目视由下一站点批一并做）。
