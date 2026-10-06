---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-fix-layout-typecheck",
  "type": "fix",
  "scope": "packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "packages/components/col/index.tsx",
    "packages/components/layout-typecheck.test.mjs",
    "packages/components/stagger/index.tsx",
    "packages/components/themes/responsive.ts",
    "packages/components/tsconfig.layout.guard.json"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 493,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/493",
    "pullRequest": 494,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/494"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "b9bb924cf3d021fc02277e039ac9c5d5cbb1cf23",
    "verifiedAt": "2026-10-06T15:00:50.940Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:494",
    "planHash": "0627dbb8c4c7ffc72f9667d7c878837c51a55b200444eb8d407100e40eec8208",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 布局组件域类型检查守卫 + 修复 3 处 latent 类型错误",
      "titleRaw": "布局组件域类型检查守卫 + 修复 3 处 latent 类型错误",
      "supplement": "根 tsc 的 include 仅覆盖 packages 下 src 目录，packages/components 无 src/ 从不被覆盖（#449/#450 型空转漏检，site 又 ignoreBuildErrors）。scoped 复测暴露布局域 3 处真实类型错误：ladderSlots 返回类型、col placement 顶层 undefined、stagger forwardRef 泛型。本 change 修 3 处类型 + 照 audio-player 配方新增 tsconfig.layout.guard.json + layout-typecheck.test.mjs 纳入 CI。详见 shadow-docs/changes/20261006-fix-layout-typecheck/brief.md",
      "body": "## 动机\n`packages/components` 无 `src/`，根 `pnpm exec tsc --noEmit` 的 include 不覆盖它（build-config 卡明载：同 #449/#450 生产事故根因——空转 tsc + site `ignoreBuildErrors:true` 双重漏检）。布局组件族（#485/#491）按根 tsc 判「通过」实为空转。用域内 guard 配方（audio-player 先例）scoped 复测，暴露 **3 处真实类型错误**：\n\n1. `themes/responsive.ts:28` `ladderSlots` — `Array.isArray` 不收窄 `readonly (T|undefined)[]`，返回类型 `(T & any[]) | TResponsive<T>[]` 与声明不符。\n2. `col/index.tsx:85` — `placements[0]` 类型为 `TPlacement | undefined`，赋给 `TResponsive<TPlacement>`（顶层不含 undefined）。\n3. `stagger/index.tsx:78` — `forwardRef<HTMLElement>` 的 ref 传给 styled.div（`Ref<HTMLDivElement>`），`align` 等属性不兼容（**#485 遗留**）。\n\n当前生产未受损（组件族零消费者 + ignoreBuildErrors）。但**站点替换批即将真实消费这套底座**——必须先把类型面收敛、并把域内 typecheck 纳入 CI，杜绝再次空转漏检。\n\n## 引用规范\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 组件域守卫配方 `tsconfig.guard.json`（baseUrl 指包根 + paths `@wuh.site/components/*`→`./*`，include 限本域）+ `typecheck.test.mjs`（spawn tsc 过滤域内错误断言清零）；audio-player 首发，其余组件域照此复制\n  - 适用 scope: packages/components 布局域\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 断点边界只经 BREAKPOINTS 语义常量派生，禁裸数值——guard include 覆盖 themes 时须容忍 `+1` 派生写法\n  - 适用 scope: packages/components/themes\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: ladderSlots 归一化、col 逐档 carry-forward、stagger forwardRef 组件契约\n  - 适用 scope: flex/row/col/stagger/themes\n- norms/code-style-packages.md\n  - 当前结论: 改共享包检查全部 workspace 消费者（当前空集，guard + 根 tsc 兜底）；禁为绕过编译错误扩大类型/关检查\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 三处「最小且忠实」类型修复 + 新增布局域 guard，不改运行时：\n  1. `ladderSlots`：`Array.isArray(value) ? value.map(x=>x) : [value]`？不——保留归一化语义，用显式重载/收窄修返回类型（`.slice()` 或标注为 `(T|undefined)[]` 的正确分支）。以能通过 strict 且运行时返回同一槽数组为准。\n  2. `col` placement：`placements[0]` 恒存在（tier0 必 push），修复为元组首项类型正确，或 `const base = placements[0] as TPlacement`（运行时保证，符合 code-style 对 as 的限定用法），优先结构化消除 undefined。\n  3. `stagger`：`forwardRef<HTMLDivElement>`（渲染目标恒为 div 基；`as` 透传目标也是 HTML 元素，ref 类型对齐 styled.div 默认）。\n- **对比:** (a) 放宽 tsconfig strict / 关检查——否决，掩盖问题违反 code-style；(b) 加 `// @ts-ignore`——否决，逐点逃逸不如根因修；(c) 只在 fix 里改类型不加 guard——否决，CI 仍空转、下次重犯。\n- **理由:** guard 配方是 build-config 卡对该包的既定要求，本次正是其存在理由；三修复均类型层、行为不变，运行时经既有 33 守卫 + CSS 产物比对证明等价。\n\n## 任务\n### Phase 1 — 域内守卫\n- [x] 新增 guard 配置 — `packages/components/tsconfig.layout.guard.json` — 照 audio-player：baseUrl 指包根、paths 映射、include 限 themes/flex/row/col/stagger\n- [x] 新增 guard 测试 — `packages/components/layout-typecheck.test.mjs` — spawn tsc 跑该 config，断言域内错误清零（node ≥ 23 或经仓内 tsc）\n### Phase 2 — 三处修复\n- [x] 修 ladderSlots 返回类型 — `packages/components/themes/responsive.ts`\n- [x] 修 col placement undefined — `packages/components/col/index.tsx`\n- [x] 修 stagger ref 类型 — `packages/components/stagger/index.tsx`\n### Phase 3 — 验证\n- [x] 全量验证 — scoped guard tsc 0 错 + 既有 33 守卫全绿 + oxlint 0/0；确认 CSS 运行时产物与修复前一致（ladder/col 编译）\n\n## 补充\n根 tsc 的 include 仅覆盖 packages 下 src 目录，packages/components 无 src/ 从不被覆盖（#449/#450 型空转漏检，site 又 ignoreBuildErrors）。scoped 复测暴露布局域 3 处真实类型错误：ladderSlots 返回类型、col placement 顶层 undefined、stagger forwardRef 泛型。本 change 修 3 处类型 + 照 audio-player 配方新增 tsconfig.layout.guard.json + layout-typecheck.test.mjs 纳入 CI。详见 shadow-docs/changes/20261006-fix-layout-typecheck/brief.md\n\n完整 brief：shadow-docs/changes/20261006-fix-layout-typecheck/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-fix-layout-typecheck\",\"type\":\"fix\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-fix-layout-typecheck/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/col/index.test.mjs",
        "packages/components/col/index.tsx",
        "packages/components/layout-typecheck.test.mjs",
        "packages/components/stagger/index.tsx",
        "packages/components/themes/responsive.ts",
        "packages/components/tsconfig.layout.guard.json",
        "shadow-docs/changes/20261006-fix-layout-typecheck/brief.md"
      ],
      "message": "fix(components): 布局域类型清零 + 纳入 typecheck 守卫 (#493)",
      "title": "[fix] 布局组件域类型检查守卫 + 修复 3 处 latent 类型错误",
      "body": "Closes #493\n\n完整 brief：shadow-docs/changes/20261006-fix-layout-typecheck/brief.md"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "main 复核（b9bb924，#494 已随 v1.4.67 部署链绿）：scoped tsc 清零 3 处 latent 类型 + 布局域 typecheck 守卫入 CI；守卫配方属 build-config 卡既有覆盖，本 change 为应用实例，知识无需变更。重钉过归档门禁。"
  }
}
---

# 布局组件域类型检查守卫 + 修复 3 处 latent 类型错误

## 动机

`packages/components` 无 `src/`，根 `pnpm exec tsc --noEmit` 的 include 不覆盖它（build-config 卡明载：同 #449/#450 生产事故根因——空转 tsc + site `ignoreBuildErrors:true` 双重漏检）。布局组件族（#485/#491）按根 tsc 判「通过」实为空转。用域内 guard 配方（audio-player 先例）scoped 复测，暴露 **3 处真实类型错误**：

1. `themes/responsive.ts:28` `ladderSlots` — `Array.isArray` 不收窄 `readonly (T|undefined)[]`，返回类型 `(T & any[]) | TResponsive<T>[]` 与声明不符。
2. `col/index.tsx:85` — `placements[0]` 类型为 `TPlacement | undefined`，赋给 `TResponsive<TPlacement>`（顶层不含 undefined）。
3. `stagger/index.tsx:78` — `forwardRef<HTMLElement>` 的 ref 传给 styled.div（`Ref<HTMLDivElement>`），`align` 等属性不兼容（**#485 遗留**）。

当前生产未受损（组件族零消费者 + ignoreBuildErrors）。但**站点替换批即将真实消费这套底座**——必须先把类型面收敛、并把域内 typecheck 纳入 CI，杜绝再次空转漏检。

## 复杂度评级

- **评级:** M
- **理由:** 契约——修的是类型标注，不改任何运行时行为/输出（ladder 编译、col 逐档合成逻辑保持不变）；触及面——仅 packages/components 布局域 + 新增 guard 配置，无跨包/宿主核心；可发现性——新增 `layout-typecheck.test.mjs` 域内断言清零，改坏即红。运行时行为三重不变（scoped tsc 前后 CSS 产物一致）。
- **期望验证深度:** unit

## 引用规范

- shadow-docs/knowledge/build-config.md
  - 当前结论: 组件域守卫配方 `tsconfig.guard.json`（baseUrl 指包根 + paths `@wuh.site/components/*`→`./*`，include 限本域）+ `typecheck.test.mjs`（spawn tsc 过滤域内错误断言清零）；audio-player 首发，其余组件域照此复制
  - 适用 scope: packages/components 布局域
- shadow-docs/knowledge/design-system.md
  - 当前结论: 断点边界只经 BREAKPOINTS 语义常量派生，禁裸数值——guard include 覆盖 themes 时须容忍 `+1` 派生写法
  - 适用 scope: packages/components/themes
- shadow-docs/knowledge/layout-components.md
  - 当前结论: ladderSlots 归一化、col 逐档 carry-forward、stagger forwardRef 组件契约
  - 适用 scope: flex/row/col/stagger/themes
- norms/code-style-packages.md
  - 当前结论: 改共享包检查全部 workspace 消费者（当前空集，guard + 根 tsc 兜底）；禁为绕过编译错误扩大类型/关检查
  - 适用 scope: packages/components

## 决策

- **选型:** 三处「最小且忠实」类型修复 + 新增布局域 guard，不改运行时：
  1. `ladderSlots`：`Array.isArray(value) ? value.map(x=>x) : [value]`？不——保留归一化语义，用显式重载/收窄修返回类型（`.slice()` 或标注为 `(T|undefined)[]` 的正确分支）。以能通过 strict 且运行时返回同一槽数组为准。
  2. `col` placement：`placements[0]` 恒存在（tier0 必 push），修复为元组首项类型正确，或 `const base = placements[0] as TPlacement`（运行时保证，符合 code-style 对 as 的限定用法），优先结构化消除 undefined。
  3. `stagger`：`forwardRef<HTMLDivElement>`（渲染目标恒为 div 基；`as` 透传目标也是 HTML 元素，ref 类型对齐 styled.div 默认）。
- **对比:** (a) 放宽 tsconfig strict / 关检查——否决，掩盖问题违反 code-style；(b) 加 `// @ts-ignore`——否决，逐点逃逸不如根因修；(c) 只在 fix 里改类型不加 guard——否决，CI 仍空转、下次重犯。
- **理由:** guard 配方是 build-config 卡对该包的既定要求，本次正是其存在理由；三修复均类型层、行为不变，运行时经既有 33 守卫 + CSS 产物比对证明等价。

## 任务

### Phase 1 — 域内守卫
- [x] 新增 guard 配置 — `packages/components/tsconfig.layout.guard.json` — 照 audio-player：baseUrl 指包根、paths 映射、include 限 themes/flex/row/col/stagger
- [x] 新增 guard 测试 — `packages/components/layout-typecheck.test.mjs` — spawn tsc 跑该 config，断言域内错误清零（node ≥ 23 或经仓内 tsc）
### Phase 2 — 三处修复
- [x] 修 ladderSlots 返回类型 — `packages/components/themes/responsive.ts`
- [x] 修 col placement undefined — `packages/components/col/index.tsx`
- [x] 修 stagger ref 类型 — `packages/components/stagger/index.tsx`
### Phase 3 — 验证
- [x] 全量验证 — scoped guard tsc 0 错 + 既有 33 守卫全绿 + oxlint 0/0；确认 CSS 运行时产物与修复前一致（ladder/col 编译）

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 无需变更（guard 配方已在 build-config 卡记录；本 change 是其应用实例，不新增稳定事实）
- **候选卡片:** 无
- **理由:** 三处修复为一次性缺陷清除，非跨变更长期事实；「布局域需 typecheck guard」这一约束本已由 build-config 卡的组件域守卫段覆盖，无需再沉淀。
