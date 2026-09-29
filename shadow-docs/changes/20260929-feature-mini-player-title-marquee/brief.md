---
{
  "schema": "shadow-dev/v1",
  "name": "20260929-feature-mini-player-title-marquee",
  "type": "feature",
  "scope": "music-player",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "feature/20260929-feature-mini-player-title-marquee",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/mini-player.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 404,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/404",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "66b317f164dd1c0eab0c7b0b4eecab63c9cc0975",
    "verifiedAt": "2026-09-29T02:19:05.747Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:404",
    "planHash": "ad3625e44e04aab064614d7278fa71fe9b298c806ffe0eb2f3926fef5205c832",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[feature] MiniPlayer 歌名溢出轮播滚动",
      "titleRaw": null,
      "supplement": "",
      "body": "## 动机\n迷你播放器标题行是单行省略（`text-overflow: ellipsis`），长歌名被截断（实测「风月缠绵（2017七...」），用户无法看到完整歌名。要求：标题溢出时以轮播滚动展示全名；不溢出时保持静态。\n\n## 引用规范\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: 播放器降级语义——跳过提示占用歌手行、卡片高度不变、`role='status'`\n  - 适用 scope: packages/components/audio-player\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 新动画引用 `--motion-*` tokens；reduced-motion 必须降级；关键帧约束（MotionStyles）与 `packages/components 不得引用 --motion-*` 存在 audio-player 例外（站点专属组件，console 不消费，现有 `equalize`/`EASE`/`QUICK` 即先例），本变更延续先例并在知识评估中把例外写明\n  - 适用 scope: packages/components/audio-player\n\n## 决策\n- **选型:** 方案 A 无缝循环跑马灯——JS 只做溢出测量（ResizeObserver 观察标题容器 + 曲目名变化时重测），溢出时渲染双份歌名 + 间隔，`translateX 0 → -50%` 线性无限循环，首尾百分比 hold 停顿，时长按测量距离以恒速（约 30px/s）换算写入 CSS 变量；暂停时 `animation-play-state: paused`（与 Equalizer 语义一致）；`prefers-reduced-motion: reduce` 降级为静态 ellipsis\n- **对比方案:** B 往返 ping-pong（折返观感突兀，偏离站点动效语言，弃）；C 纯 CSS scroll-driven `scroll(self x)`（隐藏滚动条 hack + 兼容门控复杂，与 animation-system 的 timeline 使用边界冲突，弃）\n- **理由:** 循环平移无方向折返、纯 transform 合成层动画性能好；本地 keyframes 与同文件 `equalize` 先例一致；测量用元素级 ResizeObserver，不引入 JS scroll/resize 监听器\n\n## 任务\n### Phase 1\n- [ ] source guard 测试先行：断言 MiniPlayer 源码含溢出测量（ResizeObserver + 曲目名依赖）、双份文本无缝循环结构、`prefers-reduced-motion` 降级 — `packages/components/audio-player/mini-player.test.mjs` — 新增\n- [ ] Title 改造为 wrapper + track：新增溢出测量 hook，未溢出保持单行 ellipsis，溢出时输出 `$overflow` 与时长 CSS 变量并渲染双份歌名 — `packages/components/audio-player/MiniPlayer.tsx` — 修改\n- [ ] marquee keyframes 与降级：0→-50% 线性循环、首尾 hold、暂停时停走、reduced-motion 关动画回退省略号 — `packages/components/audio-player/MiniPlayer.tsx` — 修改\n\n### Phase 2\n- [ ] 验证：`node --test packages/components/audio-player/` 全绿、`pnpm exec tsc --noEmit` 无新增错误、oxlint 无告警；本地长歌名目测滚动与 reduced-motion 降级 — 验证任务\n- [ ] 知识评估落地：animation-system.md 适用边界原位补 audio-player 例外（或判定无需变更并记录理由）— `shadow-docs/knowledge/animation-system.md` — 可能原位更新\n\n完整 brief：shadow-docs/changes/20260929-feature-mini-player-title-marquee/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20260929-feature-mini-player-title-marquee\",\"type\":\"feature\",\"scope\":\"music-player\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20260929-feature-mini-player-title-marquee/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "feature"
      ]
    },
    "commit": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/mini-player.test.mjs",
        "shadow-docs/changes/20260929-feature-mini-player-title-marquee/brief.md",
        "shadow-docs/knowledge/animation-system.md"
      ],
      "message": "feat(player): 迷你播放器歌名溢出轮播滚动——双份拷贝无缝循环展示全名"
    }
  },
  "knowledge": null
}
---

# MiniPlayer 歌名溢出轮播滚动

## 动机
迷你播放器标题行是单行省略（`text-overflow: ellipsis`），长歌名被截断（实测「风月缠绵（2017七...」），用户无法看到完整歌名。要求：标题溢出时以轮播滚动展示全名；不溢出时保持静态。

## 引用规范
- shadow-docs/knowledge/music-player.md
  - 当前结论: 播放器降级语义——跳过提示占用歌手行、卡片高度不变、`role='status'`
  - 适用 scope: packages/components/audio-player
- shadow-docs/knowledge/animation-system.md
  - 当前结论: 新动画引用 `--motion-*` tokens；reduced-motion 必须降级；关键帧约束（MotionStyles）与 `packages/components 不得引用 --motion-*` 存在 audio-player 例外（站点专属组件，console 不消费，现有 `equalize`/`EASE`/`QUICK` 即先例），本变更延续先例并在知识评估中把例外写明
  - 适用 scope: packages/components/audio-player

## 决策
- **选型:** 方案 A 无缝循环跑马灯——JS 只做溢出测量（ResizeObserver 观察标题容器 + 曲目名变化时重测），溢出时渲染双份歌名 + 间隔，`translateX 0 → -50%` 线性无限循环，首尾百分比 hold 停顿，时长按测量距离以恒速（约 30px/s）换算写入 CSS 变量；暂停时 `animation-play-state: paused`（与 Equalizer 语义一致）；`prefers-reduced-motion: reduce` 降级为静态 ellipsis
- **对比方案:** B 往返 ping-pong（折返观感突兀，偏离站点动效语言，弃）；C 纯 CSS scroll-driven `scroll(self x)`（隐藏滚动条 hack + 兼容门控复杂，与 animation-system 的 timeline 使用边界冲突，弃）
- **理由:** 循环平移无方向折返、纯 transform 合成层动画性能好；本地 keyframes 与同文件 `equalize` 先例一致；测量用元素级 ResizeObserver，不引入 JS scroll/resize 监听器

## 任务
### Phase 1
- [x] source guard 测试先行：断言 MiniPlayer 源码含溢出测量（ResizeObserver + 曲目名依赖）、双份文本无缝循环结构、`prefers-reduced-motion` 降级 — `packages/components/audio-player/mini-player.test.mjs` — 新增
- [x] Title 改造为 wrapper + track：新增溢出测量 hook，未溢出保持单行 ellipsis，溢出时输出 `$overflow` 与时长 CSS 变量并渲染双份歌名 — `packages/components/audio-player/MiniPlayer.tsx` — 修改
- [x] marquee keyframes 与降级：0→-50% 线性循环、首尾 hold、暂停时停走、reduced-motion 关动画回退省略号 — `packages/components/audio-player/MiniPlayer.tsx` — 修改

### Phase 2
- [x] 验证：`node --test packages/components/audio-player/` 全绿、`pnpm exec tsc --noEmit` 无新增错误、oxlint 无告警；本地长歌名目测滚动与 reduced-motion 降级 — 验证任务
- [x] 知识评估落地：animation-system.md 适用边界原位补 audio-player 例外（或判定无需变更并记录理由）— `shadow-docs/knowledge/animation-system.md` — 可能原位更新

## 结果
- 实际耗时: —
- 验证: —

## 知识评估
- **预期影响:** 更新（原位小改）
- **候选卡片:** shadow-docs/knowledge/animation-system.md
- **理由:** 现状代码（`equalize` 关键帧、`--motion-*` 引用）已与「关键帧只在 MotionStyles」「packages/components 不得引用 --motion-*」形成事实例外，本次延续该先例，卡片适用边界应明确 audio-player 例外而非留冲突；music-player.md 降级语义不受影响（标题行滚动不触碰歌手行/提示行与卡片高度）
