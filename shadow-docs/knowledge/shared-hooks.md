---
title: 共享 Hooks 契约（packages/hooks 事件四件套 + 副作用二波）
domain: hooks
keywords: [事件监听, addEventListener, useEventListener, useMediaQuery, useKeyPress, useClickOutside, useScrollLock, useLocalStorageState, readStorage, writeStorage, scheduleIdle, 副作用清理, SSR, enabled 条件挂载, 外点收起, Esc 关闭, 滚动锁, localStorage 持久化, requestIdleCallback, 白名单棘轮, hooks 包]
scope:
  - packages/hooks
  - packages/components
  - apps/site
status: active
source:
  - changes/20261013-refactor-shared-event-hooks/brief.md
  - changes/20261014-refactor-shared-hooks-wave2/brief.md
verified: 2026-10-14
verified-depth: runtime
verified-scope: 事件四件套契约（wave1，runtime：Esc/外点/enabled 条件挂载有生产观察点；matchMedia 系统跟随链因 WKWebView 新实例语义退 code-read，见 SGN-009）+ 二波三件套契约（wave2，runtime：useScrollLock fixed 配方四值锁定/还原+scrollY 归位在 Dialog 生产实例实测，useLocalStorageState 惰性读+write-through 与 scheduleIdle 消费参数由守卫+原语链路 runtime 佐证——语言读写、主题写+SSR 注入恢复、折叠态两路、昵称+footprint 自动补齐均有观察点；visibilitychange 标题换装因 WKWebView visibilityState 不可伪造退 code-read+守卫钉形态，见 SGN-014）。
---

# 共享 Hooks 契约（事件四件套 + 副作用二波）

## 当前结论

site/components 的浏览器副作用有单一实现处：`@wuh.site/hooks`。分两波收口：wave1 事件四件套（20261013）、wave2 滚动锁/存储/空闲调度（20261014）。

### 事件原语 useEventListener（一切事件监听的底座）

语义（仿 ahooks、按项目需要扩展）：

- **target** 支持省略（默认 window）、`'window'`/`'document'` 简写（在 effect 内懒解析，调用方渲染期不触浏览器全局）、元素、ref（ref.current 须在 hook 所在 effect 执行前就位；**挂载后元素被销毁重建的不适用**）；显式 `null` → 跳过挂载。
- **handler 经内部 ref 取最新值**：handler 引用变化不触发重绑；`{ capture, once, passive, enabled }` 以原语参与依赖，options 对象身份变化同样不触发重绑。
- **enabled 是条件挂载的统一表达**（「开态才监听」模式的单点收敛），禁止关态挂空监听再靠 handler 早退。
- effect cleanup 必须与建立时对称 removeEventListener。

三个合成 hook 组合 useEventListener，自身不得直接 addEventListener：

- `useMediaQuery(query, { defaultValue? })` → boolean。SSR/首帧返回 defaultValue（默认 false），挂载后同步真实值。只用于布尔消费；**change 上挂副作用的站点应 memoize MediaQueryList 后走 `useEventListener('change', h, mql)`**，不经 useMediaQuery。
- `useKeyPress(key | key[], handler, { enabled?, preventDefault?, target? = 'window', capture?, passive? })` → keydown 订阅。单键/组合键/数组候选；KEY_ALIASES 归一；**声明的修饰键必须按下，未声明的修饰键不参与否决**。仅订阅 keydown。
- `useClickOutside(ref, onTrigger, { enabled?, event? = 'pointerdown', capture? })` → document 冒泡 + contains 判定；ref.current 为空不触发。

### 弹层滚动锁 useScrollLock(active, { mode? })

两种配方语义不同、**不混用**，由 mode 参数表达：

- `'fixed'`（默认）：body 四值暂存（overflow/position/top/width）+ `position:fixed` + `top:-scrollY` + `width:100%`，cleanup 逐值还原后 `scrollTo(0, scrollY)`。遮罩下页面不可滚且不塌陷布局，兼顾 iOS 滚动穿透。消费：Dialog（`open && lockScroll`）、PlayerPanel（`state.isPanelOpen`）。
- `'simple'`：documentElement.style.overflow 暂存/还原 + cleanup scrollTo。全屏覆盖层轻量形态。消费：image-preview（`open && lockScrollProp`）。

active=false 或非浏览器环境跳过；条件挂载一律传组合布尔，禁止锁内加业务判断。

### 存储：底层原语 + 上层 hook 两层

写时机是选型唯一标准：

- 原语 `readStorage(key, validate?)` → `string | undefined`（SSR/键缺失/校验不过/抛异常统一静默归 undefined）；`writeStorage(key, value: string)`（SSR 跳过、异常静默；非字符串调用方自控 String()）。**延迟写/条件写/写点耦合副作用编排的站点必须用原语保持原时机**——ThemeModeProvider（parse+apply 链）、locales（commitLocale 成套提交）、PostComments（仅提交成功后落盘）、Barrage（仅非空时落盘）皆此型。
- hook `useLocalStorageState(key, initialValue, { deserialize?, serialize? })`：useState 惰性初始化**同步读**（SSR 返回 initialValue，水合差异由消费方现状负责）+ setState 后 write-through；serialize/deserialize 经 ref 取最新值，函数身份变化不触发额外读写。仅覆盖「状态变化即持久化」语义（MiniPlayer collapsed 是标准形态）。
- 主题/配色持久化契约（key + 取值集合）单源在 `@wuh.site/components/themes/themeStorage`（**非 `'use client'` 模块**——SSR layout 的 anti-FOUC 脚本模板需读纯常量值，'use client' 模块导出在服务端只是客户端引用代理）；anti-FOUC 脚本内 `JSON.stringify` 注入 key/白名单数组，禁字面双源；守卫钉死注入形态与常量一致。
- `INTL_LOCALE`（locale→Intl 地区码）单源从 locales 导出（`export const INTL_LOCALE = LANG_BY_LOCALE`），消费点禁本地重定义。

### 空闲调度 scheduleIdle（非 hook，包内共享浏览器能力先例）

`scheduleIdle(callback, { timeout? = 2000, fallbackMs? = timeout }) → cancel()`：requestIdleCallback 可用走 idle（timeout 上限），否则 setTimeout（fallbackMs）；返回闭包按实际分支收敛 cancel（消除手写版「idle API 存在但走了 setTimeout 分支时跨 id 空间 cancel」的理论错位）。SSR 返回空函数。消费参数：GAP `{timeout:2000}`、locales 预取 `{timeout:3000, fallbackMs:1500}`、FontPrefetch `{timeout:3000}`（回落=3000）。

### 白名单（允许手写 addEventListener / localStorage 的站点，各有已证实的不适用理由，守卫棘轮锁定）

- `packages/components/cursor/index.tsx` — 4 个 pointer 监听与 InkField/跟随引擎可变态（taken/idleTimer）同 effect 闭包，`cursor/cursor.test.mjs` 以源码字面量钉死引擎结构；迁移需重写引擎生命周期，属后续 change。
- `packages/components/audio-player/provider.tsx` — audio 元素在 effect 内 `new Audio()` 命令式创建并随 `defaultVolume` deps 重建（元素重建不适用 hook 契约）。
- `apps/site/app/components/ContactCard.tsx` — `hasLink` 切换重建 ActionArea DOM 节点（button↔a），监听需随节点重建重绑。
- `packages/components/footprint-map/index.tsx` — Leaflet 命令式 DOM 绑定，非 React 生命周期内监听。
- `apps/site/app/layout.tsx` — anti-FOUC 内联脚本水合前运行，无法 import 原语；key/取值经 themeStorage 注入单源，`window.localStorage.getItem` 字面合法（wave2 守卫白名单项）。
- `packages/hooks/useLocalStorageState/index.ts` — 存储原语唯一实现处。
- `apps/desktop`（Electron，约 12 处）、`apps/console` — 不在本契约 scope，后续按同一模式跟进。
- ~~`apps/site/app/components/AppProviders.tsx`~~ — wave2 已兑现「触碰时收敛」：ahooks useEventListener → 本包原语（显式 'document' target），入 MIGRATED 台账；ahooks 仅剩 useRequest×5（去 ahooks 另立工程）。

公开消费形态：包 `exports "./*"`，子路径 `@wuh.site/hooks/<name>`；`apps/site`、`packages/components` 已声明 `@wuh.site/hooks: workspace:^`。scheduleIdle 为包内非 hook 能力先例（包定位=共享浏览器能力与 hooks）。

## 执行约束

- site/components 新代码手写 `addEventListener` 前，先核对四件套能否表达；弹层滚动锁一律 `useScrollLock`（按配方选 mode），禁再手写 body/documentElement 锁；localStorage 访问先判写时机——状态即写用 hook，延迟/条件写用原语，禁手写 try/catch 骨架。确认不适用才可新增白名单项，且必须在卡片登记理由。
- 条件挂载一律用 `enabled`/组合布尔 active，不得以 handler 早退替代（高频事件 pointermove/scroll 下尤其禁止）。
- 触碰本卡站点后必须跑对应守卫：事件面 `node packages/hooks/test/event-hooks.test.mjs`，二波面 `node packages/hooks/test/wave2-hooks.test.mjs`；白名单棘轮只减不增——白名单文件被迁空即判红。
- packages/hooks 新增浏览器能力必须处理 SSR 并建立清理语义，不掺页面业务流程；跨包消费走公开入口，禁深导入包内部文件。
- 新增 workspace 依赖声明后补跑 `pnpm install` 再构建（幽灵依赖纪律，见 build-config）。
- 给消费包新增跨包 import 面时，该包**域守卫**（`*/typecheck.test.mjs` 的 tsconfig.guard.json）须同步 paths——root tsc 绿不代表域 guard 绿，域 guard 不在 CI（见 SGN-013）。
- 守卫钉旧手写实现的断言随迁移改钉消费形态，骨架责任移交实现处守卫（wave2 先例：player-panel/locales/music-player-wiring 三条断言迁移，意图不变）。

## 适用边界

适用于 packages/hooks 及 site/components 的事件/滚动锁/存储/空闲调度副作用消费点。不适用于：React 生命周期外的命令式绑定（footprint-map）、挂载后被销毁重建的元素（provider/ContactCard 形态）、水合前内联脚本（anti-FOUC，走常量注入）、apps/desktop 与 apps/console。

## 验证方式

- `node packages/hooks/test/event-hooks.test.mjs` —— 9 用例（wave1）：四件套导出契约、合成复用不裸监听、迁移清单禁裸 addEventListener（含 AppProviders）、白名单棘轮反查、workspace 声明在位、image-preview 本地 hook 删除。纯 readFileSync 文本断言，node ≥ 22 可跑（不违 SGN-002）。
- `node packages/hooks/test/wave2-hooks.test.mjs` —— 11 用例（wave2）：三件套导出契约 ×3、迁移清单禁手写锁骨架/裸 localStorage/裸 idle 分支/ahooks useEventListener、INTL_LOCALE 单源、themeStorage 注入形态与 key 字面一致、白名单反查棘轮、image-preview 本地 useLockScroll 删除。
- `node packages/components/test/structure.test.mjs` —— 组件目录结构无回归。
- runtime：生产构建 localhost 验证（IAB 合成配方与禁区见 SGN-009/010/014/015：Dialog 关闭链需合成 `animationend` 才走 completion；visibilityState 不可伪造）。
- 基线 diff 验收法见 SGN-011：站点/域守卫红集与 `git archive main` 解树名集 `comm -23` 为空 = 零新增红。

## 关联知识

- [组件编写规范](component-standard.md) — image-preview `hooks/` 拆分与本地 hook 上提删除先例（useMediaQuery.ts、useLockScroll.ts）
- [构建与部署配置](build-config.md) — 新增 workspace 依赖后补跑 pnpm install、根 tsc 覆盖盲区、域 guard paths 漂移（SGN-013）
- [响应式布局组件族](layout-components.md) — 布局 props 与本包事件/副作用契约的分工
