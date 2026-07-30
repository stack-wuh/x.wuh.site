# 首屏加载性能优化：LCP / FP

## 背景

主站关键页面的首屏 HTML 仍可能等待非首屏数据完成。首页使用 `force-dynamic` 并在返回页面前等待仓库、精选文章、年度总结和微信读书数据；文章详情页在正文数据之后同步获取相关文章。About 和 Blog 页面也缺少明确的首屏数据边界。虽然首页已有 `LazySection` 和部分动态导入，但它们主要延迟客户端渲染，不能消除服务端数据请求对 TTFB、FP、FCP 和 LCP 的影响。

最近的字体优化已改善跨平台字形、真实字重和字体 token 一致性。本次需求不重复进行字体架构迁移，只将字体请求、字体切换和 CLS 纳入首屏基线验证。

## 目标

- 缩短首页、Blog、Post、About 的服务端首屏阻塞路径，优先返回首屏必要内容。
- 让文章标题、元数据和正文不等待相关文章；让 About 和首页的次要数据在首屏后加载。
- 确认各页面实际 LCP 元素，按实测结果优化图片优先级、尺寸、字体请求和客户端初始化。
- 使用 Lighthouse 移动端实验室指标和真实用户 Web Vitals P75 验收，并保证主题、SEO 和页面功能不回归。

## 非目标（明确不做）

- 不重新设计最近已完成的字体家族、字重或 CSS token 架构。
- 不把文章正文整体改为客户端加载或用 loading 状态替代服务端正文。
- 不改变 canonical redirect、metadata、分页筛选、文章正文渲染和既有 SEO 语义。
- 不优化后台 Console、API 业务逻辑或数据库查询，除非基线证明其直接阻塞首屏且属于必要的最小改动。
- 不为了达到指标移除主题防闪烁脚本、可访问性内容或必要的错误处理。

## 影响范围

- `packages/wuh.site.next/app/page.tsx`、`packages/wuh.site.next/app/HomeView.tsx` — 拆分首页首屏与非首屏数据边界，保留运行时获取、空状态和失败日志。
- `packages/wuh.site.next/app/post/[number]/page.tsx` — 优先返回文章主体，延后相关文章请求和展示。
- `packages/wuh.site.next/app/about/page.tsx`、`packages/wuh.site.next/app/AboutView.tsx` — 优先 profile，延后仓库、热力图等次要活动数据。
- `packages/wuh.site.next/app/blog/page.tsx` — 以文章列表为首屏主体，依据基线决定 labels 是否延后，保持筛选和分页行为。
- `packages/wuh.site.next/app/layout.tsx`、`packages/wuh.site.next/app/HomeView.tsx` — 检查主题初始化、Provider、动态模块和实际 LCP 元素的首屏影响。
- `packages/components/analytics/WebVitals.tsx` — 补充按路由聚合真实用户指标所需的上下文，确保监控不阻塞首屏。
- `openspec/changes/2026-07-29-P-optimize-first-load/` — 记录基线、设计、实施任务和增量规格。
