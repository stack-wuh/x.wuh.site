---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-feature-player-dock-progress-seal",
  "type": "feature",
  "scope": "audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "feature/20260930-feature-player-dock-progress-seal",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "packages/components/progress/index.test.mjs",
    "packages/components/progress/styles/index.tsx",
    "shadow-docs/changes/20260930-feature-player-dock-progress-seal/brief.md",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 428,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/428",
    "pullRequest": 430,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/430"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e585814efb227a711652386c13c6bc8d6dd4e036",
    "verifiedAt": "2026-10-05T10:40:38.482Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:430",
    "planHash": "27a90d64f3618ae83aa9dd7850b57e2a8b7b6a115635af011b213d4b8b410499",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] PlayerPanel 进度/音量接入 Progress 交互态——度曲尺退役",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n共享 Progress 组件（#423）已落地双模态与白文方印光标，PlayerPanel 的进度/音量仍是私有实现（度曲尺刻度尺 + 凹槽滑杆）。按 20260930-feature-progress-component 既定的两步走后半程，全量替换为共享组件：播放态呼吸晕接真实 `playing`，「一套进度语言」在面板收口。用户已拍板度曲尺退役。\n\n## 引用规范\n- shadow-docs/knowledge/components.md\n  - 当前结论: Progress 双模态（onChange 即原生 range 交互态）、白文方印「樂」、`breathing={playing}` 播放态呼吸晕、`--progress-*` 客制化、index.test.mjs 守卫纪律\n  - 适用 scope: 面板替换全部用法的 API 边界\n- shadow-docs/knowledge/music-player.md（控制甲板/度曲尺）\n  - 当前结论: 度曲尺（双层刻度 + 朱砂指针）为面板签名（v1.4.38 落地）；凹槽几何归音量；触屏目标 ≥44px\n  - 适用 scope: 本次有意替换——度曲尺退役（brief 明示，Knowledge 随 ship 更新，非静默违反）；触屏命中区要求迁移到 Progress 交互态\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: packages/components/audio-player 站点专属例外，关键帧与 `--motion-*` 引用自持\n  - 适用 scope: 面板不新增动画代码——呼吸/行笔均在 Progress 组件内建\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色只走 token、断点用 BREAKPOINTS、transient prop 自身挂态\n  - 适用 scope: 布局行（RulerRow→进度行）改造\n\n## 决策\n- **选型:** 全量替换。进度区保留布局行（TimeCode 当前/总时长两端），中段换 `<Progress value={progressPct*100} onChange={(pct)=>seek(pct/100*duration)} thumb breathing={playing} label='播放进度'>`（百分比换算复用面板现成 `progressPct`，回写一行换算）；音量 `VolumeSlider` → `<Progress value={volume*100} onChange={(v)=>setVolume(v/100)} thumb label='音量'>`（120px 原位）；删除 GrooveSlider/VolumeSlider/Ruler/RulerLayer/RulerNeedle/RulerRange/TICK_* 全部私有实现\n- **组件微补（Phase 1 先行）:** Progress 交互态触屏命中区缺口——现 SRange 命中高 19px，不满足「触屏目标 ≥44px」；`@media (pointer: coarse)` 下 SRange 纵向扩至 44px（`inset: calc(50% - 22px) 0`），组件级修复利所有消费方，守卫固化\n- **对比方案:** ①音量先行尺留任（尊重刚落地的签名，但放弃统一目标——用户已否）；②尺注入呼吸（player 本地重实现印/呼吸，语言漂移）——均不取\n- **理由:** 用户拍板全量统一；呼吸/印视觉全在 Progress 内建，面板零新增动画与样式代码；播放态 `playing` 现成可接。**愛印本轮不接**：播放器状态无最爱数据源（provider/specs 无 favorite 字段），待最爱数据链路另立 change 再传 `glyph=\"愛\"`\n- **风险与协调:** 并行会话 fix-mode-band-underline-inversion 同动 PlayerPanel（mode band 区，进度/音量区外）——实施走独立 worktree，merge 顺序以对方先合为优，同文件冲突在合并侧解\n\n## 任务\n### Phase 1\n- [ ] task 1 — `packages/components/progress/styles/index.tsx` — SRange 触屏命中区：`@media (pointer: coarse)` 纵向扩至 44px；`packages/components/progress/index.test.mjs` 加守卫断言\n\n### Phase 2\n- [ ] task 2 — `packages/components/audio-player/PlayerPanel.tsx` — 进度区替换：RulerRow 布局行保留（更名进度行），TimeCode×2 + `<Progress>` 交互态（breathing={playing}）；音量替换为 `<Progress>` 120px；删除 GrooveSlider/VolumeSlider/Ruler 系/TICK_* 私有实现\n- [ ] task 3 — `packages/components/audio-player/player-panel.test.mjs` — 尺/凹槽守卫改写为 Progress 交互态 + breathing 在场断言；style.test.mjs 门禁保绿\n\n### Phase 3\n- [ ] task 4 — 四主题目检（展开面板）+ 播放态呼吸实证 + 触屏命中区断言 + progress 全门禁复跑\n\n完整 brief：shadow-docs/changes/20260930-feature-player-dock-progress-seal/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-feature-player-dock-progress-seal\",\"type\":\"feature\",\"scope\":\"audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-feature-player-dock-progress-seal/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/progress/index.test.mjs",
        "packages/components/progress/index.tsx",
        "packages/components/progress/styles/index.tsx",
        "shadow-docs/changes/20260930-feature-player-dock-progress-seal/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "feat(player): 面板进度/音量接入共享 Progress 交互态——度曲尺退役，播放态呼吸接线"
    }
  },
  "knowledge": null
}
---

# PlayerPanel 进度/音量接入 Progress 交互态——度曲尺退役

## 动机

共享 Progress 组件（#423）已落地双模态与白文方印光标，PlayerPanel 的进度/音量仍是私有实现（度曲尺刻度尺 + 凹槽滑杆）。按 20260930-feature-progress-component 既定的两步走后半程，全量替换为共享组件：播放态呼吸晕接真实 `playing`，「一套进度语言」在面板收口。用户已拍板度曲尺退役。

## 引用规范

- shadow-docs/knowledge/components.md
  - 当前结论: Progress 双模态（onChange 即原生 range 交互态）、白文方印「樂」、`breathing={playing}` 播放态呼吸晕、`--progress-*` 客制化、index.test.mjs 守卫纪律
  - 适用 scope: 面板替换全部用法的 API 边界
- shadow-docs/knowledge/music-player.md（控制甲板/度曲尺）
  - 当前结论: 度曲尺（双层刻度 + 朱砂指针）为面板签名（v1.4.38 落地）；凹槽几何归音量；触屏目标 ≥44px
  - 适用 scope: 本次有意替换——度曲尺退役（brief 明示，Knowledge 随 ship 更新，非静默违反）；触屏命中区要求迁移到 Progress 交互态
- shadow-docs/knowledge/animation-system.md
  - 当前结论: packages/components/audio-player 站点专属例外，关键帧与 `--motion-*` 引用自持
  - 适用 scope: 面板不新增动画代码——呼吸/行笔均在 Progress 组件内建
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只走 token、断点用 BREAKPOINTS、transient prop 自身挂态
  - 适用 scope: 布局行（RulerRow→进度行）改造

## 决策

- **选型:** 全量替换。进度区保留布局行（TimeCode 当前/总时长两端），中段换 `<Progress value={progressPct*100} onChange={(pct)=>seek(pct/100*duration)} thumb breathing={playing} label='播放进度'>`（百分比换算复用面板现成 `progressPct`，回写一行换算）；音量 `VolumeSlider` → `<Progress value={volume*100} onChange={(v)=>setVolume(v/100)} thumb label='音量'>`（120px 原位）；删除 GrooveSlider/VolumeSlider/Ruler/RulerLayer/RulerNeedle/RulerRange/TICK_* 全部私有实现
- **组件微补（Phase 1 先行）:** Progress 交互态触屏命中区缺口——现 SRange 命中高 19px，不满足「触屏目标 ≥44px」；`@media (pointer: coarse)` 下 SRange 纵向扩至 44px（`inset: calc(50% - 22px) 0`），组件级修复利所有消费方，守卫固化
- **对比方案:** ①音量先行尺留任（尊重刚落地的签名，但放弃统一目标——用户已否）；②尺注入呼吸（player 本地重实现印/呼吸，语言漂移）——均不取
- **理由:** 用户拍板全量统一；呼吸/印视觉全在 Progress 内建，面板零新增动画与样式代码；播放态 `playing` 现成可接。**愛印本轮不接**：播放器状态无最爱数据源（provider/specs 无 favorite 字段），待最爱数据链路另立 change 再传 `glyph="愛"`
- **风险与协调:** 并行会话 fix-mode-band-underline-inversion 同动 PlayerPanel（mode band 区，进度/音量区外）——实施走独立 worktree，merge 顺序以对方先合为优，同文件冲突在合并侧解

## 任务

### Phase 1
- [x] task 1 — `packages/components/progress/styles/index.tsx` — SRange 触屏命中区：`@media (pointer: coarse)` 纵向扩至 44px；`packages/components/progress/index.test.mjs` 加守卫断言

### Phase 2
- [x] task 2 — `packages/components/audio-player/PlayerPanel.tsx` — 进度区替换：RulerRow 布局行保留（更名进度行），TimeCode×2 + `<Progress>` 交互态（breathing={playing}）；音量替换为 `<Progress>` 120px；删除 GrooveSlider/VolumeSlider/Ruler 系/TICK_* 私有实现
- [x] task 3 — `packages/components/audio-player/player-panel.test.mjs` — 尺/凹槽守卫改写为 Progress 交互态 + breathing 在场断言；style.test.mjs 门禁保绿

### Phase 3
- [x] task 4 — 四主题目检（展开面板）+ 播放态呼吸实证 + 触屏命中区断言 + progress 全门禁复跑

## 结果

- 实际耗时: —
- 验证: —

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 度曲尺退役、面板进度/音量改由共享 Progress 承担、触屏命中区要求迁移——控制甲板段结论变更；随 ship 原位更新（度曲尺段改写为退役说明 + Progress 接管现状）
