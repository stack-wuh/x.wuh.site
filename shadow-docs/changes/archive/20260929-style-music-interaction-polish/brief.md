---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-style-music-interaction-polish",
  "type": "style",
  "scope": "music",
  "status": "archived",
  "baseBranch": "main",
  "branch": "style/20260929-style-music-interaction-polish",
  "files": [
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/app/music/loading.tsx",
    "apps/site/app/music/page.tsx",
    "apps/site/app/music/styles.ts",
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/mini-player.test.mjs",
    "shadow-docs/knowledge/music-player.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 419,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/419",
    "pullRequest": 421,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/421"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "de824756fc2894333ece508d1ed5d44b07de9d57",
    "verifiedAt": "2026-09-30T02:39:08.822Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:421",
    "planHash": "443916bf35accf8092716bdd911c303004472789529e6a151353fc62e7badd28",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 音乐交互两处优化：收起态声源指示 + /music 页头身份栏移除",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n用户在实际使用中发现两个交互问题（同一张 /music 页截图提出）：\n\n1. **收起态无声源指示**：迷你播放器收起后，桌面只剩屏幕左缘一枚 28×48 箭头书耳（`CollapsedEar`）、移动端右下角朱砂「音」印章（`SealButton`），音乐在响却没有任何视觉元素告诉访客「声音从这里来」。用户原话：「左下角的箭头是不是应该有动效，要不然用户根本不知道音乐声音从哪里来」。\n2. **页头身份栏冗余**：/music 页头右侧的「头像 + 吴尒红 + 自 2018 年记录」身份栏与站点导航、页头正下方的年份纵轨（2018–2025）信息重复；个人站点访客无需知道账号昵称与等级。用户原话：「右上角的用户名和头像是不是可以考虑去掉，太冗余了」。\n\n## 引用规范\n- `shadow-docs/knowledge/music-player.md`\n  - 当前结论: /music 页呈现「年轮编年·碟心封面」（年份纵轨/水印年份/碟心封面）；移动端页头身份栏收进标题行；播放器降级语义与组件公开 API 保持不变\n  - 适用 scope: apps/site/app/music、packages/components/audio-player\n- `shadow-docs/knowledge/animation-system.md`\n  - 当前结论: packages/components 共享组件不得引用 `--motion-*`；例外——`packages/components/audio-player` 为站点专属组件，关键帧与 `--motion-*` 引用自持（既有 `equalize` 先例）\n  - 适用 scope: packages/components/audio-player（收起态动效的新关键帧落在该豁免内）\n- `shadow-docs/knowledge/design-system.md`\n  - 当前结论: 颜色必须经主题变量暴露；断点只用 `BREAKPOINTS` 语义常量；淡化色用 `color-mix(var(--text-color) 72%)` 语言；reduced-motion 必须尊重\n  - 适用 scope: 两处改动的 token 与动效纪律\n\n## 决策\n- **选型:** 单变更两阶段，type `style`（均为表现层交互打磨，不动数据域）：\n  - **阶段一 · 收起态声源指示（墨柱等化器方案）**：桌面 `CollapsedEar` 播放中把箭头换成三根跳动墨柱（复用既有 `equalize` 关键帧与展开卡 `Equalizer` 同款语言），暂停/空闲恢复箭头；移动端 `SealButton` 播放中外圈加朱砂涟漪环（`::after` 扩散消散循环），暂停静止。两者 `prefers-reduced-motion` 下动效取消（墨柱静止低柱态/涟漪不渲染），可访问名保持「展开播放器」不变。\n  - **阶段二 · /music 页头身份栏整块移除**：删除 `Identity` 块（头像/昵称/Lv 徽标/「自 X 年记录」）及 `MusicView` 的 `profile` prop 链路（`page.tsx` 不再下传）；`styles.ts` 清掉 `Identity`/`Avatar`/`SealAvatar`/`IdentityName`/`LvBadge`/`Since` 六个样式；页头回归「标题 + 副题」，与博客/关于页头同构；移动端页头网格随之简化。\n- **对比方案:**\n  - 声源指示备选「脉冲圆点」（箭头常驻、耳顶加呼吸圆点）——更保守但引入第二套播放语言，与展开卡既有墨柱语汇分裂，未选。\n  - 身份栏备选「保留起始年叙事」（「自 2018 年记录」折进副题）——与年份纵轨信息重复，且副题加长后移动端易折行，未选。\n- **理由:** 墨柱等化器零新增视觉语汇（复用 `equalize` + audio-player 豁免条款），收起/展开两态语言自洽；身份栏整块移除后页头信息密度与全站一致，「自 2018 年记录」由年份纵轨天然表达。服务端 `/v2/music/user-playlists` 的 `profile` 字段属接口契约，保持暴露不动（其它消费者按契约对接），仅 /music 页不再渲染。\n\n## 任务\n### Phase 1 收起态声源指示\n- [ ] `CollapsedEar` 增加 `$playing` transient prop：播放中渲染迷你墨柱等化器（复用 `equalize`），暂停/空闲渲染 `IconChevronRight` — `packages/components/audio-player/MiniPlayer.tsx`\n- [ ] `SealButton` 增加 `$playing`：`::after` 朱砂涟漪环扩散动画，`prefers-reduced-motion` 取消 — `packages/components/audio-player/MiniPlayer.tsx`\n- [ ] 源码守卫测试：等化器换装条件、涟漪关键帧、reduced-motion、暂停回落箭头 — `packages/components/audio-player/mini-player.test.mjs`\n\n### Phase 2 /music 页头身份栏移除\n- [ ] 删除 `Identity` 渲染块与 `profile` prop（含未用 import 清理） — `apps/site/app/music/MusicView/index.tsx`\n- [ ] `page.tsx` 不再下传 `profile`（`mine` 仍供年度纵轨） — `apps/site/app/music/page.tsx`\n- [ ] 删除 `Identity`/`Avatar`/`SealAvatar`/`IdentityName`/`LvBadge`/`Since` 样式并简化移动端页头网格 — `apps/site/app/music/styles.ts`\n\n### Phase 3 验证与知识\n- [ ] `pnpm exec tsc --noEmit` + oxlint + audio-player 测试全绿；dev 实测收起态播放/暂停两态与 /music 页头（桌面 + ≤640px）\n- [ ] 更新 music-player.md：收起态声源指示事实新增；「页头身份栏收进标题行」表述随移除改写 — `shadow-docs/knowledge/music-player.md`\n\n完整 brief：shadow-docs/changes/20260929-style-music-interaction-polish/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-style-music-interaction-polish\",\"type\":\"style\",\"scope\":\"music\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-style-music-interaction-polish/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "commit": {
      "files": [
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/music/loading.tsx",
        "apps/site/app/music/page.tsx",
        "apps/site/app/music/styles.ts",
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/mini-player.test.mjs",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "style(music): 收起态声源指示与 /music 页头身份栏移除——书耳墨柱换装、印章涟漪环、身份栏整块清退"
    }
  },
  "knowledge": null
}
---

# 音乐交互两处优化：收起态声源指示 + /music 页头身份栏移除

## 动机

用户在实际使用中发现两个交互问题（同一张 /music 页截图提出）：

1. **收起态无声源指示**：迷你播放器收起后，桌面只剩屏幕左缘一枚 28×48 箭头书耳（`CollapsedEar`）、移动端右下角朱砂「音」印章（`SealButton`），音乐在响却没有任何视觉元素告诉访客「声音从这里来」。用户原话：「左下角的箭头是不是应该有动效，要不然用户根本不知道音乐声音从哪里来」。
2. **页头身份栏冗余**：/music 页头右侧的「头像 + 吴尒红 + 自 2018 年记录」身份栏与站点导航、页头正下方的年份纵轨（2018–2025）信息重复；个人站点访客无需知道账号昵称与等级。用户原话：「右上角的用户名和头像是不是可以考虑去掉，太冗余了」。

## 引用规范

- `shadow-docs/knowledge/music-player.md`
  - 当前结论: /music 页呈现「年轮编年·碟心封面」（年份纵轨/水印年份/碟心封面）；移动端页头身份栏收进标题行；播放器降级语义与组件公开 API 保持不变
  - 适用 scope: apps/site/app/music、packages/components/audio-player
- `shadow-docs/knowledge/animation-system.md`
  - 当前结论: packages/components 共享组件不得引用 `--motion-*`；例外——`packages/components/audio-player` 为站点专属组件，关键帧与 `--motion-*` 引用自持（既有 `equalize` 先例）
  - 适用 scope: packages/components/audio-player（收起态动效的新关键帧落在该豁免内）
- `shadow-docs/knowledge/design-system.md`
  - 当前结论: 颜色必须经主题变量暴露；断点只用 `BREAKPOINTS` 语义常量；淡化色用 `color-mix(var(--text-color) 72%)` 语言；reduced-motion 必须尊重
  - 适用 scope: 两处改动的 token 与动效纪律

## 决策

- **选型:** 单变更两阶段，type `style`（均为表现层交互打磨，不动数据域）：
  - **阶段一 · 收起态声源指示（墨柱等化器方案）**：桌面 `CollapsedEar` 播放中把箭头换成三根跳动墨柱（复用既有 `equalize` 关键帧与展开卡 `Equalizer` 同款语言），暂停/空闲恢复箭头；移动端 `SealButton` 播放中外圈加朱砂涟漪环（`::after` 扩散消散循环），暂停静止。两者 `prefers-reduced-motion` 下动效取消（墨柱静止低柱态/涟漪不渲染），可访问名保持「展开播放器」不变。
  - **阶段二 · /music 页头身份栏整块移除**：删除 `Identity` 块（头像/昵称/Lv 徽标/「自 X 年记录」）及 `MusicView` 的 `profile` prop 链路（`page.tsx` 不再下传）；`styles.ts` 清掉 `Identity`/`Avatar`/`SealAvatar`/`IdentityName`/`LvBadge`/`Since` 六个样式；页头回归「标题 + 副题」，与博客/关于页头同构；移动端页头网格随之简化。
- **对比方案:**
  - 声源指示备选「脉冲圆点」（箭头常驻、耳顶加呼吸圆点）——更保守但引入第二套播放语言，与展开卡既有墨柱语汇分裂，未选。
  - 身份栏备选「保留起始年叙事」（「自 2018 年记录」折进副题）——与年份纵轨信息重复，且副题加长后移动端易折行，未选。
- **理由:** 墨柱等化器零新增视觉语汇（复用 `equalize` + audio-player 豁免条款），收起/展开两态语言自洽；身份栏整块移除后页头信息密度与全站一致，「自 2018 年记录」由年份纵轨天然表达。服务端 `/v2/music/user-playlists` 的 `profile` 字段属接口契约，保持暴露不动（其它消费者按契约对接），仅 /music 页不再渲染。

## 任务

### Phase 1 收起态声源指示
- [x] `CollapsedEar` 增加 `$playing` transient prop：播放中渲染迷你墨柱等化器（复用 `equalize`），暂停/空闲渲染 `IconChevronRight` — `packages/components/audio-player/MiniPlayer.tsx`
- [x] `SealButton` 增加 `$playing`：`::after` 朱砂涟漪环扩散动画，`prefers-reduced-motion` 取消 — `packages/components/audio-player/MiniPlayer.tsx`
- [x] 源码守卫测试：等化器换装条件、涟漪关键帧、reduced-motion、暂停回落箭头 — `packages/components/audio-player/mini-player.test.mjs`

### Phase 2 /music 页头身份栏移除
- [x] 删除 `Identity` 渲染块与 `profile` prop（含未用 import 清理） — `apps/site/app/music/MusicView/index.tsx`
- [x] `page.tsx` 不再下传 `profile`（`mine` 仍供年度纵轨） — `apps/site/app/music/page.tsx`
- [x] 删除 `Identity`/`Avatar`/`SealAvatar`/`IdentityName`/`LvBadge`/`Since` 样式并简化移动端页头网格 — `apps/site/app/music/styles.ts`
- [x] loading 骨架同步移除身份栏占位（复用 `Identity` 容器，样式删除会编译失败；apply 进场依 #416 现状补录本任务与文件清单，走「CLI 不负责时普通文件编辑」逃生口） — `apps/site/app/music/loading.tsx`

### Phase 3 验证与知识
- [x] `pnpm exec tsc --noEmit` + oxlint + audio-player 测试全绿；dev 实测收起态播放/暂停两态与 /music 页头（桌面 + ≤640px）
- [x] 更新 music-player.md：收起态声源指示事实新增；「页头身份栏收进标题行」与路由骨架「身份栏」占位表述随移除改写 — `shadow-docs/knowledge/music-player.md`

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/music-player.md`
- **理由:** 「/music 移动端呈现」段落的页头身份栏事实随整块移除失效需改写；收起态声源指示（墨柱换装 + 印章涟漪 + reduced-motion 语义）是长期有效的组件事实，应沉淀。animation-system.md 的 audio-player 豁免已覆盖新关键帧，无需变更。
