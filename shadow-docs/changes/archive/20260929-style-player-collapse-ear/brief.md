---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-style-player-collapse-ear",
  "type": "style",
  "scope": "packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260929-style-player-collapse-ear",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": null,
    "issueUrl": null,
    "pullRequest": 403,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/403"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "ee2bba005db8ed3ae7ef41d14893d0ce09a87c09",
    "verifiedAt": "2026-09-29T23:54:35.345Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:403",
    "planHash": "afb3c6e09f02ab4c3286b53baa1cb30c2a2d4c52a6ff1a03144d14a2e07c02c1",
    "updatedAt": null,
    "lastError": null,
    "release": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "shadow-docs/changes/20260929-style-player-collapse-ear",
        "shadow-docs/knowledge/components.md",
        "shadow-docs/signals.md"
      ],
      "message": "style(player): 迷你播放器收起交互重设计——书耳替代拼贴窄栏",
      "title": "style(player): 迷你播放器收起交互重设计——书耳替代拼贴窄栏",
      "body": ""
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/components.md",
    "reason": "书耳结论已随 PR #403 落入 components.md（子元素化约束 + verified-scope），交付 PR #403 merged + Release v1.4.29 部署链全绿；归档前按 main HEAD 重签（MiniPlayer 代码与 #403 合入内容一致）"
  }
}
---

# 播放器收起交互重设计：书耳语言替代拼贴窄栏

## 动机

迷你播放器桌面收起栏（`CollapseRail`）与卡片是两个独立 `position: fixed` 元素靠坐标算术拼合（`left: 464` = 卡片 `left: 24 + width: 440`），卡片右缘保留全圆角与发丝线描边、栏又无左边框，接缝在视觉上永远读作「两张纸」——用户实测截图圈出该拼贴缝。另有三处失衡：

1. **体量与功能倒挂**：32×96 与卡片等高的整条窄栏，只服务「收起」这一个低频动作；
2. **语法断裂**：打开面板、播放、歌单全在卡片上，唯独收起漂在卡外；
3. **收起态同病**：收起后左缘挂 36×96 整条板，同样的「孤儿碎片」且常驻。

本变更把收起交互重塑为「书耳」语言：耳页从卡片右缘长出，结构上消除拼合。

## 复杂度评级

- **评级：** S
- **理由：** 无契约变更（`TrackSource`/`TrackResolver`/`AudioPlayerActions` 与播放降级语义全部不动）；触及面单文件（`MiniPlayer.tsx` 样式层）；可发现性高——同目录 `style.test.mjs` 门禁覆盖样式纪律，`showHide` 等既有模式直接复用。
- **期望验证深度：** runtime（`node --test` 门禁全绿 + 双主题四态目检）

## 引用规范

- shadow-docs/knowledge/components.md
  - 当前结论: 播放器纸墨语言纪律由 `style.test.mjs` 门禁固化：禁裸十六进制色、禁裸断点数值、禁 `--text-secondary`、transition 禁布局属性、aria-label / `prefers-reduced-motion` / `role='status'` 在场
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色只经语义 token；断点只用 `BREAKPOINTS` 语义常量；淡化色用 `color-mix(in oklab, var(--text-color) 72%, transparent)`；动态状态挂 transient prop 不用跨组件插值选择器；`font` 简写不得排在 `font-size` 之后
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/icon-system.md
  - 当前结论: 图标恒为 outline 线框，从 `@wuh.site/components/icons` 具名导出，不在业务目录散落 SVG
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/music-player.md
  - 当前结论: 跳过提示占歌手行、卡片高度不变；公开 API 与降级语义保持不变——本次不触碰 provider 与提示语义
  - 适用 scope: packages/components/audio-player
- norms/code-style.md
  - 当前结论: 渐进式治理，只修正与当前改动直接相关的问题，不顺手扩大范围
  - 适用 scope: 全量

## 决策

- **选型:** 方案 B「书耳」。展开态耳页改为**卡片子元素**（`position: absolute; left: calc(100% - 1px); top: 50%` 垂直居中），24×44、三边发丝线（上/右/下，左边借卡片边框并被耳页纸面盖住身后段）、右缘 `--border-radius-base` 圆角、`IconChevronLeft`；收起态为 fixed 兄弟小耳 28×48（屏幕左缘、与展开耳同一水平线 `bottom: 48px`），四边完整发丝线、`IconChevronRight`。
- **对比方案:**
  - 方案 A「收起钮入列按钮组 + 全端以朱砂印收束」——否决：用户明确倾向保留「向边缘收拢」的空间隐喻；但其「子元素化消灭拼缝」的结构思路被本方案吸收。
  - 方案 C「hover 显现竖排墨签」——否决：可发现性押在 hover 上（触屏笔电/平板无 hover），且竖字墨签与 Header「墨」印章语言冲突。
- **理由:** 耳页作为卡片子元素从结构上消除坐标拼合，开合动画天然一体（单物体动作）；小元素用小一号圆角（base）延续同一套比例语言；收起耳与展开耳同水平线，空间记忆连续。
- **细节决策:** 展开耳垂直居中而非对齐按钮行（读作「卡的书签」而非第五个按钮）；命中区外扩至 ≥32×44（视觉 24 宽、好点）；hover 沿用现收拢栏的朱砂染色语言（`primary 6%` 纸面 + 墨转朱砂）；`aria-label`/`aria-expanded`/`showHide` 过渡（只动 opacity/transform/visibility）全部保留既有语义；移动端收起/展开（chevron-down + 朱砂「音」印）本次不动；按钮组歌单钮保留。
- **边界:** 纯 `MiniPlayer.tsx` 样式层变更；不改 provider、PlayerPanel、面板 z 层与任何公开 API。

## 任务

### Phase 1

- [x] task 1 — `packages/components/audio-player/MiniPlayer.tsx` — 删除 `CollapseRail`/`CollapsedRail`，新增展开态书耳（`MiniCard` 子元素，随卡片开合动画一体）与收起态小耳（fixed 兄弟元素）；颜色全走 token、圆角/间距经 token、断点只引 `BREAKPOINTS`、图标用 icons 包具名导出；两耳 `aria-label`/`aria-expanded`/`:focus-visible` 齐备
- [x] task 2 — `packages/components/audio-player` — 验收：`node --test packages/components/audio-player/style.test.mjs` 与 `provider.test.mjs` 全绿；wine/plain × light/dark 四主题目检展开/收起/hover/focus 四态与耳页接缝（边框在耳后断开、无拼贴感）

## 结果

- 实际耗时: propose→archive 同日完成（2026-09-29）
- 验证: `node --test style.test.mjs` 6/6 与 `provider.test.mjs` 6/6；`packages/components` tsc 干净（根 tsc 两次 139 为 SGN-001 环境问题）；wine/plain × light/dark 四主题展开/收起双态截图目检、往返交互与 `matches(':hover')` 计算样式验证通过
- 交付: PR #403 merged（2026-09-29 08:32）；Release [v1.4.29 迷你播放器收起交互书耳重设计](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.29) 触发部署链，CI-CD run 36503704631 全绿（prepare → build → staging-test → switch-traffic，conclusion: success）；merge 后 main push quality-gate 与 CodeQL 均绿
- 知识动作: components.md AudioPlayer 段落更新为书耳结论（含子元素化约束）+ verified-scope 补录；signals.md SGN-001 命中 1→2
- 流程备注: propose 阶段的 GitHub Issue 未创建（唯一偏差，不影响交付）

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/components.md
- **理由:** 该卡片 AudioPlayer 段落现记载「MiniPlayer 桌面为纸卡 dock + 右缘收拢栏」，本次将收起形态更新为「书耳」（展开耳为卡片子元素、收起耳为左缘小签），需同步该句结论并记录 verified-depth。
