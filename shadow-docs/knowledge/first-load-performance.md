---
title: 首屏加载性能
domain: performance
keywords: [首屏性能, LCP, 数据边界, 延迟加载, Web Vitals, ISR, 服务端渲染]
scope:
  - apps/site/app/HomeView
  - apps/site/app/page.tsx
  - apps/site/app/components/AppProviders.tsx
status: active
source:
  - changes/archive/20260615_P_first_screen_optimization/brief.md
  - changes/archive/2026-07-29-P-optimize-first-load/brief.md
  - changes/20260824-P-homepage-hydration-slimming/brief.md
verified: 2026-08-24
---

# 首屏加载性能

## 当前结论

核心原则：服务端生成初始 HTML 时只等待首屏主体所需数据，非首屏数据不阻塞 HTML 返回。

各页面数据边界：首页 Hero 和精选内容优先，仓库、年度总结、微信读书等非首屏区块延后加载并保留稳定占位；文章详情正文不等待相关文章请求，相关文章失败不阻断正文阅读；About 页 profile 主体优先，仓库和活动数据可在首屏后加载；Blog 列表文章和分页主体优先，labels 可延后加载。

生产构建后首页仍在运行时获取数据，不依赖构建期快照。非首屏请求失败不使已返回的首屏主体不可用。

每个关键页面可识别实际 LCP 元素及依赖，图片优先级和字体请求只依据测量结果调整。Web Vitals 指标上报包含页面 pathname 上下文，上报失败不阻塞页面渲染。

首页 hydration 边界：styled-components 6.4 组件可在 RSC server component 中直接渲染（样式经 StyledComponentsRegistry 收集，验证通过）。首页为 Server Component，纯展示区块（Hero/时间线/年度总结/分隔线）不参与客户端水合；交互部分（社交链接/联系弹窗/书架/项目刷新/打字机）为独立 client 叶子。Lighthouse 4x CPU 模拟下 TBT 从 2020ms 降至 1030ms（减半）。

## 执行约束

- 首屏主体数据优先，非首屏请求不得阻塞初始 HTML；延迟区块必须保留稳定占位，次要请求失败不得阻断主体。

## 适用边界

不要求所有页面都客户端请求；服务端主体数据仍可按路由缓存策略获取。

## 验证方式

检查各页面 await 边界与 LazySection/Suspense 占位，验证次要接口失败时主体仍有内容。

## 关联知识

- [homepage data](./homepage-data.md)
- [about activity](./about-activity.md)
- [blog scroll behavior](./blog-scroll-behavior.md)
