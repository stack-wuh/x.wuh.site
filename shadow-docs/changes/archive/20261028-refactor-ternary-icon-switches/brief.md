---
{
  "schema": "shadow-dev/v1",
  "name": "20261028-refactor-ternary-icon-switches",
  "type": "refactor",
  "scope": "components",
  "status": "archived",
  "baseBranch": "main",
  "branch": "refactor/20261028-refactor-ternary-icon-switches",
  "files": [
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/PlayPauseIcon.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/image-preview/FullscreenToggleIcon.tsx",
    "packages/components/image-preview/MoreMenu.tsx",
    "packages/components/image-preview/Toolbar.tsx"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 564,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/564",
    "pullRequest": 565,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/565"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "831ebdeaf85e4a213965916259e7537f5236f643",
    "verifiedAt": "2026-10-28T16:20:34.173Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:565",
    "planHash": "4f4efdbacd95818c29525008e3d2d31e2d5e2c6a5f7331f1bf8648950a195d2e",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 收敛音频/图片预览的图标切换三目为内部小组件",
      "titleRaw": "收敛音频/图片预览的图标切换三目为内部小组件",
      "supplement": "将 playing 播放/暂停图标切换（MiniPlayer ×2、PlayerPanel ×1）与全屏进入/退出图标切换（Toolbar、MoreMenu）两组重复三目各收敛为目录内部小组件。方案评估与任务见 shadow-docs/changes/20261028-refactor-ternary-icon-switches/brief.md",
      "body": "## 动机\napps/site 与 packages/components 中 `A ? <X/> : <Y/>` 形态的组件级三目约 8 处，其中真正 ≥2 处重复的模式只有两组：playing 播放/暂停图标切换（MiniPlayer ×2、PlayerPanel ×1）与全屏进入/退出图标切换（Toolbar、MoreMenu）。每组收敛为一个语义命名的内部小组件，分支关系保留在组件内部，消费点变为一行。原设想 `[flag, comA, comB] = useComponent()` 解构 hook 经评估否决（见决策）。其余三目（`??` 兜底、条件存在、单次 A/B 分支）不属本次范围，渐进式治理不搞全仓改造。\n\n## 引用规范\n- `norms/code-style.md`\n  - 当前结论: 渐进式治理——不以一次变更为全仓改造入口；不为未来场景提前增加抽象\n  - 适用 scope: 全仓（收敛范围仅限 ≥2 处重复分支的理由依据）\n- `norms/code-style-frontend.md`\n  - 当前结论: hooks 包只封装可复用状态/副作用/浏览器能力；'use client' 只放在需要客户端能力的组件边界\n  - 适用 scope: packages/components\n- `norms/ui-patterns.md`\n  - 当前结论: 组件复用优先，先查组件库，禁止与已有组件功能重叠的新组件\n  - 适用 scope: packages/components\n- `norms/verification.md`\n  - 当前结论: M 级——验收被触及的既有不变量，S/M 级新建套件断言文件判红（INV-4）\n  - 适用 scope: 全仓\n- `shadow-docs/knowledge/component-standard.md`\n  - 当前结论: 目录即公开入口、三件套、内部文件先例（image-preview 的 Toolbar/MoreMenu 同目录文件）；布尔 prop 用形容词不用 isXxx；结构守卫必须绿\n  - 适用 scope: packages/components\n- `shadow-docs/knowledge/shared-hooks.md`\n  - 当前结论: hooks 包不掺页面业务流程；用「组件」而非「hook」收敛渲染分支正是该边界的体现\n  - 适用 scope: packages/hooks（本 change 不触碰，仅作为方案否决依据）\n\n## 决策\n- **选型:** 方案 B——两组重复图标切换各收敛为一个目录内部小组件，三目保留在小组件内部。\n- **对比方案:** 方案 A（`useComponent` 解构 hook）否决——两分支被急切求值破坏三目惰性语义、hook 不管理状态/副作用属语义错位、`use` 前缀误导读者，违反 code-style「不为未来场景提前增加抽象」与 shared-hooks 边界；方案 C（不立项）——用户确认要收敛，仅作备选。\n- **理由:** 组件是渲染分支收敛的正确形态；范围只圈 ≥2 处真实重复，单次分支（MiniPlayer 错误提示行、分页、进度条）不动；不新建任何测试文件（INV-4）。\n\n## 任务\n### Phase 1\n- [ ] task 1 — `packages/components/audio-player/PlayPauseIcon.tsx` — 新建内部组件：props `{ playing: boolean; size: number }`，内部保留 `playing ? <IconPause size/> : <IconPlay size/>`，图标自 `@wuh.site/components/icons` 导入\n- [ ] task 2 — `packages/components/audio-player/MiniPlayer.tsx` — 114/126 两处替换为 `<PlayPauseIcon playing={playing} size={20}/>`，清理 IconPause/IconPlay 无用 import\n- [ ] task 3 — `packages/components/audio-player/PlayerPanel.tsx` — 386 行替换为 `<PlayPauseIcon playing={playing} size={24}/>`，清理无用 import\n### Phase 2\n- [ ] task 4 — `packages/components/image-preview/FullscreenToggleIcon.tsx` — 新建内部组件：props `{ active: boolean }`，内部保留 `active ? <IconExitFullscreen/> : <IconFullscreen/>`\n- [ ] task 5 — `packages/components/image-preview/Toolbar.tsx` 与 `MoreMenu.tsx` — 替换为 `<FullscreenToggleIcon active={...}/>`，清理无用 import\n### Phase 3\n- [ ] task 6 — 验证：`node packages/components/test/structure.test.mjs` 全绿；audio-player 探针（mini-player/player-panel/provider/style/typecheck test）无回归；`pnpm exec tsc --noEmit`；dev/生产构建后页面观察播放按钮与全屏按钮渲染\n\n## 补充\n将 playing 播放/暂停图标切换（MiniPlayer ×2、PlayerPanel ×1）与全屏进入/退出图标切换（Toolbar、MoreMenu）两组重复三目各收敛为目录内部小组件。方案评估与任务见 shadow-docs/changes/20261028-refactor-ternary-icon-switches/brief.md\n\n完整 brief：shadow-docs/changes/20261028-refactor-ternary-icon-switches/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261028-refactor-ternary-icon-switches\",\"type\":\"refactor\",\"scope\":\"components\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261028-refactor-ternary-icon-switches/brief.md\",\"cliVersion\":\"1.8.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/PlayPauseIcon.tsx",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/image-preview/FullscreenToggleIcon.tsx",
        "packages/components/image-preview/MoreMenu.tsx",
        "packages/components/image-preview/Toolbar.tsx",
        "shadow-docs/changes/20261028-refactor-ternary-icon-switches"
      ],
      "message": "refactor(components): 收敛音频与图片预览的图标切换三目为内部小组件",
      "title": "[refactor] 收敛音频/图片预览的图标切换三目为内部小组件",
      "body": "## 变更说明\n\n将两组真实重复的图标切换三目收敛为目录内部小组件，三目保留在小组件内部，公开 Props 与入口零变化：\n\n- `audio-player/PlayPauseIcon`（props: playing/size）——消费点：MiniPlayer ×2、PlayerPanel ×1\n- `image-preview/FullscreenToggleIcon`（props: active）——消费点：Toolbar、MoreMenu\n\n原 `useComponent` 解构 hook 方案经评估否决（两分支急切求值破坏三目惰性语义、hook 语义错位）。范围仅限 ≥2 处重复分支，`??` 兜底与单次 A/B 分支未动。\n\n## 验证\n\n- `node packages/components/test/structure.test.mjs`：18 pass / 0 fail\n- audio-player 探针：mini-player 8 / player-panel 23 / provider 7 / style 22 / typecheck 1，全 pass\n- hooks 守卫：event-hooks 9 / wave2-hooks 11，全 pass\n- `pnpm exec tsc --noEmit`：exit 0\n- runtime 观察：4 个消费点图标渲染正确（size 20/20/24 与传参一致；全屏 glyph 与 icons/icofont 单源一致）；true 分支证据缺口见 brief 结果段\n\nCloses #564"
    }
  },
  "knowledge": {
    "action": "无需变更",
    "target": null,
    "reason": "归档前置重跑：release squash 后 HEAD 由 da9a110 变为 831ebde（PR #565），代码内容与此前 passed review 一致；在 main 上对同一不变量集（结构契约/公开 Props 契约/白名单棘轮）重新落结论，知识判定维持无需变更。"
  }
}
---

# 收敛音频/图片预览的图标切换三目为内部小组件

## 动机
apps/site 与 packages/components 中 `A ? <X/> : <Y/>` 形态的组件级三目约 8 处，其中真正 ≥2 处重复的模式只有两组：playing 播放/暂停图标切换（MiniPlayer ×2、PlayerPanel ×1）与全屏进入/退出图标切换（Toolbar、MoreMenu）。每组收敛为一个语义命名的内部小组件，分支关系保留在组件内部，消费点变为一行。原设想 `[flag, comA, comB] = useComponent()` 解构 hook 经评估否决（见决策）。其余三目（`??` 兜底、条件存在、单次 A/B 分支）不属本次范围，渐进式治理不搞全仓改造。

## 复杂度评级
- **评级:** M
- **理由:** 契约变更＝否——新增组件为目录内部文件，不进公开入口，四个公开组件的 Props/行为不变；触及面＝packages/components 共享包内 audio-player、image-preview 两个目录，局部；可发现性＝改坏立刻可见（图标渲染错一眼可辨）。
- **期望验证深度:** runtime

## 领域模型

- **限界上下文:** components（组件库）— 通用 UI 能力。上游 无；下游 apps/site、apps/console 经公开入口消费。本 change 不动 packages/hooks、不动 site 页面，单上下文。
- **统一语言增量:** 无——PlayPauseIcon、FullscreenToggleIcon 为目录内部文件，不构成公开名词。
- **聚合与不变量:**
  - 组件结构契约：目录三件套/导出形态/跨目录深导入禁令/baseline 棘轮只减不增（component-standard 卡）。
  - 公开 Props 契约：audio-player、image-preview 的 types.ts 与公开入口不变。
  - 副作用白名单棘轮：不新增手写 addEventListener/localStorage（shared-hooks 卡白名单）。
- **领域事件:** 无状态改变。

## 引用规范
- `norms/code-style.md`
  - 当前结论: 渐进式治理——不以一次变更为全仓改造入口；不为未来场景提前增加抽象
  - 适用 scope: 全仓（收敛范围仅限 ≥2 处重复分支的理由依据）
- `norms/code-style-frontend.md`
  - 当前结论: hooks 包只封装可复用状态/副作用/浏览器能力；'use client' 只放在需要客户端能力的组件边界
  - 适用 scope: packages/components
- `norms/ui-patterns.md`
  - 当前结论: 组件复用优先，先查组件库，禁止与已有组件功能重叠的新组件
  - 适用 scope: packages/components
- `norms/verification.md`
  - 当前结论: M 级——验收被触及的既有不变量，S/M 级新建套件断言文件判红（INV-4）
  - 适用 scope: 全仓
- `shadow-docs/knowledge/component-standard.md`
  - 当前结论: 目录即公开入口、三件套、内部文件先例（image-preview 的 Toolbar/MoreMenu 同目录文件）；布尔 prop 用形容词不用 isXxx；结构守卫必须绿
  - 适用 scope: packages/components
- `shadow-docs/knowledge/shared-hooks.md`
  - 当前结论: hooks 包不掺页面业务流程；用「组件」而非「hook」收敛渲染分支正是该边界的体现
  - 适用 scope: packages/hooks（本 change 不触碰，仅作为方案否决依据）

## 决策
- **选型:** 方案 B——两组重复图标切换各收敛为一个目录内部小组件，三目保留在小组件内部。
- **对比方案:** 方案 A（`useComponent` 解构 hook）否决——两分支被急切求值破坏三目惰性语义、hook 不管理状态/副作用属语义错位、`use` 前缀误导读者，违反 code-style「不为未来场景提前增加抽象」与 shared-hooks 边界；方案 C（不立项）——用户确认要收敛，仅作备选。
- **理由:** 组件是渲染分支收敛的正确形态；范围只圈 ≥2 处真实重复，单次分支（MiniPlayer 错误提示行、分页、进度条）不动；不新建任何测试文件（INV-4）。

## 任务
### Phase 1
- [x] task 1 — `packages/components/audio-player/PlayPauseIcon.tsx` — 新建内部组件：props `{ playing: boolean; size: number }`，内部保留 `playing ? <IconPause size/> : <IconPlay size/>`，图标自 `@wuh.site/components/icons` 导入
- [x] task 2 — `packages/components/audio-player/MiniPlayer.tsx` — 114/126 两处替换为 `<PlayPauseIcon playing={playing} size={20}/>`，清理 IconPause/IconPlay 无用 import
- [x] task 3 — `packages/components/audio-player/PlayerPanel.tsx` — 386 行替换为 `<PlayPauseIcon playing={playing} size={24}/>`，清理无用 import
### Phase 2
- [x] task 4 — `packages/components/image-preview/FullscreenToggleIcon.tsx` — 新建内部组件：props `{ active: boolean }`，内部保留 `active ? <IconExitFullscreen/> : <IconFullscreen/>`
- [x] task 5 — `packages/components/image-preview/Toolbar.tsx` 与 `MoreMenu.tsx` — 替换为 `<FullscreenToggleIcon active={...}/>`，清理无用 import
### Phase 3
- [x] task 6 — 验证：`node packages/components/test/structure.test.mjs` 全绿；audio-player 探针（mini-player/player-panel/provider/style/typecheck test）无回归；`pnpm exec tsc --noEmit`；dev/生产构建后页面观察播放按钮与全屏按钮渲染

## 结果
- 实际耗时: 约 25 分钟（含 dev server 环境排查：ambient node 24 下 next dev 空日志挂起，按 mise.toml/SGN-001 切 node 22.23.2 后 2s 就绪）
- 验证: 计划探针 8/8 绿；不变量 3/3 有观察点。
  - 结构契约：`node packages/components/test/structure.test.mjs` → fail 0。
  - 回归探针：mini-player 8 pass / player-panel 23 pass / provider 7 pass / style 22 pass / typecheck 1 pass；另按 shared-hooks 卡「触碰 player 消费点后必跑」补跑 event-hooks 9 pass、wave2-hooks 11 pass——全部 fail 0。
  - 类型：`pnpm exec tsc --noEmit` → exit 0。
  - diff 范围：仅 brief 声明的 4 个文件修改（+9/−13）+ 2 个新内部组件；types.ts、index.tsx（公开入口与 Props 契约）零 diff。
  - 白名单棘轮：diff 中无新增手写 addEventListener/localStorage，走查确认。
  - runtime（localhost:3001，node 22.23.2）：3 个播放按钮各渲染 1 个 svg（MiniPlayer ×2 size=20、PlayerPanel size=24，与传参一致；playing=false 走 IconPlay 分支）；图片预览 1280 宽下 Toolbar 渲染「进入全屏」按钮、窄视口 MoreMenu 全屏项同图标（glyph `iconarrows-alt` 与 `icons/icofont.tsx:89` 的 IconFullscreen 单源一致）——4 个消费点全部命中。
  - 证据缺口：active/true 分支（IconExitFullscreen/IconPause）未能在页面内翻转——Fullscreen API 在后台 pane 拒绝合成点击（无用户激活）、歌曲播放依赖的后端未启动（歌单 API 500）。替代观察点：两组件内部三目为原表达式逐字迁移，true 分支图标与已验证的 false 分支在同一 import 语句同源，tsc 全绿。
- 交付发布: PR #565 已合并（squash `831ebde`，2026-10-29）。按 `shadow-docs/knowledge/build-config.md`：合并不触发部署，生产更新由 GitHub Release published 触发，发版走 `shadow-dev-publish` 独立入口（可攒版）——本 change 无独立发布链待等。

## 知识评估
- **预期影响:** 无需变更
- **候选卡片:** 无
- **理由:** 纯内部重组，不产生新的公开契约与稳定条款；component-standard 卡已覆盖内部文件先例与守卫约束，无增量。
