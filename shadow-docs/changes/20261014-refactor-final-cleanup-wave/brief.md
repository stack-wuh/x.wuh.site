---
{
  "schema": "shadow-dev/v1",
  "name": "20261014-refactor-final-cleanup-wave",
  "type": "refactor",
  "scope": "packages/hooks,packages/components,apps/site",
  "status": "published",
  "baseBranch": "main",
  "branch": "refactor/20261014-refactor-final-cleanup-wave",
  "files": [
    "AGENTS.md",
    "apps/site/app/about/AboutView/index.tsx",
    "apps/site/app/components/AppProviders.tsx",
    "apps/site/app/components/player/GlobalAudioPlayer.tsx",
    "apps/site/package.json",
    "packages/components/audio-player",
    "packages/components/image-preview",
    "packages/components/test/breakpoint-raw-scan.test.mjs",
    "packages/hooks/useFetch/createService.ts",
    "packages/hooks/useRequest",
    "pnpm-lock.yaml",
    "shadow-docs/knowledge/layout-components.md",
    "shadow-docs/knowledge/shared-hooks.md"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 541,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/541",
    "pullRequest": 542,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/542"
  },
  "review": {
    "conclusion": "pending",
    "verifiedCommit": null,
    "verifiedAt": null
  },
  "workflow": {
    "operation": null,
    "checkpoint": "pr:542",
    "planHash": "a6fd2d2b007efbd5e105faf67417c6636f17448cfc9642e6f5dfbea9da04d540",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] refactor: 优化收口三合一——去 ahooks + 批次7 响应式收编 + 文档环境清理",
      "titleRaw": "refactor: 优化收口三合一——去 ahooks + 批次7 响应式收编 + 文档环境清理",
      "supplement": "L 级三 Phase:①自研 useRequest 等价迁移 5 调用点出账 ahooks(含 createService 共享包底层);②批次 7 台账收编(audio-player 逐块双判据、image-preview 767 族逐块判定、STAGE_TIER 判归保留注记);③AGENTS 死引用+分支清理+残留实例。完整 brief:shadow-docs/changes/20261014-refactor-final-cleanup-wave/brief.md",
      "body": "## 动机\n优化主线的收尾包:①共享 hooks 收敛最后一块外部依赖(ahooks `useRequest` 4 处消费,含 `packages/hooks/useFetch/createService.ts`——共享包底层压着 ahooks 是主线唯一未闭合点);②响应式阶梯的批次 7 收编(audio-player 族 ~20 处 `max-width:640` 移动块按备忘⑬双判据迁 `[移动,,桌面]` 两档槽、image-preview 767 族评估,STAGE_TIER max-height 族判归保留注记);③仓库文档与环境一致性小项(AGENTS.md `codex/` 死引用、已合并分支清理、本机残留生产实例)。\n\n消费现实(apply 前实测):\n- `useRequest` 全仓仅 5 个调用点、用到 4 类能力:auto(3 处)、`manual+runAsync`(AppProviders)、`manual+onSuccess`(GlobalAudioPlayer)、`cacheKey`(AboutView 单点,无跨组件共享者)、`onSuccess`(createService 内嵌)。无 `loading`/`error`/`run`/`refresh` 之外的能力面。\n- `ahooks` 依赖仅 `apps/site/package.json` 声明(createService 在 packages/hooks,经 site 传递)。\n- 批次 7 台账(layout-components 卡在册):audio-player 族 `${BREAKPOINTS.mobile}` 手写媒体块 ~20 处(max-width 形态)、image-preview 767 族 9 块、STAGE_TIER max-height 6 处。\n- 站点手写 `addEventListener` 散点 2 处(ContactCard pointermove/leave,收编收益为负,不做)。\n\n## 引用规范\n- shadow-docs/knowledge/shared-hooks.md\n  - 当前结论: wave1/wave2 契约全集(useScrollLock 双配方/存储两层/scheduleIdle);useFetch/createService 是 ahooks 唯一包内消费点,替换属本卡「事件/副作用」域扩面。\n  - 适用 scope: packages/hooks\n- shadow-docs/knowledge/layout-components.md\n  - 当前结论: 批次 7 非目标台账在册(audio-player ~20、image-preview 767 族 9、STAGE_TIER 6);备忘⑬两档槽双判据/回退税显式写回、备忘⑭选择器级条件组保留为收编判据;OFF_LADDER 值冻结不可归槽。\n  - 适用 scope: packages/components/audio-player, packages/components/image-preview, packages/components/themes/responsive.ts\n- shadow-docs/knowledge/component-standard.md\n  - 当前结论: 守卫测试同目录先例(index.test.mjs);新 hook 目录须三件套。\n  - 适用 scope: packages/hooks/useRequest\n\n## 决策\n- **选型:** 方案 A——单一 change 三 Phase 分账,Phase 间无依赖可独立回滚:Phase 1=自研 `useRequest` 等价 hook(TDD 先行:先写钉死 5 调用点行为面的失败守卫)→ 迁移 5 点 → 出账 ahooks 依赖;Phase 2=批次 7 收编(audio-player 逐块双判据 + image-preview 767 族逐块评估:可归槽则迁、OFF_LADDER 语义则保留注记入册、STAGE_TIER max-height 判归编译口外保留族);Phase 3=小项(AGENTS.md 死引用修正、已合并分支 4 条清理、3000/3001 残留生产实例关停)。\n- **对比方案:** 方案 B(拆三个 change)——符合小步快跑,但三者同为「收口」主题且 Phase 3 撑不起独立 change,用户裁决合一;方案 C(useRequest 不替代、仅 site 3 点迁走留 createService)——共享包仍压 ahooks,主线不闭合,否决。\n- **理由:** cacheKey 语义必须实测钉死(ahooks:remount 读缓存秒显 + 后台重发)——TDD 守卫 + IAB 软导航 runtime 双钉;批次 7 是响应式主线唯一在册欠账,不收口则卡内台账常挂;767 族判据=「归槽即边界移动改行为,禁止」(OFF_LADDER 卡条款),预计多数保留入册——预期收益是台账清零而非 29 块全迁,brief 明示防误解。\n- **非目标(明示):** 占位组件 6 空目录处置(待用户裁决,不动);ContactCard 2 散点(收益为负);`analytics` 缺 index.tsx 结构欠账(触碰时顺手,不扩面);pnpm-lock 外依赖面不动。\n\n## 任务\n### Phase 1 — 自研 useRequest 等价迁移(TDD)\n- [ ] 1.1 `packages/hooks/useRequest/index.tsx`+`types.ts`+`readme.md`+`useRequest.test.mjs` — 新守卫先红:钉 auto/manual+runAsync 语义、run/refresh 区分、onSuccess/onError、cacheKey(remount 秒显+后台重发,模块级 Map)、错误后 loading 归位\n- [ ] 1.2 `packages/hooks/useRequest/` — 最小实现转绿(禁 ahooks 引用;SSR 安全:cacheMap 仅客户端读写)\n- [ ] 1.3 `packages/hooks/useFetch/createService.ts` — useRequest 调用点切换(@wuh.site/hooks/useRequest),暴露面 data/error/loading/run/refresh 不变\n- [ ] 1.4 `apps/site/app/about/AboutView/index.tsx` — 2 处迁移(cacheKey 语义保留)\n- [ ] 1.5 `apps/site/app/components/AppProviders.tsx` — manual+runAsync 迁移\n- [ ] 1.6 `apps/site/app/components/player/GlobalAudioPlayer.tsx` — manual+onSuccess 迁移\n- [ ] 1.7 `apps/site/package.json`+`pnpm-lock.yaml` — 出账 ahooks 依赖;全仓 grep from 'ahooks' 归零\n- [ ] 1.8 runtime 钉正 — 生产实例软导航回 about:cacheKey 秒显旧数据 + 后台重发可观察(网络面确认二次请求发出)\n\n### Phase 2 — 批次 7 响应式收编\n- [ ] 2.1 `packages/components/audio-player/`(panel/mini/ghost 各 styles) — 逐块清点 max-width:640 声明:回退税判据(桌面参与声明显式写回/惰性直落)迁 `[移动,,桌面]` 两档槽;不可迁块(⑭族选择器级/⑩实例 transient)保留 + 注记\n- [ ] 2.2 `packages/components/image-preview/` — 767 族 9 块逐块判定:双源同常量语义=保留入 ⑥ 在册清单(附理由);可归槽块(若有)迁移\n- [ ] 2.3 `packages/components/audio-player/` — STAGE_TIER max-height 6 处:确认编译口不覆盖 max-height 轴,判归保留注记(登记范围外条款)\n- [ ] 2.4 `packages/components/test/breakpoint-raw-scan.test.mjs` — ④收编台账/⑥保留清单同步;audio-player 域媒体块裸 `${BREAKPOINTS.mobile}` 手写块计数下降至台账值\n- [ ] 2.5 runtime — 生产实例 CSSOM 探针:迁移块输出 `@media (min-width:521/641)` 两档形态 + ≤640 视口 computed 值抽查(音乐面板移动端布局)\n- [ ] 2.6 `shadow-docs/knowledge/layout-components.md` — 批次 7 台账从「非目标在册」更新为终态收口(收编数/保留数+理由),verified 行待 review 重验\n\n### Phase 3 — 文档与环境小项\n- [ ] 3.1 `AGENTS.md` — 仓库结构段 `codex/` 死引用修正(目录实际不存在);Hooks 清单段补 useRequest;批次 7 收编结果同步组件库清单段\n- [ ] 3.2 分支清理 — 已合并 4 分支删除(本地+远端):refactor/…wave2、refactor/…responsive-sweep、chore/…dead-components、chore/…layout-grid-retirement\n- [ ] 3.3 进程清理 — 本机 3000/3001 残留 next start 生产实例关停(端口占用核实后)\n\n## 补充\nL 级三 Phase:①自研 useRequest 等价迁移 5 调用点出账 ahooks(含 createService 共享包底层);②批次 7 台账收编(audio-player 逐块双判据、image-preview 767 族逐块判定、STAGE_TIER 判归保留注记);③AGENTS 死引用+分支清理+残留实例。完整 brief:shadow-docs/changes/20261014-refactor-final-cleanup-wave/brief.md\n\n完整 brief：shadow-docs/changes/20261014-refactor-final-cleanup-wave/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261014-refactor-final-cleanup-wave\",\"type\":\"refactor\",\"scope\":\"packages/hooks,packages/components,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261014-refactor-final-cleanup-wave/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "worktree": "D:\\works\\x.wuh.final-cleanup",
    "commit": {
      "files": [
        "AGENTS.md",
        "apps/site/app/about/AboutView/index.tsx",
        "apps/site/app/components/AppProviders.tsx",
        "apps/site/app/components/player/GlobalAudioPlayer.tsx",
        "apps/site/package.json",
        "packages/components/audio-player/mini/styles.tsx",
        "packages/components/audio-player/panel/styles/dock.tsx",
        "packages/components/audio-player/panel/styles/ghost.tsx",
        "packages/components/audio-player/panel/styles/mobile.tsx",
        "packages/components/audio-player/panel/styles/queue.tsx",
        "packages/components/audio-player/panel/styles/shell.tsx",
        "packages/components/audio-player/panel/styles/stage.tsx",
        "packages/components/audio-player/panel/styles/words.tsx",
        "packages/components/image-preview/index.tsx",
        "packages/components/image-preview/styles/index.tsx",
        "packages/components/test/breakpoint-raw-scan.test.mjs",
        "packages/hooks/useFetch/createService.ts",
        "packages/hooks/useRequest/",
        "pnpm-lock.yaml",
        "shadow-docs/changes/20261014-refactor-final-cleanup-wave/",
        "shadow-docs/knowledge/layout-components.md",
        "shadow-docs/knowledge/shared-hooks.md",
        "shadow-docs/menu.md"
      ],
      "message": "refactor: self-hosted useRequest + batch7 responsive consolidation + cleanup"
    }
  }
}
---

# 优化收口三合一:去 ahooks + 批次7 响应式收编 + 文档/环境清理

## 动机
优化主线的收尾包:①共享 hooks 收敛最后一块外部依赖(ahooks `useRequest` 4 处消费,含 `packages/hooks/useFetch/createService.ts`——共享包底层压着 ahooks 是主线唯一未闭合点);②响应式阶梯的批次 7 收编(audio-player 族 ~20 处 `max-width:640` 移动块按备忘⑬双判据迁 `[移动,,桌面]` 两档槽、image-preview 767 族评估,STAGE_TIER max-height 族判归保留注记);③仓库文档与环境一致性小项(AGENTS.md `codex/` 死引用、已合并分支清理、本机残留生产实例)。

消费现实(apply 前实测):
- `useRequest` 全仓仅 5 个调用点、用到 4 类能力:auto(3 处)、`manual+runAsync`(AppProviders)、`manual+onSuccess`(GlobalAudioPlayer)、`cacheKey`(AboutView 单点,无跨组件共享者)、`onSuccess`(createService 内嵌)。无 `loading`/`error`/`run`/`refresh` 之外的能力面。
- `ahooks` 依赖仅 `apps/site/package.json` 声明(createService 在 packages/hooks,经 site 传递)。
- 批次 7 台账(layout-components 卡在册):audio-player 族 `${BREAKPOINTS.mobile}` 手写媒体块 ~20 处(max-width 形态)、image-preview 767 族 9 块、STAGE_TIER max-height 6 处。
- 站点手写 `addEventListener` 散点 2 处(ContactCard pointermove/leave,收编收益为负,不做)。

## 复杂度评级
- **评级:** L
- **理由:** 契约变更=共享包出账外部依赖 + 新增自研 useRequest 等价契约(替代面含缓存语义);触及面=packages/hooks + site 入口/播放器/about 三消费点 + audio-player/image-preview 两族样式块;可发现性=批次 7 边界收敛必须 runtime CSSOM + 拖窗等价验证(备忘⑬回退税逐块论证),useRequest 替换必须 TDD(行为等价优先,wave 先例)。
- **期望验证深度:** unit(useRequest 等价守卫) + runtime(CSSOM 规则形态 + 生产实例软导航 cacheKey 行为观察)

## 引用规范
- shadow-docs/knowledge/shared-hooks.md
  - 当前结论: wave1/wave2 契约全集(useScrollLock 双配方/存储两层/scheduleIdle);useFetch/createService 是 ahooks 唯一包内消费点,替换属本卡「事件/副作用」域扩面。
  - 适用 scope: packages/hooks
- shadow-docs/knowledge/layout-components.md
  - 当前结论: 批次 7 非目标台账在册(audio-player ~20、image-preview 767 族 9、STAGE_TIER 6);备忘⑬两档槽双判据/回退税显式写回、备忘⑭选择器级条件组保留为收编判据;OFF_LADDER 值冻结不可归槽。
  - 适用 scope: packages/components/audio-player, packages/components/image-preview, packages/components/themes/responsive.ts
- shadow-docs/knowledge/component-standard.md
  - 当前结论: 守卫测试同目录先例(index.test.mjs);新 hook 目录须三件套。
  - 适用 scope: packages/hooks/useRequest

## 决策
- **选型:** 方案 A——单一 change 三 Phase 分账,Phase 间无依赖可独立回滚:Phase 1=自研 `useRequest` 等价 hook(TDD 先行:先写钉死 5 调用点行为面的失败守卫)→ 迁移 5 点 → 出账 ahooks 依赖;Phase 2=批次 7 收编(audio-player 逐块双判据 + image-preview 767 族逐块评估:可归槽则迁、OFF_LADDER 语义则保留注记入册、STAGE_TIER max-height 判归编译口外保留族);Phase 3=小项(AGENTS.md 死引用修正、已合并分支 4 条清理、3000/3001 残留生产实例关停)。
- **对比方案:** 方案 B(拆三个 change)——符合小步快跑,但三者同为「收口」主题且 Phase 3 撑不起独立 change,用户裁决合一;方案 C(useRequest 不替代、仅 site 3 点迁走留 createService)——共享包仍压 ahooks,主线不闭合,否决。
- **理由:** cacheKey 语义必须实测钉死(ahooks:remount 读缓存秒显 + 后台重发)——TDD 守卫 + IAB 软导航 runtime 双钉;批次 7 是响应式主线唯一在册欠账,不收口则卡内台账常挂;767 族判据=「归槽即边界移动改行为,禁止」(OFF_LADDER 卡条款),预计多数保留入册——预期收益是台账清零而非 29 块全迁,brief 明示防误解。
- **非目标(明示):** 占位组件 6 空目录处置(待用户裁决,不动);ContactCard 2 散点(收益为负);`analytics` 缺 index.tsx 结构欠账(触碰时顺手,不扩面);pnpm-lock 外依赖面不动。

## 任务
### Phase 1 — 自研 useRequest 等价迁移(TDD)
- [x] 1.1 `packages/hooks/useRequest/index.tsx`+`types.ts`+`readme.md`+`useRequest.test.mjs` — 新守卫先红:钉 auto/manual+runAsync 语义、run/refresh 区分、onSuccess/onError、cacheKey(remount 秒显+后台重发,模块级 Map)、错误后 loading 归位
- [x] 1.2 `packages/hooks/useRequest/` — 最小实现转绿(禁 ahooks 引用;SSR 安全:cacheMap 仅客户端读写)
- [x] 1.3 `packages/hooks/useFetch/createService.ts` — useRequest 调用点切换(@wuh.site/hooks/useRequest),暴露面 data/error/loading/run/refresh 不变
- [x] 1.4 `apps/site/app/about/AboutView/index.tsx` — 2 处迁移(cacheKey 语义保留)
- [x] 1.5 `apps/site/app/components/AppProviders.tsx` — manual+runAsync 迁移
- [x] 1.6 `apps/site/app/components/player/GlobalAudioPlayer.tsx` — manual+onSuccess 迁移
- [x] 1.7 `apps/site/package.json`+`pnpm-lock.yaml` — 出账 ahooks 依赖;全仓 grep from 'ahooks' 归零
- [x] 1.8 runtime 钉正 — 生产实例软导航回 about:cacheKey 秒显旧数据 + 后台重发可观察(网络面确认二次请求发出)

### Phase 2 — 批次 7 响应式收编
- [x] 2.1 `packages/components/audio-player/`(panel/mini/ghost 各 styles) — 逐块清点 max-width:640 声明:回退税判据(桌面参与声明显式写回/惰性直落)迁 `[移动,,桌面]` 两档槽;不可迁块(⑭族选择器级/⑩实例 transient)保留 + 注记
- [x] 2.2 `packages/components/image-preview/` — 767 族 9 块逐块判定:双源同常量语义=保留入 ⑥ 在册清单(附理由);可归槽块(若有)迁移
- [x] 2.3 `packages/components/audio-player/` — STAGE_TIER max-height 6 处:确认编译口不覆盖 max-height 轴,判归保留注记(登记范围外条款)
- [x] 2.4 `packages/components/test/breakpoint-raw-scan.test.mjs` — ④收编台账/⑥保留清单同步;audio-player 域媒体块裸 `${BREAKPOINTS.mobile}` 手写块计数下降至台账值
- [x] 2.5 runtime — 生产实例 CSSOM 探针:迁移块输出 `@media (min-width:521/641)` 两档形态 + ≤640 视口 computed 值抽查(音乐面板移动端布局)
- [x] 2.6 `shadow-docs/knowledge/layout-components.md` — 批次 7 台账从「非目标在册」更新为终态收口(收编数/保留数+理由),verified 行待 review 重验

### Phase 3 — 文档与环境小项
- [x] 3.1 `AGENTS.md` — 仓库结构段 `codex/` 死引用修正(目录实际不存在);Hooks 清单段补 useRequest;批次 7 收编结果同步组件库清单段
- [x] 3.2 分支清理 — 已合并 4 分支删除(本地+远端):refactor/…wave2、refactor/…responsive-sweep、chore/…dead-components、chore/…layout-grid-retirement
- [x] 3.3 进程清理 — 本机 3000/3001 残留 next start 生产实例关停(端口占用核实后)

## 结果
- 实际耗时: propose→apply 单会话(worktree 隔离)
- 偏差登记: ①3.3 的 3000/3001 实例经 netstat+进程名核实为**当前活跃会话**(用户 IAB 正浏览),原计划「关停残留」不适用,裁定保留并记录;runtime 探针改起隔离 3003 实例(验证后已关停)。②1.8 的软导航 SWR 观测在 IAB 受硬导航约束(SGN-005 家族:站内点击触发整页重载致 fetch 计数器随 realm 重置,两轮复现),生产侧仅能确证「auto 请求发出+热力图渲染」;cacheKey「挂载种子秒显+SWR 重校验」语义由 UR6 单测钉死,种子时机与 ahooks 的构造期差异已在 runner.ts 注释与 readme 声明。
- 验证:
  - **Phase 1(TDD):** `useRequest.test.mjs` 7 例先红(MODULE_NOT_FOUND)后绿——UR1 auto/UR2 manual+runAsync/UR3 run 吞错+runAsync 抛/UR4 refresh 沿 lastArgs/UR5 stale 响应保护/UR6 cacheKey 种子+SWR/UR7 订阅快照引用稳定;hooks 域 27 例(7+9+11)全绿;根 `tsc --noEmit` RC=0(run 期类型红 1 处即修);`lint:next` 0/0;`next build` RC=0;全仓 `from 'ahooks'` 0 命中,`apps/site/package.json` 依赖出账、lock 刷新。
  - **Phase 2:** 全族实测 **27 处** max-width:640(brief 预估 ~28 分布 8 文件)全部迁 `responsive()` 两档槽:纯隐藏 12 块、回退税 13 块(桌面值显式写回:Panel inset48/1160/行列模板/边框阴影、MiniCard 440/right:auto、ControlRow margin/gap、PlayButton 64、IconButton 40、Cover 48、ProgressRow static 等)、⑬惰性直落 2 块(mobile.tsx LeafPages/LeafPage+PageTicks 3 组件——grid-area/滚动容器声明桌面惰性);保留族:STAGE_TIER max-height 5 处(编译口无 max-height 轴)+image-preview previewMobile 9 块+hover/reduced-motion 14 处(非宽度轴),全部注记入册。守卫台账同步:收编台账 4→10 文件、保留清单 7→11 文件,`breakpoint-raw-scan` 6/6 绿;audio-player 域守卫 58 例+typecheck guard 全绿;根 tsc RC=0、lint 0/0、`next build` RC=0。
  - **Phase 2 runtime(CSSOM):** worktree 生产实例(3003,已关停)/music 页实测——`min-width:641px` 24 条规则,Panel 桌面回退(inset 48px+max-width 1160px)与 MiniCard(440px+right:auto)逐条在位,`desktop-only-hide`/`restore:inline-flex` 形态正确,**移动声明零泄漏**(leaked640=空);剩余 1 条 max-width:640 归属 `:root/[data-theme-family]`(site 主题变量层,非本变更两族,常量插值合规)。
  - **Phase 3:** AGENTS.md `codex/` 死引用删除+useRequest 入册 Hooks 清单;4 条已合并本地分支删除(`git branch -d` 全部成功,远端仅剩 desktop-submodule 与 master 非 main 遗留,不在本变更处置面);3000/3001 保留(偏差①)。
- 交付: (待 release 阶段回填)

## 知识评估

## 知识评估
- **预期影响:** 更新 2 卡——`shared-hooks.md`(useRequest 新契约+cacheKey 语义)、`layout-components.md`(批次 7 终态台账);`AGENTS.md`/`component-standard.md` 视实际触碰。
- **候选卡片:** shadow-docs/knowledge/shared-hooks.md, shadow-docs/knowledge/layout-components.md
- **理由:** useRequest 是共享 hooks 域新稳定契约;批次 7 是布局卡在册台账的收口事件,不留常驻过程细节。
