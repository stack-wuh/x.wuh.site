---
{
  "schema": "shadow-dev/v1",
  "name": "20261118-fix-music-year-loading",
  "type": "fix",
  "scope": "apps/site",
  "status": "archived",
  "baseBranch": "main",
  "branch": null,
  "files": [
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/app/music/styles.ts",
    "packages/components/locales/dictionaries/zh/music.ts",
    "packages/components/locales/dictionaries/en/music.ts",
    "packages/components/locales/dictionaries/ja/music.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 593,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/593",
    "pullRequest": 594,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/594"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "9da5f66d8c7658b75d285917c28c9b30b8175c6c",
    "verifiedAt": "2026-11-18T00:57:17.581Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:594",
    "planHash": "fdbdbcb86ad88f96bd8a60817ae6dfe95aa084ea4b10027a259911dc382daa74",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] music 切年 Loading 收窄到列表区 + 骨架行光扫",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n20261117-feature-music-year-transition（PR #592）引入的换卷动效，用户实测「整页 Loading 闪一下」，不满意。根因是两层叠加：`Content $dim={loading}` 把整个面板（水印/碟面/卷名/描述/标签/按语/曲目）统一压到 `opacity: 0.45`，数据到达后 `ContentInner` 按歌单 key 重挂让全部子元素从透明升起——整块变淡再整块浮现。\n\n诉求：Loading 只占列表区，面板头保持不动；并给列表区设计一个 Loading 动效。用户拍板「录年·骨架行 + 光扫」。\n\n## 引用规范\n（brief 缺少该节）\n\n## 决策\n- **选型:** 移除 `Content $dim` 整页压暗；取数期间面板头（碟面 + 卷名）保持可见且显示**目标卷**；描述/标签/按语/曲目列表收进骨架边界，统一换成骨架占位。列表用 8 行骨架 + 一道柔光从左掠过（1.5s 循环，复用既有缓动令牌）。\n- **对比方案:** B「待卷·旧内容轻压暗」——列表区仍是旧内容变淡，残留痕迹；C「行止·等化器指示」——列表区留白、需固定高度防跳动，且不如骨架能保 CLS。用户选 A。\n- **理由:** 骨架行复刻真实 `TrackRow` 分栏与 54px 行高，骨架→真容零跳变；光扫复用站点「书写显现·被照亮」语言，不新造动画源。\n\n## 任务\n### Phase 1\n- [x] task 1 — apps/site/app/music/styles.ts — 移除 `Content $dim`；新增 SkeletonRow/SkeletonBar/SkeletonIndex/SkeletonMain/SkeletonSide/SkeletonStatus/IntroSkeleton\n- [x] task 2 — apps/site/app/music/MusicView/index.tsx — 删前奏 effect；loading 分支骨架列表；targetSummary 统一卷名/水印；key 前缀防撞\n- [x] task 3 — packages/components/locales/dictionaries/{zh,en,ja}/music.ts — `tracksLoading` 三语文案\n\n完整 brief：shadow-docs/changes/20261118-fix-music-year-loading/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261118-fix-music-year-loading\",\"type\":\"fix\",\"scope\":\"apps/site\",\"status\":\"reviewed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261118-fix-music-year-loading/brief.md\",\"cliVersion\":\"1.9.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": []
    },
    "release": {
      "files": [
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/music/styles.ts",
        "packages/components/locales/dictionaries/en/music.ts",
        "packages/components/locales/dictionaries/ja/music.ts",
        "packages/components/locales/dictionaries/zh/music.ts",
        "shadow-docs/changes/20261118-fix-music-year-loading/brief.md",
        "shadow-docs/knowledge/music-player.md"
      ],
      "message": "fix(music): 切年 Loading 收窄到列表区 + 骨架行光扫",
      "title": "fix(music): 切年 Loading 收窄到列表区 + 骨架行光扫",
      "body": "## 变更\n- `/music` 切年 Loading 从整页收窄到曲目列表区：移除 `Content $dim` 整页压暗，面板头（碟面 + 卷名）取数期间保持可见不动，只有列表区进入 Loading 态\n- 新增列表 Loading 动效「录年·骨架行 + 光扫」：8 行骨架复刻 `TrackRow` 分栏与 54px 行高，一道柔光由左掠过（`skeletonSweep` 1.5s 循环，走 `--motion-ease-in-out-soft`），错落宽度，骨架→真容零跳变\n- 取数期间卷名/水印先显目标卷（`targetSummary` 取纵轨选中项），描述/标签/按语/曲目列表收进骨架边界换占位，不再残留旧卷内容\n- 读屏经视觉隐藏 `role='status'` 播报 `music.page.tracksLoading`（三语新增文案），骨架行 `aria-hidden`\n\n## 影响\n- 行为/触发面变化：切年取数期间面板头不再变淡或整体重挂，视觉焦点稳定在列表区；面板头卷名/水印与目标年份一致\n- 顺带修复 PR #592 三个缺陷：碟面 opacity 卡死 0（前奏 effect 与换面 effect 抢同一 `discFading`）、水印滞留旧值（`Watermark key` 与 `ContentInner key` 同父撞 key）、面板副题显示旧卷曲目数\n- 明确不受影响的范围：换幕层 1 契约（`content-swap` / `useViewTransition` / 失败回落路径）、切年数据流与 URL 同步、reduced-motion 降级（复用 MotionStyles 全局压平）、`/v2/music/*` 契约\n\n## 验证\n- 命令与结果：Next dev 编译 200 通过；真页实测桌面 1011px 与移动 375px 两档——骨架 8 行、行高 54px、光扫 `skeletonSweep` 1.5s infinite 运行、面板头 opacity 恒 1、水印/卷名与目标年份一致、数据到达后 12 行真曲目完整还原\n- 未覆盖项（明说，不留空白）：本地根 `tsc` 与 `oxlint` 因 SIGSEGV / 原生绑定缺失无法运行（环境态，与本次改动无关）；权威门禁以 PR CI 为准\n\n## 关联\n- Closes #593\n- brief: shadow-docs/changes/20261118-fix-music-year-loading/brief.md"
    }
  },
  "knowledge": null
}
---

# music 切年 Loading 收窄到列表区 + 骨架行光扫

## 动机

20261117-feature-music-year-transition（PR #592）引入的换卷动效，用户实测「整页 Loading 闪一下」，不满意。根因是两层叠加：`Content $dim={loading}` 把整个面板（水印/碟面/卷名/描述/标签/按语/曲目）统一压到 `opacity: 0.45`，数据到达后 `ContentInner` 按歌单 key 重挂让全部子元素从透明升起——整块变淡再整块浮现。

诉求：Loading 只占列表区，面板头保持不动；并给列表区设计一个 Loading 动效。用户拍板「录年·骨架行 + 光扫」。

## 复杂度评级
- **评级:** S
- **理由:** 同仓 5 文件（2 代码 + 3 文案），不改接口与数据流；复用既有动效语言。
- **期望验证深度:** runtime（真页 + 移动/桌面两档 + 骨架态与到达态实测）
- **取证策略:** observation

## 领域模型
- **限界上下文:** music 年度歌单切换动效（消费 animation-system 换幕两层 + 列表骨架）。
- **被触及的既有不变量:** ①换幕层 1 契约（Content 持 `content-swap`、失败回落不进 withTransition）——未动；②reduced-motion 降级——复用 MotionStyles 全局压平；③切年数据流 selectedId→fetch→withTransition 提交 + URL 同步——未动。

## 决策
- **选型:** 移除 `Content $dim` 整页压暗；取数期间面板头（碟面 + 卷名）保持可见且显示**目标卷**；描述/标签/按语/曲目列表收进骨架边界，统一换成骨架占位。列表用 8 行骨架 + 一道柔光从左掠过（1.5s 循环，复用既有缓动令牌）。
- **对比方案:** B「待卷·旧内容轻压暗」——列表区仍是旧内容变淡，残留痕迹；C「行止·等化器指示」——列表区留白、需固定高度防跳动，且不如骨架能保 CLS。用户选 A。
- **理由:** 骨架行复刻真实 `TrackRow` 分栏与 54px 行高，骨架→真容零跳变；光扫复用站点「书写显现·被照亮」语言，不新造动画源。

## 顺带修复（PR #592 遗留缺陷）
1. **碟面 opacity 卡死 0**：新增的「换卷前奏 effect」（keyed on `selectedId`）与原有「换面 effect」（keyed on `selectedPlaylist.playlistId`）抢同一个 `discFading`，淡出后没人恢复，取数期间碟面完全不可见。删除前奏 effect。
2. **水印/卷名与目标年份错位**：`Watermark key={selectedYear}`（字符串 `"2023"`）与 `ContentInner key={playlistId}`（数字 `2023`）在 React 同父兄弟间撞 key，报 "two children with the same key"，水印滞留旧值。两者加 `wm-` / `vol-` 前缀区分。
3. **面板副题显示旧卷数字**：取数期间改骨架占位条。

## 任务
### Phase 1
- [x] task 1 — apps/site/app/music/styles.ts — 移除 `Content $dim`；新增 SkeletonRow/SkeletonBar/SkeletonIndex/SkeletonMain/SkeletonSide/SkeletonStatus/IntroSkeleton
- [x] task 2 — apps/site/app/music/MusicView/index.tsx — 删前奏 effect；loading 分支骨架列表；targetSummary 统一卷名/水印；key 前缀防撞
- [x] task 3 — packages/components/locales/dictionaries/{zh,en,ja}/music.ts — `tracksLoading` 三语文案

## 结果
- 实际耗时: —
- 验证: 真页实测（桌面 1011px / 移动 375px）——骨架 8 行、行高 54px、光扫 `skeletonSweep` 1.5s infinite、面板头 opacity 恒 1、水印/卷名与目标年份一致、数据到达后 12 行真曲目完整还原。Next 编译 200；根 `tsc`/`oxlint` 本机 SIGSEGV/原生绑定缺失（环境态，与改动无关）。

## 知识评估
- **预期影响:** 更新
- **候选卡片:** shadow-docs/knowledge/music-player.md
- **理由:** yearbook 段「换卷·洜染」需补记「Loading 收窄为列表骨架 + 光扫」的现行形态，并记录三个已修缺陷，避免后续实现重蹈。