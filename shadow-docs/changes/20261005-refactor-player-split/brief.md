---
{
  "schema": "shadow-dev/v1",
  "name": "20261005-refactor-player-split",
  "type": "refactor",
  "scope": "audio-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "refactor/20261005-refactor-player-split",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/mini-player.test.mjs",
    "packages/components/audio-player/mini/styles.tsx",
    "packages/components/audio-player/panel-sources.mjs",
    "packages/components/audio-player/panel/PanelMobile.tsx",
    "packages/components/audio-player/panel/PanelQueue.tsx",
    "packages/components/audio-player/panel/PanelVolume.tsx",
    "packages/components/audio-player/panel/styles/dock.tsx",
    "packages/components/audio-player/panel/styles/ghost.tsx",
    "packages/components/audio-player/panel/styles/mobile.tsx",
    "packages/components/audio-player/panel/styles/queue.tsx",
    "packages/components/audio-player/panel/styles/shell.tsx",
    "packages/components/audio-player/panel/styles/stage.tsx",
    "packages/components/audio-player/panel/styles/tokens.ts",
    "packages/components/audio-player/panel/styles/words.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 473,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/473",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "287f63f1fadd93032670660115fbf191d161acf0",
    "verifiedAt": "2026-10-05T15:37:43.659Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:473",
    "planHash": "f94e7c25fa59b03a85c55dbc65d0a004e1def3776795d5f97d0c19602982324f",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] refactor(player): 播放器组件拆分——样式模块化 + 叶子组件，主组件 ≤500 行",
      "titleRaw": "refactor(player): 播放器组件拆分——样式模块化 + 叶子组件，主组件 ≤500 行",
      "supplement": "PlayerPanel.tsx 2089 行 / MiniPlayer.tsx 634 行超出组件包「主组件 ≤500 行」规范。行为零变化纯拆分：面板样式按区块模块化（panel/styles/ 8 模块）+ 3 个自包含叶子组件（PanelVolume/PanelQueue/PanelMobile），MiniPlayer 抽 mini/styles.tsx；守卫测试改 panel-sources 拼接读取并新增行数上限守卫。方案与任务见 shadow-docs/changes/20261005-refactor-player-split/brief.md",
      "body": "## 动机\n`PlayerPanel.tsx` 已膨胀到 **2089 行**（~1420 行 styled 样式 + ~648 行组件体），`MiniPlayer.tsx` **634 行**，违反组件包既有设计规范（components.md：ImagePreview 先例「主组件不超过 500 行，按职责拆分独立文件」）。单文件承载 60+ 个 styled 组件、8 个 effect、5 组交互逻辑，改动定位成本高、合并冲突面大。本次按既定规范做**行为零变化**的纯结构性拆分，不触碰任何样式值、DOM 结构与交互语义。\n\n## 引用规范\n- `shadow-docs/knowledge/components.md`\n  - 当前结论: 组件按职责拆分独立文件，主组件不超过 500 行（ImagePreview 先例：types / hooks / Toolbar / MoreMenu / ThumbnailRail / styles/）；颜色只走主题 token、断点只用 `BREAKPOINTS`、显隐态组件一律行内样式驱动\n  - 适用 scope: packages/components\n- `shadow-docs/knowledge/music-player.md`\n  - 当前结论: audio-player 域守卫语义化纪律（类型类约束并入 tsconfig.guard.json；守卫断言语义不镜像实现）；全文件禁 `scrollIntoView`、面板壳 `overflow: clip` ≥2、motion 令牌五令牌名单、显隐行内样式纪律、Escape 按层收起（popover→抽屉→词卷→面板）\n  - 适用 scope: packages/components/audio-player\n- `shadow-docs/knowledge/about-code-structure.md`\n  - 当前结论: 拆分后功能与拆分前完全一致、每文件单一职责（参照先例；80 行硬上限不适用于本域）\n  - 适用 scope: 参照，不直接约束\n\n## 决策\n- **选型:** 方案 A——样式按区块模块化 + 3 个自包含叶子组件（用户已确认；范围含 PlayerPanel + MiniPlayer）\n- **对比方案:**\n  - B 只抽样式不抽子组件：主文件仍 ~700 行，达不到 ≤500 规范线，半途而废\n  - C 全子组件化（按视觉区块五拆）：跨区块状态（Escape 分层收起串起 volOpen/queueOpen/wordsOpen、词卷跟随 effect 抓 wordsVerseRef、foldLatch 横跨 QZone 与 Panel、body 滚动锁）需大量 props 钻孔 + ref 转发，行为不变重构风险最高\n- **理由:** A 完全对标 ImagePreview 同构先例；状态/refs/Escape 分层全部留守主组件，只拆三个真正自包含的叶子（音量 popover 自带开合态与外点收起、队列区纯渲染、移动册页自持 mobilePage/拖拽关闭），行为零变化可守。\n\n**拆分布局**（新建 `panel/`、`mini/` 子目录，tsconfig.guard.json `./**/*.ts(x)` 自动覆盖）：\n\n```\naudio-player/\n├── PlayerPanel.tsx            # 收敛 ~430 行：refs/state/effects/Escape 分层/滚动锁/词卷跟随/跑马灯量尺 + JSX 骨架\n├── MiniPlayer.tsx             # 收敛 ~180 行：逻辑 + JSX\n├── panel-sources.mjs          # 守卫专用：PANEL_SOURCES 规范顺序清单 + readPanelSource 拼接读取\n├── panel/\n│   ├── PanelVolume.tsx        # 音量钮 + popover + 竖向滑杆（外点收起/拖拽/键盘内聚）\n│   ├── PanelQueue.tsx         # 遮罩 + 翻页屏 + 队列行 JSX（drawerListRef 经 props 传入）\n│   ├── PanelMobile.tsx        # 册页（mobilePage 态/gotoPage/拖拽关闭/词窗跟随）\n│   └── styles/\n│       ├── tokens.ts          # HAIRLINE/INK_*/EASE/QUICK/DUR_PANEL/FOLD_*/GHOST_*/GRAIN/focusRing/reducedMotion/STAGE_TIER_*\n│       ├── shell.tsx          # WashSrc/PaperVeil/Backdrop/Panel/CloseButton/TopTools/WordsToggle/DrawerButton\n│       ├── ghost.tsx          # GhostLayer/GhostLine\n│       ├── stage.tsx          # NowStage…EpiRow（含碟化家族，保持 PlateArt→StageTitle 声明顺序）\n│       ├── dock.tsx           # NowDock…ModeButton + VolWrap/VolumeButton/VolumePop/VSlider 家族（保持 PlayButton→『/* 模式钮』→『/* 音量』注释锚点）\n│       ├── words.tsx          # WordsView…WordsLine\n│       ├── queue.tsx          # DrawerScrim/QZone/QScreen/SectionHeading/QueueList…QueueMeta\n│       └── mobile.tsx         # GrabHandle…WordBloom（保持 LeafPlate→PlateNo→LeafTitle→WordWindow→WordLine→WordEmpty→PageTicks→PageTick→WordBloom 顺序）\n└── mini/\n    └── styles.tsx             # MiniPlayer 全部 styled/keyframes/样式常量\n```\n\n**守卫锚点策略（本次的关键决策）**：style.test.mjs / player-panel.test.mjs 既有 ~25 处 `indexOf` 声明名切片依赖单文件内的声明顺序。拆分后引入 `panel-sources.mjs` 按**规范顺序**（tokens→shell→ghost→stage→dock→words→queue→mobile→PlayerPanel→PanelVolume→PanelQueue→PanelMobile）拼接面板源码，锚点语义不变（声明在各模块内的相对顺序 = 原文件顺序，brief 已钉死必须保持）；全文件级断言（禁裸 hex、禁 scrollIntoView、motion 令牌、overflow: clip ≥2、transition 布局属性）升级为逐文件遍历——比原单文件扫描更强。mini-player.test.mjs 改「MiniPlayer.tsx + mini/styles.tsx」拼接读取。新增拆分纪律守卫：PlayerPanel.tsx 与 MiniPlayer.tsx 行数 ≤500 断言 + PANEL_SOURCES 清单钉死。\n\n**唯一的逻辑等价拆分（需在 apply 时走查）**：原「播放列表定位到当前曲」单一 effect 同时管抽屉列表与移动列表（依赖任一变化时双列表都重定位）；拆分后抽屉部分留守主文件（依赖 isPanelOpen/currentIndex/queueOpen），移动部分随迁 PanelMobile（依赖 isPanelOpen/currentIndex/mobilePage）。视觉行为等价（跨列表重定位本就互不可见），由既有守卫与部署后目检兜底。\n\n**行为零变化承诺**：不改动任何样式值、DOM 结构、aria 语义、交互时序、i18n key；不改 provider/specs/index；MiniPlayer 仅抽样式。\n\n## 任务\n### Phase 1 样式模块化（面板）\n- [ ] 新建 `panel-sources.mjs`：PANEL_SOURCES 规范顺序清单 + `readPanelSource()` 拼接读取 — `packages/components/audio-player/panel-sources.mjs`\n- [ ] 抽出 tokens.ts + shell.tsx + ghost.tsx，PlayerPanel.tsx 改 import — `packages/components/audio-player/panel/styles/`\n- [ ] 抽出 stage.tsx（碟化家族）+ dock.tsx（含音量家族），保持注释锚点与声明顺序 — `packages/components/audio-player/panel/styles/`\n- [ ] 抽出 words.tsx + queue.tsx + mobile.tsx，保持声明顺序 — `packages/components/audio-player/panel/styles/`\n\n### Phase 2 叶子组件与主文件收敛\n- [ ] PanelVolume.tsx：音量钮/popover/竖向滑杆整体迁入（volumeFromPointer/onVSliderKeyDown/外点收起 effect 内聚；volOpen 仍由面板持有，Escape 分层不变） — `packages/components/audio-player/panel/PanelVolume.tsx`\n- [ ] PanelQueue.tsx：遮罩 + 翻页屏 + 队列行 JSX 迁入，drawerListRef 经 props 传入，抽屉定位 effect 留守 — `packages/components/audio-player/panel/PanelQueue.tsx`\n- [ ] PanelMobile.tsx：册页 JSX + mobilePage/gotoPage/拖拽关闭/词窗跟随/移动队列定位迁入 — `packages/components/audio-player/panel/PanelMobile.tsx`\n- [ ] PlayerPanel.tsx 收敛 ≤500 行，Ghost JSX/词卷 JSX/舞台 JSX/dock JSX 留守 — `packages/components/audio-player/PlayerPanel.tsx`\n\n### Phase 3 MiniPlayer 与守卫收口\n- [ ] mini/styles.tsx 抽取 MiniPlayer 全部样式，主文件 ≤500 行 — `packages/components/audio-player/mini/styles.tsx`\n- [ ] 三个测试文件改拼接/逐文件读取 + 新增拆分纪律守卫（行数上限 + 清单钉死） — `packages/components/audio-player/{style,player-panel,mini-player}.test.mjs`\n- [ ] 全门禁：域 5 测试全绿 + 根 tsc + oxlint + build:next — `pnpm exec tsc --noEmit`\n\n## 补充\nPlayerPanel.tsx 2089 行 / MiniPlayer.tsx 634 行超出组件包「主组件 ≤500 行」规范。行为零变化纯拆分：面板样式按区块模块化（panel/styles/ 8 模块）+ 3 个自包含叶子组件（PanelVolume/PanelQueue/PanelMobile），MiniPlayer 抽 mini/styles.tsx；守卫测试改 panel-sources 拼接读取并新增行数上限守卫。方案与任务见 shadow-docs/changes/20261005-refactor-player-split/brief.md\n\n完整 brief：shadow-docs/changes/20261005-refactor-player-split/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261005-refactor-player-split\",\"type\":\"refactor\",\"scope\":\"audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261005-refactor-player-split/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/mini-player.test.mjs",
        "packages/components/audio-player/mini/styles.tsx",
        "packages/components/audio-player/panel-sources.mjs",
        "packages/components/audio-player/panel/PanelMobile.tsx",
        "packages/components/audio-player/panel/PanelQueue.tsx",
        "packages/components/audio-player/panel/PanelVolume.tsx",
        "packages/components/audio-player/panel/styles/dock.tsx",
        "packages/components/audio-player/panel/styles/ghost.tsx",
        "packages/components/audio-player/panel/styles/mobile.tsx",
        "packages/components/audio-player/panel/styles/queue.tsx",
        "packages/components/audio-player/panel/styles/shell.tsx",
        "packages/components/audio-player/panel/styles/stage.tsx",
        "packages/components/audio-player/panel/styles/tokens.ts",
        "packages/components/audio-player/panel/styles/words.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261005-refactor-player-split/brief.md",
        "shadow-docs/knowledge/components.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "refactor(player): 播放器组件拆分——样式模块化 + 叶子组件，主组件 ≤500 行",
      "title": "refactor(player): 播放器组件拆分——样式模块化 + 叶子组件，主组件 ≤500 行",
      "body": "Closes #473\n\n完整 brief：shadow-docs/changes/20261005-refactor-player-split/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/components.md",
    "reason": "拆分后主组件达标（PlayerPanel 467 / MiniPlayer 178 行）与 panel/mini 子目录布局、panel-sources 拼接守卫读取纪律、行数上限守卫是长期有效事实，须写入 components.md AudioPlayer 段；music-player.md 执行约束补拼接读取一句"
  }
}
---

# refactor(player): 播放器组件拆分——样式模块化 + 叶子组件，主组件 ≤500 行

## 动机

`PlayerPanel.tsx` 已膨胀到 **2089 行**（~1420 行 styled 样式 + ~648 行组件体），`MiniPlayer.tsx` **634 行**，违反组件包既有设计规范（components.md：ImagePreview 先例「主组件不超过 500 行，按职责拆分独立文件」）。单文件承载 60+ 个 styled 组件、8 个 effect、5 组交互逻辑，改动定位成本高、合并冲突面大。本次按既定规范做**行为零变化**的纯结构性拆分，不触碰任何样式值、DOM 结构与交互语义。

## 复杂度评级

- **评级:** M
- **理由:** 三要素对照——契约变更：无（公开 API `TrackSource/TrackResolver/AudioPlayerActions/AudioPlayerState` 与 `@wuh.site/components/audio-player` exports 零变化，纯包内搬移）；触及面：大（PlayerPanel/MiniPlayer 两个主文件 + 新增 12 个拆分文件 + 3 个守卫测试更新，共 ~16 文件）；可发现性：高（机械搬移、域内 47+ 守卫 + 根 tsc + oxlint 全网覆盖，且拆分后新增行数上限守卫防回潮）。
- **期望验证深度:** unit（域 5 测试文件全绿 + 根 `tsc --noEmit` + oxlint 0 errors + `pnpm build:next`）

## 引用规范

- `shadow-docs/knowledge/components.md`
  - 当前结论: 组件按职责拆分独立文件，主组件不超过 500 行（ImagePreview 先例：types / hooks / Toolbar / MoreMenu / ThumbnailRail / styles/）；颜色只走主题 token、断点只用 `BREAKPOINTS`、显隐态组件一律行内样式驱动
  - 适用 scope: packages/components
- `shadow-docs/knowledge/music-player.md`
  - 当前结论: audio-player 域守卫语义化纪律（类型类约束并入 tsconfig.guard.json；守卫断言语义不镜像实现）；全文件禁 `scrollIntoView`、面板壳 `overflow: clip` ≥2、motion 令牌五令牌名单、显隐行内样式纪律、Escape 按层收起（popover→抽屉→词卷→面板）
  - 适用 scope: packages/components/audio-player
- `shadow-docs/knowledge/about-code-structure.md`
  - 当前结论: 拆分后功能与拆分前完全一致、每文件单一职责（参照先例；80 行硬上限不适用于本域）
  - 适用 scope: 参照，不直接约束

## 决策

- **选型:** 方案 A——样式按区块模块化 + 3 个自包含叶子组件（用户已确认；范围含 PlayerPanel + MiniPlayer）
- **对比方案:**
  - B 只抽样式不抽子组件：主文件仍 ~700 行，达不到 ≤500 规范线，半途而废
  - C 全子组件化（按视觉区块五拆）：跨区块状态（Escape 分层收起串起 volOpen/queueOpen/wordsOpen、词卷跟随 effect 抓 wordsVerseRef、foldLatch 横跨 QZone 与 Panel、body 滚动锁）需大量 props 钻孔 + ref 转发，行为不变重构风险最高
- **理由:** A 完全对标 ImagePreview 同构先例；状态/refs/Escape 分层全部留守主组件，只拆三个真正自包含的叶子（音量 popover 自带开合态与外点收起、队列区纯渲染、移动册页自持 mobilePage/拖拽关闭），行为零变化可守。

**拆分布局**（新建 `panel/`、`mini/` 子目录，tsconfig.guard.json `./**/*.ts(x)` 自动覆盖）：

```
audio-player/
├── PlayerPanel.tsx            # 收敛 ~430 行：refs/state/effects/Escape 分层/滚动锁/词卷跟随/跑马灯量尺 + JSX 骨架
├── MiniPlayer.tsx             # 收敛 ~180 行：逻辑 + JSX
├── panel-sources.mjs          # 守卫专用：PANEL_SOURCES 规范顺序清单 + readPanelSource 拼接读取
├── panel/
│   ├── PanelVolume.tsx        # 音量钮 + popover + 竖向滑杆（外点收起/拖拽/键盘内聚）
│   ├── PanelQueue.tsx         # 遮罩 + 翻页屏 + 队列行 JSX（drawerListRef 经 props 传入）
│   ├── PanelMobile.tsx        # 册页（mobilePage 态/gotoPage/拖拽关闭/词窗跟随）
│   └── styles/
│       ├── tokens.ts          # HAIRLINE/INK_*/EASE/QUICK/DUR_PANEL/FOLD_*/GHOST_*/GRAIN/focusRing/reducedMotion/STAGE_TIER_*
│       ├── shell.tsx          # WashSrc/PaperVeil/Backdrop/Panel/CloseButton/TopTools/WordsToggle/DrawerButton
│       ├── ghost.tsx          # GhostLayer/GhostLine
│       ├── stage.tsx          # NowStage…EpiRow（含碟化家族，保持 PlateArt→StageTitle 声明顺序）
│       ├── dock.tsx           # NowDock…ModeButton + VolWrap/VolumeButton/VolumePop/VSlider 家族（保持 PlayButton→『/* 模式钮』→『/* 音量』注释锚点）
│       ├── words.tsx          # WordsView…WordsLine
│       ├── queue.tsx          # DrawerScrim/QZone/QScreen/SectionHeading/QueueList…QueueMeta
│       └── mobile.tsx         # GrabHandle…WordBloom（保持 LeafPlate→PlateNo→LeafTitle→WordWindow→WordLine→WordEmpty→PageTicks→PageTick→WordBloom 顺序）
└── mini/
    └── styles.tsx             # MiniPlayer 全部 styled/keyframes/样式常量
```

**守卫锚点策略（本次的关键决策）**：style.test.mjs / player-panel.test.mjs 既有 ~25 处 `indexOf` 声明名切片依赖单文件内的声明顺序。拆分后引入 `panel-sources.mjs` 按**规范顺序**（tokens→shell→ghost→stage→dock→words→queue→mobile→PlayerPanel→PanelVolume→PanelQueue→PanelMobile）拼接面板源码，锚点语义不变（声明在各模块内的相对顺序 = 原文件顺序，brief 已钉死必须保持）；全文件级断言（禁裸 hex、禁 scrollIntoView、motion 令牌、overflow: clip ≥2、transition 布局属性）升级为逐文件遍历——比原单文件扫描更强。mini-player.test.mjs 改「MiniPlayer.tsx + mini/styles.tsx」拼接读取。新增拆分纪律守卫：PlayerPanel.tsx 与 MiniPlayer.tsx 行数 ≤500 断言 + PANEL_SOURCES 清单钉死。

**唯一的逻辑等价拆分（需在 apply 时走查）**：原「播放列表定位到当前曲」单一 effect 同时管抽屉列表与移动列表（依赖任一变化时双列表都重定位）；拆分后抽屉部分留守主文件（依赖 isPanelOpen/currentIndex/queueOpen），移动部分随迁 PanelMobile（依赖 isPanelOpen/currentIndex/mobilePage）。视觉行为等价（跨列表重定位本就互不可见），由既有守卫与部署后目检兜底。

**行为零变化承诺**：不改动任何样式值、DOM 结构、aria 语义、交互时序、i18n key；不改 provider/specs/index；MiniPlayer 仅抽样式。

## 任务

### Phase 1 样式模块化（面板）
- [x] 新建 `panel-sources.mjs`：PANEL_SOURCES 规范顺序清单 + `readPanelSource()` 拼接读取 — `packages/components/audio-player/panel-sources.mjs`
- [x] 抽出 tokens.ts + shell.tsx + ghost.tsx，PlayerPanel.tsx 改 import — `packages/components/audio-player/panel/styles/`
- [x] 抽出 stage.tsx（碟化家族）+ dock.tsx（含音量家族），保持注释锚点与声明顺序 — `packages/components/audio-player/panel/styles/`
- [x] 抽出 words.tsx + queue.tsx + mobile.tsx，保持声明顺序 — `packages/components/audio-player/panel/styles/`

### Phase 2 叶子组件与主文件收敛
- [x] PanelVolume.tsx：音量钮/popover/竖向滑杆整体迁入（volumeFromPointer/onVSliderKeyDown/外点收起 effect 内聚；volOpen 仍由面板持有，Escape 分层不变） — `packages/components/audio-player/panel/PanelVolume.tsx`
- [x] PanelQueue.tsx：遮罩 + 翻页屏 + 队列行 JSX 迁入，drawerListRef 经 props 传入，抽屉定位 effect 留守 — `packages/components/audio-player/panel/PanelQueue.tsx`
- [x] PanelMobile.tsx：册页 JSX + mobilePage/gotoPage/拖拽关闭/词窗跟随/移动队列定位迁入 — `packages/components/audio-player/panel/PanelMobile.tsx`
- [x] PlayerPanel.tsx 收敛 ≤500 行，Ghost JSX/词卷 JSX/舞台 JSX/dock JSX 留守 — `packages/components/audio-player/PlayerPanel.tsx`

### Phase 3 MiniPlayer 与守卫收口
- [x] mini/styles.tsx 抽取 MiniPlayer 全部样式，主文件 ≤500 行 — `packages/components/audio-player/mini/styles.tsx`
- [x] 三个测试文件改拼接/逐文件读取 + 新增拆分纪律守卫（行数上限 + 清单钉死） — `packages/components/audio-player/{style,player-panel,mini-player}.test.mjs`
- [x] 全门禁：域 5 测试全绿 + 根 tsc + oxlint + build:next — `pnpm exec tsc --noEmit`

## 结果

- 实际耗时: ≈2 小时（含并行会话内存争用的等待与重试）
- 验证: 全绿——域守卫逐文件跑：provider 6/6、style 19/19、player-panel 22/22、mini-player 8/8、typecheck 1/1；站点 wiring 10/10；根 `tsc --noEmit` exit 0；oxlint audio-player 包 25 文件 0 warnings 0 errors；`next build` exit 0（14/14 页生成）。拆分纪律：PlayerPanel 2089→467 行、MiniPlayer 634→178 行（≤500 守卫钉死，PANEL_SOURCES 顺序清单钉死，声明普查 100+35 条无丢失无重复）；JSX 元素多重集对比证实 DOM 零变化（唯一差异 = QueueRows 去重两处队列行，属预期）。单次意外记录：`node --test` 合跑 style.test 时 V8 worker 原生崩溃（并行 lint:next 会话吃满单核 + free 内存 <200MB），单文件连跑 3 轮 19/19 证守卫稳定；`next build` 前两次在 page data 收集阶段 Turbopack worker SIGSEGV（同因内存挤兑），第三次全绿——均为环境性失败，非代码回归，runtime 目检按惯例移至部署后生产复验（v1.4.43 先例）。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/components.md`（AudioPlayer 段补拆分布局与主组件达标结论）、`shadow-docs/knowledge/music-player.md`（执行约束补「源码守卫经 panel-sources 拼接读取，声明顺序 = 拼接顺序钉死」）
- **理由:** 拆分后的文件布局、行数红线与守卫读取纪律是长期有效事实，review 阶段按 unit 深度写入（verified-depth: unit）；行为语义卡片本就有记载，不重复。
