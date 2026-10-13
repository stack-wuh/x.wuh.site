---
title: 共享事件 Hooks（packages/hooks 事件四件套）
domain: hooks
keywords: [事件监听, addEventListener, useEventListener, useMediaQuery, useKeyPress, useClickOutside, 副作用清理, SSR, enabled 条件挂载, 事件四件套, 外点收起, Esc 关闭, 白名单]
scope:
  - packages/hooks
  - packages/components
  - apps/site
status: active
source:
  - changes/20261013-refactor-shared-event-hooks/brief.md
verified: 2026-10-13
verified-depth: runtime
verified-scope: 四件套契约由 packages/hooks/test/event-hooks.test.mjs（9 用例，纯文本断言不依赖 node 版本）+ site 域 tsc 基线比对 + build RC=0 确认；useKeyPress×2、useClickOutside×2、enabled 条件挂载与清理成对在生产 next start 实例上有真实观察点（外观浮层 Esc 关闭+焦点归还、移动菜单 Esc、外观外点收起/内点不收起、音量外点收起）。matchMedia 系统跟随链因 WKWebView 每次 matchMedia 调用返回新实例而不可合成测（见 SGN-009），该条款深度为 code-read。
---

# 共享事件 Hooks（packages/hooks 事件四件套）

## 当前结论

site/components 的浏览器事件副作用有单一实现处：`@wuh.site/hooks/useEventListener`。语义（仿 ahooks、按项目需要扩展）：

- **target** 支持省略（默认 window）、`'window'`/`'document'` 简写（在 effect 内懒解析，调用方渲染期不触浏览器全局）、元素、ref（ref.current 须在 hook 所在 effect 执行前就位；**挂载后元素被销毁重建的不适用**）；显式 `null` → 跳过挂载。
- **handler 经内部 ref 取最新值**：handler 引用变化不触发重绑；`{ capture, once, passive, enabled }` 以原语参与依赖，options 对象身份变化同样不触发重绑。
- **enabled 是条件挂载的统一表达**（「开态才监听」模式的单点收敛），禁止关态挂空监听再靠 handler 早退。
- effect cleanup 必须与建立时对称 removeEventListener。

三个合成 hook 组合 useEventListener，自身不得直接 addEventListener：

- `useMediaQuery(query, { defaultValue? })` → boolean。SSR/首帧返回 defaultValue（默认 false），挂载后同步真实值（与 image-preview 旧实现同构，防水合错位）。只用于布尔消费；**change 上挂副作用的站点（如系统深浅色跟随）应 memoize MediaQueryList 后走 `useEventListener('change', h, mql)`**，不经 useMediaQuery。
- `useKeyPress(key | key[], handler, { enabled?, preventDefault?, target? = 'window', capture?, passive? })` → keydown 订阅。支持单键（`'Escape'`、`'Space'`/`' '`）、组合键（`'ctrl+c'`）与数组候选（任一命中）；KEY_ALIASES 归一（esc/space/enter/方向键/tab）；**声明的修饰键必须按下，未声明的修饰键不参与否决**（与存量「只判 event.key」等价；独占语义由调用方 handler 自校）。仅订阅 keydown。
- `useClickOutside(ref, onTrigger, { enabled?, event? = 'pointerdown', capture? })` → document 冒泡阶段监听 + contains 判定，事件目标不在 ref 元素内即触发；ref.current 为空不触发。

**白名单（允许手写 addEventListener 的站点，各有已证实的不适用理由，由守卫棘轮锁定）**：

- `packages/components/cursor/index.tsx` — 4 个 pointer 监听与 InkField/跟随引擎可变态（taken/idleTimer）同 effect 闭包，`cursor/cursor.test.mjs` 以源码字面量钉死引擎结构；迁移需重写引擎生命周期，属后续 change。
- `packages/components/audio-player/provider.tsx` — audio 元素在 effect 内 `new Audio()` 命令式创建并随 `defaultVolume` deps 重建（元素重建不适用 hook 契约）。
- `apps/site/app/components/ContactCard.tsx` — `hasLink` 切换重建 ActionArea DOM 节点（button↔a），监听需随节点重建重绑。
- `packages/components/footprint-map/index.tsx` — Leaflet 命令式 DOM 绑定，非 React 生命周期内监听。
- `apps/desktop`（Electron，约 12 处）、`apps/console` — 不在本契约 scope，后续按同一模式跟进。
- `apps/site/app/components/AppProviders.tsx` — 既有一处 ahooks `useEventListener`（visibilitychange）；存量不动，触碰时收敛到 `@wuh.site/hooks`。

公开消费形态：包 `exports "./*"`，子路径 `@wuh.site/hooks/<name>`；`apps/site`、`packages/components` 已在 package.json 声明 `@wuh.site/hooks: workspace:^`（此前靠别名解析，已补正）。

## 执行约束

- site/components 新代码手写 `addEventListener` 前，先核对四件套能否表达；确认不适用才可新增白名单项，且必须在卡片登记理由。
- 条件挂载监听一律用 `enabled`，不得以 handler 早退替代（高频事件 pointermove/scroll 下尤其禁止）。
- 触碰四件套或迁移过的站点后必须跑 `node packages/hooks/test/event-hooks.test.mjs`；白名单棘轮只减不增——白名单文件被迁空即判红，强制台账与现状一致。
- packages/hooks 新增浏览器能力必须处理 SSR 并建立清理语义，不掺页面业务流程；跨包消费走公开入口，禁深导入包内部文件。
- 新增 workspace 依赖声明后补跑 `pnpm install` 再构建（幽灵依赖纪律，见 build-config）。

## 适用边界

适用于 packages/hooks 及 site/components 的事件副作用消费点。不适用于：React 生命周期外的命令式绑定（footprint-map）、挂载后被销毁重建的元素（provider/ContactCard 形态）、apps/desktop 与 apps/console。

## 验证方式

- `node packages/hooks/test/event-hooks.test.mjs` —— 9 用例：四件套导出契约 ×4、合成复用不裸监听、迁移清单禁裸 addEventListener、白名单棘轮反查、workspace 声明在位、image-preview 本地 hook 删除。纯 readFileSync 文本断言，node ≥ 22 可跑（不违 SGN-002）。
- `node packages/components/test/structure.test.mjs` —— 组件目录结构无回归。
- runtime：生产构建 localhost 验证 Esc 关闭+焦点归还、外点收起/内点不收起（IAB 合成事件可用面与禁区见 SGN-009/010）。

## 关联知识

- [组件编写规范](component-standard.md) — image-preview `hooks/` 拆分先例、多产品目录仅命名导出
- [构建与部署配置](build-config.md) — 新增 workspace 依赖后补跑 pnpm install、根 tsc 覆盖盲区
