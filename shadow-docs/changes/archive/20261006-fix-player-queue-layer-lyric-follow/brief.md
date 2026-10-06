---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-fix-player-queue-layer-lyric-follow",
  "type": "fix",
  "scope": "packages/components/audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261006-fix-player-queue-layer-lyric-follow",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/panel/PanelQueue.tsx",
    "packages/components/audio-player/panel/styles/dock.tsx",
    "packages/components/audio-player/panel/styles/queue.tsx",
    "packages/components/audio-player/panel/styles/shell.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 481,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/481",
    "pullRequest": 482,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/482"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "3926a919684f3f099fe646294233f34830bd490f",
    "verifiedAt": "2026-10-06T08:37:22.023Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:482",
    "planHash": "def6004cce904938c0ecb2a00d8f84409e6f9dd77545ae26c94114f50dff676c",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 播放器四修：队列转正盖过进度条/热区整卡化、墨痕暂停保留、词卷随播滚动",
      "titleRaw": "播放器四修：队列转正盖过进度条/热区整卡化、墨痕暂停保留、词卷随播滚动",
      "supplement": "四个生产 bug 合并一单：①翻页屏转正后整栏升 z10 盖过 dock（进度条不再浮在列表上，整卡可悬停可选）；②工具钮 z12 恒高；③墨痕歌词暂停保留；④词卷随播滚动竖排 scrollLeft 基准修正（runtime 复现）。详见 shadow-docs/changes/20261006-fix-player-queue-layer-lyric-follow/brief.md",
      "body": "## 动机\n用户生产反馈四个 bug（2026-10-06）：\n\n1. 右侧播放列表鼠标移入热区\"只认 ListItem 区域\"，要求热区为 role=\"group\" 整卡容器；\n2. 右侧播放列表 zIndex 太低，进度条浮在列表卡片上方；\n3. 暂停播放时左侧水墨纹（墨痕）歌词不应消失；\n4. 词卷（歌词面板）没有跟随播放进度滚动。\n\n根因检索结论：#1/#2 同根因——NowDock/TopTools/CloseButton 静态 z9 压在翻页屏热区 z8 之上（20261001 定稿\"hover 不得劫持\"），转正后指针一进入 dock 横带即命中 dock（非 QZone 后代）→ QZone pointerleave 误触发折回、CSS :hover 同断，卡片下缘不可选——等效热区只剩行区域；#3 是门控 `playing && wordsAvailable && !wordsOpen`（PlayerPanel.tsx），属用户拍板修订 active 结论「暂停自动隐去」；#4 词卷跟随 effect 的竖排 scrollLeft 公式基准硬伤——WordsVerse 为 static，`el.offsetLeft` 基准落在 WordsView 而非滚动容器，且守卫 player-panel.test.mjs 镜像钉死了该公式（正是 music-player.md「换算口径类守卫要断言语义、不能只镜像实现」的 #435 教训形态），公式从未 runtime 验证（目检两单均顺延）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md（verified 2026-10-05, unit）\n  - 当前结论: 队列翻页屏「dock/TopTools/CloseButton 升 z-index: 9（z8 热区之上，hover 不得劫持）」；「粘性开合：进 QZone 即锁存、离栏即折」；「墨痕歌词……词卷态/无词/暂停自动隐去」；「显隐态一律行内样式驱动，禁 styled 动态类/属性选择器」；「换算口径类守卫要断言语义、不能只镜像实现」\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/components.md（verified 2026-10-05, runtime）\n  - 当前结论: AudioPlayer 文件布局拆分纪律——面板守卫源码经 panel-sources.mjs PANEL_SOURCES 规范顺序拼接；叶子 props 沿用原标识符；主组件 ≤500 行\n  - 适用 scope: packages/components/audio-player\n- norms/ui-patterns.md / norms/interaction.md: 动效与交互反馈底线不变；prefers-reduced-motion 语义保留\n- knowledge/bug-investigation.md: 每个 bug 复现→根因→修复→回归单一上下文串联，#4 必须本地 runtime 复现后再改公式\n\n## 决策\n- **选型:** 一单四修（方案 A），三 Phase 一次交付。\n- **对比方案:** 方案 B 拆两单（层序单 + 歌词单）——两单各走一次 release/部署链，#4 的 runtime 环境本来就要为验证搭建，拆单不省工时只翻倍交付成本；方案 C 逐 bug 四单——#1/#2 拆开必互踩 queue.tsx/shell.tsx 同一守卫，否决。\n- **理由:**\n  - #1/#2 合并修：`foldOpen = queueOpen || foldLatch` 为真时 QZone 经**行内样式**升 `z-index: 10`（盖过 dock z9——进度条不再浮在列表上，指针在整卡包括眉标/留白/下缘不再误折回）；TopTools/CloseButton 静态 z 9→12 恒在热区之上（「劫持」结论修订为：**工具钮恒高于翻页屏**，翻页屏仅转正时高于 dock）；斜倚态维持现状不变（用户拍板），音量/詞/列表/关闭可达性不破坏。\n  - #3：门控改 `wordsAvailable && !wordsOpen`（暂停/待播保留，词卷态与无词仍隐去）；music-player.md 结论随之修订（release 阶段）。\n  - #4：先本地 mock runtime 复现现公式失效（列偏移基准差 + 负向域符号），修正居中公式并将守卫从镜像公式改为语义断言（断言\"当前句列中心 ≈ 视口中心\"的换算结构与容器定位基准，不钉死具体数值），en 横排回退公式同步校核。\n\n## 任务\n### Phase 1 — 层序与热区（#1/#2）\n- [ ] QZone 转正行内样式升 z-index: 10 — `packages/components/audio-player/panel/PanelQueue.tsx` — foldOpen 并集驱动 style 挂 `zIndex: 10`，注释更新\n- [ ] 工具钮层恒高 — `packages/components/audio-player/panel/styles/shell.tsx` — TopTools/CloseButton z 9→12，注释改为「恒高于翻页屏（含转正态）；Dock 注释同步修订」\n- [ ] dock 注释语义修订 — `packages/components/audio-player/panel/styles/dock.tsx` — z9 保留，注释说明被转正热区覆盖是拍板语义\n- [ ] 守卫 — `packages/components/audio-player/style.test.mjs` — 新增「转正盖过 dock（z10 行内驱动）+ 工具钮 z12 恒高 + Panel 壳禁 pointerleave 不回潮」断言\n\n### Phase 2 — 墨痕暂停保留（#3）\n- [ ] 门控修订 — `packages/components/audio-player/PlayerPanel.tsx` — GhostLayer 渲染条件去 `playing &&`，注释同步\n- [ ] 守卫 — `packages/components/audio-player/style.test.mjs` 或 `player-panel.test.mjs` — 钉死暂停保留（doesNotMatch `playing && wordsAvailable`）\n\n### Phase 3 — 词卷随播滚动修复（#4）\n- [ ] runtime 复现 — 本地 mock 起播 + 开词卷，实测 scrollLeft 值域与 el.offsetLeft 基准，留存失效证据\n- [ ] 修正居中公式 — `packages/components/audio-player/PlayerPanel.tsx` — offsetLeft 基准改为相对滚动容器（WordsVerse `position: relative` 或等价的相对偏移换算），负向域符号按实测修正；en 横排分支校核\n- [ ] 守卫语义化 — `packages/components/audio-player/player-panel.test.mjs` — 镜像公式断言替换为语义结构断言（基准容器 + 居中换算在场）\n\n### Phase 4 — 全门禁\n- [ ] audio-player 域全部 test.mjs 逐文件绿 + 根 tsc + oxlint + apps/site build\n- [ ] 部署后生产目检（网络恢复后）：四 bug 现场复核\n\n## 补充\n四个生产 bug 合并一单：①翻页屏转正后整栏升 z10 盖过 dock（进度条不再浮在列表上，整卡可悬停可选）；②工具钮 z12 恒高；③墨痕歌词暂停保留；④词卷随播滚动竖排 scrollLeft 基准修正（runtime 复现）。详见 shadow-docs/changes/20261006-fix-player-queue-layer-lyric-follow/brief.md\n\n完整 brief：shadow-docs/changes/20261006-fix-player-queue-layer-lyric-follow/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-fix-player-queue-layer-lyric-follow\",\"type\":\"fix\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-fix-player-queue-layer-lyric-follow/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/panel/PanelQueue.tsx",
        "packages/components/audio-player/panel/styles/dock.tsx",
        "packages/components/audio-player/panel/styles/shell.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/signals.md"
      ],
      "message": "fix(player): 队列转正盖过进度条与整卡热区、墨痕暂停保留、词卷 rect 增量居中 (#481)",
      "title": "fix(player): 播放器四修——队列转正盖过进度条/整卡热区、墨痕暂停保留、词卷随播滚动",
      "body": "Closes #481\n\n完整 brief：shadow-docs/changes/20261006-fix-player-queue-layer-lyric-follow/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "复核通过：main(3926a919) 即本次已验证内容（六源/守卫文件 + 卡片五处结论修订 + 信号写回，diff 与分支态一致）；知识动作与首轮 review 相同"
  }
}
---

# 播放器队列层序/热区 + 墨痕暂停保留 + 词卷随播滚动四修

## 动机

用户生产反馈四个 bug（2026-10-06）：

1. 右侧播放列表鼠标移入热区"只认 ListItem 区域"，要求热区为 role="group" 整卡容器；
2. 右侧播放列表 zIndex 太低，进度条浮在列表卡片上方；
3. 暂停播放时左侧水墨纹（墨痕）歌词不应消失；
4. 词卷（歌词面板）没有跟随播放进度滚动。

根因检索结论：#1/#2 同根因——NowDock/TopTools/CloseButton 静态 z9 压在翻页屏热区 z8 之上（20261001 定稿"hover 不得劫持"），转正后指针一进入 dock 横带即命中 dock（非 QZone 后代）→ QZone pointerleave 误触发折回、CSS :hover 同断，卡片下缘不可选——等效热区只剩行区域；#3 是门控 `playing && wordsAvailable && !wordsOpen`（PlayerPanel.tsx），属用户拍板修订 active 结论「暂停自动隐去」；#4 词卷跟随 effect 的竖排 scrollLeft 公式基准硬伤——WordsVerse 为 static，`el.offsetLeft` 基准落在 WordsView 而非滚动容器，且守卫 player-panel.test.mjs 镜像钉死了该公式（正是 music-player.md「换算口径类守卫要断言语义、不能只镜像实现」的 #435 教训形态），公式从未 runtime 验证（目检两单均顺延）。

## 复杂度评级

- **评级:** M
- **理由:** 契约不变（组件公开 API 零改动）；触及面为 audio-player 域 5 源文件 + 2 守卫文件；#4 可发现性低（vertical-rl 负向 scrollLeft 静默失效，必须 runtime 实测），整体需 runtime 深度。
- **期望验证深度:** runtime

## 引用规范

- shadow-docs/knowledge/music-player.md（verified 2026-10-05, unit）
  - 当前结论: 队列翻页屏「dock/TopTools/CloseButton 升 z-index: 9（z8 热区之上，hover 不得劫持）」；「粘性开合：进 QZone 即锁存、离栏即折」；「墨痕歌词……词卷态/无词/暂停自动隐去」；「显隐态一律行内样式驱动，禁 styled 动态类/属性选择器」；「换算口径类守卫要断言语义、不能只镜像实现」
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/components.md（verified 2026-10-05, runtime）
  - 当前结论: AudioPlayer 文件布局拆分纪律——面板守卫源码经 panel-sources.mjs PANEL_SOURCES 规范顺序拼接；叶子 props 沿用原标识符；主组件 ≤500 行
  - 适用 scope: packages/components/audio-player
- norms/ui-patterns.md / norms/interaction.md: 动效与交互反馈底线不变；prefers-reduced-motion 语义保留
- knowledge/bug-investigation.md: 每个 bug 复现→根因→修复→回归单一上下文串联，#4 必须本地 runtime 复现后再改公式

## 决策

- **选型:** 一单四修（方案 A），三 Phase 一次交付。
- **对比方案:** 方案 B 拆两单（层序单 + 歌词单）——两单各走一次 release/部署链，#4 的 runtime 环境本来就要为验证搭建，拆单不省工时只翻倍交付成本；方案 C 逐 bug 四单——#1/#2 拆开必互踩 queue.tsx/shell.tsx 同一守卫，否决。
- **理由:**
  - #1/#2 合并修：`foldOpen = queueOpen || foldLatch` 为真时 QZone 经**行内样式**升 `z-index: 10`（盖过 dock z9——进度条不再浮在列表上，指针在整卡包括眉标/留白/下缘不再误折回）；TopTools/CloseButton 静态 z 9→12 恒在热区之上（「劫持」结论修订为：**工具钮恒高于翻页屏**，翻页屏仅转正时高于 dock）；斜倚态维持现状不变（用户拍板），音量/詞/列表/关闭可达性不破坏。
  - #3：门控改 `wordsAvailable && !wordsOpen`（暂停/待播保留，词卷态与无词仍隐去）；music-player.md 结论随之修订（release 阶段）。
  - #4：先本地 mock runtime 复现现公式失效（列偏移基准差 + 负向域符号），修正居中公式并将守卫从镜像公式改为语义断言（断言"当前句列中心 ≈ 视口中心"的换算结构与容器定位基准，不钉死具体数值），en 横排回退公式同步校核。

## 任务

### Phase 1 — 层序与热区（#1/#2）
- [x] QZone 转正行内样式升 z-index: 10 — `packages/components/audio-player/panel/PanelQueue.tsx` — foldOpen 并集驱动 style 挂 `zIndex: 10`，注释更新
- [x] 工具钮层恒高 — `packages/components/audio-player/panel/styles/shell.tsx` — TopTools/CloseButton z 9→12，注释改为「恒高于翻页屏（含转正态）；Dock 注释同步修订」
- [x] dock 注释语义修订 — `packages/components/audio-player/panel/styles/dock.tsx` — z9 保留，注释说明被转正热区覆盖是拍板语义
- [x] 守卫 — `packages/components/audio-player/style.test.mjs` — 新增「转正盖过 dock（z10 行内驱动）+ 工具钮 z12 恒高 + Panel 壳禁 pointerleave 不回潮」断言

### Phase 2 — 墨痕暂停保留（#3）
- [x] 门控修订 — `packages/components/audio-player/PlayerPanel.tsx` — GhostLayer 渲染条件去 `playing &&`，注释同步
- [x] 守卫 — `packages/components/audio-player/style.test.mjs` 或 `player-panel.test.mjs` — 钉死暂停保留（doesNotMatch `playing && wordsAvailable`）

### Phase 3 — 词卷随播滚动修复（#4）
- [x] runtime 复现 — 本地 mock 起播 + 开词卷，实测 scrollLeft 值域与 el.offsetLeft 基准，留存失效证据
- [x] 修正居中公式 — `packages/components/audio-player/PlayerPanel.tsx` — offsetLeft 基准改为相对滚动容器（WordsVerse `position: relative` 或等价的相对偏移换算），负向域符号按实测修正；en 横排分支校核
- [x] 守卫语义化 — `packages/components/audio-player/player-panel.test.mjs` — 镜像公式断言替换为语义结构断言（基准容器 + 居中换算在场）

### Phase 4 — 全门禁
- [x] audio-player 域全部 test.mjs 逐文件绿 + 根 tsc + oxlint + apps/site build
- [x] 部署后生产目检（网络恢复后）：四 bug 现场复核

## 结果

- 实际耗时: 单会话连续完成（propose→apply→review 约 1 小时）
- 验证:
  - **TDD 红→绿全程**：层序守卫（z12 恒高 ×2、QZone 行内 z10、Panel 禁 pointerleave 不回潮）与暂停保留守卫（doesNotMatch `playing && wordsAvailable`）先写先红、实现后 19/19 绿；词卷守卫语义化（rect 基准在场 + 禁 offsetLeft/offsetTop 基准）先红后 22/22 绿——旧镜像公式断言恰好钉死过残差 809.9px 的失效换算（#435 教训复刻），已按「换算口径守卫断语义」纪律替换。
  - **#4 runtime 复现证据（IAB 实测，镜像 DOM 复现壳 /tmp/repro-481/verse.html）**：滚动容器（WordsVerse）为 static 时当前句 `offsetParent` 落到外层（stage/WordsView 级）、`offsetLeft = −281`（竖排负偏移）；现行公式 `clientWidth/2 − offsetWidth/2 − offsetLeft` 算出 +695 被钳 0，**残差 809.9px——面板全程不滚**，实锤用户反馈。值域探针：`scrollLeft ∈ [−(scrollWidth−clientWidth), 0]`（scrollTo(+120) 钳 0），screen 对 scroll 斜率 −1。修复公式（视口 rect 增量 `scrollLeft + (elCenter − containerCenter)`）实测中段列残差 ≤0.1px；值域两端（首/末列）钳制无法居中属物理上限，与横排歌词行为一致。en 横排分支同患 offsetTop 基准漂移，一并换同构 rect 增量，未触碰 words.tsx。
  - **域守卫逐文件**：style.test.mjs 19/19 · player-panel.test.mjs 22/22 · provider.test.mjs 6/6 · mini-player.test.mjs 8/8 · typecheck.test.mjs 1/1 · apps/site music-player-wiring.test.mjs 10/10。
  - **oxlint** 25 文件 0/0；**根 `tsc --noEmit`** exit 0（ambient node 24 四连 139 SIGSEGV 后按 SGN-001 换 `mise exec` node 22.23.2 一遍过）；**apps/site `next build`** exit 0（Compiled successfully，15 路由行；一次 139 空日志 → 清 `.next` 重试即绿，SGN-001 命中记录）。
  - **生产目检**：开发机仍无法解析 x.wuh.site（curl 000 / DNS 无记录，非站点故障）——目检顺延至网络恢复后现场复核四 bug（转正列表盖过进度条、整卡热区、暂停墨痕保留、词卷随播滚动），用户可先行手动验证。
  - **交付**：PR #482 admin-squash 合入 main（3926a919）；Release v1.4.63（https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.63）触发 CI-CD 全绿——quality-gate/prepare/prepare-deps/build-nest/build-next/staging-test/switch-traffic 七 job success，run 37436041801 约 9 分钟 completed/success。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 三处结论修订——①翻页屏 z 层序语义（"工具钮恒高于翻页屏；转正态整卡高于 dock，斜倚态热区维持现状"）；②墨痕显隐（"词卷态/无词隐去；暂停保留"，废弃"暂停自动隐去"）；③词卷随播滚动 runtime 验证结论入 verified-scope。components.md 拆分段落若涉及守卫形态（语义化替换镜像公式）仅记一行补充。
