---
{
  "schema": "shadow-dev/v1",
  "name": "20261001-style-player-stage-budget",
  "type": "style",
  "scope": "packages/components/audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20261001-style-player-stage-budget",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 452,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/452",
    "pullRequest": 453,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/453"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "e8807680699e3b0e5f18b3d4a98939d990976cbd",
    "verifiedAt": "2026-10-01T06:18:57.811Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:453",
    "planHash": "4ea9c179ab05009a6102af42ea34268e875d0fb278c27a13cb642f7ffd3aa878",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] style(player): 留白独奏舞台预算精修——封面因变量化与题名空间承诺",
      "titleRaw": "style(player): 留白独奏舞台预算精修——封面因变量化与题名空间承诺",
      "supplement": "面板高=100vh−96px 与封面帽 min(290px,32vh) 不同源，视口 ≤~920px 时题名/歌手被 overflow: clip 裁切（用户生产实测「封面遮住歌名歌手」）。本 change 封面三档因变量化（252/224/184，帽与面板高度同源）、题名/歌手 flex-shrink:0 空间承诺、矮视口题跋降当前句缓冲、style.test 语义守卫钉死。视觉稿四场景用户已确认（t3 紧凑比例获认可）。详见 shadow-docs/changes/20261001-style-player-stage-budget/brief.md",
      "body": "## 动机\n用户生产实测（v1.4.49）：播放面板装裱封面过大，题名/歌手行被裁切，观感即「封面遮住歌名歌手」。代码事实：舞台为固定预算内容栈（封面 338px + 题名 70px + 歌手 35px + 题跋 148–184px ≈ 675px）+ dock ≈150px ≈ 面板需求 825px，而面板高 = `100vh − 96px`（inset 48px）；封面帽 `min(290px, 32vh)` 与面板高度**不同源**（32vh 要到视口 ≤906px 才咬合且幅度不足），视口 ≤ ~920px 时舞台入不敷出，题名/歌手被面板 `overflow: clip` 裁切。视觉稿四场景（cur/t1/t2/t3）用户已确认，t3 紧凑比例获明确认可。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 留白独奏定稿（居中单焦点舞台 grid 'stage'/'dock'）不推翻；矮视口封面收缩档有先例（230→220px）；显隐态样式纪律针对 styled 动态类与属性选择器，静态 media query 规则不属禁令；守卫要断言语义不能只镜像实现\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 精修轮四条——①封面三档因变量化 ②题名/歌手 `flex-shrink: 0` ③矮视口题跋降当前句 ④style.test 守卫钉死\n- **对比方案:** 画左题右立轴重构（否——居中单焦点是定稿签名元素，用户诉求是尺寸不是构图）；仅全局降一档不分档（否——不与面板高度同源则矮视口仍会破）\n- **理由:** 预算手术最小触及、签名元素不动；封面成为舞台预算唯一因变量，帽与面板高度同源 `calc((100vh - 96px) * 0.30 / 0.26)`。**分档按视口高度驱动**（@media max-height：常态 252 / <960px 224 / <860px 184 + 题跋收缩）。用户口味信号：「t3 不错」——紧凑比例获认可，记为未来再收紧的参考，不改变本轮 T1=252 定案。\n- **视觉稿:** /tmp/shadow-drafts/20261001-player-stage-refine/index.html（本地产物不入仓库；场景 cur=现状复现 / t1=常态 252 / t2=矮视口 224 / t3=184+题跋缓冲；真 token：wine 亮色系 #FFFBF8/#C94A44/#2A1E16，spacing/fontSize 抄自 themes/index.ts L22-59）\n\n## 任务\n### Phase 1 实施（≤30min）\n- [ ] PlateArt 三档制：`min(252px, calc((100vh - 96px) * 0.30))` 常态；`@media (max-height: 959px)` → `min(224px, calc((100vh - 96px) * 0.30))`；`@media (max-height: 859px)` → `min(184px, calc((100vh - 96px) * 0.26))`——注意分档特征是**高度**非宽度 — `packages/components/audio-player/PlayerPanel.tsx` — 修改\n- [ ] StageTitle / StageArtist 各加 `flex-shrink: 0`（不增 DOM，直接置于既有组件） — `packages/components/audio-player/PlayerPanel.tsx` — 修改\n- [ ] 题跋缓冲：`@media (max-height: 859px)` 下 `.epi-row:not(.act)` 行 `display: none`（静态 media query 规则，不触碰态驱动禁令；EpiRow 需可被该选择器命中） — `packages/components/audio-player/PlayerPanel.tsx` — 修改\n\n### Phase 2 守卫（≤30min）\n- [ ] style.test.mjs 增语义守卫：①PlateArt 尺寸声明必须含 `calc((100vh - 96px)` 同源帽且常态帽 ≤252px；②StageTitle 与 StageArtist 必须 `flex-shrink: 0`；③max-height 矮视口题跋收缩规则在场 — `packages/components/audio-player/style.test.mjs` — 修改\n\n### Phase 3 验证与交付（≤30min）\n- [ ] audio-player 守卫套件全绿 + typecheck 域清零 + oxlint 0/0 + build:next 通过 — 仓库 — 验证\n- [ ] release：PR → Release v1.4.50（patch 递增）→ 部署链全绿 → 生产目检三档视口高度下题名/歌手完整、题名手卷仍溢出徐展 — 仓库 — 交付\n\n## 补充\n面板高=100vh−96px 与封面帽 min(290px,32vh) 不同源，视口 ≤~920px 时题名/歌手被 overflow: clip 裁切（用户生产实测「封面遮住歌名歌手」）。本 change 封面三档因变量化（252/224/184，帽与面板高度同源）、题名/歌手 flex-shrink:0 空间承诺、矮视口题跋降当前句缓冲、style.test 语义守卫钉死。视觉稿四场景用户已确认（t3 紧凑比例获认可）。详见 shadow-docs/changes/20261001-style-player-stage-budget/brief.md\n\n完整 brief：shadow-docs/changes/20261001-style-player-stage-budget/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261001-style-player-stage-budget\",\"type\":\"style\",\"scope\":\"packages/components/audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261001-style-player-stage-budget/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261001-style-player-stage-budget/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(player): 留白独奏舞台预算精修——封面因变量化与题名空间承诺 (#452)",
      "title": "style(player): 留白独奏舞台预算精修——封面因变量化与题名空间承诺",
      "body": "Closes #452\n\n完整 brief：shadow-docs/changes/20261001-style-player-stage-budget/brief.md"
    }
  },
  "knowledge": null
}
---

# 留白独奏舞台预算精修：封面因变量化 + 题名空间承诺

## 动机
用户生产实测（v1.4.49）：播放面板装裱封面过大，题名/歌手行被裁切，观感即「封面遮住歌名歌手」。代码事实：舞台为固定预算内容栈（封面 338px + 题名 70px + 歌手 35px + 题跋 148–184px ≈ 675px）+ dock ≈150px ≈ 面板需求 825px，而面板高 = `100vh − 96px`（inset 48px）；封面帽 `min(290px, 32vh)` 与面板高度**不同源**（32vh 要到视口 ≤906px 才咬合且幅度不足），视口 ≤ ~920px 时舞台入不敷出，题名/歌手被面板 `overflow: clip` 裁切。视觉稿四场景（cur/t1/t2/t3）用户已确认，t3 紧凑比例获明确认可。

## 复杂度评级
- **评级:** S
- **理由:** 无契约变更（纯样式预算手术）；触及单组件目录 2 文件；可发现性中——由视口高度触发的裁切 bug，视觉稿已复现并定稿修复构型。
- **期望验证深度:** unit + field（生产三档视口高度目检题名歌手完整）

## 引用规范
- shadow-docs/knowledge/music-player.md
  - 当前结论: 留白独奏定稿（居中单焦点舞台 grid 'stage'/'dock'）不推翻；矮视口封面收缩档有先例（230→220px）；显隐态样式纪律针对 styled 动态类与属性选择器，静态 media query 规则不属禁令；守卫要断言语义不能只镜像实现
  - 适用 scope: packages/components/audio-player

## 决策
- **选型:** 精修轮四条——①封面三档因变量化 ②题名/歌手 `flex-shrink: 0` ③矮视口题跋降当前句 ④style.test 守卫钉死
- **对比方案:** 画左题右立轴重构（否——居中单焦点是定稿签名元素，用户诉求是尺寸不是构图）；仅全局降一档不分档（否——不与面板高度同源则矮视口仍会破）
- **理由:** 预算手术最小触及、签名元素不动；封面成为舞台预算唯一因变量，帽与面板高度同源 `calc((100vh - 96px) * 0.30 / 0.26)`。**分档按视口高度驱动**（@media max-height：常态 252 / <960px 224 / <860px 184 + 题跋收缩）。用户口味信号：「t3 不错」——紧凑比例获认可，记为未来再收紧的参考，不改变本轮 T1=252 定案。
- **视觉稿:** /tmp/shadow-drafts/20261001-player-stage-refine/index.html（本地产物不入仓库；场景 cur=现状复现 / t1=常态 252 / t2=矮视口 224 / t3=184+题跋缓冲；真 token：wine 亮色系 #FFFBF8/#C94A44/#2A1E16，spacing/fontSize 抄自 themes/index.ts L22-59）

## 任务
### Phase 1 实施（≤30min）
- [x] PlateArt 三档制：`min(252px, calc((100vh - 96px) * 0.30))` 常态；`@media (max-height: 959px)` → `min(224px, calc((100vh - 96px) * 0.30))`；`@media (max-height: 859px)` → `min(184px, calc((100vh - 96px) * 0.26))`——注意分档特征是**高度**非宽度 — `packages/components/audio-player/PlayerPanel.tsx` — 修改
- [x] StageTitle / StageArtist 各加 `flex-shrink: 0`（不增 DOM，直接置于既有组件） — `packages/components/audio-player/PlayerPanel.tsx` — 修改
- [x] 题跋缓冲：`@media (max-height: 859px)` 下 `.epi-row:not(.act)` 行 `display: none`（静态 media query 规则，不触碰态驱动禁令；EpiRow 需可被该选择器命中） — `packages/components/audio-player/PlayerPanel.tsx` — 修改

### Phase 2 守卫（≤30min）
- [x] style.test.mjs 增语义守卫：①PlateArt 尺寸声明必须含 `calc((100vh - 96px)` 同源帽且常态帽 ≤252px；②StageTitle 与 StageArtist 必须 `flex-shrink: 0`；③max-height 矮视口题跋收缩规则在场 — `packages/components/audio-player/style.test.mjs` — 修改

### Phase 3 验证与交付（≤30min）
- [x] audio-player 守卫套件全绿 + typecheck 域清零 + oxlint 0/0 + build:next 通过 — 仓库 — 验证
- [x] release：PR → Release v1.4.50（patch 递增）→ 部署链全绿 → 生产目检三档视口高度下题名/歌手完整、题名手卷仍溢出徐展 — 仓库 — 交付

## 结果
- 实际耗时: 实现+验证约 40 分钟；交付排障约 1.5 小时（2026-10-01）
- 验证: TDD 先红（舞台预算守卫）后绿；源码守卫套件 fail 0 + typecheck 域清零 pass；oxlint 0/0；site tsc 域内 0；本地 build:next exit 0。交付：PR #453 squash 合入 main（332d63f）→ [Release v1.4.50](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.50) → 部署链 7 jobs 全绿 → switch-traffic 上线。**排障记录**：首跑 build-next/build-nest 与 mongod 同分钟被杀（mongod.service Active: failed Result: signal @ 11:42:40 CST = 03:42:40 UTC）——磁盘/内存危机一石三鸟；`disk-clean` 手动触发后构建恢复；staging-test 因 Mongo 死亡（staging/prod nest ECONNREFUSED 27017）两连败；经临时 SSH 诊断工作流定位后 `sudo systemctl start mongod` 拉起，双 nest healthy，重跑 `gh run rerun --failed` 全绿。生产 API 降级窗口 11:42 CST 起 ~2.5 小时（next 靠 ISR 撑门面），随 mongod 拉起自愈。临时工作流已删除。

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（留白独奏段补「舞台预算三档制」结论：封面为因变量、分档按视口高度、题名 flex-shrink: 0 空间承诺，verified-depth: unit + field）
- **理由:** 留白独奏首次高度预算修订，后续触碰舞台高度链路必须循此预算公式。

## 待确认点
- 无（视觉稿已定稿，四场景用户确认）
