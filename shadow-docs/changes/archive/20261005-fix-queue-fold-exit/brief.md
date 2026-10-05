---
{
  "schema": "shadow-dev/v1",
  "name": "20261005-fix-queue-fold-exit",
  "type": "fix",
  "scope": "audio-player",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261005-fix-queue-fold-exit",
  "files": [
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/panel/PanelQueue.tsx",
    "packages/components/audio-player/style.test.mjs",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 477,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/477",
    "pullRequest": 478,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/478"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "fc72d01061cecc9952d372f25a03695db322db45",
    "verifiedAt": "2026-10-05T16:11:53.326Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:478",
    "planHash": "e13e585f898f7252b10a0fde43a7b4152c24530fcce6de5fd9a230c9007da540",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix(player): 队列翻页屏粘性收拢边界——离列表栏即折，不再等离整个面板",
      "titleRaw": "fix(player): 队列翻页屏粘性收拢边界——离列表栏即折，不再等离整个面板",
      "supplement": "20261002 粘性开合把 latch 解除边界定在离开整个 Panel，实际体验热区等效整个弹窗、摊开挡视线。本次下沉到右缘 340px 列表栏：移出 QZone 即原路翻回；pinned/键盘路径不变。brief：shadow-docs/changes/20261005-fix-queue-fold-exit/brief.md",
      "body": "## 动机\n20261002 粘性开合把 `foldLatch` 的解除边界定在**离开整个 Panel**（设计初衷：转正后在面板内漫游不误收拢）。实际体验判定这过头了：右缘 340px 列表转正后，鼠标只要还留在弹窗内任何位置（舞台/dock/标题），列表就一直摊开挡视线、盖内容——热区等效扩大到整个 Dialog。用户拍板新语义：**鼠标移出列表容器（右缘 340px 列）即解除 latch 原路翻回**；pinned（列表钮钉开）路径不变。\n\n## 引用规范\n- `shadow-docs/knowledge/music-player.md`\n  - 当前结论: 播放列表翻页屏段——粘性开合（20261002 hotfix）：进入右缘热区即锁存「开」，指针在面板内漫游不收拢，**离开面板**才折回；`foldOpen = queueOpen || foldLatch` 行内样式驱动；CSS `:hover` 保留作零延迟开启\n  - 适用 scope: packages/components/audio-player\n- `shadow-docs/knowledge/components.md`\n  - 当前结论: 拆分守卫读取纪律——面板守卫源码经 `panel-sources.mjs` 规范顺序拼接；叶子 props 沿用原标识符；禁选择器/动态类驱动显隐（行内样式纪律）\n  - 适用 scope: packages/components\n\n## 决策\n- **选型:** 解除边界下沉到 QZone——`<QZone onPointerEnter={...}>` 补 `onPointerLeave={() => setFoldLatch(false)}`，Panel 级 `onPointerLeave` 退役（离开面板必经 QZone 边界，先于 Panel 触发，无遗漏场景；触屏 pointer 抬升即 leave，列表随即折回——触屏主路径本就是 pinned 钮与 CSS hover 门控，行为一致性更好）\n- **对比方案:** QScreen 级 leave——转正后 QScreen 视觉矩形与 QZone 列等宽等高（340px 定宽），两者边界重合，QScreen 级并无更准，反而把 leave 挂到带 transform 的动画元素上（3D 变换元素事件命中区在过渡中有抖动风险），不选\n- **理由:** 离场 160ms 宽限由 QScreen 既有 CSS `transition-delay` 承担（掠出不频闪）；keyboard `:focus-within` 与 pinned `queueOpen` 路径零改动；改动最小且语义即用户指令\n\n## 任务\n### Phase 1 接线与守卫\n- [ ] QZone 补 `onPointerLeave={() => setFoldLatch(false)}`；Panel 级 `onPointerLeave` 与对应行删除 — `packages/components/audio-player/panel/PanelQueue.tsx`、`packages/components/audio-player/PlayerPanel.tsx`\n- [ ] 更新「队列翻页屏 hotfix」守卫断言：latch 解除挂点从 Panel 改为 QZone 调用点（切片 `<QZone` 起、断言 onPointerLeave 在场 + Panel 壳不再挂）；brief 语义注释同步 — `packages/components/audio-player/style.test.mjs`\n- [ ] 门禁：域 5 测试逐文件全绿 + 根 tsc + oxlint — `node --test`\n\n### Phase 2 知识闭环\n- [ ] music-player.md「粘性开合」结论改写为离栏即折语义（source 追加本 brief）；knowledge 动作随 release 落实\n\n## 补充\n20261002 粘性开合把 latch 解除边界定在离开整个 Panel，实际体验热区等效整个弹窗、摊开挡视线。本次下沉到右缘 340px 列表栏：移出 QZone 即原路翻回；pinned/键盘路径不变。brief：shadow-docs/changes/20261005-fix-queue-fold-exit/brief.md\n\n完整 brief：shadow-docs/changes/20261005-fix-queue-fold-exit/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261005-fix-queue-fold-exit\",\"type\":\"fix\",\"scope\":\"audio-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261005-fix-queue-fold-exit/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/panel/PanelQueue.tsx",
        "packages/components/audio-player/style.test.mjs",
        "shadow-docs/changes/20261005-fix-queue-fold-exit/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(player): 队列翻页屏粘性收拢边界——移出 340px 列表栏即折回，不再等离开整个面板",
      "title": "fix(player): 队列翻页屏粘性收拢边界——离列表栏即折",
      "body": "Closes #477\n\n完整 brief：shadow-docs/changes/20261005-fix-queue-fold-exit/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/music-player.md",
    "reason": "粘性开合边界语义（离栏即折）已改写进 music-player.md，source 与 verified-scope 同步"
  }
}
---

# fix(player): 队列翻页屏粘性收拢边界——离列表栏即折，不再等离整个面板

## 动机

20261002 粘性开合把 `foldLatch` 的解除边界定在**离开整个 Panel**（设计初衷：转正后在面板内漫游不误收拢）。实际体验判定这过头了：右缘 340px 列表转正后，鼠标只要还留在弹窗内任何位置（舞台/dock/标题），列表就一直摊开挡视线、盖内容——热区等效扩大到整个 Dialog。用户拍板新语义：**鼠标移出列表容器（右缘 340px 列）即解除 latch 原路翻回**；pinned（列表钮钉开）路径不变。

## 复杂度评级

- **评级:** S
- **理由:** 契约变更：无（公开 API 与组件 props 形态不变，仅一行接线删除 + 一行新增）；触及面：小（PanelQueue.tsx、PlayerPanel.tsx、守卫断言、music-player.md 结论）；可发现性：高（hover 进出纯事件语义，目检即证）。
- **期望验证深度:** code-read + unit（域守卫全绿 + tsc/oxlint）；runtime 目检随部署生产复验

## 引用规范

- `shadow-docs/knowledge/music-player.md`
  - 当前结论: 播放列表翻页屏段——粘性开合（20261002 hotfix）：进入右缘热区即锁存「开」，指针在面板内漫游不收拢，**离开面板**才折回；`foldOpen = queueOpen || foldLatch` 行内样式驱动；CSS `:hover` 保留作零延迟开启
  - 适用 scope: packages/components/audio-player
- `shadow-docs/knowledge/components.md`
  - 当前结论: 拆分守卫读取纪律——面板守卫源码经 `panel-sources.mjs` 规范顺序拼接；叶子 props 沿用原标识符；禁选择器/动态类驱动显隐（行内样式纪律）
  - 适用 scope: packages/components

## 决策

- **选型:** 解除边界下沉到 QZone——`<QZone onPointerEnter={...}>` 补 `onPointerLeave={() => setFoldLatch(false)}`，Panel 级 `onPointerLeave` 退役（离开面板必经 QZone 边界，先于 Panel 触发，无遗漏场景；触屏 pointer 抬升即 leave，列表随即折回——触屏主路径本就是 pinned 钮与 CSS hover 门控，行为一致性更好）
- **对比方案:** QScreen 级 leave——转正后 QScreen 视觉矩形与 QZone 列等宽等高（340px 定宽），两者边界重合，QScreen 级并无更准，反而把 leave 挂到带 transform 的动画元素上（3D 变换元素事件命中区在过渡中有抖动风险），不选
- **理由:** 离场 160ms 宽限由 QScreen 既有 CSS `transition-delay` 承担（掠出不频闪）；keyboard `:focus-within` 与 pinned `queueOpen` 路径零改动；改动最小且语义即用户指令

## 任务

### Phase 1 接线与守卫
- [x] QZone 补 `onPointerLeave={() => setFoldLatch(false)}`；Panel 级 `onPointerLeave` 与对应行删除 — `packages/components/audio-player/panel/PanelQueue.tsx`、`packages/components/audio-player/PlayerPanel.tsx`
- [x] 更新「队列翻页屏 hotfix」守卫断言：latch 解除挂点从 Panel 改为 QZone 调用点（切片 `<QZone` 起、断言 onPointerLeave 在场 + Panel 壳不再挂）；brief 语义注释同步 — `packages/components/audio-player/style.test.mjs`
- [x] 门禁：域 5 测试逐文件全绿 + 根 tsc + oxlint — `node --test`

### Phase 2 知识闭环
- [x] music-player.md「粘性开合」结论改写为离栏即折语义（source 追加本 brief）；knowledge 动作随 release 落实

## 结果

- 实际耗时: ≈20 分钟
- 验证: 全绿——style 19/19（含新「离栏即折」四断言：QZone enter/leave 配对、Panel 壳 onPointerLeave doesNotMatch 禁回潮、queueOpen||foldLatch 并集、foldLatch 在场）、player-panel 22/22、typecheck 1/1、provider+mini 14/14、wiring 10/10、oxlint 25 文件 0/0。S 级不跑本地 build:next（PR 合并后 main quality-gate + 部署链覆盖）。行为：鼠标移出右缘 340px 列表栏即原路翻回；pinned（列表钮）与键盘 focus-within 路径不变；离场 160ms 宽限由 QScreen CSS transition-delay 承担；触屏 pointer 抬升即 leave——触屏主路径本就是 pinned 钮，一致性更好。知识卡 music-player.md「粘性开合」结论已改写为离栏即折。

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/music-player.md`（播放列表翻页屏段·粘性开合语义改写）
- **理由:** 折叠边界是长期交互语义（20261002「离面板才折」被本次用户拍板推翻），不改写即与代码事实冲突
