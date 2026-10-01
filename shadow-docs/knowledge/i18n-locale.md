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
verified: 2026-10-01
verified-depth: runtime
verified-scope: 浏览器三语（zh/en/ja）× 双主题走查——切换钮循环、localStorage 持久化、刷新后保持、documentElement.lang 同步、日文假名自托管字体渲染截图；locales 守卫测试 13 项 + audio-player 等守卫回归 63/63。20260930-fix-locale-switcher-flat-instant：平铺行 DOM 断言（三钮 aria-pressed/下划线/发丝线，循明暗行分段语言）+ 即时切换探针（点中→132ms 内 博客/zh-CN、点英→167ms 内 Blog/en；预取 chunk 先于弹层交互在册）+ 三语 nav/lang 走查（博客/Blog/ブログ）；locales 守卫 14/14、根 tsc 净、oxlint 0 errors
---

# 站点多语言 i18n

## 当前结论

三语（zh/en/ja）客户端 i18n，自研 LocaleProvider（`packages/components/locales/index.tsx`）+ `useLocale`（`packages/hooks/useLocale` 复用导出），切换不上 URL（无 `[locale]` 路由段、无 cookie 探测），服务端 metadata/JSON-LD/sitemap/RSS 维持中文默认。

词典按命名空间分片段：`packages/components/locales/dictionaries/{zh,en,ja}/<ns>.ts`（ns：common/site/home/blog/post/player/about/guestbook/music/weread/footprint/components），三语装配文件（`dictionaries/zh.ts|en.ts|ja.ts`）只做 import + spread。**zh 为类型基准**（`Dict = Widen<typeof zh>`），en/ja 片段类型 `DeepPartial<Dict['ns']>`，运行时缺 key 回落中文、中文也缺返回 key 本身（fail-visible）。`t(key, params)` 支持点路径与 `{name}` 占位符插值。

en/ja 词典 `dynamic import` 惰性加载（各语言独立槽位缓存、晚到加载无竞态），默认中文用户**首屏**零增量；LocaleProvider 挂载后空闲预取两份词典 chunk（`requestIdleCallback` 回退 `setTimeout`，catch 静默），外观弹层挂载时再经导出的 `preloadDictionaries()` 兜底——chunk 有模块缓存，切换时入库近乎同步、**即时生效**。持久化 key `wuh.site.locale`（循主题 localStorage 先例）；SSR `<html lang>` 恒 zh-CN，客户端挂载后按已选语言同步（zh-CN/en/ja）——硬加载存在一瞬默认语回落闪，为方案 v1 明确接受。

切换入口是 SiteHeader 外观弹层「语言」组**三钮平铺行**（中｜英｜日 直选，`aria-pressed` + 渐隐下划线 + 发丝线分隔，与「明暗」行同一分段语言）；语言自称名常量（中/英/日）是跨语言不变量，写在组件常量、不进词典；品牌印章字形（墨/念/音/樂/愛）不随 locale 变。

## 执行约束

- 新页面/组件的用户可见文案与 aria 必须进词典三语（zh/en/ja）同步补齐，不新增硬编码中文；依赖中文匹配的业务逻辑（如 `title.includes('年度总结')`）不迁。
- 零第三方 i18n 依赖（next-intl/react-i18next 等），由 `locales.test.mjs` 守卫固化；词典形状（en/ja ⊆ zh、装配文件铺开全部片段）同卡守卫。
- 脱离 React 主树的渲染出口（如 message 的 `createRoot` portal）拿不到主树 context，须自包一层 `LocaleProvider`。
- canvas 绘制文案（ShareCard）与命令式 DOM 写入（usePostImagePreview 复制按钮）在调用层先 `t()` 取好文案再传入，绘制/写入函数不接 hook。
- 相对时间/日期随 locale：`Intl`/`toLocaleDateString` 传 locale 映射（zh→zh-CN、en→en、ja→ja），今天/昨天/前天等相对标签进词典。

## 适用边界

文章内容（GitHub Issues 中文写作）、后台 Console、VitePress 博客子模块不做多语言；`design/system-color` 调试页（noindex）demo 文案属内容不迁移。

## 验证方式

`node --test packages/components/locales/locales.test.mjs`（词典形状 + fallback + 惰性加载 + 持久化 key + lang 同步 + 零依赖守卫）；浏览器切换走查：切语言看导航/aria/`documentElement.lang`，硬刷新验证 localStorage 持久化，日文需目检假名字体渲染（依赖 first-load-performance 的 CJK 子集假名覆盖）。

## 关联知识

- [first load performance](./first-load-performance.md)
- [design system](./design-system.md)
- [components](./components.md)
