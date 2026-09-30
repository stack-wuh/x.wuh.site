---
{
  "schema": "shadow-dev/v1",
  "name": "20260930-fix-mode-band-underline-inversion",
  "type": "fix",
  "scope": "player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20260930-fix-mode-band-underline-inversion",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/player-panel.test.mjs",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 427,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/427",
    "pullRequest": 429,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/429"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0e98f8d2cb04f70325a98661b3bbf83d53bc4ee3",
    "verifiedAt": "2026-09-30T08:49:40.552Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:429",
    "planHash": "9df7411a1b61b86238b9f41dd5d97a807b0e1c1fbc9a7b1fb169dc29ee644e9d",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] 修复模式带下划线反转——动态类规则删除竞态，改 aria 属性选择器承载激活态",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n生产（v1.4.38）实测复现：点击模式带（顺序/单曲/随机）后 0.5–1s 内，新激活钮无下划线、旧钮保留下划线（自动化采样：点击后 60–500ms 间 `随机` pressed=true + 激活类 `dlGuIA` 但计算 border-bottom 仍透明；约 1s 后自愈）。根因取证：瞬态窗口内 `.dlGuIA`（激活变体）规则**从样式表整体消失**、稍后被下一次无关的 styled-components 插入补回——styled-components v6 对函数插值产生的动态类有使用计数清理，模式带只在点击时重渲染（播放中无其它插入风暴），误删的规则迟迟不重建；用户此前在 v1.4.36 截到的「持久反转」即音频暂停时没有后续插入风暴的形态。歌词/列表类组件因每秒重渲染自愈快、未成显性 bug，但同属此机制。\n\n## 引用规范\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 「导航当前页状态一律用 aria-current='page' 属性选择器承载，样式与无障碍语义同体」——本变更是同一原则在播放模式带/页缘钮的落地\n  - 适用 scope: 全站前端\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 控制甲板下划线模式带（v1.4.36 定稿）、移动端册页页缘钮（20260930）\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 激活态从 transient prop 三元插值改为 **aria 属性选择器静态 CSS**：`ModeButton` 去掉 `$active` prop 与函数插值，改 `&[aria-pressed='true'] { border-bottom-color: var(--primary-color); color: var(--primary-color) }`（基础声明保持 `border-bottom: 2px solid transparent`）；`PageTick`（册页页缘钮）同理改 `&[aria-current='true']`。静态 CSS 无动态类 → 无规则增删生命周期 → 不存在删除竞态；样式与无障碍语义同体（与导航 aria-current 同一血统）。\n- **对比方案:** ① 升级/补丁 styled-components 规则清理逻辑——动公共依赖、风险大不属小变更；② 只对 ModeButton 修、PageTick 留 transient——页缘钮同样点击翻转、同一竞态必然复现，一次修齐。\n- **理由:** 属性选择器是卡片既有规范方向；改动局部（两个 styled 块 + 守卫），甲板视觉零变化（选中态渲染结果与现值一致）。\n- **边界:** 只动 `ModeButton`/`PageTick` 两个 styled 块与对应守卫；`LyricLine`/`WordLine`/`QueueItem` 等无 aria 状态可挂的动态类暂不动（有每秒重渲染自愈，记录进知识卡待后续统一治理）。\n\n## 任务\n### Phase 1\n- [ ] TDD 守卫先行：模式带断言改为「基础 border-bottom 透明 + `&[aria-pressed='true']` 变体在场、`$active` 函数插值退场」；页缘钮断言同改 `&[aria-current='true']` — packages/components/audio-player/player-panel.test.mjs\n- [ ] 实现两个 styled 块改造 — packages/components/audio-player/PlayerPanel.tsx\n### Phase 2\n- [ ] 全量门禁 + dev 实测：点击三模式计算样式 60ms 内到位、样式表规则恒在（无消失窗口）、四主题目检选中态视觉与现版一致 — 验证记录进 brief\n\n完整 brief：shadow-docs/changes/20260930-fix-mode-band-underline-inversion/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260930-fix-mode-band-underline-inversion\",\"type\":\"fix\",\"scope\":\"player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260930-fix-mode-band-underline-inversion/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "shadow-docs/changes/20260930-fix-mode-band-underline-inversion/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 模式带激活态改 aria 属性选择器——消除动态类规则删除竞态的下划线反转"
    }
  },
  "knowledge": null
}
---

# 修复模式带下划线反转——动态类规则删除竞态，改 aria 属性选择器承载激活态

## 动机

生产（v1.4.38）实测复现：点击模式带（顺序/单曲/随机）后 0.5–1s 内，新激活钮无下划线、旧钮保留下划线（自动化采样：点击后 60–500ms 间 `随机` pressed=true + 激活类 `dlGuIA` 但计算 border-bottom 仍透明；约 1s 后自愈）。根因取证：瞬态窗口内 `.dlGuIA`（激活变体）规则**从样式表整体消失**、稍后被下一次无关的 styled-components 插入补回——styled-components v6 对函数插值产生的动态类有使用计数清理，模式带只在点击时重渲染（播放中无其它插入风暴），误删的规则迟迟不重建；用户此前在 v1.4.36 截到的「持久反转」即音频暂停时没有后续插入风暴的形态。歌词/列表类组件因每秒重渲染自愈快、未成显性 bug，但同属此机制。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 「导航当前页状态一律用 aria-current='page' 属性选择器承载，样式与无障碍语义同体」——本变更是同一原则在播放模式带/页缘钮的落地
  - 适用 scope: 全站前端
- shadow-docs/knowledge/music-player.md
  - 当前结论: 控制甲板下划线模式带（v1.4.36 定稿）、移动端册页页缘钮（20260930）
  - 适用 scope: packages/components/audio-player

## 决策

- **选型:** 激活态从 transient prop 三元插值改为 **aria 属性选择器静态 CSS**：`ModeButton` 去掉 `$active` prop 与函数插值，改 `&[aria-pressed='true'] { border-bottom-color: var(--primary-color); color: var(--primary-color) }`（基础声明保持 `border-bottom: 2px solid transparent`）；`PageTick`（册页页缘钮）同理改 `&[aria-current='true']`。静态 CSS 无动态类 → 无规则增删生命周期 → 不存在删除竞态；样式与无障碍语义同体（与导航 aria-current 同一血统）。
- **对比方案:** ① 升级/补丁 styled-components 规则清理逻辑——动公共依赖、风险大不属小变更；② 只对 ModeButton 修、PageTick 留 transient——页缘钮同样点击翻转、同一竞态必然复现，一次修齐。
- **理由:** 属性选择器是卡片既有规范方向；改动局部（两个 styled 块 + 守卫），甲板视觉零变化（选中态渲染结果与现值一致）。
- **边界:** 只动 `ModeButton`/`PageTick` 两个 styled 块与对应守卫；`LyricLine`/`WordLine`/`QueueItem` 等无 aria 状态可挂的动态类暂不动（有每秒重渲染自愈，记录进知识卡待后续统一治理）。

## 任务

### Phase 1
- [x] TDD 守卫先行：模式带断言改为「基础 border-bottom 透明 + `&[aria-pressed='true']` 变体在场、`$active` 函数插值退场」；页缘钮断言同改 `&[aria-current='true']` — packages/components/audio-player/player-panel.test.mjs
- [x] 实现两个 styled 块改造 — packages/components/audio-player/PlayerPanel.tsx
### Phase 2
- [x] 全量门禁 + dev 实测：点击三模式计算样式 60ms 内到位、样式表规则恒在（无消失窗口）、四主题目检选中态视觉与现版一致 — 验证记录进 brief

## 结果
- 实际耗时: 约 1.5 小时（含生产根因取证）
- 验证:
  - `node --test packages/components/audio-player/*.test.mjs` **36/36**（模式带守卫改写：`&[aria-pressed='true']` 属性变体在场、`$active` 函数插值退场）；根 tsc 干净；oxlint 0/0
  - dev 实测（桌面面板）：三钮共享**同一静态类**（无任何动态变体类，删除竞态载体消除）；`.deeIBI[aria-pressed="true"]` 属性规则恒在（CSSOM 会把单引号规范化为双引号——探针须双引号匹配）；点击后各采样点（30–400ms）计算样式全部正确，选中态视觉与现版一致（fix-mode-band-random.png 留档）
  - 采样探针注意：150ms border-color 过渡期内计算值是插值中间色（可能序列化为 color(srgb …)），一致性断言须以 aria-pressed 与目标端点比对面非子串匹配
- 落点说明：`PageTick`（页缘钮）只存在于未合并的 #425 分支，本 PR（基于 main）仅修 `ModeButton`；PageTick 的同款 `&[aria-current='true']` 改造作为补充提交进 #425，两处修齐后本竞态在播放器内不再有宿主
- 生产复现数据（取证存档）：点击后 60–500ms 间激活变体规则从样式表消失（cssRules 采样）、计算样式反转，约 1s 后随下一次 styled 插入自愈；音频暂停时无后续插入风暴 → 用户所见持久反转

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md（模式带/页缘钮条目补「激活态必须 aria 属性选择器、动态类规则删除竞态」结论）
- **理由:** 动态类删除竞态是会复发的机制级事实，属长期有效约束。
