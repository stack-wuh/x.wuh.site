---
title: 组件编写规范
domain: components
keywords: [组件规范, 目录结构, 命名规则, 文件职责, exports, 入口, types.ts, specs.tsx, readme, 导出形态, default, 命名导出, 双导出, 守卫, 棘轮, baseline, props词汇, variant, size, 受控, 逃生口, 占位组件]
scope:
  - packages/components
status: active
source:
  - changes/20261008-refactor-component-standard/brief.md
verified: 2026-10-08
verified-depth: unit
verified-scope: 条款由 2026-10-08 对 40 个组件目录全量普查归纳（文件构成、导出语句、readme 标题、引用点逐一 grep）；结构约束由 packages/components/test/structure.test.mjs + structure-baseline.json 棘轮守卫可重复验证，验证方式段给出复跑命令。
---

# 组件编写规范

packages/components 组件目录的结构契约与接口设计约定。标杆参照实现是 `button/`（20261008 起）；新增组件照 button 抄结构，存量组件触碰即收敛。本卡修订走 release 知识闭环：事实变化原位更新、追加 source、验证后更新 verified。

## 当前结论

### 结构契约

- **目录即公开入口**：目录名 kebab-case，等于 exports 子路径；消费者唯一形态 `@wuh.site/components/<dir>`（经 `<dir>/index.tsx` 解析），禁止深导入 `<dir>/styles`、`<dir>/types` 等内部文件。包内组件目录间允许**入口级互引**（`from '../icons'` 或 `from '@wuh.site/components/icons'`），跨目录子路径深导入违规；`themes/`、`styled/` 基础设施目录的子路径引用（`themes/breakpoints` 等）为合法标准用法。非组件目录 `themes/`、`styled/`、`test/`、`locales/` 不适用本规范的组件条款。
- **三件套必备**（每个组件目录）：
  - `index.tsx` — 唯一入口 + 实现。`'use client'` 只在确需客户端能力时置于文件首行。主实现 ≤500 行，超出按 audio-player（`mini/`、`panel/` 子目录）与 image-preview（`hooks/` 拆分）先例组织。
  - `types.ts` — Props 接口 + transient props（`$` 前缀）类型契约，纯类型无实现。**`specs.tsx` 是历史名，20261008 已全量更名为 `types.ts`，守卫禁止再出现。**
  - `readme.md` — 全小写文件名。标题 `# <组件名> <中文别名>`（h1），正文小节：一句话定位 / 用法示例 / 关键 Props / 结构说明。模板示例见 `button/readme.md`。
- **条件项**（触发即必备）：
  - 出现 styled-components 样式 → 拆 `styles/`（单文件可 `styles/index.tsx`；多区块按语义命名多文件，依赖单向：区块 → tokens，参照 audio-player `panel/styles/`）。
  - 样式纪律复杂（禁裸色/裸断点/aria 约束需固化）→ 同目录 `index.test.mjs` 守卫（audio-player `style.test.mjs` 先例）。
  - 跨区块复用的样式令牌 → `tokens.ts`（button 先例）。
- **导出形态按目录产品数分类**（消费者 import 风格与之对应）：
  - 单一产品目录（主组件是唯一定制品）：`export default` 主组件；伴生常量/类型可额外命名导出（如 buttonTokens、`export type`），不算混用。
  - 多产品目录（复合组件/hook 齐售，如 audio-player、icons、message-card）：仅命名导出，无 default。
  - **过渡形态**：default + 同名组件的命名双导出（现存 row/col/flex/stagger 等）登记入 baseline 棘轮，新组件禁用；消费者 import 两种写法都能工作，readme 与新增代码统一展示 default。

### 接口设计约定（新组件必须；存量触碰时收敛）

- **变体词汇**：`variant`（形态）/ `color`（语义色）/ `size`（档位：`small|medium|large`，紧凑场景允许 `sm|md|lg`，与相邻组件对齐）；布尔开关用形容词（`disabled`、`fullWidth`、`bordered`），不用 `isXxx` prop。
- **事件与受控**：回调统一 `onXxx`，签名对齐 React 惯例；受控/非受控成对时用 `value` + `defaultValue` + `onChange`。
- **样式逃生口**：外层容器走 `className`；内部子区域走 `xxxClassName`/`xxxStyle`（Image `imageClassName` 先例）。禁止消费者穿透选择器，禁止 JSX 硬编码主题色。
- **响应式 props**：一律走 `themes/responsive.ts` 的 `TResponsive` 断点阶梯（见 layout-components 卡），不新造响应式 prop 形态。
- **可见状态与无障碍**：适用时明确处理 loading/disabled/empty/error；焦点可见、图标按钮 aria-label、reduced-motion 降级继承 ui-patterns 底线。
- **样式实现**：styled-components transient props 用 `$` 前缀；颜色/间距/断点只用主题令牌与语义常量（design-system 卡铁律）。

### 豁免与迭代协议

- **占位组件豁免**：`config-provider`、`float-button`、`modal`、`space`、`spin`、`video-player`（空 `index.tsx`，AGENTS.md 占位清单）在实现前不登记 baseline、不要求三件套；实现落地的那个 change 必须按本规范完成全结构并跑守卫。
- **棘轮**：结构守卫 `test/structure.test.mjs` 硬性规则（目录 kebab-case、`specs.tsx`/`specs.ts` 禁现、`./specs` import 禁现、index.tsx 至多一个 default、跨目录深导入禁止）全量即红；六类缺口——缺入口（`analytics`）、缺类型契约、缺 readme、大写 README 遗留、同名双导出、样式内联——登记 `test/structure-baseline.json`，在册放行、新增即红、**只减不增**（台账项已修好未除名同样判红，强制台账与现状一致）。存量组件改造完成一个即从 baseline 除名一个。
- **持续迭代**：后续触碰 packages/components 的每个 change，propose 引用本卡 → review「规范遵循」维度按本卡检查 → release 知识评估原位更新本卡（新增稳定条款时）→ archive 归档 brief。规范与代码冲突时按 knowledge-cards.md 冲突优先级处理，先确认是有意变更、回归还是卡片过期。

## 执行约束

- 修改/新增 packages/components 组件后必须跑 `node packages/components/test/structure.test.mjs` 且全绿。
- 类型契约文件名唯一为 `types.ts`；新建 `specs.tsx` 或从旧分支带回均会被守卫判红。
- 双导出（default+同名）与样式内联属于在册欠账：触碰该组件时顺手收敛并从 baseline 除名，不得为无关改动扩大范围。
- 消费者新代码统一从 `@wuh.site/components/<dir>` 根子路径导入。

## 适用边界

- 适用于 `packages/components` 下组件目录；`themes/`、`styled/`、`test/`、`locales/` 基础设施目录除外（各自契约见 design-system / layout-components / i18n 卡）。
- 业务页面的组件组合与文案不属于本规范。
- `console`/`site` 应用内部私有组件暂不在本卡 scope，规范确立后由后续变更评估外延。

## 验证方式

- `node packages/components/test/structure.test.mjs`（在 packages/components 或仓库根均可）——硬性规则 + 棘轮只减不增断言；`node test/structure.test.mjs --emit-baseline` 输出当前违规集，应与登记台账一致。
- 深导入禁令由守卫静态解析 import 判定（入口级互引与 INFRA 子路径豁免），无需手工 grep。
- 抽查 `button/` 目录：三件套 + styles/ + tokens.ts + readme 模板，作为新组件的抄写源。

## 关联知识

- [组件包](components.md) — exports map 消费事实与 AudioPlayer/ImagePreview 拆分先例
- [设计系统](design-system.md) — 主题令牌与断点铁律
- [响应式布局组件族](layout-components.md) — TResponsive 断点阶梯契约
