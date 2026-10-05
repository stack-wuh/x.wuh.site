---
title: 站点多语言 i18n
domain: i18n
keywords: [i18n, 多语言, locale, 语言切换, 词典, 翻译, LocaleProvider, useLocale]
scope:
  - packages/components/locales
  - packages/hooks/useLocale
  - apps/site/app/components/SiteHeader/AppearanceOptions.tsx
status: active
source:
  - changes/20260930-feature-site-i18n-trilingual/brief.md
  - changes/20260930-fix-locale-switcher-flat-instant/brief.md
  - changes/20261005-fix-locale-switch-realtime/brief.md
verified: 2026-10-05
verified-depth: runtime
verified-scope: MutationObserver 记 DOM 文本轨迹（本地 next dev，node 22）——zh→ja 点击后 62ms 同一条记录内 `lang=ja` 且 nav 转「ブログ｜音楽｜について」，全程弹层 `aria-expanded=true`（不关弹层即生效），轨迹零回落语言中间帧；连点 中→英 latest-wins；带 `locale=ja` 硬刷新首屏即日文（对照组）。locales 守卫 16/16（同守卫对修复前实现取 3 项红灯）、audio-player 回归 41/41、根 tsc exit=0、oxlint 0/0。反面教训：20260930 那次「点中→132ms、点英→167ms 即时生效」探针只读 `documentElement.lang` 与 `aria-pressed`，二者都不依赖词典，对「文案不更新」必然假绿
---

# 站点多语言 i18n

## 当前结论

三语（zh/en/ja）客户端 i18n，自研 LocaleProvider（`packages/components/locales/index.tsx`）+ `useLocale`（`packages/hooks/useLocale` 复用导出），切换不上 URL（无 `[locale]` 路由段、无 cookie 探测），服务端 metadata/JSON-LD/sitemap/RSS 维持中文默认。

词典按命名空间分片段：`packages/components/locales/dictionaries/{zh,en,ja}/<ns>.ts`（ns：common/site/home/blog/post/player/about/guestbook/music/weread/footprint/components），三语装配文件（`dictionaries/zh.ts|en.ts|ja.ts`）只做 import + spread。**zh 为类型基准**（`Dict = Widen<typeof zh>`），en/ja 片段类型 `DeepPartial<Dict['ns']>`，运行时缺 key 回落中文、中文也缺返回 key 本身（fail-visible）。`t(key, params)` 支持点路径与 `{name}` 占位符插值。

en/ja 词典 `dynamic import` 惰性加载，唯一入口是模块级 `ensureDict(locale)`（词典缓存 + in-flight Promise 去重）：resolve 即「该语言词典已在缓存内、可作渲染输入」，zh 静态导入恒在手同步 resolve。缓存在 React 树之外，故空闲预取、外观弹层兜底预取与多个 `LocaleProvider` 实例共用同一份加载；默认中文用户**首屏**零增量（预取只跑在挂载后的空闲档）。词典在 Provider 内以 `useState` 持有、`t` 依赖含该 state——**词典必须是渲染输入**，切语言经**就绪门控**（`ensureDict` resolve 后才成套提交 locale state / `<html lang>` / localStorage，连点取最新值，加载失败仍提交并按回落链显示中文），因此切换即时生效且不存在「按钮已切、文案未切」的半更新帧。持久化 key `wuh.site.locale`（循主题 localStorage 先例）；SSR `<html lang>` 恒 zh-CN，客户端挂载路径同样走门控，硬加载仍有一瞬默认语文案（词典未到手），为方案 v1 明确接受。

切换入口是 SiteHeader 外观弹层「语言」组**三钮平铺行**（中｜英｜日 直选，`aria-pressed` + 渐隐下划线 + 发丝线分隔，与「明暗」行同一分段语言）；语言自称名常量（中/英/日）是跨语言不变量，写在组件常量、不进词典；品牌印章字形（墨/念/音/樂/愛）不随 locale 变。

## 执行约束

- 新页面/组件的用户可见文案与 aria 必须进词典三语（zh/en/ja）同步补齐，不新增硬编码中文；依赖中文匹配的业务逻辑（如 `title.includes('年度总结')`）不迁。
- 零第三方 i18n 依赖（next-intl/react-i18next 等），由 `locales.test.mjs` 守卫固化；词典形状（en/ja ⊆ zh、装配文件铺开全部片段）同卡守卫。
- 脱离 React 主树的渲染出口（如 message 的 `createRoot` portal）拿不到主树 context，须自包一层 `LocaleProvider`；词典缓存在模块级，多实例共用一次加载。
- **词典必须是渲染输入**：槽位存 `useState`、`t` 的依赖含该 state。把词典放 ref、再自增一个不进 context `value` 的版本号来「强制重渲染」是彻底空转——context identity 不变使 `useContext` 消费者全部不更新，Provider 自身重渲染时 `children` 元素引用未变又使 React bail out 整棵子树。症状特征：状态与非文本属性（`lang`、`aria-pressed`）已变而 DOM 文案不变，要等一次无关重渲染（关弹层、切路由）才跳出已在手的词典。由 `locales.test.mjs` 结构守卫钉死，改 LocaleProvider 不得洗掉。
- **提交必须门控在词典就绪之后**：不得「先提交 locale、再异步补词典」。discrete 事件的 React 渲染在事件尾部同步 flush，跑在 `import().then()` 微任务之前，点击那一帧必然读到空槽并回落中文，且此后不再有任何重渲染纠正它（20261005 生产实证）。locale state / `<html lang>` / localStorage 还要成套同批提交，连点取最新值，词典加载失败仍提交（回落中文，不吞用户意图）。
- canvas 绘制文案（ShareCard）与命令式 DOM 写入（usePostImagePreview 复制按钮）在调用层先 `t()` 取好文案再传入，绘制/写入函数不接 hook。
- 相对时间/日期随 locale：`Intl`/`toLocaleDateString` 传 locale 映射（zh→zh-CN、en→en、ja→ja），今天/昨天/前天等相对标签进词典。

## 适用边界

文章内容（GitHub Issues 中文写作）、后台 Console、VitePress 博客子模块不做多语言；`design/system-color` 调试页（noindex）demo 文案属内容不迁移。

## 验证方式

`node --test packages/components/locales/locales.test.mjs`（词典形状 + fallback + 惰性加载 + 持久化 key + lang 同步 + 零依赖守卫 + 词典渲染输入守卫 + 就绪门控守卫；注意该套守卫靠 `.ts` 原生剥离，需 node ≥ 23，`mise.toml` 为 next 钉的 22 跑不动它）。

浏览器复验**必须以 DOM 文本为观测点**：页内挂 MutationObserver（`subtree + childList + characterData`）记录 `header nav a` 文案、`documentElement.lang` 与弹层 `aria-expanded` 的带时间戳轨迹，点击语言钮后在**不关弹层**的前提下断言两件事——文案在有限 ms 内变成目标语言，且轨迹里不存在「lang 已切而文案未切」或回落语言的中间记录。`lang` 与 `aria-pressed` 都不依赖词典，单独读它们对「文案不更新」必然假绿（20260930 的即时性探针即由此漏检，20261005 生产复核暴露）。采样勿用 `requestAnimationFrame`：非前台标签 rAF 停摆会静默丢帧、给出「什么都没发生」的假阴性，改用 MutationObserver 或 `setTimeout` 轮询。另需硬刷新验证 localStorage 持久化，日文需目检假名字体渲染（依赖 first-load-performance 的 CJK 子集假名覆盖）。

## 关联知识

- [first load performance](./first-load-performance.md)
- [design system](./design-system.md)
- [components](./components.md)
