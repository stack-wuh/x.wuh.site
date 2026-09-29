---
{
  "schema": "shadow-dev/v1",
  "name": "20260928-style-player-responsive-redesign",
  "type": "style",
  "scope": "packages/components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260928-style-player-responsive-redesign",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/style.test.mjs",
    "packages/components/icons/index.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 395,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/395",
    "pullRequest": 402,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/402"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "dd3ff124085cc1fc5da774661d036eeaa2406e08",
    "verifiedAt": "2026-09-28T23:46:25.351Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:402",
    "planHash": "8f6b118e7d5db34f123a8dced949cd4f02c300c601a5935c9262d01a8d364853",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] style: 播放器响应式重设计——纸墨语言整器重铸",
      "titleRaw": "style: 播放器响应式重设计——纸墨语言整器重铸",
      "supplement": "AudioPlayer 移动端样式重做：MiniPlayer 全宽底栏 + 印章收起钮，PlayerPanel 移动端全屏沉浸页 + 歌词/列表分段切换，全端换纸墨主题 token 语言。详见 shadow-docs/changes/20260928-style-player-responsive-redesign/brief.md",
      "body": "## 动机\nAudioPlayer（MiniPlayer + PlayerPanel）当前是一套硬编码的暗色霓虹皮（`#ff375f`/`#ff6a3d`/写死酒红渐变），与站点纸墨设计语言完全脱节，且在四个主题（酒红/素雅 × 亮/暗）下呈现同一张皮。移动端问题更重：PlayerPanel 零断点，桌面三栏 `inset: 40px 48px` 布局在手机上直接挤爆、封面固定 380px 溢出；MiniPlayer 卡片+收拢栏并排挤压，触摸目标仅 34px（规范底线 44px），并使用 `width` 布局位移动画。另缺 Escape 关闭、焦点管理、`prefers-reduced-motion`，图标使用 `‹ ▶ ❯ ❮` 裸字符破坏全站线框图标语言。本变更按方案 A「整器重铸」重写两个组件的样式层与移动端形态，使其成为一套符合网站风格的响应式播放器。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 跳过提示占用迷你播放器歌手行（`role='status'`、卡片高度不变、只在用户操作时清空）；公开 API 保持兼容\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/design-system.md\n  - 当前结论: 颜色必须经主题变量、断点只用 `BREAKPOINTS` 语义常量、暗色淡化用 `color-mix(in oklab, var(--text-color) 72%, transparent)` 禁 `--text-secondary`、`font` 简写排在 `font-size` 之前、动态状态禁跨组件插值选择器（transient prop 挂子组件自身）\n  - 适用 scope: packages/components（全局主题体系）\n- shadow-docs/knowledge/icon-system.md\n  - 当前结论: lucide 线框图标按需具名导出进 `icons/index.tsx`，不散落 SVG/裸字符；图标按钮保持 44×44 触摸区\n  - 适用 scope: packages/components/icons\n- norms/ui-patterns.md — 暗色全覆盖、禁横向滚动/固定遮挡、动效 150–300ms ease-out、禁布局位移动画、`prefers-reduced-motion`、visible focus ring、44px 触摸目标\n- norms/interaction.md — Escape 关闭弹层、焦点打开移入/关闭移回触发元素、动态提示 aria（`role='status'`）\n- norms/code-style-packages.md — 组件包不依赖业务页面；变更后验证消费者类型检查与构建\n\n## 决策\n- **选型:** 方案 A「整器重铸」——重写 `MiniPlayer.tsx` + `PlayerPanel.tsx` 样式层（DOM 局部调整），移动端面板采用用户确认的「全屏沉浸页 + 歌词/列表分段切换」形态，移动端 Mini 采用全宽底栏 + 收起态印章钮。\n- **对比方案:** B 渐进补丁（只换色加断点）无法解决布局性缺陷（三栏挤爆、34px 触摸目标、width 位移动画），被否；C 组件拆分重写属结构治理，超出视觉/响应式范畴，留待后续独立 change。\n- **理由:** A 是唯一同时命中「移动端体验」与「全端风格统一」两个目标的范围；design-system/icon-system/ui-patterns 约束全部内生于做法（token 化、BREAKPOINTS 常量、lucide 具名导出、transform/opacity 动效、44px、reduced-motion）；`provider.tsx`/`specs.tsx` 不动使 music-player.md 的降级语义与公开 API 承诺自动保持。\n- **设计语言（UI 方向）:** 纸墨——纸卡 `--background-100` + 发丝线边框 + `--elevation-soft`；播放主钮为朱砂印圆钮（呼应 Header 墨签）；进度条为朱砂渐隐运笔（`scaleX`，与导航下划线同源语言）；移动端收起态为圆形朱砂「音」印章钮；面板为纸面沉浸页，封面装裱式呈现。全部颜色走主题变量，四主题自动适配。\n- **待确认点:** 无。\n\n## 任务\n### Phase 1 基线\n- [ ] icons 增补播放族 lucide 具名导出（Play/Pause/SkipBack/SkipForward/Repeat/Repeat1/Shuffle/ListMusic/X/ChevronUp 等按需） — `packages/components/icons/index.tsx` — 新增导出\n- [ ] 新建样式纪律测试：扫描 audio-player 源码禁裸十六进制色值、禁裸断点数值（必须经 `BREAKPOINTS` 常量） — `packages/components/audio-player/style.test.mjs` — 新建（绿灯）\n\n### Phase 2 MiniPlayer 重铸\n- [ ] 桌面 dock 卡纸墨重皮：纸卡 + 发丝线 + elevation-soft，进度改朱砂运笔 `scaleX`，播放钮朱砂印圆钮，裸字符换 lucide 图标 — `packages/components/audio-player/MiniPlayer.tsx` — 重写 styled 层\n- [ ] 移动端全宽底栏：`safe-area-inset-bottom` 适配、触摸目标 ≥44px、收起态缩为朱砂印章钮、开合动效只用 opacity/transform（去 width 过渡） — `packages/components/audio-player/MiniPlayer.tsx` — 重写移动端布局\n- [ ] 跳过提示语义走查：`role='status'` 占歌手行、卡片高度不变、仅用户操作清空 — `packages/components/audio-player/MiniPlayer.tsx` — 验证\n\n### Phase 3 PlayerPanel 重铸\n- [ ] 桌面三栏纸卡弹层重皮（信息架构不变，裸字符换图标） — `packages/components/audio-player/PlayerPanel.tsx` — 重写 styled 层\n- [ ] 移动端全屏沉浸页 + 歌词/列表分段切换（tablist 语义），音量行移动端隐藏 — `packages/components/audio-player/PlayerPanel.tsx` — 新增移动端形态\n- [ ] 弹层交互补齐：Escape 关闭、焦点移入/移回触发钮、`role='dialog'` + `aria-modal`、`prefers-reduced-motion` 降级 — `packages/components/audio-player/PlayerPanel.tsx` — 新增\n\n### Phase 4 验证\n- [ ] Lint + `pnpm exec tsc --noEmit` + `node --test packages/components/audio-player/provider.test.mjs packages/components/audio-player/style.test.mjs` — 回归\n- [ ] 浏览器目检：酒红/素雅 × 亮/暗 4 主题 × 375/768/1280 viewport，Mini 展开/收起两态 + Panel 桌面/移动两形态 — runtime 目检\n\n## 补充\nAudioPlayer 移动端样式重做：MiniPlayer 全宽底栏 + 印章收起钮，PlayerPanel 移动端全屏沉浸页 + 歌词/列表分段切换，全端换纸墨主题 token 语言。详见 shadow-docs/changes/20260928-style-player-responsive-redesign/brief.md\n\n完整 brief：shadow-docs/changes/20260928-style-player-responsive-redesign/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260928-style-player-responsive-redesign\",\"type\":\"style\",\"scope\":\"packages/components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260928-style-player-responsive-redesign/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/style.test.mjs",
        "packages/components/icons/index.tsx",
        "shadow-docs/knowledge/components.md",
        "shadow-docs/knowledge/design-system.md"
      ],
      "message": "style(player): 播放器响应式重设计——纸墨语言整器重铸\n\n- MiniPlayer: 桌面纸卡 dock + 收拢栏，移动端全宽底栏 + 朱砂印章收起钮\n- PlayerPanel: 桌面三栏纸卡弹层，移动端全屏沉浸页 + 歌词/列表分段切换\n- 面板背景采用封面原图水印层 + 主题纸色罩，四主题自适应\n- 补齐 Escape/焦点管理/reduced-motion/44px 触摸目标，图标换 lucide 线框体系\n- 新增 style.test.mjs 样式纪律门禁（禁裸色/裸断点/布局位移动画）\n\nCloses #395",
      "title": "style(player): 播放器响应式重设计——纸墨语言整器重铸",
      "body": "Closes #395\n\n完整 brief：shadow-docs/changes/20260928-style-player-responsive-redesign/brief.md"
    }
  },
  "knowledge": null
}
---

# 播放器响应式重设计：纸墨语言整器重铸

## 动机

AudioPlayer（MiniPlayer + PlayerPanel）当前是一套硬编码的暗色霓虹皮（`#ff375f`/`#ff6a3d`/写死酒红渐变），与站点纸墨设计语言完全脱节，且在四个主题（酒红/素雅 × 亮/暗）下呈现同一张皮。移动端问题更重：PlayerPanel 零断点，桌面三栏 `inset: 40px 48px` 布局在手机上直接挤爆、封面固定 380px 溢出；MiniPlayer 卡片+收拢栏并排挤压，触摸目标仅 34px（规范底线 44px），并使用 `width` 布局位移动画。另缺 Escape 关闭、焦点管理、`prefers-reduced-motion`，图标使用 `‹ ▶ ❯ ❮` 裸字符破坏全站线框图标语言。本变更按方案 A「整器重铸」重写两个组件的样式层与移动端形态，使其成为一套符合网站风格的响应式播放器。

## 复杂度评级

- **评级:** M
- **理由:** 三要素对照——①契约变更：无，公开 API（`TrackSource`/`TrackResolver`/`AudioPlayerActions`/`AudioPlayerState`）与跳过提示语义不变，`provider.tsx`/`specs.tsx` 零改动；②触及面：独立 UI 组件两文件 + 图标库增量导出，不碰宿主核心与共享函数签名，消费者仅 `GlobalAudioPlayer` 一处挂载；③可发现性：视觉组件改坏即刻可见，但需 4 主题 × 3 断点运行时目检。
- **期望验证深度:** runtime

## 引用规范

- shadow-docs/knowledge/music-player.md
  - 当前结论: 跳过提示占用迷你播放器歌手行（`role='status'`、卡片高度不变、只在用户操作时清空）；公开 API 保持兼容
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/design-system.md
  - 当前结论: 颜色必须经主题变量、断点只用 `BREAKPOINTS` 语义常量、暗色淡化用 `color-mix(in oklab, var(--text-color) 72%, transparent)` 禁 `--text-secondary`、`font` 简写排在 `font-size` 之前、动态状态禁跨组件插值选择器（transient prop 挂子组件自身）
  - 适用 scope: packages/components（全局主题体系）
- shadow-docs/knowledge/icon-system.md
  - 当前结论: lucide 线框图标按需具名导出进 `icons/index.tsx`，不散落 SVG/裸字符；图标按钮保持 44×44 触摸区
  - 适用 scope: packages/components/icons
- norms/ui-patterns.md — 暗色全覆盖、禁横向滚动/固定遮挡、动效 150–300ms ease-out、禁布局位移动画、`prefers-reduced-motion`、visible focus ring、44px 触摸目标
- norms/interaction.md — Escape 关闭弹层、焦点打开移入/关闭移回触发元素、动态提示 aria（`role='status'`）
- norms/code-style-packages.md — 组件包不依赖业务页面；变更后验证消费者类型检查与构建

## 决策

- **选型:** 方案 A「整器重铸」——重写 `MiniPlayer.tsx` + `PlayerPanel.tsx` 样式层（DOM 局部调整），移动端面板采用用户确认的「全屏沉浸页 + 歌词/列表分段切换」形态，移动端 Mini 采用全宽底栏 + 收起态印章钮。
- **对比方案:** B 渐进补丁（只换色加断点）无法解决布局性缺陷（三栏挤爆、34px 触摸目标、width 位移动画），被否；C 组件拆分重写属结构治理，超出视觉/响应式范畴，留待后续独立 change。
- **理由:** A 是唯一同时命中「移动端体验」与「全端风格统一」两个目标的范围；design-system/icon-system/ui-patterns 约束全部内生于做法（token 化、BREAKPOINTS 常量、lucide 具名导出、transform/opacity 动效、44px、reduced-motion）；`provider.tsx`/`specs.tsx` 不动使 music-player.md 的降级语义与公开 API 承诺自动保持。
- **设计语言（UI 方向）:** 纸墨——纸卡 `--background-100` + 发丝线边框 + `--elevation-soft`；播放主钮为朱砂印圆钮（呼应 Header 墨签）；进度条为朱砂渐隐运笔（`scaleX`，与导航下划线同源语言）；移动端收起态为圆形朱砂「音」印章钮；面板为纸面沉浸页，封面装裱式呈现。全部颜色走主题变量，四主题自动适配。
- **待确认点:** 无。

## 任务

### Phase 1 基线
- [x] icons 增补播放族 lucide 具名导出（Play/Pause/SkipBack/SkipForward/Repeat/Repeat1/Shuffle/ListMusic/X/ChevronUp 等按需） — `packages/components/icons/index.tsx` — 新增导出
- [x] 新建样式纪律测试：扫描 audio-player 源码禁裸十六进制色值、禁裸断点数值（必须经 `BREAKPOINTS` 常量） — `packages/components/audio-player/style.test.mjs` — 新建（绿灯）

### Phase 2 MiniPlayer 重铸
- [x] 桌面 dock 卡纸墨重皮：纸卡 + 发丝线 + elevation-soft，进度改朱砂运笔 `scaleX`，播放钮朱砂印圆钮，裸字符换 lucide 图标 — `packages/components/audio-player/MiniPlayer.tsx` — 重写 styled 层
- [x] 移动端全宽底栏：`safe-area-inset-bottom` 适配、触摸目标 ≥44px、收起态缩为朱砂印章钮、开合动效只用 opacity/transform（去 width 过渡） — `packages/components/audio-player/MiniPlayer.tsx` — 重写移动端布局
- [x] 跳过提示语义走查：`role='status'` 占歌手行、卡片高度不变、仅用户操作清空 — `packages/components/audio-player/MiniPlayer.tsx` — 验证

### Phase 3 PlayerPanel 重铸
- [x] 桌面三栏纸卡弹层重皮（信息架构不变，裸字符换图标） — `packages/components/audio-player/PlayerPanel.tsx` — 重写 styled 层
- [x] 移动端全屏沉浸页 + 歌词/列表分段切换（tablist 语义），音量行移动端隐藏 — `packages/components/audio-player/PlayerPanel.tsx` — 新增移动端形态
- [x] 弹层交互补齐：Escape 关闭、焦点移入/移回触发钮、`role='dialog'` + `aria-modal`、`prefers-reduced-motion` 降级 — `packages/components/audio-player/PlayerPanel.tsx` — 新增

### Phase 4 验证
- [x] Lint + `pnpm exec tsc --noEmit` + `node --test packages/components/audio-player/provider.test.mjs packages/components/audio-player/style.test.mjs` — 回归
- [x] 浏览器目检：酒红/素雅 × 亮/暗 4 主题 × 375/768/1280 viewport，Mini 展开/收起两态 + Panel 桌面/移动两形态 — runtime 目检

## 结果
- 实际耗时: 2026-09-28 propose → 2026-09-29 交付（跨两日；含 apply + 两轮追加需求「全屏沉浸面板形态」「封面原图水印背景」）
- 验证: 纪律测试 + provider 回归 12/12 绿；`tsc --noEmit` 零错误（根 workspace，覆盖 packages 改动）；oxlint 0 警告；visual-judge 目检累计 21 张截图全通过（4 主题 × 375/768/1280，迷你两态 + 面板双形态 + 封面水印背景）
- 交付: PR #402 merged（merge commit `71c00a4`）→ GitHub Release [v1.4.28](https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.28) → 部署链 run 36497781558 全绿（quality-gate/prepare/build-nest/build-next/staging-test/switch-traffic 全 success），已上线
- 知识落地: components.md（AudioPlayer 响应式形态 + 纪律门禁）、design-system.md（主题切换目检方法论）已原位更新

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/components.md（AudioPlayer 条目补充移动端全屏沉浸面板 + 全宽底栏形态与纸墨语言）；若印章钮/运笔进度线形成可复用结论，同步更新 shadow-docs/knowledge/design-system.md
- **理由:** 播放器新形态是组件包长期有效事实，属跨会话可复用结论；单次实现细节留在本 brief。
