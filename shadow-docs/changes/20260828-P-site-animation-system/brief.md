---
schema: shadow-dev/v1
name: 20260828-P-site-animation-system
type: feature
scope: site
status: proposed
baseBranch: main
branch: null
files: []
github:
  repository: stack-wuh/x.wuh.site
  issue: 335
  issueUrl: https://github.com/stack-wuh/x.wuh.site/issues/335
  pullRequest: null
  pullRequestUrl: null
review:
  conclusion: pending
  verifiedCommit: null
  verifiedAt: null
workflow:
  operation: null
  checkpoint: proposed
  planHash: null
  updatedAt: null
  lastError: null
---

# 全站动画规范（微光呼吸 × 书写显现）

## 动机

站点已有零散动画资产（TypewriterMotto 打字机、Header 悬停下划线、阅读进度条、skeleton shimmer），但无统一节奏语言：时长、缓动、降级策略各自为政，后续新增动画容易风格分裂或泛滥。首页重构后四个区块（Hero/Projects/Weread/Contact）零动画，动画是自然补位。

目标：沉淀一套全站动画规范——约束 + 语言 + 工具 + 降级 + 应用矩阵，首页作为第一个落地案例，其余页面按矩阵跟进。克制即规范：正文阅读区明确不动画。

## 引用规范

- shadow-docs/knowledge/design-system.md
  - 当前结论: 主题切换 0.3s ease；非颜色 tokens（spaces/fontSizes/borderRadius）通过 theme props 注入
  - 适用 scope: motion tokens 沿用同层注入机制；主题切换过渡节奏纳入规范
- shadow-docs/knowledge/blog-scroll-behavior.md
  - 当前结论: 阅读进度条纯 CSS animation-timeline: scroll(root)；禁止 JS scroll/resize 监听器
  - 适用 scope: 滚动渐入必须走 scroll-driven animations，不得引入监听器或 IO
- shadow-docs/knowledge/first-load-performance.md
  - 当前结论: 首屏主体数据优先；非首屏不阻塞 HTML；延迟区块保留稳定占位
  - 适用 scope: 入场动画不得延迟 LCP；动画全部 CSS，不新增客户端 JS 成本
- shadow-docs/knowledge/homepage-data.md
  - 适用 scope: 首页动画不得改变现有数据获取与降级渲染结构

## 决策

- **选型:** 纯 CSS 动画体系
  - 滚动渐入: `animation-timeline: view()` + `animation-range` 错位编排（无 JS 监听器）
  - 入场/悬停: CSS transition + 一次性类切换
  - 页面切换: Next.js 15.1 `experimental.viewTransition` + `::view-transition-*` 自定义（全局淡入淡出约 350ms）
- **对比方案:** 引入动效库 Motion（原 Framer Motion）
  - 收益: whileInView/variants/stagger 声明式编排，开发效率高，浏览器覆盖最全（Firefox 也有滚动渐入）
  - 代价: 运行时约十几 KB gzip；动画区块全部变 client component 且等 hydration 后才生效；与 hydration slimming 方向（当前 refactor 分支）直接相悖
  - 结论: 本项目四类动画中三类纯 CSS 可完成，页面切换原生 View Transitions API 已覆盖（Chrome 111+/Safari 18+/Firefox 138+）；不引入
- **气质语言:** 微光呼吸 × 书写显现（用户拍板）
  - 微光呼吸: opacity + translateY(12px→0) 缓慢淡入，位移小、速度慢，读作「被晨光照亮」
  - 书写显现: 标题逐行浮现（每行 opacity 0→1 + 2-4px 上移，400ms，行间 80ms 错开），是「落笔」暗示非逐字书写
  - 一条原则: 动画只做「被照亮」和「被写下」两件事，不做位移炫技
- **节奏 tokens**（进主题注入层，与现有非颜色 tokens 同机制）:
  - `--ease-out-soft`: cubic-bezier(0.22, 1, 0.36, 1)（显现类）
  - `--ease-in-out-soft`: cubic-bezier(0.45, 0, 0.25, 1)（呼吸/光感类）
  - `--dur-quick`: 150ms（悬停反馈）
  - `--dur-reveal`: 600ms（区块渐入）
  - `--dur-write`: 400ms/行（书写显现）
- **应用矩阵**（首批）:
  - 首页: Hero 入场仪式感（标题书写显现 → 描述 → CTA，总时长 ≤600ms，位移 ≤8px，不阻塞 LCP）；Projects 卡片滚动渐入 + 错落 + 悬停浮起 4px + 背景微亮；Weread 区块渐入 + 条目错落；Contact 轻柔浮现
  - 博客列表: 文章卡片渐入、筛选反馈
  - 博客详情: 仅标题区书写显现 + 工具栏悬停；正文与评论区明确不动画
  - 关于: profile / 热力图 / 仓库区块渐入
  - 留言板: 弹幕节奏纳入规范，不重写
  - 全局组件: Header 下划线、Dialog、Message、Skeleton、BackHomeLink 统一节奏
  - 错误页: 404/error 轻柔浮现
- **已有资产**（打字机、Header 渐隐下划线、阅读进度条）: 纳入规范节奏，不重写
- **降级策略:**
  - `@media (prefers-reduced-motion: reduce)` 全站关闭动画
  - `@supports (animation-timeline: view())` 门控滚动渐入；不支持（Firefox）退化为直接显示，与阅读进度条降级哲学一致
  - 入场动画 ≤600ms 且位移克制，不延迟 LCP 主体
- **依赖关系:** 实施排在 refactor/20260824-P-homepage-hydration-slimming 合并之后（与区块结构解耦，不阻塞重构）

## 任务

- [ ] T1 设计: motion tokens 接入主题注入层，确认四主题下的应用方式
- [ ] T2 工具: Reveal 渐入模式（scroll-driven 封装）与书写显现模式（styled-components 侧）
- [ ] T3 切换: 启用 experimental.viewTransition，全局淡入淡出 350ms + reduced-motion 降级
- [ ] T4 首页落地: Hero 入场编排、Projects/Weread/Contact 滚动渐入与悬停
- [ ] T5 全站跟进: 博客列表、详情标题区、关于、全局组件按应用矩阵落地
- [ ] T6 验证: reduced-motion、Firefox 降级、LCP 不回归、四主题下动画正常

## 结果

（实施后回填：验证结论、LCP 影响、浏览器覆盖实测）
