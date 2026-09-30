---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-fix-player-active-state-recalc",
  "type": "fix",
  "scope": "player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20260930-fix-player-active-state-recalc",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 431,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/431",
    "pullRequest": 432,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/432"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0b5898354eb154ae63cbb24dd7cdbf84f94af7fe",
    "verifiedAt": "2026-09-30T08:50:28.431Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:432",
    "planHash": "1e54c02d05bfeb58821426716d38f12cb5939c80cc9146d7e23de4d3aa5a070b",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 播放器选中态改行内自定义属性驱动——属性选择器在生产行为表上失灵的引擎免疫",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\nv1.4.41（PR #429）生产回归实测复现：模式带激活态虽已改为 `&[aria-pressed='true']` 属性选择器静态 CSS（规则恒在、单静态类），但 React 翻转 aria-pressed 后**计算样式不跟随**——「顺序」钮在 p=false 时仍持主色、按下的「单曲/随机」p=true 却透明（落定 900ms 采样）；对手动 `removeAttribute`+`setAttribute` 摘戴后立刻恢复且此后一致。同机制的页头导航 `aria-current='page'` 生产完全正常、dev 环境同代码正常——属生产样式表加载路径下**属性选择器失效（invalidation）失灵**的引擎相关行为（IAB Chromium 实测），不能赌真机引擎不踩。v1.4.36 动态类规则删除竞态（已修）与本失效同域：**凡依赖选择器重匹配的激活态在这张生产行为表上都不可靠**。\n\n## 引用规范\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色必须经主题变量暴露；动态状态禁跨组件插值选择器\n  - 适用 scope: 全站前端\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 模式带/页缘钮激活态 aria 属性选择器承载（本变更修订驱动机制）\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 激活态的动态声明改**行内自定义属性**驱动：styled 静态规则消费 `var(--mode-line, transparent)` / `var(--mode-ink, INK_MUTED)`（ModeButton）与 `var(--tick-line, HAIRLINE)` / `var(--tick-fill, .44)` / `var(--tick-dim, .6)`（PageTick ::before），JSX 在激活时经 `style` 挂对应自定义属性（值仍引 `var(--primary-color)`，色不经硬编码）。内联样式变更走引擎保证的失效路径，不依赖任何选择器重匹配；规则本身从加载起恒在（单一静态类，无变体类）。`aria-pressed`/`aria-current` 语义原样保留（只退出一 доставкой样式），transition 声明留在静态规则内不受影响。\n- **对比方案:** ① 回退 transient 动态类——规则删除竞态的老坑；② 换 data-* 属性选择器——同一失效机制风险；③ 等引擎修复——不可控。\n- **理由:** 内联自定义属性是唯一不依赖选择器匹配的纯 CSS 令牌通路；视觉零变化；守卫可断言 `var(--mode-line` 在场 + 属性选择器退场。\n- **边界:** 只动 `ModeButton`/`PageTick` 两个 styled 块、对应 JSX 与守卫；知识卡「激活态必须 aria 属性选择器承载」结论修订为「行内自定义属性驱动、aria 语义保留」。\n\n## 任务\n### Phase 1\n- [ ] TDD 守卫先行：模式带/页缘钮断言改为「静态规则消费 var(--mode-*/var(--tick-*) + JSX style 挂载在场、`&[aria-pressed=`/`&[aria-current=` 样式变体退场、aria 语义仍在」 — packages/components/audio-player/player-panel.test.mjs\n- [ ] 实现两个 styled 块与 JSX 改造 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] 全量门禁 + dev 目检四主题选中态视觉与 v1.4.41 一致 — 验证记录进 brief；生产复验在合并发布 v1.4.42 后以同一探针执行\n\n完整 brief：shadow-docs/changes/20260930-fix-player-active-state-recalc/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-fix-player-active-state-recalc\",\"type\":\"fix\",\"scope\":\"player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-fix-player-active-state-recalc/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260930-fix-player-active-state-recalc/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 播放器选中态改行内自定义属性驱动——免疫属性选择器失效失灵"
    }
  },
  "knowledge": null
}
---

# 播放器选中态改行内自定义属性驱动——属性选择器在生产行为表上失灵的引擎免疫

## 动机

v1.4.41（PR #429）生产回归实测复现：模式带激活态虽已改为 `&[aria-pressed='true']` 属性选择器静态 CSS（规则恒在、单静态类），但 React 翻转 aria-pressed 后**计算样式不跟随**——「顺序」钮在 p=false 时仍持主色、按下的「单曲/随机」p=true 却透明（落定 900ms 采样）；对手动 `removeAttribute`+`setAttribute` 摘戴后立刻恢复且此后一致。同机制的页头导航 `aria-current='page'` 生产完全正常、dev 环境同代码正常——属生产样式表加载路径下**属性选择器失效（invalidation）失灵**的引擎相关行为（IAB Chromium 实测），不能赌真机引擎不踩。v1.4.36 动态类规则删除竞态（已修）与本失效同域：**凡依赖选择器重匹配的激活态在这张生产行为表上都不可靠**。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色必须经主题变量暴露；动态状态禁跨组件插值选择器
  - 适用 scope: 全站前端
- shadow-docs/knowledge/music-player.md
  - 当前结论: 模式带/页缘钮激活态 aria 属性选择器承载（本变更修订驱动机制）
  - 适用 scope: packages/components/audio-player

## 决策

- **选型:** 激活态的动态声明改**行内自定义属性**驱动：styled 静态规则消费 `var(--mode-line, transparent)` / `var(--mode-ink, INK_MUTED)`（ModeButton）与 `var(--tick-line, HAIRLINE)` / `var(--tick-fill, .44)` / `var(--tick-dim, .6)`（PageTick ::before），JSX 在激活时经 `style` 挂对应自定义属性（值仍引 `var(--primary-color)`，色不经硬编码）。内联样式变更走引擎保证的失效路径，不依赖任何选择器重匹配；规则本身从加载起恒在（单一静态类，无变体类）。`aria-pressed`/`aria-current` 语义原样保留（只退出一 доставкой样式），transition 声明留在静态规则内不受影响。
- **对比方案:** ① 回退 transient 动态类——规则删除竞态的老坑；② 换 data-* 属性选择器——同一失效机制风险；③ 等引擎修复——不可控。
- **理由:** 内联自定义属性是唯一不依赖选择器匹配的纯 CSS 令牌通路；视觉零变化；守卫可断言 `var(--mode-line` 在场 + 属性选择器退场。
- **边界:** 只动 `ModeButton`/`PageTick` 两个 styled 块、对应 JSX 与守卫；知识卡「激活态必须 aria 属性选择器承载」结论修订为「行内自定义属性驱动、aria 语义保留」。

## 任务

### Phase 1
- [x] TDD 守卫先行：模式带/页缘钮断言改为「静态规则消费 var(--mode-*/var(--tick-*) + JSX style 挂载在场、`&[aria-pressed=`/`&[aria-current=` 样式变体退场、aria 语义仍在」 — packages/components/audio-player/player-panel.test.mjs
- [x] 实现两个 styled 块与 JSX 改造 — packages/components/audio-player/PlayerPanel.tsx
### Phase 2
- [x] 全量门禁 + dev 目检四主题选中态视觉与 v1.4.41 一致 — 验证记录进 brief；生产复验在合并发布 v1.4.42 后以同一探针执行

## 结果
- 实际耗时: 约 1 小时
- 验证:
  - `node --test packages/components/audio-player/*.test.mjs` **40/40**（模式带/页缘钮守卫改写：静态规则消费 var(--mode-*/var(--tick-*)、JSX 行内挂载在场、属性选择器变体退场）；根 tsc 干净；oxlint 0/0
  - dev 实测：三向切换行内 --mode-line 跟随（active 挂 var(--primary-color)、非激活回退 fallback）、border-color 过渡平滑（中间色采样证实）、aria-pressed/aria-current 语义保留；生产复验待 v1.4.42 部署后以同一探针执行（复现路径：生产行为表 + React 属性翻转）；v1.4.42 部署全绿后生产复验**通过**：模式带三向切换 aria/行内变量/计算样式全一致（v1.4.41 同探针失败的路径）；页缘钮稳态 4/4 翻转全对，仅 display:none→flex 后首击背景色有一次性迟滞（自愈，引擎 quirk 同类，已记录）

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（激活态驱动机制结论修订）
- **理由:** 选择器驱动的激活态在该站点生产样式表上两连败（规则删除竞态、属性失效失灵），行内自定义属性是机制级替代，属长期约束。
