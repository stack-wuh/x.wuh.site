# 任务清单

## Phase 1: 首屏性能基线

### Task 1: 建立关键页面实验室基线

- [ ] **文件:** `openspec/changes/2026-07-29-P-optimize-first-load/`（基线记录）
- [ ] 固定移动端 Lighthouse 视口、网络、CPU、浏览器版本，并覆盖 `/`、`/blog`、`/post/[number]`、`/about`
- [ ] 记录 FP、FCP、LCP、TTFB、CLS、请求瀑布、传输量和实际 LCP 元素
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 每个页面有可复现的基线数据和 LCP 元素记录

### Task 2: 核对首屏资源与客户端阻塞

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`、`packages/wuh.site.next/app/HomeView.tsx`、`packages/components/analytics/WebVitals.tsx`
- [ ] 检查主题初始化、Provider、全局播放器、动态导入、动画、图片优先级和字体请求是否进入首屏阻塞路径
- [ ] 确认 Web Vitals 上报按 pathname 记录且不阻塞渲染
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 明确每个首屏候选元素的依赖和资源优先级

## Phase 2: 服务端首屏数据边界

### Task 3: 拆分首页首屏与非首屏数据

- [ ] **文件:** `packages/wuh.site.next/app/page.tsx`、`packages/wuh.site.next/app/HomeView.tsx`
- [ ] 移除 repos、年度总结、微信读书等非首屏数据对 Hero HTML 返回的同步阻塞
- [ ] 复用或扩展已有 `LazySection`/动态加载边界，保留稳定占位、空状态、错误日志和最终内容
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 首页首屏 HTML 不等待非必要请求；功能、排序和主题无回归

### Task 4: 解耦文章正文与相关文章

- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx` 及相关文章展示组件
- [ ] 保持文章主体服务端渲染，将 `getRelatedPosts` 移出正文首屏同步路径
- [ ] 保留相关文章加载态、错误隔离、去重、排序和最多三篇语义
- [ ] **预计耗时:** 75 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 正文不等待相关文章；canonical、metadata、正文和相关内容回归通过

### Task 5: 建立 About / Blog 首屏数据边界

- [ ] **文件:** `packages/wuh.site.next/app/about/page.tsx`、`packages/wuh.site.next/app/AboutView.tsx`、`packages/wuh.site.next/app/blog/page.tsx`
- [ ] About 优先返回 profile，活动和仓库内容延后；Blog 优先返回文章列表，按基线决定 labels 是否延后
- [ ] 保留热力图稳定布局、错误态、分页、筛选、URL 同步和 SEO metadata
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 首屏主体不依赖次要数据；分页筛选和活动内容最终可用

## Phase 3: 资源与客户端路径优化

### Task 6: 按实测 LCP 元素优化资源优先级

- [ ] **文件:** 由基线确认的页面组件和样式文件
- [ ] 仅针对实测 LCP 元素调整图片尺寸、优先级、响应式资源、字体加载或动态模块
- [ ] 保持图片语义角色、稳定尺寸和可访问性，不盲目增加 preload
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** LCP 资源提前可用且无布局跳动；Network 请求数和传输量有证据支持

### Task 7: 验证字体与客户端初始化回归

- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`、`packages/components/themes/cssVariableProvider.tsx`、相关页面入口
- [ ] 验证字体请求、`document.fonts.check()`、字体切换和 CLS；确认主题防闪烁和客户端初始化没有回归
- [ ] 不重复修改已完成的字体架构，除非测量证明存在本次首屏问题
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 字体和主题验证结果记录完整，CLS 不因优化上升

## Phase 4: 双重指标验收

### Task 8: 复测 Lighthouse 与真实用户指标

- [ ] **文件:** `packages/components/analytics/WebVitals.tsx`、提案基线记录
- [ ] 复测四个关键页面的移动端 FP/FCP/LCP/TTFB/CLS，并比较优化前后差异
- [ ] 核对真实用户 P75 能按 pathname 区分页面，记录样本量和观测窗口
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** Lighthouse FCP ≤ 1.8 秒、LCP ≤ 2.5 秒，或相对基线明确改善并记录限制

## 验收

- [ ] 首页 Hero 不等待非首屏数据，延后内容仍有稳定占位、空状态和错误处理
- [ ] 文章正文不等待相关文章，正文服务端渲染和 SEO 行为保持不变
- [ ] About profile、Blog 文章列表优先可见，热力图、仓库、labels 等次要内容最终可用
- [ ] 主题防闪烁、图片语义、分页筛选、响应式布局和可访问性无回归
- [ ] Lighthouse 移动端 FP/FCP/LCP/TTFB/CLS 有优化前后对比记录
- [ ] 真实用户 Web Vitals P75 可按页面路径聚合
- [ ] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误
