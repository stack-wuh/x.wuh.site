---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-fix-panel-progress-double-scale",
  "type": "fix",
  "scope": "player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20260930-fix-panel-progress-double-scale",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 435,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/435",
    "pullRequest": 437,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/437"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "a9142e3da81b14e21f374c3dc7a4ec57de819944",
    "verifiedAt": "2026-09-30T10:04:55.286Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:437",
    "planHash": "e5c60becf0b9ffb3cbeef62a7ab5889b99a9a5435b13800482f627e944acdd34",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 面板播放进度光标钉死末端——双重百分比换算修复",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n生产 wuh.site/music 实测（用户元素快照）：面板 NowDock 的播放进度 range `value=\"100\"` 恒定，印光标永远停在最后一刻度，不随播放推进。根因是双重百分比换算：`progressPct`（PlayerPanel.tsx:897）已是 0–100 百分数（度曲尺时期 `0ad5072` 定下的口径），共享 Progress 替换（`8e26e6f`，#430）时误按音量 `state.volume * 100`（volume 是 0–1）的样子写了 `value={progressPct * 100}`，值域 0–10000 被 Progress 组件钳到 100。守卫测试 player-panel.test.mjs:80 同步把错误口径钉死了，所以门禁全绿也拦不住。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 进度=白文方印「樂」，Progress 交互态百分比换算、消费方换算必须防 0/0（组件内 Number.isFinite 钳 0）\n  - 适用 scope: packages/components/audio-player, packages/components/progress\n\n## 决策\n- **选型:** A——消费方修正：`value={progressPct}` 去掉二次 ×100，progressPct 保持 0–100 口径（与 onChange `(pct/100)*totalDuration` 对称），守卫断言同步翻转\n- **对比方案:** B——progressPct 统一成 0–1 分数口径（与 MiniPlayer 的 progressPercent、音量一致），改动面大收益低；C——Progress 组件侧对 ≤1 自动当分数，语义分叉污染 0–100 契约（aria-valuenow），否\n- **理由:** 单行修复 + 守卫翻转即闭环；Progress 组件契约（0–100）不动；MiniPlayer 实查口径本就正确（0–1 ×100），波及面只有 PlayerPanel 一处\n\n## 任务\n### Phase 1\n- [ ] 修复进度 value 双重换算并翻转守卫断言 — `packages/components/audio-player/PlayerPanel.tsx` — `value={progressPct * 100}` → `value={progressPct}`，注释同步口径；`packages/components/audio-player/player-panel.test.mjs` — 断言改 `value={progressPct}` 并补「不得二次 ×100」负断言\n- [ ] runtime 验证 — `packages/components/audio-player/player-panel.test.mjs` — node --test 全绿、根 tsc 干净；dev 实播采样 range value 随播放递增且 <100、拖拽 seek 双向可用\n\n完整 brief：shadow-docs/changes/20260930-fix-panel-progress-double-scale/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-fix-panel-progress-double-scale\",\"type\":\"fix\",\"scope\":\"player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-fix-panel-progress-double-scale/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 面板播放进度光标钉死末端——value 双重百分比换算修复"
    }
  },
  "knowledge": null
}
---

# 面板播放进度光标钉死末端——双重百分比换算修复

## 动机
生产 wuh.site/music 实测（用户元素快照）：面板 NowDock 的播放进度 range `value="100"` 恒定，印光标永远停在最后一刻度，不随播放推进。根因是双重百分比换算：`progressPct`（PlayerPanel.tsx:897）已是 0–100 百分数（度曲尺时期 `0ad5072` 定下的口径），共享 Progress 替换（`8e26e6f`，#430）时误按音量 `state.volume * 100`（volume 是 0–1）的样子写了 `value={progressPct * 100}`，值域 0–10000 被 Progress 组件钳到 100。守卫测试 player-panel.test.mjs:80 同步把错误口径钉死了，所以门禁全绿也拦不住。

## 引用规范
- shadow-docs/knowledge/music-player.md
  - 当前结论: 进度=白文方印「樂」，Progress 交互态百分比换算、消费方换算必须防 0/0（组件内 Number.isFinite 钳 0）
  - 适用 scope: packages/components/audio-player, packages/components/progress

## 决策
- **选型:** A——消费方修正：`value={progressPct}` 去掉二次 ×100，progressPct 保持 0–100 口径（与 onChange `(pct/100)*totalDuration` 对称），守卫断言同步翻转
- **对比方案:** B——progressPct 统一成 0–1 分数口径（与 MiniPlayer 的 progressPercent、音量一致），改动面大收益低；C——Progress 组件侧对 ≤1 自动当分数，语义分叉污染 0–100 契约（aria-valuenow），否
- **理由:** 单行修复 + 守卫翻转即闭环；Progress 组件契约（0–100）不动；MiniPlayer 实查口径本就正确（0–1 ×100），波及面只有 PlayerPanel 一处

## 任务
### Phase 1
- [x] 修复进度 value 双重换算并翻转守卫断言 — `packages/components/audio-player/PlayerPanel.tsx` — `value={progressPct * 100}` → `value={progressPct}`，注释同步口径；`packages/components/audio-player/player-panel.test.mjs` — 断言改 `value={progressPct}` 并补「不得二次 ×100」负断言
- [x] runtime 验证 — `packages/components/audio-player/player-panel.test.mjs` — node --test 全绿、根 tsc 干净；dev 实播采样 range value 随播放递增且 <100、拖拽 seek 双向可用

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 进度段「`value={progressPct*100}` 百分比换算」记载的正是错误口径，修复后需改为「progressPct 已是 0–100，value 直传」；#430 引入回归且守卫钉死错误口径（门禁全绿拦不住语义错）值得记一笔
