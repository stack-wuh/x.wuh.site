---
title: 站内导航与软导航纪律
domain: frontend
keywords: [导航, 软导航, 硬导航, 路由, Link, 裸锚点, 全文档重载, 播放中断, 整页闪跳, prefetch, 水合]
scope:
  - apps/site/app
  - packages/components
status: active
source:
  - changes/20261006-fix-soft-navigation-audio-continuity/brief.md
verified: 2026-10-07
verified-depth: runtime
verified-scope: IAB 文档指纹探针（window.__probe='DOC@'+timeOrigin、window.__audio 引用存续、performance.timeOrigin 对照）实测：页脚「博客」、BackHomeLink/Empty 动作 Button、HomeView Button 三面点击后同文档存续；RSS 原生锚点对照面文档替换（探针灭、timeOrigin 变）；水合前提判据 hasFiber + 外观按钮开 dialog 通过。上/下篇、话题题签、相关文章、分页四面无后端环境不可达，由静态守卫 soft-navigation 5/5（基线红→实现绿）钉死 Link 形态。
---

# 站内导航与软导航纪律

## 当前结论

根布局常驻的客户端状态（AudioPlayerProvider 与其 `new Audio()`、主题/语言上下文）只在**软导航**（next/link）下跨路由存活。站内路径经同源裸 `<a>` / `styled.a` 点击即全文档重载：provider 重建、音乐断播、队列重拉。20261006 起全站页面导航已软化，守卫 `apps/site/test/soft-navigation.test.mjs` 钉死「站内路径禁裸锚点」。

## 执行约束

- 站内页面导航必须 next/link：直接 `<Link>`、`styled(Link)`，或消费侧 `as={Link}`（留言簿 BackLink 先例）。
- `Button href` 经 `isInternalHref`（以 `/` 开头且非协议相对）自动切 Link 渲染根；绝对/协议相对/mailto 地址维持原生 anchor 语义；消费侧显式 `as` 覆盖该判定（domProps spread 后位优先）。
- 保留原生 `<a>` 的正当形态：外链（target=_blank）、资源文档链接（如 `/api/rss.xml`——footerConf navItems 以数据字段 `native: true` 标记）、页内 hash 锚。
- `styled(Link)` 承载禁用态时必须给禁用分支 `as='span'` 摘除 href（Link 缺 href 会抛），如分页 NavLink、SpreadSide。
- 新增站内导航面先过 `soft-navigation.test.mjs` 红绿；新 `styled.a` 定义必须进零增长白名单并附外链/资源理由。
- dev 的 runtime 验证必须走 localhost：经 127.0.0.1 访问 Next dev 会被同源保护拒掉全部 chunk（403）→ 整树不水合，一切点击呈硬导航假象（`hasFiber=false` 为判据，勿误诊为代码问题）。

## 适用边界

覆盖站内页面路径导航的一切渲染形态（JSX 标签、styled 根、数据驱动的 href）。不覆盖：离开站点的链接（整页加载是预期语义）；跨文档重载保播放属非目标（不引 Service Worker）。

## 验证方式

`node --test apps/site/test/soft-navigation.test.mjs`（裸锚扫描 + styled.a 零增长白名单 + 各面形态断言）。runtime 复验：页面内设置 `window.__probe='DOC@'+Math.round(performance.timeOrigin)` 与 `window.__audio` 引用，点击目标面后回读——探针同值且 timeOrigin 不变 = 软导航。

## 关联知识

- [音乐播放器与网易云接入](music-player.md)
- [Next.js 前端构建](next.md)
- [组件包](components.md)
