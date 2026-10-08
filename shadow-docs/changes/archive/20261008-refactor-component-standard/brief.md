---
{
  "schema": "shadow-dev/v1",
  "name": "20261008-refactor-component-standard",
  "type": "refactor",
  "scope": "packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "refactor/20261008-refactor-component-standard",
  "files": [
    "packages/components/alert/types.ts",
    "packages/components/alert/index.tsx",
    "packages/components/audio-player/types.ts",
    "packages/components/audio-player/index.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/provider.tsx",
    "packages/components/button/index.tsx",
    "packages/components/button/index.test.mjs",
    "packages/components/button/readme.md",
    "packages/components/button/types.ts",
    "packages/components/button/styles/index.tsx",
    "packages/components/button/tokens.ts",
    "packages/components/card/types.ts",
    "packages/components/card/index.tsx",
    "packages/components/dialog/types.ts",
    "packages/components/dialog/index.tsx",
    "packages/components/divider/types.ts",
    "packages/components/divider/index.tsx",
    "packages/components/empty/types.ts",
    "packages/components/empty/index.tsx",
    "packages/components/flex/types.ts",
    "packages/components/flex/index.tsx",
    "packages/components/footprint-map/types.ts",
    "packages/components/footprint-map/index.tsx",
    "packages/components/heatmap/types.ts",
    "packages/components/heatmap/index.tsx",
    "packages/components/image/types.ts",
    "packages/components/image/index.tsx",
    "packages/components/image-preview/types.ts",
    "packages/components/image-preview/index.tsx",
    "packages/components/image-preview/ThumbnailRail.tsx",
    "packages/components/image-preview/Toolbar.tsx",
    "packages/components/layout/types.ts",
    "packages/components/layout/index.tsx",
    "packages/components/layout/site-stats.tsx",
    "packages/components/layout/footer.tsx",
    "packages/components/link-group/types.ts",
    "packages/components/link-group/index.tsx",
    "packages/components/message/types.ts",
    "packages/components/message/index.tsx",
    "packages/components/message-card/types.ts",
    "packages/components/message-card/index.tsx",
    "packages/components/pagination/types.ts",
    "packages/components/pagination/index.tsx",
    "packages/components/progress/types.ts",
    "packages/components/progress/index.tsx",
    "packages/components/result/types.ts",
    "packages/components/result/index.tsx",
    "packages/components/result/styles/index.tsx",
    "packages/components/scroll-area/types.ts",
    "packages/components/scroll-area/index.tsx",
    "packages/components/shared-link-group/types.ts",
    "packages/components/shared-link-group/index.tsx",
    "packages/components/skeleton/types.ts",
    "packages/components/skeleton/index.tsx",
    "packages/components/tag/types.ts",
    "packages/components/tag/index.tsx",
    "packages/components/test/structure-baseline.json",
    "packages/components/test/structure.test.mjs",
    "shadow-docs/knowledge/component-standard.md",
    "shadow-docs/menu.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 520,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/520",
    "pullRequest": 522,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/522"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "80cc0973256f0730ab399b76fa35fd119defcd75",
    "verifiedAt": "2026-10-08T07:13:10.445Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:522",
    "planHash": "899edc3341d3e9482d6c4c466fb80acf7f25d013324e8fbdca6ecb6f97a9ef20",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 组件编写规范——packages/components 结构契约与接口约定",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n组件库 40 个组件的结构与写法长期各自生长：12 个缺 specs.tsx、19 个未拆 styles/、仅 14 个有守卫测试、README 大小写不一、导出风格不一。用户目标是统一全套代码风格，先从 packages/components 建立「组件编写规范」，并且这套规范必须作为活文档随后续每个 change 的 review/release 知识闭环持续迭代，而不是一次性写完即腐。\n\n## 引用规范\n- norms/code-style.md\n  - 当前结论: 渐进式治理（新代码必须遵守，旧代码触碰时收敛，不以一次变更为全仓改造入口）；组件 PascalCase、函数 camelCase；跨包只走公开入口；文件名遵循所在包现有约定（本规范即把 components 包的「现有约定」显式化）。\n  - 适用 scope: packages/components 全部\n- norms/code-style-frontend.md\n  - 当前结论: 组件库不依赖业务页面/路由；styled-components 用 `$` 前缀 transient props；颜色间距走 CSS 变量/主题令牌；组件公共导出从包公开入口维护，禁止消费者依赖内部文件路径。\n  - 适用 scope: packages/components\n- norms/code-style-packages.md\n  - 当前结论: 修改共享包必须检查所有 workspace 消费者的类型检查、构建和运行时影响；导出入口变更需同时验证 dev/build/消费者解析。\n  - 适用 scope: packages/components\n- norms/ui-patterns.md\n  - 当前结论: 设计规范先行、组件复用优先、暗黑模式全覆盖、动效约束、可访问性底线。\n  - 适用 scope: 规范条款中的可见状态与 a11y 要求\n- norms/knowledge-cards.md\n  - 当前结论: 一张卡片一个可独立执行的稳定知识单元；命名描述领域事实不用事件词；active 卡片必须进 menu 路由。\n  - 适用 scope: 本规范卡的形态与写入\n- shadow-docs/knowledge/components.md\n  - 当前结论: 消费者用 `@wuh.site/components/<name>` 子路径直接映射，无桶文件；主组件 ≤500 行对标 ImagePreview 先例；组件纪律由同目录守卫测试固化（audio-player style.test.mjs 先例）。\n  - 适用 scope: packages/components\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只用主题 token、禁裸十六进制；断点只用 `themes/breakpoints.ts` 语义常量、禁裸数值。\n  - 适用 scope: 规范条款的样式部分\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 断点阶梯 `TResponsive`/`responsive()` 是布局 props 的唯一契约。\n  - 适用 scope: 接口约定中响应式 props 的写法\n\n## 决策\n- **选型:** 方案 A——新建独立规范卡 `shadow-docs/knowledge/component-standard.md`（结构契约 + 接口设计约定 + 迭代协议）+ button 标杆组件完整改造 + `packages/components/test/structure.test.mjs` 棘轮式结构守卫（硬性规则全量即红；必备文件三件套与条件项建 baseline 快照，新增违规红、存量修好除名）。\n- **对比方案:** 方案 B（并入现有 components.md）被否——该卡已承载 Image/AudioPlayer/Progress 等多段事实，违反「一卡一知识单元」门禁，规范与事实记录混写后续更新互相污染；方案 C（包内 STANDARD.md 不进 Knowledge）被否——绕过 menu 路由与 review「规范遵循」检查、release「知识评估」闭环，正是用户要避免的两张皮。\n- **理由:** 规范的持续迭代寄生在既有工作流回路上（propose 引用 → review 检查 → release 原位更新 → archive 归档 brief），唯一能进入这条回路的形态是 active Knowledge 卡；棘轮守卫兼容 code-style.md 渐进式治理，避免存量 26+19+12 项缺口一次性阻塞；button 结构最全且全站消费最多，改造示范价值最高且对外 API 不动、风险可控。\n\n## 任务\n### Phase 1 规范卡落地\n- [ ] 从 40 个组件实测归纳命名/导出/样式细节差异，定稿规范条款，写 `shadow-docs/knowledge/component-standard.md`（active，source 指向本 change brief） — `shadow-docs/knowledge/component-standard.md` — 新建\n- [ ] 在 `shadow-docs/menu.md`「主题与样式」与「组件」相关路由追加本卡 — `shadow-docs/menu.md` — 更新\n\n### Phase 2 棘轮守卫\n- [ ] 实现 `packages/components/test/structure.test.mjs`：硬性规则（目录 kebab-case、index.tsx 存在且为唯一入口、readme 文件名小写、无 default/命名混用、文件名全小写）全量即红；三件套与条件项按 baseline 快照棘轮（棘轮只减不增） — `packages/components/test/structure.test.mjs` — 新建\n- [ ] 跑现状生成初始 baseline，确认 button 改造后除名流程通畅 — `packages/components/test/structure.test.mjs` — 运行验证\n\n### Phase 3 button 标杆改造\n- [ ] button 目录按规范对齐：命名导出核查、tokens.ts 归位说明、legacy type 兼容块组织方式、styles/ 结构 — `packages/components/button/index.tsx`、`packages/components/button/specs.tsx`、`packages/components/button/tokens.ts`、`packages/components/button/styles/` — 调整（对外 API 零变化）\n- [ ] `button/readme.md` 升级为规范模板并作为模板示例 — `packages/components/button/readme.md` — 更新\n- [ ] button 从棘轮 baseline 除名 — `packages/components/test/structure.test.mjs` — 更新\n\n### Phase 4 收尾验证\n- [ ] workspace `tsc --noEmit` + 守卫脚本全绿 + apps/site 消费者类型检查基线持平 — 各命令输出记录进 brief 结果段\n- [ ] 卡片「验证方式」写明可重复检查（结构守卫即验证），review 阶段核对\n\n完整 brief：shadow-docs/changes/20261008-refactor-component-standard/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261008-refactor-component-standard\",\"type\":\"refactor\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261008-refactor-component-standard/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "worktree": "D:\\works\\x.wuh.site-component-standard",
    "commit": {
      "files": [
        "shadow-docs/changes/20261008-refactor-component-standard/brief.md"
      ],
      "message": "docs(shadow): 回写 brief checkpoint c296db3"
    }
  },
  "knowledge": null
}
---

# 组件编写规范——packages/components 结构契约与接口约定

## 动机

组件库 40 个组件的结构与写法长期各自生长：类型契约文件（specs.tsx）仅 23 个组件有、12 个组件缺失，styles/ 拆分 18 个目录，守卫测试仅 15 个，README 大小写不一、导出风格不一。用户目标是统一全套代码风格，先从 packages/components 建立「组件编写规范」，并且这套规范必须作为活文档随后续每个 change 的 review/release 知识闭环持续迭代，而不是一次性写完即腐。

## 引用规范

- norms/code-style.md
  - 当前结论: 渐进式治理（新代码必须遵守，旧代码触碰时收敛，不以一次变更为全仓改造入口）；组件 PascalCase、函数 camelCase；跨包只走公开入口；文件名遵循所在包现有约定（本规范即把 components 包的「现有约定」显式化）。
  - 适用 scope: packages/components 全部
- norms/code-style-frontend.md
  - 当前结论: 组件库不依赖业务页面/路由；styled-components 用 `$` 前缀 transient props；颜色间距走 CSS 变量/主题令牌；组件公共导出从包公开入口维护，禁止消费者依赖内部文件路径。
  - 适用 scope: packages/components
- norms/code-style-packages.md
  - 当前结论: 修改共享包必须检查所有 workspace 消费者的类型检查、构建和运行时影响；导出入口变更需同时验证 dev/build/消费者解析。
  - 适用 scope: packages/components
- norms/ui-patterns.md
  - 当前结论: 设计规范先行、组件复用优先、暗黑模式全覆盖、动效约束、可访问性底线。
  - 适用 scope: 规范条款中的可见状态与 a11y 要求
- norms/knowledge-cards.md
  - 当前结论: 一张卡片一个可独立执行的稳定知识单元；命名描述领域事实不用事件词；active 卡片必须进 menu 路由。
  - 适用 scope: 本规范卡的形态与写入
- shadow-docs/knowledge/components.md
  - 当前结论: 消费者用 `@wuh.site/components/<name>` 子路径直接映射，无桶文件；主组件 ≤500 行对标 ImagePreview 先例；组件纪律由同目录守卫测试固化（audio-player style.test.mjs 先例）。
  - 适用 scope: packages/components
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只用主题 token、禁裸十六进制；断点只用 `themes/breakpoints.ts` 语义常量、禁裸数值。
  - 适用 scope: 规范条款的样式部分
- shadow-docs/knowledge/layout-components.md
  - 当前结论: 断点阶梯 `TResponsive`/`responsive()` 是布局 props 的唯一契约。
  - 适用 scope: 接口约定中响应式 props 的写法

## 决策

- **选型:** 方案 A——新建独立规范卡 `shadow-docs/knowledge/component-standard.md`（结构契约 + 接口设计约定 + 迭代协议）+ button 标杆组件完整改造 + `packages/components/test/structure.test.mjs` 棘轮式结构守卫（硬性规则全量即红；必备文件三件套与条件项建 baseline 快照，新增违规红、存量修好除名）。
- **对比方案:** 方案 B（并入现有 components.md）被否——该卡已承载 Image/AudioPlayer/Progress 等多段事实，违反「一卡一知识单元」门禁，规范与事实记录混写后续更新互相污染；方案 C（包内 STANDARD.md 不进 Knowledge）被否——绕过 menu 路由与 review「规范遵循」检查、release「知识评估」闭环，正是用户要避免的两张皮。
- **理由:** 规范的持续迭代寄生在既有工作流回路上（propose 引用 → review 检查 → release 原位更新 → archive 归档 brief），唯一能进入这条回路的形态是 active Knowledge 卡；棘轮守卫兼容 code-style.md 渐进式治理，避免存量缺口（12 个组件无类型契约、25 个缺守卫测试等）一次性阻塞；button 结构最全且全站消费最多，改造示范价值最高且对外 API 不动、风险可控。
- **外部对照权衡（antd/shadcn/MUI 对照后确认，2026-10-08 补充）:**
  - 类型契约文件统一为业界规范命名 `types.ts`（用户决策 2026-10-08，推翻此前「保留 specs.tsx」建议）：23 个组件的存量 `specs.tsx` 随本 change 一次性更名为 `types.ts`——纯类型文件无 JSX 实现（实测 23 个文件均只有 `import * as React from 'react'` + 接口/类型声明），git mv + 29 处引用文件更新 import，行为零变化、tsc 全量兜底；守卫硬性规则禁止 `specs.tsx` 再出现。理由：机械改名一次性做完的验证成本，低于两套命名长期并存对规范卡、baseline 与外部贡献者心智的持续污染。
  - baseline（存量欠账登记表：在册违规放行、新增违规即红、修好除名只减不增）独立为数据文件 `packages/components/test/structure-baseline.json`，与守卫逻辑 `structure.test.mjs` 分离——逻辑不动、数据随收敛变化，并行 change 的 diff 只落在 JSON 数据行上，合并冲突可控。
  - 样式逃生口维持 `xxxClassName`/`xxxStyle`（Image 先例、消费者已存在），不引入 antd 5.x `classNames` 对象 API：两者语义等价仅形态不同，迁移属兼容性演进，如未来要做另立 change。此条为决策记录，不写入规范卡（knowledge-cards.md 门禁：卡片不存路线图内容）。

## 规范内容大纲（卡正文的条款来源）

### 结构契约
- 目录名 = exports 子路径 = kebab-case（`audio-player`），消费者唯一入口 `@wuh.site/components/<dir>`，经 `<dir>/index.tsx` 解析；禁止深导入内部文件。
- 每个组件必备三件套：`index.tsx`（唯一入口 + 实现，`'use client'` 按客户端边界放置）、`types.ts`（Props 接口 + transient props 类型契约，业界规范命名；存量 `specs.tsx` 随本 change 全量更名）、`readme.md`（全小写，模板：一句话定位 / 用法示例 / 关键 Props / 结构说明）。
- 条件项：出现 styled-components 样式 → 拆 `styles/`（单文件可 `styles/index.tsx`，多区块按语义命名多文件，参照 audio-player panel/styles 先例）；样式纪律复杂的组件 → 同目录守卫 `index.test.mjs`；跨区块复用的样式令牌 → `tokens.ts`（button 先例入规范）。
- 主实现文件 ≤500 行，超出按 ImagePreview/audio-player 拆分先例组织子目录。
- 导出：组件用命名导出（与现状主流一致），类型随 `export type` 从 index.tsx 公开；禁止 default export 与命名混用两套。

### 接口设计约定（新组件必须、存量触碰时收敛）
- 变体词汇统一：`variant`（形态）/ `color`（语义色）/ `size`（档位，值 `small|medium|large` 或 `sm|md|lg` 对齐相邻组件）；布尔开关用形容词（`disabled`、`fullWidth`、`bordered`）。
- 事件回调 `onXxx`，签名对齐 React 惯例；受控/非受控成对出现时用 `value/defaultValue + onChange`。
- 样式逃生口：外层容器 `className`、内部子区域 `xxxClassName`/`xxxStyle`（Image 先例）；禁止消费者穿透选择器。
- 响应式 props 一律走 `TResponsive` 断点阶梯（layout-components 契约）。
- 可见状态：组件明确处理 loading/disabled/empty/error（适用时）；a11y 底线继承 ui-patterns.md。

### 迭代协议（写入卡片）
- 新增组件照 button 标杆抄结构；规范修订走 release 知识闭环原位更新卡片并追加 source。
- 存量组件触碰即收敛：改造一个、棘轮 baseline 除名一个；baseline 只减不增。
- review 阶段「规范遵循」维度以本卡为检查基准。

## 任务

### Phase 1 规范卡落地
- [x] 从 40 个组件实测归纳命名/导出/样式细节差异，定稿规范条款（三件套类型契约定为 `types.ts`），写 `shadow-docs/knowledge/component-standard.md`（active，source 指向本 change brief） — `shadow-docs/knowledge/component-standard.md` — 新建
- [x] 在 `shadow-docs/menu.md`「主题与样式」与「组件」相关路由追加本卡 — `shadow-docs/menu.md` — 更新

### Phase 2 类型契约文件全量更名（机械性、行为零变化）
- [x] 23 个组件 `specs.tsx` → `types.ts` git mv，同步更新 29 处引用文件的 import（audio-player×3、image-preview×3、layout×2、result×2、其余各 1） — `packages/components/*/specs.tsx` 及全部引用文件 — 更名
- [x] 更名后 workspace `tsc --noEmit` 全量兜底：站点基线错误计数与错误位集持平 — 验证

### Phase 3 棘轮守卫
- [x] 实现 `packages/components/test/structure.test.mjs`：硬性规则（目录 kebab-case、index.tsx 存在且为唯一入口、readme 文件名小写、无 default/命名混用、文件名全小写、禁止 `specs.tsx` 再出现）全量即红；三件套（index/types/readme）与条件项按独立数据文件 `packages/components/test/structure-baseline.json` 的 baseline 快照棘轮（在册放行、新增即红、只减不增；themes/styled/test/locales 等非组件目录除外） — `packages/components/test/structure.test.mjs`、`packages/components/test/structure-baseline.json` — 新建
- [x] 跑现状生成初始 baseline 登记册（缺失类型契约与条件项的在册组件登记），确认 button 改造后除名流程通畅 — `packages/components/test/structure-baseline.json` — 运行生成

### Phase 4 button 标杆改造
- [x] button 目录按规范对齐：命名导出核查、tokens.ts 归位说明、legacy type 兼容块组织方式、styles/ 结构 — `packages/components/button/index.tsx`、`packages/components/button/types.ts`、`packages/components/button/tokens.ts`、`packages/components/button/styles/` — 调整（对外 API 零变化）
- [x] `button/readme.md` 升级为规范模板并作为模板示例 — `packages/components/button/readme.md` — 更新
- [x] button 从棘轮 baseline 除名 — `packages/components/test/structure-baseline.json` — 更新

### Phase 5 收尾验证
- [x] workspace `tsc --noEmit` + 守卫脚本全绿 + apps/site 消费者类型检查基线持平 — 各命令输出记录进 brief 结果段
- [x] 卡片「验证方式」写明可重复检查（结构守卫即验证），review 阶段核对

## 结果

- 实际耗时: apply 约 90 分钟（worktree 建场 → Phase 1-5，全程 worktree `refactor/20261008-refactor-component-standard`）
- 验证:
  - root `pnpm exec tsc --noEmit`：基线 0 错误 → 终态 0 错误，持平。
  - apps/site tsc components 子集：基线 17 → 终态 15。specs→types 文本归一后**零新增**；减少 2 项均为真实修复——button `styles TS2459`（types.ts re-export 枚举类型）、message `styles TS2307 '../types'`（main HEAD 历史断链引用尚不存在的 ../types，被全量更名顺势修复）。site 非 components 错误 18→18 持平。
  - `test/structure.test.mjs` 18/18 全绿（5 条硬性规则 + 6 规则×2 棘轮双向断言 + 占位检查）；棘轮经双向红灯探测（台账除名未同步→红；假修复未除名→红）。
  - 更名影响的 15 个组件守卫测试 + audio-player 2 测试全部重跑绿。
  - 已知存量环境问题（非本变更）：`themes/responsive.test.mjs`、`themes/spacing.test.mjs`、`test/image-role-contract.test.mjs` 依赖 `node:module registerHooks`（本机 Node 22.14 不满足），main 工作区同样红，按范围纪律不顺手修。
- 与任务口径的差异: task「button 从棘轮 baseline 除名」——button 自更名后在台账零登记（三件套齐、readme 小写、styles/ 已拆），实际动作是确认其标杆资格；另在 Phase 4 修复 `button/index.test.mjs` 读取大写 `README.md`（区分大小写文件系统下会红）与 `types.ts` 枚举 re-export 缺失。
- 守卫实现补充口径（review 时请一并核对卡片）：跨目录仅禁**深导入**（`../<dir>/<sub>`、`@wuh.site/components/<dir>/<sub>`）；入口级互引与 INFRA 目录（themes/styled/locales/test）子路径引用合法。`analytics`（shadcn 式双文件、无 index.tsx）登记入 `missing-entry` 棘轮，规范卡「基础设施目录」列举已含 locales/themes/styled/test。

## 知识评估

- **终态（release 2026-10-08）:** 新增确认。查重 `domain: components + scope: packages/components` 命中 components.md，判定为独立知识单元（该卡记录组件包现状事实，本卡记录编写规范），按一卡一单元门禁分卡并存；卡片、menu 路由与 brief 均随本 change 落盘。
- **预期影响:** 新增
- **候选卡片:** `shadow-docs/knowledge/component-standard.md`
- **理由:** 组件编写规范是跨变更长期有效的执行真相，独立知识单元，不与 components.md 的组件包事实混写；后续存量收敛变更在各自 release 阶段按「事实变化原位更新」协议迭代本卡并追加 source。
