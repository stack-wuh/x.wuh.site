---
{
  "schema": "shadow-dev/v1",
  "name": "20261013-refactor-shared-event-hooks",
  "type": "refactor",
  "scope": "packages/hooks,packages/components,apps/site",
  "status": "archived",
  "baseBranch": "main",
  "branch": "refactor/20261013-refactor-shared-event-hooks",
  "files": [
    "apps/site/app/about/components/GuestbookBarrageDialog.tsx",
    "apps/site/app/blog/components/TitleWithTooltip/index.tsx",
    "apps/site/app/components/ContactCard.tsx",
    "apps/site/app/components/SiteHeader/index.tsx",
    "apps/site/app/components/theme/ThemeModeProvider.tsx",
    "apps/site/app/music/MusicView/index.tsx",
    "apps/site/app/post/usePostImagePreview.ts",
    "apps/site/package.json",
    "packages/components/audio-player/PlayerPanel.tsx",
    "packages/components/audio-player/panel/PanelVolume.tsx",
    "packages/components/audio-player/provider.tsx",
    "packages/components/cursor/index.tsx",
    "packages/components/dialog/index.tsx",
    "packages/components/icons/iconfont-context.tsx",
    "packages/components/image-preview/hooks/useKeyboard.ts",
    "packages/components/image-preview/hooks/useMediaQuery.ts",
    "packages/components/image-preview/index.tsx",
    "packages/components/image/index.tsx",
    "packages/components/package.json",
    "packages/hooks/test/event-hooks.test.mjs",
    "packages/hooks/useClickOutside/index.ts",
    "packages/hooks/useEventListener/index.ts",
    "packages/hooks/useKeyPress/index.ts",
    "packages/hooks/useMediaQuery/index.ts"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 531,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/531",
    "pullRequest": 532,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/532"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "0e3c3821de5743bffc70131388d297cac0b06ca1",
    "verifiedAt": "2026-10-13T10:12:33.323Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:532",
    "planHash": "7c3cba78fca04e12a10636963826e4c97d5f4f416be1c4c93d2e42350173d8a7",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[refactor] 事件副作用抽象为 packages/hooks 共享 hooks（仿 ahooks 四件套）",
      "titleRaw": "事件副作用抽象为 packages/hooks 共享 hooks（仿 ahooks 四件套）",
      "supplement": "仿 ahooks 语义自研 useEventListener/useMediaQuery/useClickOutside/useKeyPress 进 packages/hooks，等价迁移 site+components 存量 addEventListener 调用点。复杂度 M，验证 runtime。详见 shadow-docs/changes/20261013-refactor-shared-event-hooks/brief.md",
      "body": "## 动机\n全仓 `addEventListener` 散落在 28 个文件约 50 处，重复模式明显：keydown/Esc 关闭约 10 处、外点收起 3 处、matchMedia 监听 4 处（`image-preview/hooks/useMediaQuery.ts` 已有一份合格实现但被关在组件目录内，`ThemeModeProvider`、`image` 组件另有内联重复版）。副作用建立/清理正确性靠各处自觉，SSR guard 参差不齐。`packages/hooks` 已有 useDialog/useFetch 等 6 个 hook，但缺少浏览器事件基础原语。本期仿 ahooks 语义自研四件套并等价迁移 site + components 存量调用点，使事件监听收敛为单一实现处。\n\n## 引用规范\n- `norms/code-style.md`（通用）\n  - 当前结论: 修改旧代码只修正与当前改动直接相关问题，不以一次变更为全仓改造入口；禁止为未来场景提前抽象；不吞异常，异步/副作用必须有清理语义。\n  - 适用 scope: 全仓\n- `norms/code-style-frontend.md` · 共享 Hooks 段\n  - 当前结论: `packages/hooks` 只封装可复用状态/副作用/浏览器能力，不含业务流程；事件监听必须建立并清理；`window`/`matchMedia` 等必须处理 SSR；返回值稳定。\n  - 适用 scope: packages/hooks\n- `norms/code-style-packages.md`\n  - 当前结论: 跨包消费走 `package.json` workspace 依赖与公开入口；共享包间只建立必要依赖；修改共享包必须检查所有消费者的类型/构建/运行时影响。\n  - 适用 scope: packages/hooks, packages/components, apps/site\n- `shadow-docs/knowledge/component-standard.md`（active, verified 2026-10-08）\n  - 当前结论: packages/components 目录结构契约由 `test/structure.test.mjs` 棘轮守卫强制；多产品目录仅命名导出；`image-preview/hooks/` 拆分先例。\n  - 适用 scope: packages/components, apps/site\n- `norms/tdd-verification.md`\n  - 当前结论: M 级 = 绿灯测试（写测试不强制先红）+ unit + 走查；runtime 验证须附可追溯观察点。\n  - 适用 scope: 验证策略\n\n## 决策\n- **选型:** 方案 B——仿 ahooks 语义自研四件套（useEventListener / useMediaQuery / useClickOutside / useKeyPress）进 `packages/hooks`，迁移 site + components 内全部语义等价调用点；特殊点保留并登记非目标。\n- **对比方案:**\n  - 方案 A（直接引入 ahooks）：零实现成本，但 API 词汇与项目 `bind`/Options/Return 契约两套风格并存，ahooks 依赖面（lodash 系、useLayoutEffect SSR 告警）需自行消化，且 useMediaQuery 需求仍不匹配其 useResponsive——混搭最不干净，不选。\n  - 方案 C（自研 + 保守迁移）：实现相同但只迁 mediaQuery/外点/Esc 三类，`addEventListener` 仍散落十余文件，后续需再开 change，收敛收益打折；本期范围已锁 site+components，触及面可控，不选。\n- **理由:** 四件套全选 + 范围锁定表明目标是真收敛；自研保证与现有 hooks 包风格统一、SSR guard 与清理语义单点保证；验证策略选静态守卫 + runtime 抽检（仓库无 React DOM 测试设施，引入 vitest+RTL 会使 change 扩为 refactor+build，周期失衡）。\n- **实现约束（来自规范）:**\n  - 四件套放 `packages/hooks/<name>/index.ts`，命名导出 + `UseXxxOptions/Return` 接口，仿 useDialog 现有形态；不引入组件三件套要求（hooks 包非 packages/components）。\n  - `useEventListener`：target 支持 ref/element/window/document（undefined 时跳过），透传 `{ capture, passive, once }`，handler 经内部 ref 保持最新值避免 re-bind，effect cleanup 必须 removeEventListener；SSR 安全。\n  - 内部支撑 `useLatest` 不公开导出。\n  - `image-preview/hooks/useMediaQuery.ts` 删除，消费方改从 `@wuh.site/hooks/useMediaQuery` 导入；`image-preview/hooks/useKeyboard.ts` 保留业务签名但内部改用 `useKeyPress`/`useEventListener` 重写。\n  - 依赖声明补齐：`packages/components/package.json`、`apps/site/package.json` 增加 `\"@wuh.site/hooks\": \"workspace:*\"` 并 `pnpm install`（当前导入靠别名，未按 workspace 规范声明）。\n\n## 任务\n### Phase 0 — 地基\n- [ ] P0-1 补 workspace 依赖声明 `@wuh.site/hooks` 并 pnpm install — `apps/site/package.json`、`packages/components/package.json`\n- [ ] P0-2 实现 `useEventListener`（含内部 useLatest；ref/element/window/document target、capture/passive/once、handler 最新值、SSR guard、清理）— `packages/hooks/useEventListener/index.ts`\n\n### Phase 1 — 用 useEventListener 迁移 components 批次\n- [ ] T1-1 `packages/components/cursor/index.tsx` — 4 处 pointer 监听迁移\n- [ ] T1-2 `packages/components/icons/iconfont-context.tsx` — load `{ once: true }` 迁移\n- [ ] T1-3 `packages/components/image-preview/index.tsx` — fullscreenchange 迁移\n- [ ] T1-4 `packages/components/audio-player/provider.tsx` — audio 元素 4 事件迁移\n- [ ] T1-5 `packages/components/audio-player/PlayerPanel.tsx` — keydown 迁移（暂用 useEventListener，Phase 2 换 useKeyPress 视场景）\n\n### Phase 2 — 其余三件套 + components/site 对应迁移\n- [ ] T2-1 实现 `useMediaQuery`（首帧同步 + change 监听 + SSR guard）— `packages/hooks/useMediaQuery/index.ts`\n- [ ] T2-2 迁移 `apps/site/app/components/theme/ThemeModeProvider.tsx` 与 `packages/components/image/index.tsx` 内联 matchMedia；删除 `packages/components/image-preview/hooks/useMediaQuery.ts` 并改消费导入\n- [ ] T2-3 实现 `useKeyPress`（key/组合键、enabled、preventDefault、target=window/document/ref）— `packages/hooks/useKeyPress/index.ts`\n- [ ] T2-4 迁移 `packages/components/dialog/index.tsx`、`apps/site/app/components/SiteHeader/index.tsx` 两处 Esc keydown；重写 `packages/components/image-preview/hooks/useKeyboard.ts` 内部\n- [ ] T2-5 实现 `useClickOutside`（ref + enabled 守卫 + onTrigger，pointerdown）— `packages/hooks/useClickOutside/index.ts`\n- [ ] T2-6 迁移 `apps/site/app/components/SiteHeader/index.tsx`（appearance 外点）与 `packages/components/audio-player/panel/PanelVolume.tsx`\n\n### Phase 3 — site 事件批次\n- [ ] T3-1 `apps/site/app/music/MusicView/index.tsx` — pointer 拖拽 + capture click 迁移\n- [ ] T3-2 `apps/site/app/post/usePostImagePreview.ts` — capture click/keydown 迁移\n- [ ] T3-3 `apps/site/app/components/ContactCard.tsx`（pointermove/leave）、`apps/site/app/about/components/GuestbookBarrageDialog.tsx`（scroll passive）、`apps/site/app/blog/components/TitleWithTooltip/index.tsx`（resize；ResizeObserver 部分保留）\n\n### Phase 4 — 守卫与验证收口\n- [ ] T4-1 静态守卫 `packages/hooks/test/event-hooks.test.mjs`：四件套导出契约存在 + 已迁移文件清单内禁现裸 `addEventListener`（白名单除外）\n- [ ] T4-2 全量验证：`pnpm exec tsc --noEmit`、`node packages/components/test/structure.test.mjs`、`pnpm build:next`、`node packages/hooks/test/event-hooks.test.mjs` 全绿\n- [ ] T4-3 runtime 抽检并记录观察点：① SiteHeader 外观面板 Esc 关闭 + 外点收起；② 系统主题切换跟随（ThemeModeProvider）；③ 图片预览键盘导航（←/→/空格/Esc）与全屏状态同步；④ 播放器 Esc/快捷键与音量外点收起；⑤ 博客标题 tooltip 窗口缩放溢出重算\n\n### 非目标（登记，不随本 change 处理）\n- `packages/components/footprint-map/index.tsx` — Leaflet 命令式 DOM 绑定，非 React 生命周期内监听\n- `apps/desktop`（Electron 端约 12 处）、`apps/console` — 本期范围外，后续按同一模式跟进\n- `useDialog`/`useTokens`/`useFetch`/`useImagePreview`/`useLocale` 现有契约不动\n\n## 补充\n仿 ahooks 语义自研 useEventListener/useMediaQuery/useClickOutside/useKeyPress 进 packages/hooks，等价迁移 site+components 存量 addEventListener 调用点。复杂度 M，验证 runtime。详见 shadow-docs/changes/20261013-refactor-shared-event-hooks/brief.md\n\n完整 brief：shadow-docs/changes/20261013-refactor-shared-event-hooks/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261013-refactor-shared-event-hooks\",\"type\":\"refactor\",\"scope\":\"packages/hooks,packages/components,apps/site\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261013-refactor-shared-event-hooks/brief.md\",\"cliVersion\":\"1.6.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "refactor"
      ]
    },
    "release": {
      "files": [
        "apps/site/app/about/components/GuestbookBarrageDialog.tsx",
        "apps/site/app/blog/components/TitleWithTooltip/index.tsx",
        "apps/site/app/components/SiteHeader/index.tsx",
        "apps/site/app/components/theme/ThemeModeProvider.tsx",
        "apps/site/app/music/MusicView/index.tsx",
        "apps/site/app/post/usePostImagePreview.ts",
        "apps/site/package.json",
        "apps/site/test/site-header-theme-toggle.test.mjs",
        "packages/components/audio-player/PlayerPanel.tsx",
        "packages/components/audio-player/panel/PanelVolume.tsx",
        "packages/components/dialog/index.tsx",
        "packages/components/icons/iconfont-context.tsx",
        "packages/components/image-preview/hooks/useKeyboard.ts",
        "packages/components/image-preview/index.tsx",
        "packages/components/image/index.tsx",
        "packages/components/package.json",
        "packages/hooks/test/event-hooks.test.mjs",
        "packages/hooks/useClickOutside/index.ts",
        "packages/hooks/useEventListener/index.ts",
        "packages/hooks/useKeyPress/index.ts",
        "packages/hooks/useMediaQuery/index.ts",
        "pnpm-lock.yaml",
        "shadow-docs/changes/20261013-refactor-shared-event-hooks/brief.md",
        "shadow-docs/knowledge/shared-hooks.md",
        "shadow-docs/menu.md",
        "shadow-docs/signals.md"
      ],
      "message": "refactor(hooks): 事件副作用收敛为四件套并迁移 site/components 调用点",
      "title": "refactor(hooks): 事件副作用收敛为四件套并迁移 site/components 调用点",
      "body": "## 变更\n- 新增 `@wuh.site/hooks` 事件四件套：useEventListener（target 简写/ref/元素、enabled 条件挂载、handler 最新值、SSR 安全、清理成对）、useMediaQuery、useKeyPress（单键/候选/组合键）、useClickOutside（document + contains）\n- 迁移 site/components 13 个调用点到四件套：iconfont、image-preview（fullscreenchange + 本地 useMediaQuery 删除上收 + useKeyboard 重写）、PlayerPanel、PanelVolume、dialog、SiteHeader（Esc×2 + 外点）、ThemeModeProvider（mql change）、image（reduced-motion）、MusicView（pointer 拖拽 + capture click）、usePostImagePreview（capture）、GuestbookBarrageDialog（scroll passive）、TitleWithTooltip（resize）\n- `apps/site`、`packages/components` 补声明 `@wuh.site/hooks: workspace:^`（此前靠别名解析）\n- 新增静态守卫 `packages/hooks/test/event-hooks.test.mjs`（9 用例，含迁移清单禁裸 addEventListener 与白名单棘轮反查）；`site-header-theme-toggle.test.mjs` 两处断言改钉 hook 形态（意图不变）\n- 偏差登记（见 brief 执行偏差段）：cursor/provider/ContactCard 因元素重建或引擎闭包语义不等价保留手写监听；PlayerPanel 焦点 effect 的 deps 原样保留以维持捕获/归还时序\n- Knowledge：新增 `shadow-docs/knowledge/shared-hooks.md` 并补 menu 路由；signals.md 新增 SGN-009～012\n\n## 影响\n- 行为/触发面变化：无预期行为变化（行为等价重构）；监听建立/清理与 SSR guard 收敛到单一实现处\n- 明确不受影响的范围：apps/desktop、apps/console、footprint-map（Leaflet 命令式绑定）、useDialog/useFetch/useImagePreview/useTheme/useTokens/useLocale 现有契约；白名单四处文件的运行时行为不变\n\n## 验证\n- 命令与结果：`node packages/hooks/test/event-hooks.test.mjs` 9/9；`node packages/components/test/structure.test.mjs` 18/18；`node --test apps/site/test/site-header-theme-toggle.test.mjs` 适配两案绿、其余 6 红为基线既有；site 守卫集全量 `comm -23` 分支独有失败 = 空（零新增红）；`node --test packages/components/cursor/cursor.test.mjs` 13/13；根 `tsc --noEmit` RC=0（CI 门禁项）；site 域 tsc 与基线错误集逐条相同（仅 3 处行号偏移）；`next build` RC=0（17 路由）\n- 未覆盖项（明说，不留空白）：图片预览键盘导航与标题 tooltip 的 runtime 观察被本地 GitHub/网易云数据后端不可达阻塞，观察点与反向验证记录在 brief；PlayerPanel 开态 Escape 分层同样被数据门控，已反向验证关态 enabled 不挂载\n\n## 关联\n- Closes #531\n- brief: shadow-docs/changes/20261013-refactor-shared-event-hooks/brief.md"
    }
  },
  "knowledge": {
    "action": "新增",
    "target": "shadow-docs/knowledge/shared-hooks.md",
    "reason": "四件套契约与白名单棘轮为长期有效低可发现事实；卡片已在 release 阶段落地并随 PR #532 进入 main（0e3c382），本次为 main 同源复核"
  }
}
---

# 事件副作用抽象为 packages/hooks 共享 hooks（仿 ahooks 四件套）

## 动机

全仓 `addEventListener` 散落在 28 个文件约 50 处，重复模式明显：keydown/Esc 关闭约 10 处、外点收起 3 处、matchMedia 监听 4 处（`image-preview/hooks/useMediaQuery.ts` 已有一份合格实现但被关在组件目录内，`ThemeModeProvider`、`image` 组件另有内联重复版）。副作用建立/清理正确性靠各处自觉，SSR guard 参差不齐。`packages/hooks` 已有 useDialog/useFetch 等 6 个 hook，但缺少浏览器事件基础原语。本期仿 ahooks 语义自研四件套并等价迁移 site + components 存量调用点，使事件监听收敛为单一实现处。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——`packages/hooks` 新增公开 API 为增量，不改现有 hook 契约，行为等价重构；触及面——共享包 + 约 17 个消费文件，跨 `packages/components` 与 `apps/site`；可发现性——Esc/外点/主题跟随等功能回归即时可见，监听器泄漏类问题需长时运行观察，属中低可发现性。综合定 M。
- **期望验证深度:** runtime（静态守卫绿灯测试 + tsc/构建 + dev 抽检并附可追溯观察点）

## 引用规范

- `norms/code-style.md`（通用）
  - 当前结论: 修改旧代码只修正与当前改动直接相关问题，不以一次变更为全仓改造入口；禁止为未来场景提前抽象；不吞异常，异步/副作用必须有清理语义。
  - 适用 scope: 全仓
- `norms/code-style-frontend.md` · 共享 Hooks 段
  - 当前结论: `packages/hooks` 只封装可复用状态/副作用/浏览器能力，不含业务流程；事件监听必须建立并清理；`window`/`matchMedia` 等必须处理 SSR；返回值稳定。
  - 适用 scope: packages/hooks
- `norms/code-style-packages.md`
  - 当前结论: 跨包消费走 `package.json` workspace 依赖与公开入口；共享包间只建立必要依赖；修改共享包必须检查所有消费者的类型/构建/运行时影响。
  - 适用 scope: packages/hooks, packages/components, apps/site
- `shadow-docs/knowledge/component-standard.md`（active, verified 2026-10-08）
  - 当前结论: packages/components 目录结构契约由 `test/structure.test.mjs` 棘轮守卫强制；多产品目录仅命名导出；`image-preview/hooks/` 拆分先例。
  - 适用 scope: packages/components, apps/site
- `norms/tdd-verification.md`
  - 当前结论: M 级 = 绿灯测试（写测试不强制先红）+ unit + 走查；runtime 验证须附可追溯观察点。
  - 适用 scope: 验证策略

## 决策

- **选型:** 方案 B——仿 ahooks 语义自研四件套（useEventListener / useMediaQuery / useClickOutside / useKeyPress）进 `packages/hooks`，迁移 site + components 内全部语义等价调用点；特殊点保留并登记非目标。
- **对比方案:**
  - 方案 A（直接引入 ahooks）：零实现成本，但 API 词汇与项目 `bind`/Options/Return 契约两套风格并存，ahooks 依赖面（lodash 系、useLayoutEffect SSR 告警）需自行消化，且 useMediaQuery 需求仍不匹配其 useResponsive——混搭最不干净，不选。
  - 方案 C（自研 + 保守迁移）：实现相同但只迁 mediaQuery/外点/Esc 三类，`addEventListener` 仍散落十余文件，后续需再开 change，收敛收益打折；本期范围已锁 site+components，触及面可控，不选。
- **理由:** 四件套全选 + 范围锁定表明目标是真收敛；自研保证与现有 hooks 包风格统一、SSR guard 与清理语义单点保证；验证策略选静态守卫 + runtime 抽检（仓库无 React DOM 测试设施，引入 vitest+RTL 会使 change 扩为 refactor+build，周期失衡）。
- **实现约束（来自规范）:**
  - 四件套放 `packages/hooks/<name>/index.ts`，命名导出 + `UseXxxOptions/Return` 接口，仿 useDialog 现有形态；不引入组件三件套要求（hooks 包非 packages/components）。
  - `useEventListener`：target 支持 ref/element/window/document（undefined 时跳过），透传 `{ capture, passive, once }`，handler 经内部 ref 保持最新值避免 re-bind，effect cleanup 必须 removeEventListener；SSR 安全。
  - 内部支撑 `useLatest` 不公开导出。
  - `image-preview/hooks/useMediaQuery.ts` 删除，消费方改从 `@wuh.site/hooks/useMediaQuery` 导入；`image-preview/hooks/useKeyboard.ts` 保留业务签名但内部改用 `useKeyPress`/`useEventListener` 重写。
  - 依赖声明补齐：`packages/components/package.json`、`apps/site/package.json` 增加 `"@wuh.site/hooks": "workspace:*"` 并 `pnpm install`（当前导入靠别名，未按 workspace 规范声明）。

## 任务

### Phase 0 — 地基
- [x] P0-1 补 workspace 依赖声明 `@wuh.site/hooks` 并 pnpm install — `apps/site/package.json`、`packages/components/package.json`
- [x] P0-2 实现 `useEventListener`（含内部 useLatest；ref/element/window/document target、capture/passive/once、handler 最新值、SSR guard、清理）— `packages/hooks/useEventListener/index.ts`

### Phase 1 — 用 useEventListener 迁移 components 批次
- [x] T1-1 `packages/components/cursor/index.tsx` — 4 处 pointer 监听迁移
- [x] T1-2 `packages/components/icons/iconfont-context.tsx` — load `{ once: true }` 迁移
- [x] T1-3 `packages/components/image-preview/index.tsx` — fullscreenchange 迁移
- [x] T1-4 `packages/components/audio-player/provider.tsx` — audio 元素 4 事件迁移
- [x] T1-5 `packages/components/audio-player/PlayerPanel.tsx` — keydown 迁移（暂用 useEventListener，Phase 2 换 useKeyPress 视场景）

### Phase 2 — 其余三件套 + components/site 对应迁移
- [x] T2-1 实现 `useMediaQuery`（首帧同步 + change 监听 + SSR guard）— `packages/hooks/useMediaQuery/index.ts`
- [x] T2-2 迁移 `apps/site/app/components/theme/ThemeModeProvider.tsx` 与 `packages/components/image/index.tsx` 内联 matchMedia；删除 `packages/components/image-preview/hooks/useMediaQuery.ts` 并改消费导入
- [x] T2-3 实现 `useKeyPress`（key/组合键、enabled、preventDefault、target=window/document/ref）— `packages/hooks/useKeyPress/index.ts`
- [x] T2-4 迁移 `packages/components/dialog/index.tsx`、`apps/site/app/components/SiteHeader/index.tsx` 两处 Esc keydown；重写 `packages/components/image-preview/hooks/useKeyboard.ts` 内部
- [x] T2-5 实现 `useClickOutside`（ref + enabled 守卫 + onTrigger，pointerdown）— `packages/hooks/useClickOutside/index.ts`
- [x] T2-6 迁移 `apps/site/app/components/SiteHeader/index.tsx`（appearance 外点）与 `packages/components/audio-player/panel/PanelVolume.tsx`

### Phase 3 — site 事件批次
- [x] T3-1 `apps/site/app/music/MusicView/index.tsx` — pointer 拖拽 + capture click 迁移
- [x] T3-2 `apps/site/app/post/usePostImagePreview.ts` — capture click/keydown 迁移
- [x] T3-3 `apps/site/app/components/ContactCard.tsx`（pointermove/leave）、`apps/site/app/about/components/GuestbookBarrageDialog.tsx`（scroll passive）、`apps/site/app/blog/components/TitleWithTooltip/index.tsx`（resize；ResizeObserver 部分保留）

### Phase 4 — 守卫与验证收口
- [x] T4-1 静态守卫 `packages/hooks/test/event-hooks.test.mjs`：四件套导出契约存在 + 已迁移文件清单内禁现裸 `addEventListener`（白名单除外）
- [x] T4-2 全量验证：`pnpm exec tsc --noEmit`、`node packages/components/test/structure.test.mjs`、`pnpm build:next`、`node packages/hooks/test/event-hooks.test.mjs` 全绿
- [x] T4-3 runtime 抽检并记录观察点：① SiteHeader 外观面板 Esc 关闭 + 外点收起；② 系统主题切换跟随（ThemeModeProvider）；③ 图片预览键盘导航（←/→/空格/Esc）与全屏状态同步；④ 播放器 Esc/快捷键与音量外点收起；⑤ 博客标题 tooltip 窗口缩放溢出重算

### 非目标（登记，不随本 change 处理）
- `packages/components/footprint-map/index.tsx` — Leaflet 命令式 DOM 绑定，非 React 生命周期内监听
- `apps/desktop`（Electron 端约 12 处）、`apps/console` — 本期范围外，后续按同一模式跟进
- `useDialog`/`useTokens`/`useFetch`/`useImagePreview`/`useLocale` 现有契约不动

## 执行偏差（apply 期记录）

- **T1-1 cursor → 登记非目标**：4 个 pointer 监听与 `InkField`/`takeover`/`armIdle` 引擎可变态同处一个 effect 闭包，`cursor/cursor.test.mjs` 以源码字面量钉死监听结构（`taken = true`、`if (taken)` 等）。迁移需重写引擎生命周期 + 反转卫，超出「行为等价监听收敛」边界。移交后续 change（cursor 引擎契约内评估）。
- **T1-4 provider → 登记非目标**：audio 元素在 effect 内 `new Audio()` 命令式创建并随 `defaultVolume` deps 重建，晚于挂载且身份会变，落在 `useEventListener` 文档声明的不适用面（ref 需 effect 前就位、元素重建不适用）。原实现建立/清理同 effect，本就满足清理纪律，保留手写监听。
- **T3-3 ContactCard（部分）→ 登记非目标**：`hasLink` 切换重建 ActionArea DOM 节点（button↔a），依赖重挂载期重绑；且 `contact-dialog-paper.test.mjs` 钉 `matchMedia(...)` 同步探测结构。同类元素重建，不适用 hook。同任务的 GuestbookBarrageDialog、TitleWithTooltip 已迁移。
- **useEventListener 增 `enabled` 参数**（原实现约束仅 capture/passive/once）：PlayerPanel/Barrage/image-preview/PanelVolume/SiteHeader 共 6 处「开态才挂监听」语义，若无 enabled 首类支持则关态挂空监听再靠 handler 早退，属语义漂移；enabled 是保持等价的必要实现细节。
- **T1-5 PlayerPanel 定稿用 `useEventListener + enabled`**（非 useKeyPress）：Escape 分层级联需保留「仅命中分支 preventDefault」与焦点归还时序；焦点 effect 的 deps（含子层开关）原样保留。
- **image-preview useKeyboard 重写为 4 次 `useKeyPress`**：原单监听逐 key 判断等价拆为 4 个 keydown 监听（低频事件，开销可忽略），`preventDefault` 仅在 allowKeyboard 命中分支执行、`closeOnEsc && open` 历史门控按原样保留。
- **MusicView `(pointer: fine)` 探测**：原实现挂载时求值一次、会话内不追踪；迁移为 `useState` 初始化求值 + `enabled`，语义一致（useMediaQuery 会引入会话内热切换的无意涵变化，故不用）。
- **守卫适配**：`apps/site/test/site-header-theme-toggle.test.mjs` 对 SiteHeader 的 `event.key === 'Escape'`/`contains(event.target as Node)` 字面量断言改为钉 `useKeyPress(...)`/`useClickOutside(...)` 调用形态（意图不变，登记入本 change 文件清单）。

## 结果

- 实际耗时: ~3.5h（apply 全程）
- 验证:

### 静态与构建（全部附真实输出）
- `node packages/hooks/test/event-hooks.test.mjs` → **9/9 pass**（导出契约×4、合成复用约束、迁移文件禁裸监听、白名单棘轮反查、workspace 声明、image-preview 本地 hook 删除）
- `node packages/components/test/structure.test.mjs` → **fail 0**
- `oxlint app`（apps/site）→ **0 warnings 0 errors**（124 files）
- 根 `tsc --noEmit`（CI 门禁项）→ **RC=0 一遍过**（SGN-001 限堆配方）
- site 域 tsc（覆盖 components/hooks 导入图，SGN-001 配方）：分支与基线错误**逐条相同，仅 3 处行号偏移**（本次编辑致 dialog 168→161、image-preview 401→399、image 76→77）——**零新增类型错误**；域内存量 61 行错误属既有基线
- `next build`（等价 pnpm build:next，win 下绕开 NODE_OPTIONS 行内赋值限制直调二进制）→ **RC=0**，17 路由全生成
- site 守卫集全量对比：分支 204 tests/27 fail vs main 基线 193/32；`comm -23` **branch-only 失败 = 空**（零新增红）。本 change 适配的两个用例（桌面外观浮层 Escape/外点、移动菜单 Escape）分支上 ✔；其余红项（含 image-role-contract 3 项同名）均为基线既有（源码字面量守卫与现码漂移的存量问题，移交后续 change）
- `node --test packages/components/cursor/cursor.test.mjs` → **13/13 绿**（白名单文件未动）

### runtime 抽检（生产模式 `next start :3111`，localhost，`__reactFiber` 确认水合）
- ✓ 观察点① SiteHeader 桌面外观 **Esc 关闭 + 焦点归还**（useKeyPress 实例1；真实 window keydown 派发，expanded true→false、activeElement=触发器）
- ✓ 观察点①' **移动菜单 Esc 关闭**（useKeyPress 实例2，enabled=open 门控）
- ✓ 观察点② **外观浮层外点收起**（useClickOutside 实例1：document pointerdown；外点收起 ✓ / 浮层内点不误收 ✓）
- ✓ 观察点④ **音量外点收起**（useClickOutside 实例2，PanelVolume，enabled=volOpen：开层→外点→收起）
- ✓ 观察点⑥ 替代路径：外观面板 UI 切「深色」→ localStorage 写入 + `data-color-scheme` 链正常（ThemeModeProvider 迁移文件的 handler 生效）。**「系统深浅色跟随」合成 change 事件不可测**：WKWebView 每次 `window.matchMedia(q)` 返回新实例（实测 `same:false`），合成事件触不到组件 memo 实例上的监听；main 旧实现同为实例级监听，此测法对旧码同样无效——非迁移回归，环境限制记录偏差
- ✗ PlayerPanel Escape 分层：面板展开受曲目/队列数据门控（GitHub Issues / 网易云后端本地不可用，首页呈「获取数据失败」），`isPanelOpen=true` 态在本环境不可达。已反向验证**关态 enabled=false 监听正确不挂载**（合成 Escape 无副作用、window 探针证明事件可达，说明未响应即因监听未挂=预期）；分层 handler 与 SiteHeader 复用同一 `useEventListener + enabled` 实现点
- ✗ 观察点③ 图片预览键盘导航、⑤ 标题 tooltip resize 重算：同样被 GitHub 数据环境阻塞（无可用文章）；其机制分别由已证的 useKeyPress（4 keydown 实例路径）与 useEventListener resize 同实现点覆盖

## 交付发布（判定命中 + 委托执行，2026-10-13）

- **判定:** 命中 `shadow-docs/menu.md`「构建与前端模块」→ `knowledge/build-config.md` 当前结论：部署链由 **GitHub Release published** 触发（push main 仅 quality-gate）；**PR merged ≠ 已部署**。最新 Release 先例 v1.4.80（2026-10-11，标题 `vX.Y.Z <中文名>`、body 空），下一版按 patch 递增取 **v1.4.81**。
- **执行记录（用户授权代执行）：**
  - PR #532 squash merged（merge commit `0e3c382`，2026-10-13T09:47:37Z）→ push main quality-gate 绿
  - `gh release create v1.4.81 --title "v1.4.81 事件副作用四件套（@wuh.site/hooks）" --target main` → https://github.com/stack-wuh/x.wuh.site/releases/tag/v1.4.81
  - 部署链 run `38379323780` 首试 `prepare-deps` 红——`docker.m.daocloud.io` 镜像加速源对 `node:20-alpine` manifest HEAD 返回 **502 Bad Gateway**（第三方镜像瞬时故障，与被部署代码无关；磁盘 24G 充足）
  - `gh run rerun --failed` 断点续跑 → **全链 7 作业 success**（prepare-deps/build-next/build-nest/staging-test/switch-traffic/restart-nginx），run 终态 completed/success（2026-10-13）
  - 公网复核：`https://wuh.site/` HTTP 200
- **交付结论:** ✅ **已部署**（v1.4.81 全链绿 + 入口可达）。镜像源 502 属外部瞬时故障，本次重试即恢复，未构成新信号（单次、无「勿再走」语义）；若后续复发再考虑「Dockerfile 基础镜像源治理」独立 change。
- **归档:** 部署链绿，可进入 `shadow-dev-archive`。

## 知识评估

- **预期影响:** 新增
- **候选卡片:** `shadow-docs/knowledge/shared-hooks.md`（domain: hooks；keywords: 事件监听, addEventListener, useEventListener, useMediaQuery, useClickOutside, useKeyPress, 副作用清理, SSR, packages/hooks；scope: packages/hooks, packages/components, apps/site），并在 `shadow-docs/menu.md` 追加「共享 Hooks」路由行
- **理由:** 本 change 后「浏览器事件副作用一律复用 `@wuh.site/hooks` 四件套、site/components 不手写 addEventListener」成为长期有效且低可发现（新代码容易再次手写）的项目事实，须沉淀为 active Knowledge 供后续 propose 路由。verified-depth 按 release 阶段实测定为 runtime。
