---
{
  "schema": "shadow-dev/v1",
  "name": "20261104-style-state-transition-motion",
  "type": "style",
  "scope": "site",
  "status": "reviewed",
  "baseBranch": "main",
  "branch": "style/20261104-style-state-transition-motion",
  "files": [
    "apps/site/app/blog/BlogListView/index.tsx",
    "apps/site/app/footprint/page.tsx",
    "apps/site/app/guestbook/GuestbookPageView/index.tsx",
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/app/music/styles.ts",
    "apps/site/app/post/PostView/index.tsx",
    "apps/site/app/styles/motion.ts",
    "apps/site/app/topics/[label]/TopicListView.tsx",
    "apps/site/app/weread/WereadView/index.tsx",
    "packages/components/footprint-map/styles.ts",
    "packages/hooks/test/view-transition-hooks.test.mjs",
    "packages/hooks/useViewTransition/index.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 566,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/566",
    "pullRequest": null,
    "pullRequestUrl": null
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0cbe78b47d3b7c326743effff382ae8760677562",
    "verifiedAt": "2026-11-03T23:42:24.632Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "issue:566",
    "planHash": "5bca044eebced8a99f8e06fa372210c30f6fec44a1a0a014f0d4599ee2256533",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[style] 状态切换换幕——全站内容区过渡机制",
      "titleRaw": "[style] 状态切换换幕——全站内容区过渡机制",
      "supplement": "用户操作触发的状态切换（切年/地图选点/翻页/筛选/上下篇）内容区 DOM 瞬时替换无过渡。建立「换幕」双层机制：层 1 startViewTransition 交叉淡化（music 切年 + footprint 选点，新增共享 hook useViewTransition）；层 2 key 换幕 + mount 入场关键帧（blog/guestbook/weread/topics/post 五面软导航）。方案与不变量见 shadow-docs/changes/20261104-style-state-transition-motion/brief.md",
      "body": "## 动机\n用户操作触发的状态切换（/music 切年、/footprint 地图选点、blog 筛选与分页、guestbook/weread 分页、topics 话题跳转、post 上一篇/下一篇）导致内容区 DOM 瞬时替换，无进出场反馈，观感生硬。典型痛点：/music 切年时面板标题/按语/水印年份/曲目列表文字直变，仅碟心黑胶有自持换面动画。20261104 全站盘点确认 7 个视图存在同类瞬换（GuestbookPageView/WereadView/TopicListView/footprint ContentPanel 等零动画；blog 仅有 YearGroup blogRowRise 部分覆盖）。\n\n本次建立「换幕」双层机制一次接齐：\n\n- **层 1 交叉淡化**（本地 state、DOM 提交时机可控）：`document.startViewTransition` + `flushSync`，消费方 /music 切年 + /footprint 选点；\n- **层 2 mount 入场渐显**（软导航、`router.push` 异步提交，startViewTransition 回调无法同步等到新内容）：内容子树按身份挂 key 强制重挂 + MotionStyles 全局入场模式，消费方 blog/guestbook/weread/topics/post 五面。\n\n出场语言统一为「**入场即过渡**」：被移除 DOM 不做出场动画（React 移除即瞬时，双缓冲需 framer-motion 属方案 C 否决），出场突兀由「旧内容停留到新数据到达」的数据流等待期掩盖。\n\n## 引用规范\n- shadow-docs/knowledge/animation-system.md\n  - 当前结论: 静交互×浓时刻语言；`--motion-*` tokens；关键帧唯一源 MotionStyles；禁通配过渡；软导航保持瞬时（层 2 是 mount 入场不是导航过渡，不推翻该定论；startViewTransition 软导航路线仍属该卡「届时单独评估」项，本单不触）\n  - 适用 scope: apps/site/app/styles/motion.ts + 全站视图\n- shadow-docs/knowledge/music-player.md\n  - 当前结论: /music 年轮编年呈现、切年取数与失败回落语义、碟心换面既有动画；年度筛选排序语义只在服务端\n  - 适用 scope: apps/site/app/music\n- shadow-docs/knowledge/shared-hooks.md\n  - 当前结论: hooks 包封装可复用状态/副作用/浏览器能力，契约钉于 node:test\n  - 适用 scope: packages/hooks\n\n## 决策\n- **选型:** 方案 A 双层机制（用户 20261104 拍板「全站同类场景一次接齐」）\n- **对比方案:** B（只做层 1）——软导航五面继续裸奔，与全站接齐诉求相悖；C（framer-motion AnimatePresence 全站真进出场）——列表级 JS 动画成本/包体/与纯 CSS 静交互语言冲突（image-preview 属弹层特例非列表先例），且出场动画收益被数据流等待期掩盖\n- **理由:** 层 1 与层 2 各自贴合 DOM 提交时机的可控性边界（本地 state 可 flushSync 同步提交，软导航不可）；全部沿用既有动效语言与 tokens；blog 翻页/筛选经 Timeline 容器 key 化自然复用既有 blogRowRise，不新增局部关键帧\n- **待确认点（apply 阶段真机裁决）:** ① 碟心自持换面与整区 crossfade 叠加观感（必要时收短碟心档）；② footprint ContentPanel/EmptyPanel 互斥下 view-transition-name 唯一性的进出组行为；③ view-transition-name 元素在硬导航 `@view-transition` root 过渡中独立成组的观感\n\n## 任务\n### Phase 1 机制层\n- [ ] task 1 — `packages/hooks/useViewTransition/index.ts` — 新建 hook：`withTransition(commit)` 三分支（无 document / 特性不支持 / reduced-motion → 直接 commit；否则 `document.startViewTransition(() => flushSync(commit))`），SSR 安全\n- [ ] task 2 — `packages/hooks/test/view-transition-hooks.test.mjs` — 契约测试先红后绿：三分支回落、flushSync wiring（mock startViewTransition）、commit 异常透传\n- [ ] task 3 — `apps/site/app/styles/motion.ts` — 换幕段：`::view-transition-old/new(content-swap)` 时长 `--motion-dur-base` + ease-out-soft；mount-rise 模式（复用 rise-fade 关键帧）；确认既有 reduced-motion 块覆盖伪元素与新模式的降级\n\n### Phase 2 层 1 消费方\n- [ ] task 4 — `apps/site/app/music/MusicView/index.tsx` + `apps/site/app/music/styles.ts` — selectYear 数据提交（setSelectedPlaylist + replaceState）改经 withTransition；Content 挂 `view-transition-name: content-swap`\n- [ ] task 5 — `apps/site/app/footprint/page.tsx` + `packages/components/footprint-map/styles.ts` — setSelected 经 withTransition；ContentPanel 挂 view-transition-name（EmptyPanel 不挂，保同页唯一）\n\n### Phase 3 层 2 软导航消费方\n- [ ] task 6 — `apps/site/app/blog/BlogListView/index.tsx` — Timeline 容器按筛选+页身份挂 key（复用既有 blogRowRise，零新 CSS）\n- [ ] task 7 — `apps/site/app/guestbook/GuestbookPageView/index.tsx` — 列表容器按页挂 key + mount-rise\n- [ ] task 8 — `apps/site/app/weread/WereadView/index.tsx` — 书架容器按页挂 key + mount-rise\n- [ ] task 9 — `apps/site/app/topics/[label]/TopicListView.tsx` — 列表容器按 label 挂 key + mount-rise\n- [ ] task 10 — `apps/site/app/post/PostView/index.tsx` — 正文容器按文章号挂 key + mount-rise（大区块 opacity 档为主，12px 上浮可收）\n\n### Phase 4 验证\n- [ ] task 11 — 守卫补条目：music wiring 守卫断言 content-swap 与 withTransition 消费在场；静交互词表探针三连复跑（通配税零 / transition-fast 零 / 裸 ease 白名单不扩大）\n- [ ] task 12 — 根 tsc + oxlint + music/footprint 相关域测试 + next build\n- [ ] task 13 — 真机走查：切年/选点/翻页/上下篇 × 明暗主题 × reduced-motion 回落；裁决「决策」三条待确认点\n\n## 补充\n用户操作触发的状态切换（切年/地图选点/翻页/筛选/上下篇）内容区 DOM 瞬时替换无过渡。建立「换幕」双层机制：层 1 startViewTransition 交叉淡化（music 切年 + footprint 选点，新增共享 hook useViewTransition）；层 2 key 换幕 + mount 入场关键帧（blog/guestbook/weread/topics/post 五面软导航）。方案与不变量见 shadow-docs/changes/20261104-style-state-transition-motion/brief.md\n\n完整 brief：shadow-docs/changes/20261104-style-state-transition-motion/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261104-style-state-transition-motion\",\"type\":\"style\",\"scope\":\"site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261104-style-state-transition-motion/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "style"
      ]
    },
    "worktree": "/Users/wuhong/shadow-desktop/github/x.wuh.site/.worktrees/20261104-style-state-transition-motion",
    "release": {
      "files": [
        "apps/site/app/blog/BlogListView/index.tsx",
        "apps/site/app/footprint/page.tsx",
        "apps/site/app/guestbook/GuestbookPageView/index.tsx",
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/music/styles.ts",
        "apps/site/app/post/PostView/index.tsx",
        "apps/site/app/styles/motion.ts",
        "apps/site/app/topics/[label]/TopicListView.tsx",
        "apps/site/app/weread/WereadView/index.tsx",
        "apps/site/test/music-player-wiring.test.mjs",
        "packages/components/footprint-map/styles.ts",
        "packages/hooks/test/view-transition-hooks.test.mjs",
        "packages/hooks/test/view-transition-loader.mjs",
        "packages/hooks/useViewTransition/index.ts",
        "shadow-docs/changes/20261104-style-state-transition-motion/brief.md",
        "shadow-docs/knowledge/animation-system.md",
        "shadow-docs/knowledge/music-player.md",
        "shadow-docs/knowledge/shared-hooks.md",
        "shadow-docs/menu.md"
      ],
      "message": "style(next): 状态切换换幕——全站内容区过渡双层机制",
      "title": "style(next): 状态切换换幕——全站内容区过渡双层机制",
      "body": "## 变更\n- 建立换幕双层机制，消除状态切换内容区 DOM 瞬变：层 1 交叉淡化、层 2 mount 入场渐显\n- 层 1：新增共享 hook `useViewTransition`（startViewTransition 回调内 flushSync 同步提交；SSR/特性不支持/reduced-motion 三分支直接 commit 回落；ready/finished 拒绝吸收），/music 切年与 /footprint 地图选点接入\n- 层 2：MotionStyles 新增换幕段（::view-transition-old/new(content-swap) 走 dur-base 220ms、.mount-rise 入场模式、print 降级扩展），软导航五面按身份 key 重挂——blog 筛选与分页、guestbook/weread 分页、topics 话题跳转、post 上下篇\n- 知识闭环：animation-system（换幕词表）、music-player（切年换幕段）、shared-hooks（hook 契约）三卡更新 + menu 路由\n\n## 影响\n- 行为/触发面变化：/music 切年、/footprint 选点出现 220ms 内容区交叉淡化（不支持浏览器行为不变）；软导航五面新内容出现 220ms 入场渐显\n- 明确不受影响的范围：路由/取数/ISR/prefetch 语义零变化；切年失败回落路径不进换幕回调；出场 DOM 不做动画（入场即过渡）\n\n## 验证\n- 命令与结果：hook 契约测试 7/7（先红后绿）；music wiring 守卫新增断言绿（同套件 3 红归因 main 既有）；根 tsc exit 0；oxlint 0 errors；next build 14/14\n- 真机走查（mock 后端 3200）：/music 切年与 /footprint 选点全链路实证（vtLog called→cb-enter→cb-exit、内容/URL/aria-current 切换、换幕三规则下发）；未覆盖项：内容五面软导航走查（本机无内容后端）、reduced-motion 仿真、明暗主题走查——生产复验随部署\n\n## 关联\n- Closes #566\n- brief: shadow-docs/changes/20261104-style-state-transition-motion/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/animation-system.md",
    "reason": "换幕（状态切换内容区过渡双层机制）入 animation-system 词表：层 1 交叉淡化（content-swap + useViewTransition）、层 2 mount 入场（mount-rise + 身份 key 重挂）、出场语言=入场即过渡；连带更新 music-player.md（/music 切年换幕段）与 shared-hooks.md（新增 useViewTransition 行）；verified-depth: runtime（music 切年 + footprint 选点真机全链路实证、换幕跳过拒绝吸收修复实测）；另发现两项待对账基线漂移：裸 ease 白名单（image:43,218/dialog:123）与 music 移动端 wiring 守卫 3 条旧正则失配"
  }
}
---

# 状态切换换幕——全站内容区过渡机制

## 动机

用户操作触发的状态切换（/music 切年、/footprint 地图选点、blog 筛选与分页、guestbook/weread 分页、topics 话题跳转、post 上一篇/下一篇）导致内容区 DOM 瞬时替换，无进出场反馈，观感生硬。典型痛点：/music 切年时面板标题/按语/水印年份/曲目列表文字直变，仅碟心黑胶有自持换面动画。20261104 全站盘点确认 7 个视图存在同类瞬换（GuestbookPageView/WereadView/TopicListView/footprint ContentPanel 等零动画；blog 仅有 YearGroup blogRowRise 部分覆盖）。

本次建立「换幕」双层机制一次接齐：

- **层 1 交叉淡化**（本地 state、DOM 提交时机可控）：`document.startViewTransition` + `flushSync`，消费方 /music 切年 + /footprint 选点；
- **层 2 mount 入场渐显**（软导航、`router.push` 异步提交，startViewTransition 回调无法同步等到新内容）：内容子树按身份挂 key 强制重挂 + MotionStyles 全局入场模式，消费方 blog/guestbook/weread/topics/post 五面。

出场语言统一为「**入场即过渡**」：被移除 DOM 不做出场动画（React 移除即瞬时，双缓冲需 framer-motion 属方案 C 否决），出场突兀由「旧内容停留到新数据到达」的数据流等待期掩盖。

## 复杂度评级

- **评级:** L
- **理由:** 契约变更（hooks 包新增公开 API `useViewTransition` + MotionStyles 新增换幕段与 mount-rise 模式）；触及面（1 个共享 hook + motion.ts + 7 个视图 + footprint-map 共享组件样式）；可发现性（静默失效面多：特性检测分支、reduced-motion 回落、flushSync 时序、view-transition-name 同页唯一性——失效均无报错）。
- **期望验证深度:** unit（hook 契约测试 + 静交互词表探针 + music wiring 守卫）+ runtime（真机走查切年/选点/翻页/上下篇 × 明暗 × reduced-motion）
- **取证策略:** assert-first

## 领域模型

- **限界上下文:** 站点动效呈现（animation-system scope）与共享 hooks（shared-hooks scope）的交界——hook 封装浏览器能力，站点视图消费，MotionStyles 是关键帧唯一源。上游为各视图数据流（本变更不动）；反腐边界：hook 不掺页面业务流程（shared-hooks 边界）、不封装数据获取、motion 语言不外溢到后端/桌面端。
- **统一语言增量:**
  - **换幕**：状态切换时内容区过渡的统称。层 1 = 交叉淡化（startViewTransition），层 2 = mount 入场渐显（key 重挂 + 关键帧）。
  - **content-swap**：层 1 消费方内容区的 `view-transition-name` 约定值（同页唯一，同刻仅一个元素持有）。
  - **mount-rise**：MotionStyles 层 2 入场模式类（复用既有 rise-fade 关键帧 + `--motion-dur-base`）。
  - **useViewTransition**：hooks 包新 hook，`withTransition(commit)`——支持且未 reduced-motion 时 `startViewTransition(() => flushSync(commit))`，否则直接 commit。
- **聚合与不变量:**
  - `INV-1 动效词表`：新增过渡全部引用 `--motion-*` tokens；关键帧只在 MotionStyles 定义（blog 既有 blogRowRise/contentEnter 沿祖父条款不动）；无裸 ease/裸时长/通配 `* { transition }`；reduced-motion 与 print 降级在场
  - `INV-2 回落无损`：SSR / 特性不支持 / reduced-motion 三分支下 `withTransition` 行为 = 直接 commit，功能零变化
  - `INV-3 数据流不变`：换幕只包视觉提交——/music 切年失败回落 previousId 的拒绝路径、`history.replaceState`、ISR 取数语义全部不变
  - `INV-4 软导航零改向`：层 2 只加 key 重挂与入场类，不改路由/取数/缓存/prefetch 行为
- **领域事件:** 用户切年/选点/翻页/切文 → 数据提交瞬间 → 换幕播放（220ms 档）→ 无流程后果（纯视觉）

## 引用规范

- shadow-docs/knowledge/animation-system.md
  - 当前结论: 静交互×浓时刻语言；`--motion-*` tokens；关键帧唯一源 MotionStyles；禁通配过渡；软导航保持瞬时（层 2 是 mount 入场不是导航过渡，不推翻该定论；startViewTransition 软导航路线仍属该卡「届时单独评估」项，本单不触）
  - 适用 scope: apps/site/app/styles/motion.ts + 全站视图
- shadow-docs/knowledge/music-player.md
  - 当前结论: /music 年轮编年呈现、切年取数与失败回落语义、碟心换面既有动画；年度筛选排序语义只在服务端
  - 适用 scope: apps/site/app/music
- shadow-docs/knowledge/shared-hooks.md
  - 当前结论: hooks 包封装可复用状态/副作用/浏览器能力，契约钉于 node:test
  - 适用 scope: packages/hooks

## 决策

- **选型:** 方案 A 双层机制（用户 20261104 拍板「全站同类场景一次接齐」）
- **对比方案:** B（只做层 1）——软导航五面继续裸奔，与全站接齐诉求相悖；C（framer-motion AnimatePresence 全站真进出场）——列表级 JS 动画成本/包体/与纯 CSS 静交互语言冲突（image-preview 属弹层特例非列表先例），且出场动画收益被数据流等待期掩盖
- **理由:** 层 1 与层 2 各自贴合 DOM 提交时机的可控性边界（本地 state 可 flushSync 同步提交，软导航不可）；全部沿用既有动效语言与 tokens；blog 翻页/筛选经 Timeline 容器 key 化自然复用既有 blogRowRise，不新增局部关键帧
- **待确认点（apply 阶段真机裁决）:** ① 碟心自持换面与整区 crossfade 叠加观感（必要时收短碟心档）；② footprint ContentPanel/EmptyPanel 互斥下 view-transition-name 唯一性的进出组行为；③ view-transition-name 元素在硬导航 `@view-transition` root 过渡中独立成组的观感

## 任务

### Phase 1 机制层
- [x] task 1 — `packages/hooks/useViewTransition/index.ts` — 新建 hook：`withTransition(commit)` 三分支（无 document / 特性不支持 / reduced-motion → 直接 commit；否则 `document.startViewTransition(() => flushSync(commit))`），SSR 安全
- [x] task 2 — `packages/hooks/test/view-transition-hooks.test.mjs` — 契约测试先红后绿：三分支回落、flushSync wiring（mock startViewTransition）、commit 异常透传
- [x] task 3 — `apps/site/app/styles/motion.ts` — 换幕段：`::view-transition-old/new(content-swap)` 时长 `--motion-dur-base` + ease-out-soft；mount-rise 模式（复用 rise-fade 关键帧）；确认既有 reduced-motion 块覆盖伪元素与新模式的降级

### Phase 2 层 1 消费方
- [x] task 4 — `apps/site/app/music/MusicView/index.tsx` + `apps/site/app/music/styles.ts` — selectYear 数据提交（setSelectedPlaylist + replaceState）改经 withTransition；Content 挂 `view-transition-name: content-swap`
- [x] task 5 — `apps/site/app/footprint/page.tsx` + `packages/components/footprint-map/styles.ts` — setSelected 经 withTransition；ContentPanel 挂 view-transition-name（EmptyPanel 不挂，保同页唯一）

### Phase 3 层 2 软导航消费方
- [x] task 6 — `apps/site/app/blog/BlogListView/index.tsx` — Timeline 容器按筛选+页身份挂 key（复用既有 blogRowRise，零新 CSS）
- [x] task 7 — `apps/site/app/guestbook/GuestbookPageView/index.tsx` — 列表容器按页挂 key + mount-rise
- [x] task 8 — `apps/site/app/weread/WereadView/index.tsx` — 书架容器按页挂 key + mount-rise
- [x] task 9 — `apps/site/app/topics/[label]/TopicListView.tsx` — 列表容器按 label 挂 key + mount-rise
- [x] task 10 — `apps/site/app/post/PostView/index.tsx` — 正文容器按文章号挂 key + mount-rise（大区块 opacity 档为主，12px 上浮可收）

### Phase 4 验证
- [x] task 11 — 守卫补条目：music wiring 守卫断言 content-swap 与 withTransition 消费在场；静交互词表探针三连复跑（通配税零 / transition-fast 零 / 裸 ease 白名单不扩大）
- [x] task 12 — 根 tsc + oxlint + music/footprint 相关域测试 + next build
- [x] task 13 — 真机走查：切年/选点/翻页/上下篇 × 明暗主题 × reduced-motion 回落；裁决「决策」三条待确认点

## 结果

- 实际耗时: 约 0.5 天（含 CLI 升级阻塞处置与 SGN-001 家族三连 139/挂起重试）
- 验证（L 级逐条对账）:
  - | INV-1 | 观察点：`grep -rn transition-fast apps packages` → 0 命中；`cssVariableProvider` 通配块 2 处经上下文核实为 reset（无 transition）；裸 ease 3 处均属未触碰基线文件（image-preview:43,218 / dialog:123，白名单不扩大，另记录与 animation-system 卡 20261023 白名单清单漂移待 review 对账）；MotionStyles 换幕段经浏览器 `document.styleSheets` 实测三条规则（vt-old/vt-new(content-swap)/.mount-rise）全部下发，`--motion-dur-base` 实测 220ms |
  - | INV-2 | 观察点：`node --test packages/hooks/test/view-transition-hooks.test.mjs` → 7/7 绿（SSR/不支持/reduced-motion 三分支直接 commit、flushSync wiring、commit 透传、ready/finished 拒绝吸收无 unhandledRejection）|
  - | INV-3 | 观察点：`node --test apps/site/test/music-player-wiring.test.mjs` → 新增换幕守卫绿（withTransition 包裹提交 + `setSelectedId(previousId)` 拒绝路径在场 + Content 持 content-swap）；同套件 3 红经 base 提交取证归因 main 既有红（20261015 移动端改版后旧正则失配，与本变更无关）|
  - | INV-4 | 观察点：`mise node22 next build` 首轮 14/14 页全绿、路由清单与基线一致（/blog /guestbook /weread /topics/[label] /post/[number] /music /footprint 全在）；层 2 五面改动均为 key/className 级，无路由与取数语义变更（源码走查）|
  - | runtime | 观察点：真机走查（mock 后端 3200 喂数，仿 20261015 先例）——/music 切年 2026→2025：`vtLog` called→cb-enter→cb-exit、曲目/按语/水印/URL/纵轨 aria-current 全部切换，落定态目检无残影；/footprint 选点：ContentPanel computed `content-swap` + 点击→换幕链路→沙坡尾换开元寺。换幕跳过噪音修复（ready/finished 吸收）实测 dev 日志零新增 unhandledRejection |
  - | 证据缺口 | ① 内容五面（blog/guestbook/weread/topics/post）软导航走查不可达——本机无内容后端（mongo/Nest 均缺），机制与层 1 同构且经 V6/V8/源码守卫背书，生产复验随部署执行（v1.4.43 先例）；② reduced-motion 真机仿真不可达——IAB 无媒体仿真能力，回落行为由 INV-2 分支三行为断言背书；③ 硬导航独立成组观感（待确认点③）与碟心叠加瞬时观感（待确认点①）属主观观感，落定态截图无残影，生产复验补充 |
- 实现期修复: 走查暴露换幕跳过（连切/文档隐藏）产生 `unhandledRejection: Transition was aborted`——hook 补 `ready/finished` 拒绝吸收（updateCallbackDone 保持响亮），契约测试补行为断言 7/7
- 环境噪声记录: ambient pnpm tsc 空转 10 分钟挂起一次（杀后 mise node22 直跑一遍过）；next build page-data worker SIGSEGV 三连（node22 清 .next 重试均 139），第 4 试按批次4 配方切 ambient node24+1400 限堆一遍过 exit 0 · 14/14 页——「同一命令 mise 死循环、ambient 即过」形态第 N 次复现

## 知识评估

- **预期影响:** 更新
- **候选卡片:** animation-system.md（换幕/content-swap/mount-rise/useViewTransition 入词表与执行约束，verified-depth: runtime）、music-player.md（/music 切年换幕段）、shared-hooks.md（新增 hook 行）
- **理由:** 新动效词目入 animation-system 主卡；/music 呈现细节随消费方更新；hooks 清单随新 hook 更新
