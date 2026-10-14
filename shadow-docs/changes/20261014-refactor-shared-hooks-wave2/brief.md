---
{
  "schema": "shadow-dev/v1",
  "name": "20261014-refactor-shared-hooks-wave2",
  "type": "refactor",
  "scope": "packages/hooks,packages/components,apps/site",
  "status": "published",
  "baseBranch": "main",
  "branch": "refactor/20261014-refactor-shared-hooks-wave2",
  "files": [
    "AGENTS.md",
    "apps/site/app/about/components/GuestbookBarrageDialog.tsx",
    "apps/site/app/components/AppProviders.tsx",
    "apps/site/app/components/FontPrefetch.tsx",
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/app/components/theme/ThemeModeProvider.tsx",
    "apps/site/app/footprint/page.tsx",
    "apps/site/app/layout.tsx",
    "apps/site/app/post/components/PostComments/index.tsx",
    "packages/components/audio-player/MiniPlayer.tsx",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/dialog/index.tsx",
    "packages/components/image-preview/hooks/useLockScroll.ts",
    "packages/components/image-preview/index.tsx",
    "packages/components/locales/index.tsx",
    "packages/hooks/scheduleIdle/index.ts",
    "packages/hooks/test/event-hooks.test.mjs",
    "packages/hooks/test/wave2-hooks.test.mjs",
    "packages/hooks/useLocalStorageState/index.ts",
    "packages/hooks/useScrollLock/index.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 533,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/533",
    "pullRequest": 534,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/534"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "269b2854429cacdc7a28a41994f42510383cbac5",
    "verifiedAt": "2026-10-14T03:07:49.059Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:534",
    "planHash": "8e5df3407efd7e6efb47f88b00a5fb3057e2aecaba1ae5b1d9f9624d86bad014",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 共享 Hooks 二波:滚动锁/存储持久化/空闲调度抽离与全量等价迁移",
      "titleRaw": "[refactor] 共享 Hooks 二波:滚动锁/存储持久化/空闲调度抽离与全量等价迁移",
      "supplement": "useScrollLock 双 mode、readStorage/writeStorage + useLocalStorageState 分层、scheduleIdle 纯函数,14 文件等价迁移;AppProviders ahooks 收敛与 INTL_LOCALE 上提顺带兑现。完整 brief:shadow-docs/changes/20261014-refactor-shared-hooks-wave2/brief.md",
      "body": "## 动机\n事件四件套(20261013)收口后,代码扫描确认 packages/hooks 仍有三组「≥2 处真实重复、语义等价」的副作用骨架未收敛:\n\n1. **滚动锁 ×3**:Dialog 与 PlayerPanel 的 body position:fixed 配方逐字节相同(注释自认「复用 Dialog 配方」),image-preview 另有本地 `hooks/useLockScroll`(documentElement overflow + scrollTo 简化配方)——两配方三处手写。\n2. **localStorage 持久化 ×5 文件**:ThemeModeProvider、locales、MiniPlayer、PostComments、GuestbookBarrageDialog 各自手写 `try { getItem + 校验 + set } catch {}` / `try { setItem } catch {}` 骨架;**写时机各处不同**(MiniPlayer 状态变化即写、PostComments 仅提交成功后写、Barrage 仅非空时写、Theme/locales 写点耦合副作用提交),裸套 ahooks 式 write-through hook 会改变行为。另 layout.tsx anti-FOUC 内联脚本手工镜像 ThemeModeProvider 的两个存储 key 与取值集合,构成双源。\n3. **空闲调度 ×3**:GlobalAudioPlayer(scheduleIdle/cancelIdle 成对工具)、LocaleProvider(内联,回落参数 3000/1500)、FontPrefetch(回落 3000/3000)三处手写「requestIdleCallback + 旧 Safari setTimeout 回落 + 成对 cancel」,参数各异。\n\n顺带兑现两笔登记:AppProviders.tsx 的 ahooks `useEventListener`(shared-hooks 白名单「触碰时收敛」条款)、`INTL_LOCALE` 映射表在 Barrage 与 footprint/page 逐字重复。并纠偏 AGENTS.md 占位清单失真(Divider 已实现且有 3 处消费者)。\n\n## 引用规范\n- shadow-docs/knowledge/shared-hooks.md\n  - 当前结论: 事件副作用单一实现处、enabled 条件挂载、SSR 语义、白名单棘轮「只减不增」、合成 hook 不得裸 addEventListener;AppProviders 存量 ahooks「触碰时收敛」条款本批兑现。\n  - 适用 scope: packages/hooks、packages/components、apps/site\n- shadow-docs/knowledge/component-standard.md\n  - 当前结论: image-preview `hooks/` 本地拆分先例——本地 hook 与共享包语义重复时上提并删除本地版(前例 useMediaQuery.ts 删除)。\n  - 适用 scope: packages/components/image-preview\n- shadow-docs/knowledge/build-config.md\n  - 当前结论: 验证配方 SGN-001(限堆拆单跑);守卫测试不 import .ts、纯文本断言(SGN-002 规避)。\n  - 适用 scope: 验证阶段\n- shadow-docs/signals.md SGN-009/010\n  - 当前结论: runtime 抽检用 `__reactProps` expando 调 onClick、`window.dispatchEvent` 造合成事件;matchMedia 新实例语义限制部分观察点。\n  - 适用 scope: runtime 验证\n\n## 决策\n- **选型:** 方案 A——仿 ahooks 语义自研 + 全量等价迁移(与四件套同范式),抽象分两层:\n  - `useScrollLock(active, options?)`:双 mode 契约。`'fixed'`(默认)——body 四值暂存 + position:fixed + top:-scrollY + width:100%,cleanup 还原后 `scrollTo(0, scrollY)`,Dialog/PlayerPanel 用;`'simple'`——documentElement overflow 暂存 + cleanup 还原 + scrollTo,`original` 变量语义保留,image-preview 用。active=false 或非浏览器环境跳过,零新增行为。\n  - 存储:**底层原语** `readStorage<T>(key, validate?)` / `writeStorage(key, value)`(try/catch 静默、SSR 安全)+ `serialize`(writeStorage 第二参接字符串,调用方自控 String())。上层 `useLocalStorageState(key, initialValue, options?: { validate?, deserialize? })`——useState 惰性初始化同步读(SSR 返回 initialValue,hydration 差异语义由消费方现状决定,MiniPlayer 已是该形态)。**迁移映射**:仅 MiniPlayer 用 hook(write-through 语义恰合);ThemeModeProvider/locales/PostComments/Barrage 用底层原语——各自写时机、校验函数、副作用编排不动。key 与取值集合常量化共享:THEME_STORAGE_KEY/COLOR_SCHEME_STORAGE_KEY/取值枚举从 ThemeModeProvider 导出,layout.tsx anti-FOUC 脚本模板注入同一常量,消除字面双源(脚本内联校验逻辑保留,守卫以字面量一致断言钉死)。\n  - `scheduleIdle(callback, options?: { timeout?, fallbackMs? }) → cancel`(纯函数,非 hook,置于 `packages/hooks/scheduleIdle`,包描述扩展「共享浏览器能力」):idle 可用走 requestIdleCallback(timeout 默认 2000),否则 setTimeout(fallbackMs 默认=timeout);返回闭包 cancel 按实际分支收敛(修正现 GAP 版跨 id 空间 cancel 的理论错位)。三处参数:GAP `{timeout:2000}`、locales `{timeout:3000, fallbackMs:1500}`、FontPrefetch `{timeout:3000, fallbackMs:3000}`。\n  - AppProviders:ahooks `useEventListener` → `@wuh.site/hooks/useEventListener`,显式 `'document'` target(visibilitychange 规范目标,行为等价);ahooks 依赖因 useRequest×5 暂留,**去 ahooks useRequest 立为非目标另项工程**。\n  - `INTL_LOCALE` 上提至 packages/components/locales 导出,Barrage/footprint 两处 import。\n  - AGENTS.md:Divider 移入已实现清单,占位清单更正为 6 项。\n- **对比方案:** 方案 B(直接引 ahooks useLocalStorageState/useLockScroll)——ahooks 存储 hook 为 effect 期初始值+write-through,与 MiniPlayer 惰性同步读冲突、与 PostComments/Barrage 延迟写时机冲突,且加深 ahooks 依赖,否决。方案 C(只抽底层纯函数不造 hook)——5 处 useState+effect 骨架仍重复、image-preview/PlayerPanel 锁配方仍散落,收口不彻底,否决(其底层部分已并入 A)。\n- **理由:** 行为等价优先——两配方不混用、写时机不统一、回落参数不合并;重复骨架归一但语义差异由参数/层次表达,与四件套「特殊点保留登记」纪律一致。\n\n## 任务\n### Phase 1 — 实现三件套(packages/hooks)\n\n- [ ] 1.1 `packages/hooks/useScrollLock/index.ts` — 双 mode 滚动锁,含 SSR guard 与对称 cleanup\n- [ ] 1.2 `packages/hooks/useLocalStorageState/index.ts` — readStorage/writeStorage 原语 + useLocalStorageState hook\n- [ ] 1.3 `packages/hooks/scheduleIdle/index.ts` — scheduleIdle/cancel 纯函数\n\n### Phase 2 — 滚动锁迁移\n\n- [ ] 2.1 `packages/components/dialog/index.tsx` — 删手写 effect,`useScrollLock(open && lockScroll)`,锁内四 effect 与 focus 逻辑不动\n- [ ] 2.2 `packages/components/audio-player/PlayerPanel.tsx` — 同上(`state.isPanelOpen`)\n- [ ] 2.3 `packages/components/image-preview/index.tsx` 改消费 `@wuh.site/hooks/useScrollLock(open && lockScroll, { mode: 'simple' })`;删除 `packages/components/image-preview/hooks/useLockScroll.ts`\n\n### Phase 3 — 存储迁移与双源消除\n\n- [ ] 3.1 `apps/site/app/components/audio-player/MiniPlayer.tsx`(collpased)→ `useLocalStorageState(COLLAPSE_STORAGE_KEY, false)`\n- [ ] 3.2 `apps/site/app/components/theme/ThemeModeProvider.tsx` → readStorage(带 parse 校验)+ writeStorage;导出 key/取值常量\n- [ ] 3.3 `apps/site/app/layout.tsx` — anti-FOUC 脚本模板注入共享常量,消除字面双源\n- [ ] 3.4 `packages/components/locales/index.tsx` — readStoredLocale/commitLocale 走原语;导出 INTL_LOCALE\n- [ ] 3.5 `apps/site/app/post/components/PostComments/index.tsx`、`apps/site/app/about/components/GuestbookBarrageDialog.tsx` — 原语替换(写时机不动);两处 INTL_LOCALE 改 import(`apps/site/app/footprint/page.tsx` 同)\n\n### Phase 4 — 空闲调度 + ahooks 收敛\n\n- [ ] 4.1 `apps/site/app/components/player/GlobalAudioPlayer.tsx`、`packages/components/locales/index.tsx`、`apps/site/app/components/FontPrefetch.tsx` — 三处手写 idle 分支改 scheduleIdle(参数如上)\n- [ ] 4.2 `apps/site/app/components/AppProviders.tsx` — useEventListener 收敛至 `@wuh.site/hooks`(显式 'document');`packages/hooks/test/event-hooks.test.mjs` 台账同步 AppProviders 行\n\n### Phase 5 — 守卫与文档\n\n- [ ] 5.1 `packages/hooks/test/wave2-hooks.test.mjs` — 新守卫:三件套导出契约、MIGRATED 文件禁手写锁骨架/裸 localStorage try-catch/裸 requestIdleCallback 分支/ahooks useEventListener、白名单反查棘轮、layout 脚本 key 与常量字面一致\n- [ ] 5.2 `AGENTS.md` — 占位清单更正(Divider 已实现)\n- [ ] 5.3 回归:`pnpm exec tsc --noEmit` 基线位集持平、oxlint 0/0、`node --test packages/hooks/test/*.mjs` 全绿、`node packages/components/test/structure.test.mjs` 无回归(SGN-001 配方)\n\n### Phase 6 — runtime 抽检(期望深度 runtime)\n\n- [ ] 6.1 Dialog 开→body 锁定四值生效→关→位置还原;播放器面板开合同配方观察\n- [ ] 6.2 语言切换→刷新持久化;主题/配色 mode 刷新持久化;MiniPlayer 折叠态持久化\n- [ ] 6.3 visibilitychange 标题换装/还原;留言昵称持久化\n- [ ] 6.4 观察点不可达项如实登记(IAB 配方见 SGN-009/010)\n\n## 补充\nuseScrollLock 双 mode、readStorage/writeStorage + useLocalStorageState 分层、scheduleIdle 纯函数,14 文件等价迁移;AppProviders ahooks 收敛与 INTL_LOCALE 上提顺带兑现。完整 brief:shadow-docs/changes/20261014-refactor-shared-hooks-wave2/brief.md\n\n完整 brief：shadow-docs/changes/20261014-refactor-shared-hooks-wave2/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261014-refactor-shared-hooks-wave2\",\"type\":\"refactor\",\"scope\":\"packages/hooks,packages/components,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261014-refactor-shared-hooks-wave2/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "AGENTS.md",
        "apps/site/app/about/components/GuestbookBarrageDialog.tsx",
        "apps/site/app/components/AppProviders.tsx",
        "apps/site/app/components/FontPrefetch.tsx",
        "apps/site/app/components/player/GlobalAudioPlayer.tsx",
        "apps/site/app/components/theme/ThemeModeProvider.tsx",
        "apps/site/app/footprint/page.tsx",
        "apps/site/app/layout.tsx",
        "apps/site/app/post/components/PostComments/index.tsx",
        "apps/site/test/music-player-wiring.test.mjs",
        "apps/site/test/site-header-theme-toggle.test.mjs",
        "packages/components/audio-player/MiniPlayer.tsx",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/player-panel.test.mjs",
        "packages/components/audio-player/tsconfig.guard.json",
        "packages/components/dialog/index.tsx",
        "packages/components/image-preview/index.tsx",
        "packages/components/locales/index.tsx",
        "packages/components/locales/locales.test.mjs",
        "packages/components/themes/themeStorage.ts",
        "packages/hooks/scheduleIdle/index.ts",
        "packages/hooks/test/event-hooks.test.mjs",
        "packages/hooks/test/wave2-hooks.test.mjs",
        "packages/hooks/useLocalStorageState/index.ts",
        "packages/hooks/useScrollLock/index.ts",
        "shadow-docs/changes/20261014-refactor-shared-hooks-wave2/brief.md",
        "shadow-docs/knowledge/shared-hooks.md",
        "shadow-docs/signals.md"
      ],
      "message": "refactor(hooks): 副作用二波收口三件套——滚动锁/存储持久化/空闲调度等价迁移",
      "title": "refactor(hooks): 副作用二波收口三件套——滚动锁/存储持久化/空闲调度等价迁移",
      "body": "## 变更\n- 新增 `@wuh.site/hooks` 二波三件套：useScrollLock（fixed/simple 双配方弹层滚动锁，条件挂载+对称还原+SSR guard）、readStorage/writeStorage 原语 + useLocalStorageState（惰性同步读+write-through，serialize/deserialize 经 ref 免加戏）、scheduleIdle（requestIdleCallback+setTimeout 回落纯函数，返回按实际分支收敛的 cancel 闭包）\n- 滚动锁迁移：Dialog、PlayerPanel（两处逐字节同配方归一）、image-preview（simple 配方上收，本地 `hooks/useLockScroll.ts` 删除——沿 wave1 useMediaQuery.ts 先例）\n- 存储迁移（写时机逐处保留）：MiniPlayer 用 hook；ThemeModeProvider、locales、PostComments、GuestbookBarrageDialog 用原语；主题 key+取值集合单源化到 `themes/themeStorage.ts`（非 'use client'，SSR anti-FOUC 脚本 JSON.stringify 注入，消除字面双源）；`INTL_LOCALE` 从 locales 既有 `LANG_BY_LOCALE` 导出，三处本地副本（Barrage/footprint/PostComments.DATE_LOCALES）归一\n- 空闲调度迁移：GlobalAudioPlayer（timeout 2000）、LocaleProvider 预取（3000/回落 1500）、FontPrefetch（3000/3000）\n- AppProviders 兑现「触碰时收敛」：ahooks useEventListener → 本包原语（显式 'document' target）；ahooks 仅剩 useRequest×5（去 ahooks 另立工程）\n- 新增守卫 `packages/hooks/test/wave2-hooks.test.mjs`（11 用例：契约/迁移禁裸/白名单棘轮/layout 注入一致性）；`event-hooks.test.mjs` 台账 +AppProviders；四条钉旧手写实现的守卫断言（player-panel/locales/music-player-wiring/site-header×2）改钉消费形态，意图不变\n- `audio-player/tsconfig.guard.json` 补 `@wuh.site/hooks/*` paths——修复 wave1 骑入 main 的域 guard 红（TS2307×6，SGN-013）\n- AGENTS.md 占位清单纠偏（Divider 已实现移入）+ Hooks 段补真（wave1 四件套从未登记，一并补录）\n- Knowledge：更新 `shared-hooks.md`（四件套扩为共享 hooks 契约全集，verified-depth runtime）；signals.md SGN-011 命中+1，新增 SGN-013/014/015\n\n## 影响\n- 行为/触发面变化：无预期行为变化（行为等价重构）；病理态容错增强两处已登记（MiniPlayer 存储异常由崩改静默回落、Barrage 键粒度静默终态一致，见 brief 执行偏差段）\n- 明确不受影响的范围：apps/desktop、apps/console；四件套既有契约；PostComments/Barrage/Theme/locales 各站写时机与副作用编排；anti-FOUC 脚本行为语义（白名单三值布尔等价）；白名单四处运行时不变\n\n## 验证\n- 命令与结果：`node packages/hooks/test/wave2-hooks.test.mjs` 11/11；`event-hooks.test.mjs` 9/9；`structure.test.mjs` 18/18；受影响守卫 118 例 109 pass/9 fail 与 `git archive main` 解树名集 `comm -23` 为空（零新增红，SGN-011 法）；根 `pnpm exec tsc --noEmit` RC=0；`pnpm run lint:next` 0/0；apps/site 域 tsc 35=35 且 diff 文件错误均在未触碰行；audio 域 guard 修复后清零；`pnpm build:next` RC=0\n- runtime（生产 next start + IAB 合成配方）：Dialog 四值锁定（overflow/position/top/width）+ 关闭还原 + scrollY 归位；语言种子读+点击写闭环；主题配色 SSR 注入恢复+浅色写路径；MiniPlayer 折叠 write-through+惰性读；昵称写+重开回显+footprint 自动补齐\n- 未覆盖项（明说，不留空白）：visibilitychange 标题换装（WKWebView visibilityState 非 configurable，SGN-014，退 code-read+守卫⑦钉形态）；PlayerPanel 开合观察（歌单后端不可达，同契约由 Dialog 实测+守卫④覆盖）；Dialog 关闭链需合成 animationend（SGN-015，环境归因非迁移回归）\n\n## 关联\n- Closes #533\n- brief: shadow-docs/changes/20261014-refactor-shared-hooks-wave2/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/shared-hooks.md",
    "reason": "三件套(useScrollLock/useLocalStorageState+原语/scheduleIdle)成为 packages/hooks 新契约面,事件四件套卡需扩为共享 hooks 契约全集;AppProviders ahooks 收敛条款已兑现,迁移台账+白名单棘轮需同步;基线守卫网与 wave2 守卫已实跑,runtime 五类观察点有生产实例证据,verified-depth 达 runtime"
  }
}
---

# 共享 Hooks 二波:滚动锁 / 存储持久化 / 空闲调度抽离与全量等价迁移

## 动机

事件四件套(20261013)收口后,代码扫描确认 packages/hooks 仍有三组「≥2 处真实重复、语义等价」的副作用骨架未收敛:

1. **滚动锁 ×3**:Dialog 与 PlayerPanel 的 body position:fixed 配方逐字节相同(注释自认「复用 Dialog 配方」),image-preview 另有本地 `hooks/useLockScroll`(documentElement overflow + scrollTo 简化配方)——两配方三处手写。
2. **localStorage 持久化 ×5 文件**:ThemeModeProvider、locales、MiniPlayer、PostComments、GuestbookBarrageDialog 各自手写 `try { getItem + 校验 + set } catch {}` / `try { setItem } catch {}` 骨架;**写时机各处不同**(MiniPlayer 状态变化即写、PostComments 仅提交成功后写、Barrage 仅非空时写、Theme/locales 写点耦合副作用提交),裸套 ahooks 式 write-through hook 会改变行为。另 layout.tsx anti-FOUC 内联脚本手工镜像 ThemeModeProvider 的两个存储 key 与取值集合,构成双源。
3. **空闲调度 ×3**:GlobalAudioPlayer(scheduleIdle/cancelIdle 成对工具)、LocaleProvider(内联,回落参数 3000/1500)、FontPrefetch(回落 3000/3000)三处手写「requestIdleCallback + 旧 Safari setTimeout 回落 + 成对 cancel」,参数各异。

顺带兑现两笔登记:AppProviders.tsx 的 ahooks `useEventListener`(shared-hooks 白名单「触碰时收敛」条款)、`INTL_LOCALE` 映射表在 Barrage 与 footprint/page 逐字重复。并纠偏 AGENTS.md 占位清单失真(Divider 已实现且有 3 处消费者)。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——packages/hooks 新增 3 个导出面(useScrollLock、useLocalStorageState+存储原语、scheduleIdle),不改既有四件套契约;触及面——14 个消费文件跨 packages/hooks、packages/components、apps/site 三包;可发现性——守卫测试 + 台账棘轮钉死,新消费者经 knowledge 卡片可发现。介于 S 与 L 之间,评 M。
- **期望验证深度:** runtime(滚动锁、持久化、语言切换在生产实例上有真实观察点;同上一轮验证配方)

## 引用规范

- shadow-docs/knowledge/shared-hooks.md
  - 当前结论: 事件副作用单一实现处、enabled 条件挂载、SSR 语义、白名单棘轮「只减不增」、合成 hook 不得裸 addEventListener;AppProviders 存量 ahooks「触碰时收敛」条款本批兑现。
  - 适用 scope: packages/hooks、packages/components、apps/site
- shadow-docs/knowledge/component-standard.md
  - 当前结论: image-preview `hooks/` 本地拆分先例——本地 hook 与共享包语义重复时上提并删除本地版(前例 useMediaQuery.ts 删除)。
  - 适用 scope: packages/components/image-preview
- shadow-docs/knowledge/build-config.md
  - 当前结论: 验证配方 SGN-001(限堆拆单跑);守卫测试不 import .ts、纯文本断言(SGN-002 规避)。
  - 适用 scope: 验证阶段
- shadow-docs/signals.md SGN-009/010
  - 当前结论: runtime 抽检用 `__reactProps` expando 调 onClick、`window.dispatchEvent` 造合成事件;matchMedia 新实例语义限制部分观察点。
  - 适用 scope: runtime 验证

## 决策

- **选型:** 方案 A——仿 ahooks 语义自研 + 全量等价迁移(与四件套同范式),抽象分两层:
  - `useScrollLock(active, options?)`:双 mode 契约。`'fixed'`(默认)——body 四值暂存 + position:fixed + top:-scrollY + width:100%,cleanup 还原后 `scrollTo(0, scrollY)`,Dialog/PlayerPanel 用;`'simple'`——documentElement overflow 暂存 + cleanup 还原 + scrollTo,`original` 变量语义保留,image-preview 用。active=false 或非浏览器环境跳过,零新增行为。
  - 存储:**底层原语** `readStorage<T>(key, validate?)` / `writeStorage(key, value)`(try/catch 静默、SSR 安全)+ `serialize`(writeStorage 第二参接字符串,调用方自控 String())。上层 `useLocalStorageState(key, initialValue, options?: { validate?, deserialize? })`——useState 惰性初始化同步读(SSR 返回 initialValue,hydration 差异语义由消费方现状决定,MiniPlayer 已是该形态)。**迁移映射**:仅 MiniPlayer 用 hook(write-through 语义恰合);ThemeModeProvider/locales/PostComments/Barrage 用底层原语——各自写时机、校验函数、副作用编排不动。key 与取值集合常量化共享:THEME_STORAGE_KEY/COLOR_SCHEME_STORAGE_KEY/取值枚举从 ThemeModeProvider 导出,layout.tsx anti-FOUC 脚本模板注入同一常量,消除字面双源(脚本内联校验逻辑保留,守卫以字面量一致断言钉死)。
  - `scheduleIdle(callback, options?: { timeout?, fallbackMs? }) → cancel`(纯函数,非 hook,置于 `packages/hooks/scheduleIdle`,包描述扩展「共享浏览器能力」):idle 可用走 requestIdleCallback(timeout 默认 2000),否则 setTimeout(fallbackMs 默认=timeout);返回闭包 cancel 按实际分支收敛(修正现 GAP 版跨 id 空间 cancel 的理论错位)。三处参数:GAP `{timeout:2000}`、locales `{timeout:3000, fallbackMs:1500}`、FontPrefetch `{timeout:3000, fallbackMs:3000}`。
  - AppProviders:ahooks `useEventListener` → `@wuh.site/hooks/useEventListener`,显式 `'document'` target(visibilitychange 规范目标,行为等价);ahooks 依赖因 useRequest×5 暂留,**去 ahooks useRequest 立为非目标另项工程**。
  - `INTL_LOCALE` 上提至 packages/components/locales 导出,Barrage/footprint 两处 import。
  - AGENTS.md:Divider 移入已实现清单,占位清单更正为 6 项。
- **对比方案:** 方案 B(直接引 ahooks useLocalStorageState/useLockScroll)——ahooks 存储 hook 为 effect 期初始值+write-through,与 MiniPlayer 惰性同步读冲突、与 PostComments/Barrage 延迟写时机冲突,且加深 ahooks 依赖,否决。方案 C(只抽底层纯函数不造 hook)——5 处 useState+effect 骨架仍重复、image-preview/PlayerPanel 锁配方仍散落,收口不彻底,否决(其底层部分已并入 A)。
- **理由:** 行为等价优先——两配方不混用、写时机不统一、回落参数不合并;重复骨架归一但语义差异由参数/层次表达,与四件套「特殊点保留登记」纪律一致。

## 任务

### Phase 1 — 实现三件套(packages/hooks)

- [x] 1.1 `packages/hooks/useScrollLock/index.ts` — 双 mode 滚动锁,含 SSR guard 与对称 cleanup
- [x] 1.2 `packages/hooks/useLocalStorageState/index.ts` — readStorage/writeStorage 原语 + useLocalStorageState hook
- [x] 1.3 `packages/hooks/scheduleIdle/index.ts` — scheduleIdle/cancel 纯函数

### Phase 2 — 滚动锁迁移

- [x] 2.1 `packages/components/dialog/index.tsx` — 删手写 effect,`useScrollLock(open && lockScroll)`,锁内四 effect 与 focus 逻辑不动
- [x] 2.2 `packages/components/audio-player/PlayerPanel.tsx` — 同上(`state.isPanelOpen`)
- [x] 2.3 `packages/components/image-preview/index.tsx` 改消费 `@wuh.site/hooks/useScrollLock(open && lockScroll, { mode: 'simple' })`;删除 `packages/components/image-preview/hooks/useLockScroll.ts`

### Phase 3 — 存储迁移与双源消除

- [x] 3.1 `apps/site/app/components/audio-player/MiniPlayer.tsx`(collpased)→ `useLocalStorageState(COLLAPSE_STORAGE_KEY, false)`
- [x] 3.2 `apps/site/app/components/theme/ThemeModeProvider.tsx` → readStorage(带 parse 校验)+ writeStorage;导出 key/取值常量
- [x] 3.3 `apps/site/app/layout.tsx` — anti-FOUC 脚本模板注入共享常量,消除字面双源
- [x] 3.4 `packages/components/locales/index.tsx` — readStoredLocale/commitLocale 走原语;导出 INTL_LOCALE
- [x] 3.5 `apps/site/app/post/components/PostComments/index.tsx`、`apps/site/app/about/components/GuestbookBarrageDialog.tsx` — 原语替换(写时机不动);两处 INTL_LOCALE 改 import(`apps/site/app/footprint/page.tsx` 同)

### Phase 4 — 空闲调度 + ahooks 收敛

- [x] 4.1 `apps/site/app/components/player/GlobalAudioPlayer.tsx`、`packages/components/locales/index.tsx`、`apps/site/app/components/FontPrefetch.tsx` — 三处手写 idle 分支改 scheduleIdle(参数如上)
- [x] 4.2 `apps/site/app/components/AppProviders.tsx` — useEventListener 收敛至 `@wuh.site/hooks`(显式 'document');`packages/hooks/test/event-hooks.test.mjs` 台账同步 AppProviders 行

### Phase 5 — 守卫与文档

- [x] 5.1 `packages/hooks/test/wave2-hooks.test.mjs` — 新守卫:三件套导出契约、MIGRATED 文件禁手写锁骨架/裸 localStorage try-catch/裸 requestIdleCallback 分支/ahooks useEventListener、白名单反查棘轮、layout 脚本 key 与常量字面一致
- [x] 5.2 `AGENTS.md` — 占位清单更正(Divider 已实现)
- [x] 5.3 回归:`pnpm exec tsc --noEmit` 基线位集持平、oxlint 0/0、`node --test packages/hooks/test/*.mjs` 全绿、`node packages/components/test/structure.test.mjs` 无回归(SGN-001 配方)

### Phase 6 — runtime 抽检(期望深度 runtime)

- [x] 6.1 Dialog 开→body 锁定四值生效→关→位置还原;播放器面板开合同配方观察
- [x] 6.2 语言切换→刷新持久化;主题/配色 mode 刷新持久化;MiniPlayer 折叠态持久化
- [x] 6.3 visibilitychange 标题换装/还原;留言昵称持久化
- [x] 6.4 观察点不可达项如实登记(IAB 配方见 SGN-009/010)

## 执行偏差

- **新增文件 `packages/components/themes/themeStorage.ts`(brief 文件清单外):** brief 决策写「常量从 ThemeModeProvider 导出」;实施发现 app/layout.tsx 是服务端组件,`'use client'` 模块的普通常量导出在 RSC 侧拿到的是客户端引用代理而非值——常量必须落在非 `'use client'` 共享模块。意图不变(SSR 脚本与 provider 共享 key/取值单源),落点调整到 tokens 同目录。
- **`INTL_LOCALE` 以既有 `LANG_BY_LOCALE` 单源导出**(brief 设想新增常量):locales 内部 `LANG_BY_LOCALE` 与两处本地 `INTL_LOCALE` 三处逐字同值,`export const INTL_LOCALE = LANG_BY_LOCALE` 收口,不新增第二份对象。附带发现 PostComments `DATE_LOCALES` 是同值第三处,并入 task-11 统一。
- **MiniPlayer 容错增强:** 原实现 localStorage 读写无 try/catch(存储抛异常会崩渲染/effect);hook 统一静默语义。正常路径等价,异常路径终态一致(新会话回落初始值)。登记为容错改进而非行为改变。
- **Barrage mount effect try/catch 块粒度 → 键粒度:** 原实现首个 getItem 抛异常即整块跳 catch(footprint 新建不落盘);新实现按键静默(读归 undefined→新建→写尝试亦静默)。storage-throw 病理态终态一致(内存新 footprint、持久化均不成),正常态零差异。
- **anti-FOUC 脚本白名单形态 `a==='x'||a==='y'` → `[…].includes(a)`:** JSON.stringify 注入数组的字面等价改写(值域三元布尔语义不变)。
- **scheduleIdle cancel 闭包修正 GAP 版理论错位:** 原 `cancelIdle` 按「cancelIdleCallback 是否存在」全局判定,与 scheduleIdle 分支判定解耦(理论上 idle 可用但走了 setTimeout 回落的分支会跨 id 空间 cancel);新实现闭包内按实际分支收敛。正常环境观察不到差异。
- **AppProviders visibilitychange target 显式 `'document'`:** ahooks 默认 window(依赖事件冒泡);按规范目标显式声明,行为等价。
- **守卫跟随更新(brief 清单外,均为迁移意图的断言钉法调整,非行为改动):** `site-header-theme-toggle.test.mjs`(2 条钉单源注入形态)、`player-panel.test.mjs`(锁骨架断言改钉消费形态,骨架移交 wave2 守卫)、`locales.test.mjs`(idle 骨架同上)、`music-player-wiring.test.mjs`(同上)。
- **`packages/components/audio-player/tsconfig.guard.json` 补 `@wuh.site/hooks/*` paths(修复 wave1 遗留):** 域守卫「audio-player 类型清零」在 main 上已红(wave1 给 PlayerPanel/PanelVolume 加了 hooks import,但该 guard 不在 CI 覆盖面、wave1 手工网未含它,TS2307 骑入 main)。本轮补 paths 映射(与 root/site tsconfig 对齐)后域内清零,icons/iconfont-context 域外同根错误一并消除。

## 结果

- 实际耗时: 约 3.5h(propose 侦察 ~40min + 实现迁移 ~70min + 守卫回归 ~40min + runtime ~40min)
- 验证:
  - **静态守卫:** `wave2-hooks.test.mjs` 11/11 绿(首跑 2 红均为守卫自身正则形态:注释误伤 `'use client'` 指令判定→改行首锚定;footprint 双引号 import 形态→引号兼容);`event-hooks.test.mjs` 9/9 绿(AppProviders 入 MIGRATED 台账);`structure.test.mjs` 18/18;布局族+组件+hooks 全守卫网 207 例 204 绿(3 红=Image 角色契约,读 `image/index.tsx`/styles 不在本轮 diff,main 既有)。
  - **基线 diff 验收(零新增红法):** `git archive main` 解基线树,site 域全守卫网 33 红(基线)vs 28 红(head),`comm` 差集为空(唯一一度新增红 `idle 回调降级` 为钉 GAP 旧实现,已按纪律改钉消费形态后归零);基线独有过失为归档树缺 shadow-docs 的取文件失败,属解包伪影。
  - **类型:** 根 `pnpm exec tsc --noEmit` RC=0(CI 同款);apps/site 域 tsc 35=35 计数持平,3 处落我 diff 文件的错误(dialog FooterRenderer/image-preview Toolbar 拼装/footprint bind)逐一核对在未触碰行(diff 上下文外),判基线;audio-player 域 guard 由红(基线 4+,含 main 既有 PanelVolume TS2307)修复至 0(见执行偏差末条)。
  - **lint:** `pnpm run lint:next` 0 warnings/0 errors(CI 同款);本轮新增红 1 条(useLocalStorageState useCallback 未用)已消除;其余触及文件 lint 输出与 main 既有基线同。
  - **runtime(生产 `next start` localhost:3000,IAB 合成配方 SGN-010):** ①Dialog fixed 配方四值锁定(overflow:hidden/position:fixed/top:-400px/width:100%,scrollY 400 对应)+ 关闭还原 + 滚动位置归 400 ✓(关闭链需合成 `animationend` 触发动画收尾——Dialog 退出动画链本非本轮改动,旧实现同依赖,环境归因);②语言读路径(种子 'en'→reload→lang=en+UI 英文化)✓、写路径(点「中」→storage='zh'+lang zh-CN+词典同步)✓;③主题/配色:刷新后 aria-label『current Plain, Dark』+ data-theme-family=plain/data-color-scheme=dark(mount readStorage+SSR 脚本注入形态)✓,点「浅色」writeStorage 落库 mode='light'+即时生效 ✓;④MiniPlayer 折叠态:点「收起播放器」write-through storage 'false'→'true' ✓,reload 后收起形态首帧渲染(惰性同步读)✓;⑤留言昵称:输入→storage='抽检君' ✓,重开弹窗徽章显「抽」(mount readStorage 回显)✓;footprint 键自动补齐 '0720eb7b-…' ✓。
  - **不可达观察点(如实登记):** visibilitychange 标题换装/还原——WKWebView `document.visibilityState` 为 own 非 configurable 属性,无法像 SGN-009 matchMedia 那样 defineProperty 伪造,真实切后台不可控时序;该观察点深度=code-read + wave2 守卫⑦钉死消费形态(事件订阅链本身 wave1 已 runtime 证可达)。PlayerPanel 合同配方开合观察——歌单数据后端不可达(『Playlist failed to load』)面板无内容展开;同一契约已由 Dialog 实测 + 守卫④(两文件钉同一 useScrollLock)覆盖。

## 知识评估

- **预期影响:** 更新 `shadow-docs/knowledge/shared-hooks.md`(事件四件套 → 共享 hooks 契约全集:新增三件套契约、迁移台账、白名单棘轮、scheduleIdle 非 hook 先例、AppProviders 收敛条款);更新 `shadow-docs/knowledge/component-standard.md` 引用面(image-preview hooks 目录再减一员)。
- **候选卡片:** shadow-docs/knowledge/shared-hooks.md
- **理由:** 三件套与四件套同属「浏览器副作用单一实现处」契约域,并入同卡;AGENTS.md 失真属仓库文档,不单独立卡。

## 非目标

- ShareCard↔ArticleExporter 双胞胎合并、useInViewOnce、reduced-motion 命令式口径统一、焦点入/归还 hook、评论 service 抽取(候选已登记,后续三波评估)
- 去 ahooks useRequest(需先自研请求 hook,独立工程)
- 响应式清扫 Change B(组件库层 @media 收编 + 阶梯外断点决策 + 注记补齐,已另行立项 propose)
- 零外部消费组件目录(alert/card/result/skeleton/shared-link-group 等)的生死判定(需逐个精读,另立 chore)
- focus trap 缺口补齐(功能新特性,非重复收敛,单独评审)
