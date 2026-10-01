---
{
  "schema": "shadow-dev/v1",
  "name": "20261002-fix-player-queue-fold-hotfix",
  "type": "fix",
  "scope": "packages/components/audio-player",
  "status": "committed",
  "baseBranch": "main",
  "branch": "fix/20261002-fix-player-queue-fold-hotfix",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": null,
    "issue": null,
    "issueUrl": null,
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "36ebfd727d26b57d54540eac59469c4318fdb937",
    "verifiedAt": "2026-10-01T23:41:32.466Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "f36e02fb9f766767c403fff559143fc8eb0a3c01",
    "planHash": "864fc2072f7094080f02cace27f25b1469ad99b3078e40c3272bb053f63678fb",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261002-fix-player-queue-fold-hotfix/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 队列翻页屏 hotfix——碟面环包含块归位 + 粘性开合\n\n- PlayButton 补 position: relative：碟面环 ::after 包含块归位（缺位时白环画成横贯 dock 的 1138×116 巨椭圆，v1.4.54 生产 DOM 实证）\n- foldLatch 粘性开合：进入右缘热区锁存开态，面板内漫游（末行移出/dock/舞台边缘）不收拢，离板才折回；行内样式驱动合显隐纪律\n- 守卫：PlayButton 包含块断言 + foldLatch 行内驱动断言；knowledge 原位更新（粘性语义 + perspective 包含块链教训）",
      "title": "fix(player): 队列翻页屏——碟面环归位 + 粘性开合",
      "body": ""
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261002-fix-player-queue-fold-hotfix/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 队列翻页屏 hotfix——碟面环包含块归位 + 粘性开合"
    }
  },
  "knowledge": null
}
---

# 播放面板队列翻页屏 hotfix：碟面环包含块 + 粘性开合

## 动机
v1.4.54 上线后用户实测两缺陷：① 播放盘碟面环 ::after（absolute inset 9px）因 PlayButton 缺 position: relative，包含块落到 NowDock，白环画成 1138×116 横贯 dock 的巨椭圆（生产 DOM 实证：computed width 1138px / border oklab 0.99 近白）；② 转正态指针从列表末行移出（仍在面板内，如向舞台/dock 漫游）即收拢，浏览体验割裂——期望面板内漫游不收拢、离板才折回。

## 复杂度评级
- **评级:** S
- **理由:** 契约无变化；触及 PlayerPanel 单文件两处小改 + 守卫断言；生产可见故 unit + 上线后目测。
- **期望验证深度:** unit（守卫 + 域门禁）+ 生产 runtime 目测

## 引用规范
- shadow-docs/knowledge/music-player.md
  - 当前结论: 翻页屏三条铁律（静止=起点/preserve-3d 透传/令牌完整性）；显隐态行内样式驱动；激活态行内自定义属性
  - 适用 scope: packages/components/audio-player

## 决策
- **选型:** ① PlayButton 补 position: relative；② foldLatch 粘性开合——QZone pointerenter 锁存开、Panel pointerleave 解除，foldOpen = queueOpen || foldLatch 走行内样式（显隐纪律），CSS :hover 保留零延迟开启
- **对比方案:** 纯 CSS L 形热区（表达不了粘性、dock 钮命中冲突）；仅延长折回宽限（治标）
- **理由:** 语义精确对齐用户期望「面板内漫游不收、离板才收」；行内样式免疫两连败禁令

## 任务
### Phase 1
- [x] PlayButton 补 position: relative（碟面环包含块归位）— `packages/components/audio-player/PlayerPanel.tsx` — 一行修
- [x] foldLatch 粘性开合 + 行内样式驱动 + 面板关闭复位 — `packages/components/audio-player/PlayerPanel.tsx` — 改写
### Phase 2
- [x] 守卫：PlayButton position: relative、foldLatch 行内驱动断言 — `packages/components/audio-player/style.test.mjs` — 新增
### Phase 3
- [x] 域门禁全绿 + 生产目测 — 验证

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 补粘性开合语义与「perspective 使面板成为 abs 后代包含块」的包含块链教训
