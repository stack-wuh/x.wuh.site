---
{
  "schema": "shadow-dev/v1",
  "name": "20261005-fix-locale-switch-realtime",
  "type": "fix",
  "scope": "packages/components/locales",
  "status": "archived",
  "baseBranch": "main",
  "branch": "fix/20261005-fix-locale-switch-realtime",
  "files": [
    "packages/components/locales/index.tsx",
    "packages/components/locales/locales.test.mjs"
  ],
  "github": {
    "repository": "stack-wuh/x.wuh.site",
    "issue": 471,
    "issueUrl": "https://github.com/stack-wuh/x.wuh.site/issues/471",
    "pullRequest": 475,
    "pullRequestUrl": "https://github.com/stack-wuh/x.wuh.site/pull/475"
  },
  "review": {
    "conclusion": "passed",
    "verifiedCommit": "c27a94dc1cdbb38c0f76e57a3176e7d0c87f2ffa",
    "verifiedAt": "2026-10-05T15:10:15.571Z"
  },
  "workflow": {
    "operation": null,
    "checkpoint": "merged-pr:475",
    "planHash": "1e73116af28947b32aabeb0c4fe617cd25118ead051ec87664af2c99f8d36c14",
    "updatedAt": null,
    "lastError": null,
    "issuePlan": {
      "title": "[fix] fix(i18n): 切语言非实时——词典入库通知空转，文案要等外观弹层关闭才生效",
      "titleRaw": "fix(i18n): 切语言非实时——词典入库通知空转，文案要等外观弹层关闭才生效",
      "supplement": "切换中/英/日时界面文案不实时更新，需等外观弹框消失才变化。生产浏览器打点已定位根因：LocaleProvider 词典存 ref + 版本号自增的通知被 React bail out（context identity 未变、children 引用未变），叠加 discrete 事件首帧必读空槽回落中文。修复口径：词典搬进 state + setLocale 就绪门控。方案与实测证据见 shadow-docs/changes/20261005-fix-locale-switch-realtime/brief.md",
      "body": "## 动机\n用户反馈：切换 i18n 时界面文案不是实时变化，要等外观弹框消失之后才变。\n\n生产 wuh.site 浏览器打点实测（2026-10-05）确认根因链条：\n\n1. 点「英」后 3 秒，`documentElement.lang === 'en'`、语言钮 `aria-pressed` 已翻、`localStorage` 已写，\n   但 `header nav a` 文案仍是「博客|音乐|关于|知识库」——组件确实重渲染了，只是 `t()` 还读到空槽。\n2. 关闭弹层后 60ms 内，文案跳成「Blog|Music|About|Knowledge base」——一次无关的本地状态更新\n   （`setAppearanceOpen(false)`）顺手触发了真正的重渲染，才把已在手的英文词典显示出来。\n3. 从 en 点「日」更糟：80ms 内文案先退回**中文**，4.1 秒后仍未修正，直到关弹层才变日文。\n   说明目标语言词典早已在手，缺的只是那次重渲染。\n4. 对照组：带 `locale=ja` 硬刷新，首屏 300ms 就是「ブログ|音楽」——挂载路径因水合期本来就有\n   大量重渲染而侥幸掩盖，问题只暴露在会话内切换。\n\n根因在 `packages/components/locales/index.tsx` 的 LocaleProvider，两点叠加：\n\n- **通知空转**：词典存 `dictsRef`（ref，非渲染输入），入库后靠 `bumpDictVersion()` 自增一个\n  未进 context value 的 state 来「强制重渲染」。该版本号既不在 `useMemo` 依赖里，context\n  identity 不变；Provider 自身重渲染时 `children` 元素引用未变、props 未变，React bail out\n  整棵子树。消费者一个都不重渲染。\n- **首帧必错**：`setLocaleState` + `loadDict` 在点击中同步发出，而 discrete 事件的 React 渲染\n  在事件尾部 flush，跑在 `import().then()` 微任务之前。点击那一帧必然读到空槽 → 回落中文。\n\n两者相加 = 「切换后不实时更新，弹框消失才变」。这不是回归，是 20260930 惰性词典方案自带的缺陷；\n当时的验证探针只测了 `aria-pressed` 与 `documentElement.lang`，没测文案，所以漏网。\n\n## 引用规范\n- `shadow-docs/knowledge/i18n-locale.md`\n  - 当前结论: 三语（zh/en/ja）客户端 i18n，自研 LocaleProvider + useLocale，切换不上 URL；\n    en/ja 词典 dynamic import 惰性加载、各语言独立槽位缓存；`requestIdleCallback` 空闲预取 +\n    外观弹层 `preloadDictionaries()` 兜底；持久化 `wuh.site.locale`；`<html lang>` 客户端同步。\n  - 适用 scope: packages/components/locales、apps/site/app/components/SiteHeader\n  - **待确认点（本 change 一并修订）**: 卡片「晚到加载无竞态」只对「词典内容」成立，\n    「通知渲染」这条当时即不成立；「空闲预取使切换近乎即时」隐含假设了预取会把词典喂进\n    渲染可读状态，而 `preloadDictionaries()` 只预热模块缓存、从不写 `dictsRef`。\n- `knowledge/bug-investigation.md`（shadow-dev-workflow）\n  - 当前结论: 同一 Bug 的复现→追踪→根因→最小修复→回归验证须由单一持续上下文完成。\n  - 适用 scope: cross-project——本 brief 的根因链即单上下文实测产物，apply 期延续同一上下文。\n- `norms/tdd-verification.md`\n  - 当前结论: M 级 = 绿灯测试（写测试，不强制先红）+ unit + 走查；未做根因分析就改代码的修复\n    review 直接驳回。\n  - 适用 scope: 全仓。根因分析已完成（见动机段），apply 期直接落修复 + 守卫。\n\n## 决策\n- **选型:** 方案 A——词典搬进 state + `setLocale` 就绪门控（用户 2026-10-05 确认）\n  1. **词典成为渲染输入**：`dictsRef` → `useState`；删除 `setDictVersion` / `bumpDictVersion`。\n     `t` 依赖 `[locale, dicts]`，context `value` 依赖含 `dicts`——入库必然改变 identity，\n     消费者必然重渲染，不再依赖任何「顺手触发」。\n  2. **`ensureDict(locale)` 单一入口**：模块级词典缓存 + in-flight 去重 + 加载。\n     `preloadDictionaries` 与 Provider 走同一入口，预取从「只热模块缓存」升级为「把词典\n     喂进可渲染状态」，切换时大概率零延迟。各语言独立槽位语义不变。\n  3. **`setLocale` 就绪门控**：词典到位才提交 `locale` state / `documentElement.lang` /\n     localStorage 三者（一个微任务内成套落地）。彻底消除「点击那一帧必然读到空槽」——\n     方案 B（只搬 state 不门控）仍会在 en→ja 时先闪一帧中文，实测第 3 条已证。\n  4. **竞态与失败语义**: 快速连点取最新值生效（latest-wins）；词典加载失败仍提交\n     `locale` + lang，按既有回落链走中文，不吞用户意图（fail-visible）。\n- **对比方案:**\n  - 方案 B（只把词典搬进 state）：改动更小，能修好「弹框消失才变」，但修不掉「先闪一帧\n    回落语言」——首帧必错源于 React 提交时序，不搬词典也存在。且 en→ja 实测会退回中文，\n    观感比现状更差。\n  - 方案 C（把 dictVersion 塞进 `useMemo` 依赖数组）：一行补丁即可让 identity 变化，但依赖\n    数组与对象内容不一致，是隐形炸弹——React Compiler 与 eslint 都会把它当多余依赖洗掉，\n    下次重构极易静默回归；且首帧仍错。\n  - 未选 next-intl / react-i18next 等第三方方案：`locales.test.mjs`「零第三方 i18n 依赖」\n    守卫与卡片明确禁止，且本 bug 与词典实现无关。\n- **理由:** 根因是「词典不是渲染输入」+「点击首帧必然读到空槽」两条独立缺陷，方案 A 同时\n  消除两者且都落在既有 `translate()` 纯函数与回落语义之上，不引入新契约、不改任何消费者。\n  与卡片「运行时缺 key 回落中文」的 fail-visible 结论一致：门控只在词典在手时才切，\n  失败路径原样回落。\n\n## 任务\n### Phase 1 — 修复实现\n\n- [ ] task-1 — `packages/components/locales/index.tsx` — 词典搬进渲染输入：`dictsRef` 换\n      `useState` 持有；删除 `setDictVersion`/`bumpDictVersion`；`t` 的 `useCallback` 依赖改为\n      `[locale, dicts]`；context `value` 的 `useMemo` 依赖含 `dicts`；`translate()` 与回落链不动。\n- [ ] task-2 — `packages/components/locales/index.tsx` — 抽 `ensureDict(locale)` 单一入口：\n      模块级词典缓存 + in-flight Promise 去重 + dynamic import；`preloadDictionaries()` 改走\n      `ensureDict('en' | 'ja')`（保留导出名与「失败静默」语义，不动 `requestIdleCallback`\n      与 setTimeout 回退档位）；挂载路径改 `await ensureDict(stored)` 后提交。\n- [ ] task-3 — `packages/components/locales/index.tsx` — `setLocale` 就绪门控：`ensureDict(next)`\n      resolve 后再成套提交（locale state / `applyDocumentLang` / localStorage）；zh 走同步路径\n      （词典已在手）；latest-wins 竞态守卫；catch 分支仍提交（回落中文）。\n- [ ] task-4 — `packages/components/locales/locales.test.mjs` — 结构守卫：断言 `dictsRef` /\n      `bumpDictVersion` / `setDictVersion` 全部退役，`ensureDict` 存在且 `preloadDictionaries`\n      经它加载，`value` 的依赖数组含 `dicts`，`setLocale` 内 `ensureDict` 先于\n      `setLocaleState`；断言零第三方 i18n 依赖守卫仍绿。\n\n### Phase 2 — 验证\n\n- [ ] task-5 — 静态检查 — `node --test packages/components/locales/locales.test.mjs`、\n      `pnpm exec tsc --noEmit`、oxlint，贴出输出。\n- [ ] task-6 — 运行时打点复验 — 复现本次取证用的探针：点击「英」/「日」后在**不关弹层**的\n      前提下，采样 `header nav a` 文案、`documentElement.lang`、`aria-pressed`，断言三者\n      同一帧成套更新且无回落语言中间帧；en→ja 直接跳、不再退中文；带 `locale=ja` 硬刷新\n      首屏仍为日文（防回归对照组）。\n\n## 补充\n切换中/英/日时界面文案不实时更新，需等外观弹框消失才变化。生产浏览器打点已定位根因：LocaleProvider 词典存 ref + 版本号自增的通知被 React bail out（context identity 未变、children 引用未变），叠加 discrete 事件首帧必读空槽回落中文。修复口径：词典搬进 state + setLocale 就绪门控。方案与实测证据见 shadow-docs/changes/20261005-fix-locale-switch-realtime/brief.md\n\n完整 brief：shadow-docs/changes/20261005-fix-locale-switch-realtime/brief.md\n\n<!-- shadow-dev:issue-metadata {\"name\":\"20261005-fix-locale-switch-realtime\",\"type\":\"fix\",\"scope\":\"packages/components/locales\",\"status\":\"proposed\",\"branch\":null,\"baseBranch\":\"main\",\"briefPath\":\"shadow-docs/changes/20261005-fix-locale-switch-realtime/brief.md\",\"cliVersion\":\"1.4.0\",\"prUrl\":null,\"issueNumber\":null} -->\n",
      "labels": [
        "fix"
      ]
    },
    "release": {
      "files": [
        "packages/components/locales/index.tsx",
        "packages/components/locales/locales.test.mjs",
        "shadow-docs/changes/20261005-fix-locale-switch-realtime/brief.md",
        "shadow-docs/knowledge/i18n-locale.md",
        "shadow-docs/signals.md"
      ],
      "message": "fix(i18n): 语言切换实时生效——词典改渲染输入 + setLocale 就绪门控",
      "title": "fix(i18n): 语言切换实时生效——词典入渲染输入 + 就绪门控",
      "body": "Closes #471\n\n完整 brief：shadow-docs/changes/20261005-fix-locale-switch-realtime/brief.md"
    }
  },
  "knowledge": {
    "action": "更新",
    "target": "shadow-docs/knowledge/i18n-locale.md",
    "reason": "复核重绑至新 HEAD c27a94d（原 review 绑 eca1fea，本 change 已合入 main）。验证与首次结论一致且已交付：locales 守卫 16/16（对修复前实现 3 项红灯）、audio-player 41/41、根 tsc exit=0、oxlint 0/0；生产 wuh.site 轨迹点「英」18ms、「日」66ms 内 lang 与文案同一记录落地、回落帧 0、弹层全程未关。i18n-locale 卡的三处修订与两条执行约束、signals 的 SGN-001 加权与 SGN-002 新建，均已随 PR #475 落盘并合入 main，本次不再产生新的 Knowledge 动作（action 仍记为「更新」以保留闭环事实源）。"
  }
}
---

# 修复 i18n 切语言非实时：词典入库通知空转导致文案要等弹层关闭才生效

## 动机

用户反馈：切换 i18n 时界面文案不是实时变化，要等外观弹框消失之后才变。

生产 wuh.site 浏览器打点实测（2026-10-05）确认根因链条：

1. 点「英」后 3 秒，`documentElement.lang === 'en'`、语言钮 `aria-pressed` 已翻、`localStorage` 已写，
   但 `header nav a` 文案仍是「博客|音乐|关于|知识库」——组件确实重渲染了，只是 `t()` 还读到空槽。
2. 关闭弹层后 60ms 内，文案跳成「Blog|Music|About|Knowledge base」——一次无关的本地状态更新
   （`setAppearanceOpen(false)`）顺手触发了真正的重渲染，才把已在手的英文词典显示出来。
3. 从 en 点「日」更糟：80ms 内文案先退回**中文**，4.1 秒后仍未修正，直到关弹层才变日文。
   说明目标语言词典早已在手，缺的只是那次重渲染。
4. 对照组：带 `locale=ja` 硬刷新，首屏 300ms 就是「ブログ|音楽」——挂载路径因水合期本来就有
   大量重渲染而侥幸掩盖，问题只暴露在会话内切换。

根因在 `packages/components/locales/index.tsx` 的 LocaleProvider，两点叠加：

- **通知空转**：词典存 `dictsRef`（ref，非渲染输入），入库后靠 `bumpDictVersion()` 自增一个
  未进 context value 的 state 来「强制重渲染」。该版本号既不在 `useMemo` 依赖里，context
  identity 不变；Provider 自身重渲染时 `children` 元素引用未变、props 未变，React bail out
  整棵子树。消费者一个都不重渲染。
- **首帧必错**：`setLocaleState` + `loadDict` 在点击中同步发出，而 discrete 事件的 React 渲染
  在事件尾部 flush，跑在 `import().then()` 微任务之前。点击那一帧必然读到空槽 → 回落中文。

两者相加 = 「切换后不实时更新，弹框消失才变」。这不是回归，是 20260930 惰性词典方案自带的缺陷；
当时的验证探针只测了 `aria-pressed` 与 `documentElement.lang`，没测文案，所以漏网。

## 复杂度评级

- **评级:** M
- **理由:** 契约变更——`useLocale()` 对外签名不变，但 `setLocale` 由同步变异步（内部实现）。
  触及面——共享包 `packages/components/locales`，全站所有 i18n 消费者（site 各页 +
  audio-player 组件）都挂在同一个 LocaleProvider 上，属于跨包共享模块。可发现性——低：
  通知空转不报错、不崩，只在「切语言」这一条运行时路径上表现为文案不刷新，静态审查极易放过。
  综合为 M（有行为但局部，不改对外契约）。
- **期望验证深度:** runtime——M 级要求绿灯测试 + 走查；本 change 根因本身是运行时渲染提交
  时序，静态断言只能守结构，生效性必须由浏览器打点实测确认。

## 引用规范

- `shadow-docs/knowledge/i18n-locale.md`
  - 当前结论: 三语（zh/en/ja）客户端 i18n，自研 LocaleProvider + useLocale，切换不上 URL；
    en/ja 词典 dynamic import 惰性加载、各语言独立槽位缓存；`requestIdleCallback` 空闲预取 +
    外观弹层 `preloadDictionaries()` 兜底；持久化 `wuh.site.locale`；`<html lang>` 客户端同步。
  - 适用 scope: packages/components/locales、apps/site/app/components/SiteHeader
  - **待确认点（本 change 一并修订）**: 卡片「晚到加载无竞态」只对「词典内容」成立，
    「通知渲染」这条当时即不成立；「空闲预取使切换近乎即时」隐含假设了预取会把词典喂进
    渲染可读状态，而 `preloadDictionaries()` 只预热模块缓存、从不写 `dictsRef`。
- `knowledge/bug-investigation.md`（shadow-dev-workflow）
  - 当前结论: 同一 Bug 的复现→追踪→根因→最小修复→回归验证须由单一持续上下文完成。
  - 适用 scope: cross-project——本 brief 的根因链即单上下文实测产物，apply 期延续同一上下文。
- `norms/tdd-verification.md`
  - 当前结论: M 级 = 绿灯测试（写测试，不强制先红）+ unit + 走查；未做根因分析就改代码的修复
    review 直接驳回。
  - 适用 scope: 全仓。根因分析已完成（见动机段），apply 期直接落修复 + 守卫。

## 决策

- **选型:** 方案 A——词典搬进 state + `setLocale` 就绪门控（用户 2026-10-05 确认）
  1. **词典成为渲染输入**：`dictsRef` → `useState`；删除 `setDictVersion` / `bumpDictVersion`。
     `t` 依赖 `[locale, dicts]`，context `value` 依赖含 `dicts`——入库必然改变 identity，
     消费者必然重渲染，不再依赖任何「顺手触发」。
  2. **`ensureDict(locale)` 单一入口**：模块级词典缓存 + in-flight 去重 + 加载。
     `preloadDictionaries` 与 Provider 走同一入口，预取从「只热模块缓存」升级为「把词典
     喂进可渲染状态」，切换时大概率零延迟。各语言独立槽位语义不变。
  3. **`setLocale` 就绪门控**：词典到位才提交 `locale` state / `documentElement.lang` /
     localStorage 三者（一个微任务内成套落地）。彻底消除「点击那一帧必然读到空槽」——
     方案 B（只搬 state 不门控）仍会在 en→ja 时先闪一帧中文，实测第 3 条已证。
  4. **竞态与失败语义**: 快速连点取最新值生效（latest-wins）；词典加载失败仍提交
     `locale` + lang，按既有回落链走中文，不吞用户意图（fail-visible）。
- **对比方案:**
  - 方案 B（只把词典搬进 state）：改动更小，能修好「弹框消失才变」，但修不掉「先闪一帧
    回落语言」——首帧必错源于 React 提交时序，不搬词典也存在。且 en→ja 实测会退回中文，
    观感比现状更差。
  - 方案 C（把 dictVersion 塞进 `useMemo` 依赖数组）：一行补丁即可让 identity 变化，但依赖
    数组与对象内容不一致，是隐形炸弹——React Compiler 与 eslint 都会把它当多余依赖洗掉，
    下次重构极易静默回归；且首帧仍错。
  - 未选 next-intl / react-i18next 等第三方方案：`locales.test.mjs`「零第三方 i18n 依赖」
    守卫与卡片明确禁止，且本 bug 与词典实现无关。
- **理由:** 根因是「词典不是渲染输入」+「点击首帧必然读到空槽」两条独立缺陷，方案 A 同时
  消除两者且都落在既有 `translate()` 纯函数与回落语义之上，不引入新契约、不改任何消费者。
  与卡片「运行时缺 key 回落中文」的 fail-visible 结论一致：门控只在词典在手时才切，
  失败路径原样回落。

## 任务

### Phase 1 — 修复实现

- [x] task-1 — `packages/components/locales/index.tsx` — 词典搬进渲染输入：`dictsRef` 换
      `useState` 持有；删除 `setDictVersion`/`bumpDictVersion`；`t` 的 `useCallback` 依赖改为
      `[locale, dicts]`；context `value` 的 `useMemo` 依赖含 `dicts`；`translate()` 与回落链不动。
- [x] task-2 — `packages/components/locales/index.tsx` — 抽 `ensureDict(locale)` 单一入口：
      模块级词典缓存 + in-flight Promise 去重 + dynamic import；`preloadDictionaries()` 改走
      `ensureDict('en' | 'ja')`（保留导出名与「失败静默」语义，不动 `requestIdleCallback`
      与 setTimeout 回退档位）；挂载路径改 `await ensureDict(stored)` 后提交。
- [x] task-3 — `packages/components/locales/index.tsx` — `setLocale` 就绪门控：`ensureDict(next)`
      resolve 后再成套提交（locale state / `applyDocumentLang` / localStorage）；zh 走同步路径
      （词典已在手）；latest-wins 竞态守卫；catch 分支仍提交（回落中文）。
- [x] task-4 — `packages/components/locales/locales.test.mjs` — 结构守卫：断言 `dictsRef` /
      `bumpDictVersion` / `setDictVersion` 全部退役，`ensureDict` 存在且 `preloadDictionaries`
      经它加载，`value` 的依赖数组含 `dicts`，`setLocale` 内 `ensureDict` 先于
      `setLocaleState`；断言零第三方 i18n 依赖守卫仍绿。

### Phase 2 — 验证

- [x] task-5 — 静态检查 — `node --test packages/components/locales/locales.test.mjs`、
      `pnpm exec tsc --noEmit`、oxlint，贴出输出。
- [x] task-6 — 运行时打点复验 — 复现本次取证用的探针：点击「英」/「日」后在**不关弹层**的
      前提下，采样 `header nav a` 文案、`documentElement.lang`、`aria-pressed`，断言三者
      同一帧成套更新且无回落语言中间帧；en→ja 直接跳、不再退中文；带 `locale=ja` 硬刷新
      首屏仍为日文（防回归对照组）。

## 结果

- 实际耗时: 约 2.5 小时单会话（生产复现取证 → 守卫红绿 → 修复 → 本地与生产双环境轨迹验收 → 发布与分支事故处置 → 归档）
- 验证: locales 守卫 16/16（同守卫对修复前实现取到 3 项红灯，证非空断言）· audio-player 回归 41/41 · 根 `tsc --noEmit` exit=0 · `oxlint` 0 warnings 0 errors · MutationObserver DOM 文本轨迹（本地 next dev + 生产 wuh.site 双环境，弹层全程不关）
- 交付: PR #475 合入 main（`abbc486`）→ Release **v1.4.59**（`--target abbc486…`，标题「v1.4.59 语言切换实时生效——词典入渲染输入 + 就绪门控」）触发 CI-CD，`quality-gate → prepare → prepare-deps → build-next → build-nest → staging-test → switch-traffic` 七段全绿（run 37328559181）。生产复核实测：点「英」18ms、点「日」66ms 内 `documentElement.lang` 与 `header nav a` 文案在同一条轨迹记录中落地，回落语言帧 0 条、弹层 `aria-expanded` 全程为 `true`；修复前同站点表现为文案无限滞留、须关弹层才跳出已在手的词典
- 事故记录（供后续 change 参考）: `release execute` 期间共享工作树 HEAD 被并发会话切到 `refactor/20261005-refactor-player-split`，提交 `ed0a62c` 落到对方分支且推送失败。经用户授权用 `git branch -f` 把本分支指回该提交（对方分支正被 checkout，git 拒绝强推，留待其 sync 到新 main 时自动跳过重复补丁）；此后本 change 的归档改在隔离 worktree `/tmp/wt-i18n-archive` 完成，避免卷入并发会话未提交的 `MiniPlayer.tsx` / `PlayerPanel.tsx`。教训：共享工作树里 release/archive 前必须核对 `branch --show-current`，并发时段优先用隔离 worktree

## 知识评估

- **预期影响:** 更新
- **候选卡片:** `shadow-docs/knowledge/i18n-locale.md`
- **理由:** 卡片两处结论需按本次实证修订——① 「晚到加载无竞态」需补「渲染通知」维度并写明
  词典必须是渲染输入（state），ref + 版本号自增在 `children` 引用不变时会被 React bail out；
  ② 「空闲预取使切换近乎即时」需改为「预取经 `ensureDict` 喂进渲染可读状态」，只热模块缓存
  不等于可渲染。同时 `verified` / `verified-depth` 随本次 runtime 复验刷新。
  不单开新卡：这是既有 i18n 卡内部的实现约束修正，拆出去会形成跨卡冲突。
