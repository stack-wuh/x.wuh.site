---
{
  "schema": "shadow-dev/v1",
  "name": "20261015-fix-player-panel-responsive-regression",
  "type": "fix",
  "scope": "components",
  "status": "published",
  "baseBranch": "main",
  "branch": "fix/20261015-fix-player-panel-responsive-regression",
  "files": [
    "packages/components/audio-player/panel/styles/mobile.tsx",
    "packages/components/audio-player/style.test.mjs",
    "packages/components/test/breakpoint-raw-scan.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 543,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/543",
    "pullRequest": 545,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/545"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "33fcc002dfdafc71565259ebb8749447313107f9",
    "verifiedAt": "2026-10-15T11:12:30.345Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:545",
    "planHash": "d9c276251ba47aca89215ebc110b82ad2b5ff039cb14cd1d1eb94aff4d6cb345",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix: 播放面板响应式收编回归——responsive 首槽缺位致桌面档隐藏规则静默丢失",
      "titleRaw": "fix: 播放面板响应式收编回归——responsive 首槽缺位致桌面档隐藏规则静默丢失",
      "supplement": "v1.4.86 批次 7 收编在 panel/styles/mobile.tsx 四处误用 responsive([undefined, …]) 首槽缺位写法，编译口按契约返回空串，桌面 md 档 display:none 从未发射，移动独显四组件在桌面全量渲染、留白独奏形态被搅乱。本变更修复四处调用点并以两条语义守卫（全仓首槽缺位扫描 + 四组件真编译产物断言）钉死该失效形态。brief: shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md",
      "body": "## 动机\nv1.4.86（PR #542）批次 7 响应式收编把 `panel/styles/mobile.tsx` 四处写成 `responsive([undefined, undefined, 'display: none;'], …)`，踩中编译口「首槽缺位 → 返回空串」契约（`themes/responsive.ts:45`），桌面 md 档 `display: none` 写回从未发射——`GrabHandle`/`LeafPages`/`LeafPage`/`PageTicks` 四个移动独显组件在桌面保持静态 `display: flex`，作为 Panel 桌面网格（`'stage' 'dock'`）的非法网格项自动放置、注入隐式行、挤占舞台，桌面「留白独奏」形态被搅乱（生产截图实锤：拖拽柄出现在桌面顶部中央、册页图版浮于播放列表上、进度/传输层与碟面叠压）。守卫网全绿放过：批次 7 的 runtime 验证只数 min-width:641 规则条数——这 4 处根本不发射规则，缺规则无从对账；style 守卫亦无首槽语义断言。本变更恢复桌面隐藏写回，并把这一失效形态变成守卫棘轮。\n\n## 引用规范\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 阶梯契约（`[base, sm?, md?, lg?]` 移动优先、缺位槽跳过）+「索引 0 缺位在编译口显式兜底（返回空声明）」+ 批次 7 收编台账（27 处、守卫台账 10 文件）\n  - 适用 scope: packages/components/themes/responsive.ts、packages/components/audio-player/**\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 播放面板桌面「留白独奏」（20261001 定稿）与移动册页（20260930 定稿）双形态；守卫语义化纪律（#450 定稿：守卫断言语义、不能只镜像实现）\n  - 适用 scope: packages/components/audio-player、apps/site/app/components/player\n\n## 决策\n- **选型:** 方案 B——修复 4 处调用点 + 守卫网补两条语义断言\n- **对比方案:** A 只修调用点（最小 diff，但「首槽缺位静默空串」脚枪留存，下次收编可再踩）；C 收紧编译口契约（首槽缺位改开发期报错或支持稀疏首槽——契约变更波及批次 1–6 全部消费点与 responsive.test.mjs 已钉死契约，回归面大，留作后续独立 change 候选，本轮不做）。\n- **理由:** 回归根因在调用侧误用而非编译口缺陷，修调用点即恢复行为且零契约影响；本失效形态穿透过守卫网，把盲区变成棘轮是防再犯的最小增量。断言②遵循 music-player.md 守卫语义化纪律（#435/#450 教训）：经真编译口断言产物语义，不做正则镜像。\n\n## 任务\n### Phase 1 修复\n- [ ] mobile.tsx 四处 `responsive([undefined, undefined, 'display: none;'])` 首槽补 `'display: flex;'`，并删除组件静态块中重复的 display 声明（GrabHandle/LeafPages/LeafPage/PageTicks，现 33/53/66/211 行）— `packages/components/audio-player/panel/styles/mobile.tsx`\n\n### Phase 2 守卫棘轮\n- [ ] 守卫①（先红后绿）：breakpoint-raw-scan 新增全仓断言——所有 `responsive(` 调用首槽不得缺位（含多行数组形态）— `packages/components/test/breakpoint-raw-scan.test.mjs`\n- [ ] 守卫②（先红后绿）：audio-player style 守卫新增四组件语义探针——提取 responsive 数组实参过真编译口，断言产物含基线 `display: flex` 与 `@media (min-width: 641px)` 档 `display: none` — `packages/components/audio-player/style.test.mjs`\n\n### Phase 3 验证与交付\n- [ ] 守卫网回归：responsive/flex/style/player-panel/mini-player/wiring 全绿 + 根 tsc + lint:next + build:next\n- [ ] runtime 双断点目检：桌面视口「留白独奏」形态（无拖拽柄/册页/页缘钮，翻页屏 hover 与 pinned 正常）、移动视口册页形态（拖拽柄/横翻/页缘钮在场）、词卷展开态\n- [ ] 交付发布 v1.4.87（release 阶段第 4 步，部署链全绿后方可归档）\n\n## 补充\nv1.4.86 批次 7 收编在 panel/styles/mobile.tsx 四处误用 responsive([undefined, …]) 首槽缺位写法，编译口按契约返回空串，桌面 md 档 display:none 从未发射，移动独显四组件在桌面全量渲染、留白独奏形态被搅乱。本变更修复四处调用点并以两条语义守卫（全仓首槽缺位扫描 + 四组件真编译产物断言）钉死该失效形态。brief: shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md\n\n完整 brief：shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261015-fix-player-panel-responsive-regression\",\"type\":\"fix\",\"scope\":\"components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md\",\"cliVersion\":\"1.7.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "commit": {
      "files": [
        "shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md"
      ],
      "message": "docs(shadow): 移除误入 brief 的发布阶段任务位（交付发布属 release 阶段，团队惯例不占 brief 任务位）(#543)"
    },
    "release": {
      "files": [
        "shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md",
        "shadow-docs/knowledge/layout-components.md"
      ],
      "message": "docs(shadow): fix brief 终态与 layout 卡知识回写——L 级对账 + 首槽缺位守卫台账增量 (#543)",
      "title": "fix(components): 播放面板响应式收编回归——首槽缺位隐藏写回恢复",
      "body": "## 变更\n- `panel/styles/mobile.tsx` 四处 `responsive([undefined, …])` 首槽补齐 `display: flex`（桌面隐藏写回恢复）\n- 守卫①：全仓 `responsive(` 首槽缺位扫描（breakpoint-raw-scan），多行数组形态一并覆盖\n- 守卫②：移动独显四组件数组实参过真编译口断言产物（style.test）\n\n## 影响\n- 行为/触发面变化：桌面端播放面板恢复「留白独奏」形态（无拖拽柄/册页图版/页缘钮）；移动端册页形态不受影响\n- 明确不受影响的范围：组件公开 API、词典与桌面舞台几何参数、交互行为均未变\n\n## 验证\n- 命令与结果：域套件+断点扫描 68/68 绿（守卫先红后绿）；根 tsc RC=0；oxlint 0/0；next build RC=0\n- 未覆盖项：wiring 套件 3 项 main 既有红（#517 起过期镜像守卫，与本改动零交集，已在 brief 归因）\n\n## 关联\n- Closes #543\n- brief: shadow-docs/changes/20261015-fix-player-panel-responsive-regression/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/layout-components.md",
    "reason": "批次 7 收编段补记「responsive 首槽缺位 → 编译口整体返回空串」生产回归教训（#543）：两档槽迁移时移动独显组件的桌面隐藏写回必须以已定义首槽编码（display 入 base 槽），禁首槽 undefined 形态；守卫台账增两条语义断言（全仓首槽缺位扫描 + 四组件真编译口产物探针），发布后刷新 verified。"
  }
}
---

# 播放面板响应式收编回归修复——responsive 首槽缺位致桌面档隐藏规则静默丢失

## 动机

v1.4.86（PR #542）批次 7 响应式收编把 `panel/styles/mobile.tsx` 四处写成 `responsive([undefined, undefined, 'display: none;'], …)`，踩中编译口「首槽缺位 → 返回空串」契约（`themes/responsive.ts:45`），桌面 md 档 `display: none` 写回从未发射——`GrabHandle`/`LeafPages`/`LeafPage`/`PageTicks` 四个移动独显组件在桌面保持静态 `display: flex`，作为 Panel 桌面网格（`'stage' 'dock'`）的非法网格项自动放置、注入隐式行、挤占舞台，桌面「留白独奏」形态被搅乱（生产截图实锤：拖拽柄出现在桌面顶部中央、册页图版浮于播放列表上、进度/传输层与碟面叠压）。守卫网全绿放过：批次 7 的 runtime 验证只数 min-width:641 规则条数——这 4 处根本不发射规则，缺规则无从对账；style 守卫亦无首槽语义断言。本变更恢复桌面隐藏写回，并把这一失效形态变成守卫棘轮。

## 复杂度评级

- **评级:** L
- **理由:** 本变更修改全仓守卫基建（breakpoint-raw-scan 跨目录棘轮 + 真编译口语义探针），守卫网变更按 L 级律审视；「首槽缺位静默空串」曾穿透整套守卫网直达生产，可发现性风险以语义守卫先红后绿 + 双断点 runtime 目检双保险兑现。
- **期望验证深度:** runtime（unit 探针为门槛，双断点目检为完成证据）
- **取证策略:** assert-first（两条守卫对未修复代码先红、修复后转绿；目检为 observation 补充）

## 领域模型

- **限界上下文:** 组件库（audio-player 播放器组件族）——播放器 UI 样式与行为内聚地；下游为站点 /music 页与全站 GlobalAudioPlayer（只消费包出口，不在本变更触及面）；反腐边界：不动 `responsive()` 编译口契约、不改面板桌面/移动双形态的视觉定稿与交互行为。
- **统一语言增量:** 无
- **聚合与不变量:**
  - `INV-1 responsive 编译口消费纪律`：全仓 `responsive(` 调用首槽必须已定义——编译口对首槽缺位返回空串是文档化行为，任何缺位调用即静默失效源；观察点=全仓源码扫描守卫（覆盖多行数组形态）。
  - `INV-2 移动独显四组件显隐`：GrabHandle/LeafPages/LeafPage/PageTicks 基线档 `display: flex` 在场、桌面档（min-width:641）必有 `display: none` 写回；观察点=提取四组件 responsive 数组实参过真编译口、断言编译产物（非正则镜像实现）。
  - `INV-3 桌面「留白独奏」形态完整`：桌面视口打开面板无拖拽柄、无册页图版、无页缘翻页钮，舞台-dock 网格几何正常，移动视口册页形态不受影响；观察点=本地 dev 双断点目检（≥641 与 ≤640 两态，词卷/队列抽屉随手核）。
- **领域事件:** 守卫转绿且 v1.4.87 部署链全绿后，生产播放面板恢复 #542 之前的桌面形态，移动形态零变化。

## 引用规范

- shadow-docs/knowledge/layout-components.md
  - 当前结论: 阶梯契约（`[base, sm?, md?, lg?]` 移动优先、缺位槽跳过）+「索引 0 缺位在编译口显式兜底（返回空声明）」+ 批次 7 收编台账（27 处、守卫台账 10 文件）
  - 适用 scope: packages/components/themes/responsive.ts、packages/components/audio-player/**
- shadow-docs/knowledge/music-player.md
  - 当前结论: 播放面板桌面「留白独奏」（20261001 定稿）与移动册页（20260930 定稿）双形态；守卫语义化纪律（#450 定稿：守卫断言语义、不能只镜像实现）
  - 适用 scope: packages/components/audio-player、apps/site/app/components/player

## 决策

- **选型:** 方案 B——修复 4 处调用点 + 守卫网补两条语义断言
- **对比方案:** A 只修调用点（最小 diff，但「首槽缺位静默空串」脚枪留存，下次收编可再踩）；C 收紧编译口契约（首槽缺位改开发期报错或支持稀疏首槽——契约变更波及批次 1–6 全部消费点与 responsive.test.mjs 已钉死契约，回归面大，留作后续独立 change 候选，本轮不做）。
- **理由:** 回归根因在调用侧误用而非编译口缺陷，修调用点即恢复行为且零契约影响；本失效形态穿透过守卫网，把盲区变成棘轮是防再犯的最小增量。断言②遵循 music-player.md 守卫语义化纪律（#435/#450 教训）：经真编译口断言产物语义，不做正则镜像。

## 任务

### Phase 1 修复
- [x] mobile.tsx 四处 `responsive([undefined, undefined, 'display: none;'])` 首槽补 `'display: flex;'`，并删除组件静态块中重复的 display 声明（GrabHandle/LeafPages/LeafPage/PageTicks，现 33/53/66/211 行）— `packages/components/audio-player/panel/styles/mobile.tsx`

### Phase 2 守卫棘轮
- [x] 守卫①（先红后绿）：breakpoint-raw-scan 新增全仓断言——所有 `responsive(` 调用首槽不得缺位（含多行数组形态）— `packages/components/test/breakpoint-raw-scan.test.mjs`
- [x] 守卫②（先红后绿）：audio-player style 守卫新增四组件语义探针——提取 responsive 数组实参过真编译口，断言产物含基线 `display: flex` 与 `@media (min-width: 641px)` 档 `display: none` — `packages/components/audio-player/style.test.mjs`

### Phase 3 验证与交付
- [x] 守卫网回归：responsive/flex/style/player-panel/mini-player/wiring 全绿 + 根 tsc + lint:next + build:next
- [x] runtime 双断点目检：桌面视口「留白独奏」形态（无拖拽柄/册页/页缘钮，翻页屏 hover 与 pinned 正常）、移动视口册页形态（拖拽柄/横翻/页缘钮在场）、词卷展开态

## 结果

- 实际耗时: —
- 验证:
  - 先红记录（取证策略 assert-first）：
    - `node --test packages/components/test/breakpoint-raw-scan.test.mjs` → 新增首槽扫描对未修复代码红：responsive 首槽缺位 4 处（panel/styles/mobile.tsx），无第 5 处；
    - `node --test packages/components/audio-player/style.test.mjs` → 新增四组件真编译口探针对未修复代码红（GrabHandle 基线档断言首败）。
  - | INV-1 responsive 首槽纪律 | 观察点：node --test packages/components/test/breakpoint-raw-scan.test.mjs → 先红转绿（29/29，全仓扫描零缺位调用） |
  - | INV-2 移动独显四组件显隐 | 观察点：node --test packages/components/audio-player/style.test.mjs → 守卫②先红转绿（真编译口产物含基线 flex 与 min-width:641 档 none）；runtime getComputedStyle @1440px 四组件 display:none、@375px 三组件 display:flex |
  - | INV-3 桌面留白独奏形态完整 | 观察点：本地 dev 双断点目检——1440×900 桌面 stage/dock 网格 + inset48/1160/居中碟面（截图），375×812 册页三件在场（截图）；桌面/移动渲染互不渗漏 |

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/layout-components.md（批次 7 段补记「首槽缺位 → 静默空串」回归教训与守卫台账增量，交付后刷新 verified）；shadow-docs/knowledge/music-player.md（source 增补本 brief）
- **理由:** 「responsive 首槽缺位静默空串」是编译口全部消费方共担的长期陷阱，属跨 change 事实；守卫语义化教训在 music-player 卡已有先例（#435/#450），本次是其响应式收编变体。
