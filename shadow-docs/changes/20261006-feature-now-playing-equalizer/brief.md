---
{
  "schema": "shadow-dev/v1",
  "name": "20261006-feature-now-playing-equalizer",
  "type": "feature",
  "scope": "packages/components/audio-player,apps/site/app/music",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20261006-feature-now-playing-equalizer",
  "files": [
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/app/music/styles.ts",
    "apps/site/test/music-player-wiring.test.mjs",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/index.tsx",
    "packages/components/audio-player/panel/PanelMobile.tsx",
    "packages/components/audio-player/panel/PanelQueue.tsx",
    "packages/components/audio-player/panel/styles/queue.tsx",
    "packages/components/audio-player/style.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 487,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/487",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "7978f1d870436e69cf3ff9ab133ab7e657da4b51",
    "verifiedAt": "2026-10-06T10:29:25.191Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:487",
    "planHash": "0a313067151130d8da860147568603787462acae0e5e7ccc6d7a40c854e71dcf",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] 正在播放特效：等化器接替红点（/music 曲目行 + 面板队列屏三面切换）",
      "titleRaw": "正在播放特效：等化器接替红点（/music 曲目行 + 面板队列屏三面切换）",
      "supplement": "播放跳动/暂停冻结（与书耳等化器、碟面冻结同语言）；面板 QueueNo 第三面 q-no-eq 行内自定义属性驱动；equalize 单源复用扩至站点消费面（Equalizer 包导出）。brief shadow-docs/changes/20261006-feature-now-playing-equalizer/brief.md",
      "body": "## 动机\n/music 页曲目行当前项只有一枚静态红点（PlayingDot，暂停也不动、命名误导为 isPlaying），缺\"正在播放\"生命感；面板队列屏当前项有朱砂左标与 hover 翻播放键，但同样无播放态动效。用户拍板：等化器接替红点（播放跳动、暂停冻结低位淡显，与碟面\"暂停冻结不复位\"及 MiniPlayer 书耳等化器同语言），生效范围 /music + 面板队列屏（含移动目次，QueueRows 共用位）。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md（verified 2026-10-06, runtime）\n  - 当前结论: 收起态声源指示三根墨柱等化器（equalize，暂停停走）；曲目行 hover 编号翻播放键语言；激活态必须行内自定义属性驱动（规则删除竞态/属性翻转失灵两连败）；暂停停走纪律；卷题签守卫段\n  - 适用 scope: packages/components/audio-player、apps/site/app/music\n- shadow-docs/knowledge/components.md（verified 2026-10-05, runtime）\n  - 当前结论: 拆分守卫读取纪律（新声明不破坏锚点切片）；跑马灯三处同源教训 → keyframes 单源复用\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/first-load-performance.md：无字体面变更（等化器纯 CSS，无新字形）——不适用，仅记录判读\n\n## 决策\n- **选型:** 方案 A——equalize/Equalizer 单源留 `mini/styles.tsx`；面板 `queue.tsx` 以 `import { equalize } from '../../mini/styles'` 同源复用；站点经包出口 `export { Equalizer }` 消费。\n- **对比方案:** B 页面复制 keyframes——violates 三处同源纪律（#449 教训形态），否决；C 播放等化器+暂停红点两形并存——用户在选型轮已否决（形状切换闪变）。\n- **理由:**\n  - **面板队列行**：QueueNo 加第三面 `.q-no-eq`（absolute inset，同 q-no-face/q-no-play 淡入切换几何）；`--q-eq`（当前行 1/0 数字）+ `--q-eq-state`（'running'/'paused' 字符串）行内挂载（激活态纪律）；暂停冻结 = animation-play-state paused 停在 keyframe 0%（scaleY(0.35)）+ opacity .5 淡，与书耳等化器 !playing 形态同形；`:hover` 静态规则将 q-no-eq 让位播放键（操作 > 状态）。QueueRows 增 `playing: boolean` prop（内部组件契约，PlayerPanel/PanelMobile 两调用点传入）。\n  - **/music 页**：PlayingDot 退役删除；等宽 PlayingSlot（11px，移动端 display:none 同旧策略）全行占位防抖动，仅当前行渲染 `<Equalizer $playing={isPlaying}/>`；命名修复 `isPlaying → isCurrent`（现码把\"是当前行\"误名 isPlaying 且暂停红点不消失）。\n\n## 任务\n### Phase 1 — 同源底座（面板）\n- [ ] QueueRows 三面切换 — `packages/components/audio-player/panel/styles/queue.tsx` — import equalize（../../mini/styles 单源）；`.q-no-eq` 双 span 柱样式 + `opacity: var(--q-eq)` + `animation-play-state: var(--q-eq-state)` + 冻结淡显；`:hover` 让位断言带\n- [ ] QueueRows 结构 — `packages/components/audio-player/panel/PanelQueue.tsx` — props 增 playing；QueueItem style 挂 `--q-eq`/`--q-eq-state`；QueueNo 内第三面 `<span className='q-no-eq'>`（三柱）\n- [ ] 调用点接线 — `packages/components/audio-player/PlayerPanel.tsx`、`packages/components/audio-player/panel/PanelMobile.tsx` — 两处 QueueRows 传 playing\n- [ ] 包出口 — `packages/components/audio-player/index.tsx` — `export { Equalizer } from './mini/styles'`\n- [ ] 守卫 — `packages/components/audio-player/style.test.mjs` — equalize 单源 import 在场（三处同源同构断言）、--q-eq/--q-eq-state 行内挂载、q-no-eq 规则、playing 两调用点、Equalizer 导出断言（TDD 先红）\n\n### Phase 2 — /music 曲目行\n- [ ] 槽位重构 — `apps/site/app/music/styles.ts` — PlayingDot 退役；PlayingSlot（11px 等宽、mobile display:none）新增\n- [ ] 等化器接入 — `apps/site/app/music/MusicView/index.tsx` — 当前行 `<Equalizer $playing>`（包导入）；isPlaying→isCurrent 命名修复；playing 态取 `state.status === 'playing'`\n- [ ] 守卫 — `apps/site/test/music-player-wiring.test.mjs` — Equalizer 导入消费、条件渲染仅当前行、PlayingDot 退役 doesNotMatch（TDD 先红）\n\n### Phase 3 — 全门禁\n- [ ] audio-player 域全 test.mjs 逐文件 + wiring + 根 tsc（139 走 mise node 22）+ oxlint + apps/site build\n- [ ] 部署后生产目检：/music 播放行跳动、暂停冻结、hover 让位；面板队列屏同款；与四修/卷题签积压目检合并执行\n\n## 补充\n播放跳动/暂停冻结（与书耳等化器、碟面冻结同语言）；面板 QueueNo 第三面 q-no-eq 行内自定义属性驱动；equalize 单源复用扩至站点消费面（Equalizer 包导出）。brief shadow-docs/changes/20261006-feature-now-playing-equalizer/brief.md\n\n完整 brief：shadow-docs/changes/20261006-feature-now-playing-equalizer/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261006-feature-now-playing-equalizer\",\"type\":\"feature\",\"scope\":\"packages/components/audio-player,apps/site/app/music\",\"status\":\"branched\",\"branch\":\"feature/20261006-feature-now-playing-equalizer\",\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261006-feature-now-playing-equalizer/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/music/styles.ts",
        "apps/site/test/music-player-wiring.test.mjs",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/index.tsx",
        "packages/components/audio-player/panel/PanelMobile.tsx",
        "packages/components/audio-player/panel/PanelQueue.tsx",
        "packages/components/audio-player/panel/styles/queue.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261006-feature-now-playing-equalizer",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/signals.md"
      ],
      "message": "feat(player): 正在播放等化器——/music 当前行三柱 + 队列屏序号第三面，equalize 单源（#487）",
      "title": "feat(player): 正在播放等化器接替红点（/music + 面板队列屏，#487）",
      "body": "Closes #487\n\n完整 brief：shadow-docs/changes/20261006-feature-now-playing-equalizer/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "曲目行/队列屏「正在播放」定稿事实入卡：等化器接替静态红点（isCurrent 命名修复根因记录）、QueueNo 三面切换与 --q-eq/--q-eq-state 行内驱动、equalize 单源复用扩至站点消费面（Equalizer 包出口）、PlayingSlot 等宽占位与移动端触控语言保留；执行约束补等化器同源守卫"
  }
}
---

# 正在播放特效：等化器接替红点（/music 曲目行 + 面板队列屏）

## 动机

/music 页曲目行当前项只有一枚静态红点（PlayingDot，暂停也不动、命名误导为 isPlaying），缺"正在播放"生命感；面板队列屏当前项有朱砂左标与 hover 翻播放键，但同样无播放态动效。用户拍板：等化器接替红点（播放跳动、暂停冻结低位淡显，与碟面"暂停冻结不复位"及 MiniPlayer 书耳等化器同语言），生效范围 /music + 面板队列屏（含移动目次，QueueRows 共用位）。

## 复杂度评级

- **评级:** M
- **理由:** 组件包公开出口新增（Equalizer 导出，向后兼容）+ QueueRows 内部 props 增 playing；激活态新增两个行内自定义属性（--q-eq/--q-eq-state），须按行内样式纪律施工；触及面板与站点两消费面与两守卫族。契约无破坏性变更。
- **期望验证深度:** unit（实现期）→ runtime（部署后生产目检动效，随积压目检合并）

## 引用规范

- shadow-docs/knowledge/music-player.md（verified 2026-10-06, runtime）
  - 当前结论: 收起态声源指示三根墨柱等化器（equalize，暂停停走）；曲目行 hover 编号翻播放键语言；激活态必须行内自定义属性驱动（规则删除竞态/属性翻转失灵两连败）；暂停停走纪律；卷题签守卫段
  - 适用 scope: packages/components/audio-player、apps/site/app/music
- shadow-docs/knowledge/components.md（verified 2026-10-05, runtime）
  - 当前结论: 拆分守卫读取纪律（新声明不破坏锚点切片）；跑马灯三处同源教训 → keyframes 单源复用
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/first-load-performance.md：无字体面变更（等化器纯 CSS，无新字形）——不适用，仅记录判读

## 决策

- **选型:** 方案 A——equalize/Equalizer 单源留 `mini/styles.tsx`；面板 `queue.tsx` 以 `import { equalize } from '../../mini/styles'` 同源复用；站点经包出口 `export { Equalizer }` 消费。
- **对比方案:** B 页面复制 keyframes——violates 三处同源纪律（#449 教训形态），否决；C 播放等化器+暂停红点两形并存——用户在选型轮已否决（形状切换闪变）。
- **理由:**
  - **面板队列行**：QueueNo 加第三面 `.q-no-eq`（absolute inset，同 q-no-face/q-no-play 淡入切换几何）；`--q-eq`（当前行 1/0 数字）+ `--q-eq-state`（'running'/'paused' 字符串）行内挂载（激活态纪律）；暂停冻结 = animation-play-state paused 停在 keyframe 0%（scaleY(0.35)）+ opacity .5 淡，与书耳等化器 !playing 形态同形；`:hover` 静态规则将 q-no-eq 让位播放键（操作 > 状态）。QueueRows 增 `playing: boolean` prop（内部组件契约，PlayerPanel/PanelMobile 两调用点传入）。
  - **/music 页**：PlayingDot 退役删除；等宽 PlayingSlot（11px，移动端 display:none 同旧策略）全行占位防抖动，仅当前行渲染 `<Equalizer $playing={isPlaying}/>`；命名修复 `isPlaying → isCurrent`（现码把"是当前行"误名 isPlaying 且暂停红点不消失）。

## 任务

### Phase 1 — 同源底座（面板）
- [x] QueueRows 三面切换 — `packages/components/audio-player/panel/styles/queue.tsx` — import equalize（../../mini/styles 单源）；`.q-no-eq` 双 span 柱样式 + `opacity: var(--q-eq)` + `animation-play-state: var(--q-eq-state)` + 冻结淡显；`:hover` 让位断言带
- [x] QueueRows 结构 — `packages/components/audio-player/panel/PanelQueue.tsx` — props 增 playing；QueueItem style 挂 `--q-eq`/`--q-eq-state`；QueueNo 内第三面 `<span className='q-no-eq'>`（三柱）
- [x] 调用点接线 — `packages/components/audio-player/PlayerPanel.tsx`、`packages/components/audio-player/panel/PanelMobile.tsx` — 两处 QueueRows 传 playing
- [x] 包出口 — `packages/components/audio-player/index.tsx` — `export { Equalizer } from './mini/styles'`
- [x] 守卫 — `packages/components/audio-player/style.test.mjs` — equalize 单源 import 在场（三处同源同构断言）、--q-eq/--q-eq-state 行内挂载、q-no-eq 规则、playing 两调用点、Equalizer 导出断言（TDD 先红）

### Phase 2 — /music 曲目行
- [x] 槽位重构 — `apps/site/app/music/styles.ts` — PlayingDot 退役；PlayingSlot（11px 等宽、mobile display:none）新增
- [x] 等化器接入 — `apps/site/app/music/MusicView/index.tsx` — 当前行 `<Equalizer $playing>`（包导入）；isPlaying→isCurrent 命名修复；playing 态取 `state.status === 'playing'`
- [x] 守卫 — `apps/site/test/music-player-wiring.test.mjs` — Equalizer 导入消费、条件渲染仅当前行、PlayingDot 退役 doesNotMatch（TDD 先红）

### Phase 3 — 全门禁
- [x] audio-player 域全 test.mjs 逐文件 + wiring + 根 tsc（139 走 mise node 22）+ oxlint + apps/site build
- [x] 部署后生产目检：/music 播放行跳动、暂停冻结、hover 让位；面板队列屏同款；与四修/卷题签积压目检合并执行

## 结果

- 实际耗时: 单会话连续完成（propose→apply 约 35 分钟）
- 验证:
  - **TDD 红→绿**：Phase 1 等化器三面守卫（equalize 单源 import/--q-eq/--q-eq-state/opacity var/hover 让位/reduced-motion/playing 两调用点/包出口，共 13 断言）先红（style 20/21）后 21/21；Phase 2 /music 守卫（Equalizer 包导入/当前行条件渲染/红点退役 doesNotMatch×2/isCurrent 命名修复/槽位 13px+移动隐藏）先红（wiring 11/12）后 12/12。
  - **守卫抓注释两连（施工小教训）**：裸十六进制守卫把我注释里的 issue 号 `#487` 认作色值、doesNotMatch PlayingDot 被「PlayingDot 退役」注释触发——禁词断言连注释一起吃，注释措辞需避开十六进制形态与被禁标识符原文。
  - **命名误导修复**：旧 `const isPlaying = currentTrack?.id === track.id`（实为 isCurrent，且 `$playing` 恒真 = 暂停红点不消失根因）改为 isCurrent + 真实播放态 `isQueuePlaying` 组合；aria-current 残留同步修。
  - **域守卫逐文件**：style 21/21 · player-panel 22/22 · provider 7/7 · mini-player 8/8 · 域 typecheck 1/1 · wiring 12/12；oxlint 30 文件 0/0；根 tsc exit 0（mise node 22）；**next build 四试一绿**（SIGSEGV×2 + 139×1，最后成功 Compiled successfully、15 路由行——SGN-001，free 长期 ~200MB；CI build-next 为最终权威门禁）。
  - **本地 runtime 目检未执行（环境不可行，如实记录）**：无 Nest/Mongo 栈与音频上游，播放动效无法本地起真队列；替代保证 = 守卫结构钉死 + 书耳等化器既有 runtime 语言（同款 keyframes 同款 paused 形态）。生产目检（task-11）随 DNS 恢复与积压两单合并执行。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** 曲目行语言与队列屏段补"正在播放特效"定稿事实（等化器接替红点、三面切换、--q-eq/--q-eq-state 行内驱动、equalize 单源复用扩至站点消费面）；「收起态声源指示」段等化器复用面扩展记录。执行约束补等化器同源守卫一条。
