---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-style-player-panel-inkwash",
  "type": "style",
  "scope": "music-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260929-style-player-panel-inkwash",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 414,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/414",
    "pullRequest": 415,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/415"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "c9709dc2a144e8f0a57c8b921fd5f1b416a77bf0",
    "verifiedAt": "2026-10-05T10:40:33.661Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:415",
    "planHash": "6719443c2e7ea5a4ff2e796a3648b2d096fd2569dea52d58c8d97f133872ae8e",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 播放面板「封面晕染纸底」重设计",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n线上面板（#402 定稿的绢底印花晕染）实测突兀：封面原图 1:1 铺满 + 74–88% 渐变罩，照片结构完整可辨（人脸正压歌词列），三栏糊成一片；左栏控制区悬空；歌词——播放器的情绪核心——当前句只「变红加粗」，无任何签名感。用户明确倾向保留背景图但要求不突兀，并确认了「封面晕染纸底」方向（原型 localhost:4321 三方向对比后拍板）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 播放器降级语义（跳过提示占歌手行、卡片高度不变）与接口契约不受本变更影响；组件公开 API 不变\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: audio-player 站点专属例外（本地 keyframes + --motion-* 引用自持）；reduced-motion 必须降级；禁止 JS scroll/resize 监听器（墨晕位移用元素级读取，不加监听）\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 淡化色统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`；断点只用 BREAKPOINTS 语义常量；font 简写不排在 font-size 后；动态状态用 transient prop 不用跨组件插值选择器；外部内容图片固有颜色不受 token 限制（封面晕染的合法性来源）\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 方向 C「封面晕染纸底」五层配方——① `WashSrc`：封面图 `blur(64px) saturate(0.92)`，亮色 `brightness(1.18)` / 暗色 `brightness(0.62)`（照片失去轮廓退化成色场）；② `Veil`：纸色 `color-mix(var(--background-100) 72%, transparent)` 全幅压平；③ 纸纹叠印：feTurbulence SVG data-URI 噪点 `multiply 6%` 挂 Panel::after（色场「印」进纸里）；④ 歌词/列表两栏局部纸罩（40%→26% 纵向渐变）；⑤ 令牌全走主题变量，暗色自动跟随\n- **结构:** 左栏拆 `NowHeader`（封面装裱+题名）与 `NowDock`（进度+控制+模式+音量）两个 grid 区：桌面 `grid-template-areas: \"now lyrics queue\" / \"dock lyrics queue\"`（dock 锚面板底边，矮视口不再挤）；移动端 `areas: \"header\" \"tabs\" \"body\" \"dock\"`（dock 吸底 safe-area 内，歌词占满中段）\n- **签名元素:** 纸上歌词——当前句 serif 放大至 `--font-size-lg`、实墨、左侧 3px 朱砂侧标、`writeIn` 书写显现（opacity+5px 上浮，audio-player 本地 keyframes 先例）；相邻句淡墨、其余隐墨；「墨随声走」——当前句背后一团朱砂 9% + 墨 6% 软墨晕（blur 10px），随 activeLyric 位移（读取 offsetTop 设 transform，无 scroll 监听）\n- **播放列表:** 01–10 序号（JetBrains Mono 淡墨，与音乐页列表同语言）；当前项从粉底 pill 改朱砂左标 + 主色名；滚动条收 4px 发丝级\n- **对比方案:** A 全撤晕染（用户已明确要背景图，弃）；B 角落墨染（保留度不够，弃）；线上原版原图 1:1 铺（对比度失败根因，弃）\n- **理由:** 配方每层都有独立职责（模糊去轮廓/纸罩压明度/噪点印刷感/列罩保对比/令牌跟主题），多层叠加让照片「消失成颜色」；交互逻辑（焦点管理、Escape、歌词跟随、reduced-motion）全部保持\n\n## 任务\n### Phase 1\n- [ ] source guard 测试先行：晕染配方（blur 64px/veil 72%/列罩/dark 反转）、纸纹叠印、歌词签名（writeIn/朱砂侧标/near 淡化）、墨随声走（bloom offsetTop）、dock 结构（grid-areas + safe-area）、列表序号、既有交互保持（Escape/焦点回移/歌词跟随） — `packages/components/audio-player/player-panel.test.mjs` — 新增\n- [ ] 面板结构改造：删 `CoverWash`/`WashScrim`，换 `WashSrc`+`Veil`+列罩+纸纹；`NowPlaying` 拆 `NowHeader`/`NowDock`；Panel 改 grid-template-areas（桌面锚底/移动吸底） — `packages/components/audio-player/PlayerPanel.tsx` — 修改\n- [ ] 歌词签名与列表样式：LyricLine 三态（active/near/ghost）+ writeIn + 朱砂侧标；bloom 元素与位移；QueueItem 序号 + 左标；发丝滚动条 — `packages/components/audio-player/PlayerPanel.tsx` — 修改\n\n### Phase 2\n- [ ] 验证：`node --test packages/components/audio-player/` 全绿、tsc（根 + site）无新增错误、oxlint 无告警；浏览器桌面 1280 + 移动 390 视口对照视觉稿目测、暗色主题目测 — 验证任务\n- [ ] 知识评估落地：music-player.md 补面板视觉语义（晕染配方、歌词签名、dock 结构）— `shadow-docs/knowledge/music-player.md` — 原位更新\n\n完整 brief：shadow-docs/changes/20260929-style-player-panel-inkwash/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-style-player-panel-inkwash\",\"type\":\"style\",\"scope\":\"music-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-style-player-panel-inkwash/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260929-style-player-panel-inkwash/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 播放面板封面晕染纸底——歌词签名与 dock 结构重排"
    }
  },
  "knowledge": null
}
---

# 播放面板「封面晕染纸底」重设计

## 动机
线上面板（#402 定稿的绢底印花晕染）实测突兀：封面原图 1:1 铺满 + 74–88% 渐变罩，照片结构完整可辨（人脸正压歌词列），三栏糊成一片；左栏控制区悬空；歌词——播放器的情绪核心——当前句只「变红加粗」，无任何签名感。用户明确倾向保留背景图但要求不突兀，并确认了「封面晕染纸底」方向（原型 localhost:4321 三方向对比后拍板）。

## 引用规范
- shadow-docs/knowledge/music-player.md
  - 当前结论: 播放器降级语义（跳过提示占歌手行、卡片高度不变）与接口契约不受本变更影响；组件公开 API 不变
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/animation-system.md
  - 当前结论: audio-player 站点专属例外（本地 keyframes + --motion-* 引用自持）；reduced-motion 必须降级；禁止 JS scroll/resize 监听器（墨晕位移用元素级读取，不加监听）
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 淡化色统一 `color-mix(in oklab, var(--text-color) 72%, transparent)`；断点只用 BREAKPOINTS 语义常量；font 简写不排在 font-size 后；动态状态用 transient prop 不用跨组件插值选择器；外部内容图片固有颜色不受 token 限制（封面晕染的合法性来源）
  - 适用 scope: packages/components/audio-player

## 决策
- **选型:** 方向 C「封面晕染纸底」五层配方——① `WashSrc`：封面图 `blur(64px) saturate(0.92)`，亮色 `brightness(1.18)` / 暗色 `brightness(0.62)`（照片失去轮廓退化成色场）；② `Veil`：纸色 `color-mix(var(--background-100) 72%, transparent)` 全幅压平；③ 纸纹叠印：feTurbulence SVG data-URI 噪点 `multiply 6%` 挂 Panel::after（色场「印」进纸里）；④ 歌词/列表两栏局部纸罩（40%→26% 纵向渐变）；⑤ 令牌全走主题变量，暗色自动跟随
- **结构:** 左栏拆 `NowHeader`（封面装裱+题名）与 `NowDock`（进度+控制+模式+音量）两个 grid 区：桌面 `grid-template-areas: "now lyrics queue" / "dock lyrics queue"`（dock 锚面板底边，矮视口不再挤）；移动端 `areas: "header" "tabs" "body" "dock"`（dock 吸底 safe-area 内，歌词占满中段）
- **签名元素:** 纸上歌词——当前句 serif 放大至 `--font-size-lg`、实墨、左侧 3px 朱砂侧标、`writeIn` 书写显现（opacity+5px 上浮，audio-player 本地 keyframes 先例）；相邻句淡墨、其余隐墨；「墨随声走」——当前句背后一团朱砂 9% + 墨 6% 软墨晕（blur 10px），随 activeLyric 位移（读取 offsetTop 设 transform，无 scroll 监听）
- **播放列表:** 01–10 序号（JetBrains Mono 淡墨，与音乐页列表同语言）；当前项从粉底 pill 改朱砂左标 + 主色名；滚动条收 4px 发丝级
- **对比方案:** A 全撤晕染（用户已明确要背景图，弃）；B 角落墨染（保留度不够，弃）；线上原版原图 1:1 铺（对比度失败根因，弃）
- **理由:** 配方每层都有独立职责（模糊去轮廓/纸罩压明度/噪点印刷感/列罩保对比/令牌跟主题），多层叠加让照片「消失成颜色」；交互逻辑（焦点管理、Escape、歌词跟随、reduced-motion）全部保持

## 任务
### Phase 1
- [x] source guard 测试先行：晕染配方（blur 64px/veil 72%/列罩/dark 反转）、纸纹叠印、歌词签名（writeIn/朱砂侧标/near 淡化）、墨随声走（bloom offsetTop）、dock 结构（grid-areas + safe-area）、列表序号、既有交互保持（Escape/焦点回移/歌词跟随） — `packages/components/audio-player/player-panel.test.mjs` — 新增
- [x] 面板结构改造：删 `CoverWash`/`WashScrim`，换 `WashSrc`+`Veil`+列罩+纸纹；`NowPlaying` 拆 `NowHeader`/`NowDock`；Panel 改 grid-template-areas（桌面锚底/移动吸底） — `packages/components/audio-player/PlayerPanel.tsx` — 修改
- [x] 歌词签名与列表样式：LyricLine 三态（active/near/ghost）+ writeIn + 朱砂侧标；bloom 元素与位移；QueueItem 序号 + 左标；发丝滚动条 — `packages/components/audio-player/PlayerPanel.tsx` — 修改

### Phase 2
- [x] 验证：`node --test packages/components/audio-player/` 全绿、tsc（根 + site）无新增错误、oxlint 无告警；浏览器桌面 1280 + 移动 390 视口对照视觉稿目测、暗色主题目测 — 验证任务
- [x] 知识评估落地：music-player.md 补面板视觉语义（晕染配方、歌词签名、dock 结构）— `shadow-docs/knowledge/music-player.md` — 原位更新

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新（原位小改）
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 面板视觉语义（封面晕染五层配方、歌词当前句签名、dock 结构）是长期有效事实，归位 music-player.md 播放器卡片；design-system.md 的「外部内容图片固有颜色不受 token 限制」为本变更晕染合法性来源，无需改卡
