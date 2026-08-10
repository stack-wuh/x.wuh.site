# 首屏加载性能优化：LCP / FP

> 原始变更名：`2026-07-29-P-optimize-first-load`

## 元数据
- 日期：2026-07-29
- 类型：P
- 状态：proposed
- Issue：历史记录未提供

## 动机
主站关键页面的首屏 HTML 仍可能等待非首屏数据完成。首页使用 `force-dynamic` 并在返回页面前等待仓库、精选文章、年度总结和微信读书数据；文章详情页在正文数据之后同步获取相关文章。About 和 Blog 页面也缺少明确的首屏数据边界。虽然首页已有 `LazySection` 和部分动态导入，但它们主要延迟客户端渲染，不能消除服务端数据请求对 TTFB、FP、FCP 和 LCP 的影响。

最近的字体优化已改善跨平台字形、真实字重和字体 token 一致性。本次需求不重复进行字体架构迁移，只将字体请求、字体切换和 CLS 纳入首屏基线验证。

## 引用规范
- `specs/first-load-performance/spec.md`

## 决策
首屏数据按页面建立“必要数据优先、次要数据延后”的边界。服务端组件只等待形成首屏内容所需的数据；次要数据通过已有的客户端边界、动态导入或独立请求在首屏后加载。文章正文继续服务端渲染，避免以客户端 loading 换取表面上的首屏速度。

```text
请求页面
  ├─ 首屏必要数据
  │    └─ 服务端渲染 HTML → 浏览器绘制 Hero / 列表 / 正文
  └─ 非首屏数据
       └─ 延后请求或延后渲染 → 首屏后补齐内容

浏览器指标
  ├─ Lighthouse：移动端 FP/FCP/LCP/TTFB/CLS
  └─ RUM：按 pathname 聚合 P75
```

实施前先固定测试环境，记录四个关键页面的基线，包括服务端响应耗时、请求瀑布、FP/FCP/LCP/TTFB/CLS、LCP 元素、图片和字体请求。每项优化完成后复测，只有能改善阻塞路径且不破坏既有行为的改动才保留。

页面策略如下：

- **首页:** Hero 和当前确实属于首屏的内容优先；`getRepos`、`getYearlySummaries`、`getWereadBooks` 不再默认阻塞 Hero。精选文章是否属于首屏由基线和 LCP 元素确认。保留 `LazySection` 的稳定占位和空状态。
- **文章详情:** `getIssue`、正文渲染、标题和元数据优先返回；`getRelatedPosts` 在正文首屏之后请求或渲染。canonical redirect、metadata、正文服务端渲染和相关文章最终展示保持不变。
- **About:** profile 作为首屏主体；仓库、GitHub/站点活动热力图等次要内容延后，保留加载态、错误态、响应式网格和现有语义。
- **Blog:** 文章列表和分页主体优先；labels 是否延后由请求瀑布和交互需求决定。筛选、分页 URL、SEO metadata 和无数据状态保持不变。
- **客户端初始化:** 主题初始化脚本继续在首屏前执行以防止闪烁；检查 AppProviders、全局播放器和 TypewriterMotto 是否被 LCP 或 hydration 阻塞，Dialog 与 ContactCard 的现有延迟加载策略继续保留。

| 维度 | 选择 | 理由 |
|------|------|------|
| 首屏数据边界 | 服务端必要数据 + 首屏后延后数据 | 直接缩短 HTML 返回和首次绘制阻塞，保留 SEO |
| 次要内容加载 | 复用现有 `LazySection`、动态导入和客户端请求模式 | 减少新抽象，避免改变已有 UI 语义 |
| 文章正文 | 保持服务端渲染 | 正文是详情页核心内容，兼顾 SEO、可读性和稳定 LCP |
| 缓存策略 | 沿用各请求现有 `revalidate`，仅调整调用时机 | 不扩大缓存语义变化，降低回归风险 |
| 指标采集 | `useReportWebVitals` + pathname 上下文 | 复用现有基础设施，支持按页面观察真实用户 P75 |
| 字体处理 | 仅做 Network、`document.fonts.check()` 和 CLS 验证 | 最近字体架构已完成，本次不重复迁移 |
| 验收 | Lighthouse 移动端 + RUM P75 | 同时覆盖实验室回归和真实用户体验 |

## 任务
### Phase 1: 首屏性能基线
- [ ] **文件:** `openspec/changes/2026-07-29-P-optimize-first-load/`（基线记录）
- [ ] 固定移动端 Lighthouse 视口、网络、CPU、浏览器版本，并覆盖 `/`、`/blog`、`/post/[number]`、`/about`
- [ ] 记录 FP、FCP、LCP、TTFB、CLS、请求瀑布、传输量和实际 LCP 元素
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 每个页面有可复现的基线数据和 LCP 元素记录
- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`、`packages/wuh.site.next/app/HomeView.tsx`、`packages/components/analytics/WebVitals.tsx`
- [ ] 检查主题初始化、Provider、全局播放器、动态导入、动画、图片优先级和字体请求是否进入首屏阻塞路径
- [ ] 确认 Web Vitals 上报按 pathname 记录且不阻塞渲染
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 明确每个首屏候选元素的依赖和资源优先级
### Phase 2: 服务端首屏数据边界
- [ ] **文件:** `packages/wuh.site.next/app/page.tsx`、`packages/wuh.site.next/app/HomeView.tsx`
- [ ] 移除 repos、年度总结、微信读书等非首屏数据对 Hero HTML 返回的同步阻塞
- [ ] 复用或扩展已有 `LazySection`/动态加载边界，保留稳定占位、空状态、错误日志和最终内容
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 首页首屏 HTML 不等待非必要请求；功能、排序和主题无回归
- [ ] **文件:** `packages/wuh.site.next/app/post/[number]/page.tsx` 及相关文章展示组件
- [ ] 保持文章主体服务端渲染，将 `getRelatedPosts` 移出正文首屏同步路径
- [ ] 保留相关文章加载态、错误隔离、去重、排序和最多三篇语义
- [ ] **预计耗时:** 75 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 正文不等待相关文章；canonical、metadata、正文和相关内容回归通过
- [ ] **文件:** `packages/wuh.site.next/app/about/page.tsx`、`packages/wuh.site.next/app/AboutView.tsx`、`packages/wuh.site.next/app/blog/page.tsx`
- [ ] About 优先返回 profile，活动和仓库内容延后；Blog 优先返回文章列表，按基线决定 labels 是否延后
- [ ] 保留热力图稳定布局、错误态、分页、筛选、URL 同步和 SEO metadata
- [ ] **预计耗时:** 90 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 首屏主体不依赖次要数据；分页筛选和活动内容最终可用
### Phase 3: 资源与客户端路径优化
- [ ] **文件:** 由基线确认的页面组件和样式文件
- [ ] 仅针对实测 LCP 元素调整图片尺寸、优先级、响应式资源、字体加载或动态模块
- [ ] 保持图片语义角色、稳定尺寸和可访问性，不盲目增加 preload
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** LCP 资源提前可用且无布局跳动；Network 请求数和传输量有证据支持
- [ ] **文件:** `packages/wuh.site.next/app/layout.tsx`、`packages/components/themes/cssVariableProvider.tsx`、相关页面入口
- [ ] 验证字体请求、`document.fonts.check()`、字体切换和 CLS；确认主题防闪烁和客户端初始化没有回归
- [ ] 不重复修改已完成的字体架构，除非测量证明存在本次首屏问题
- [ ] **预计耗时:** 45 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 字体和主题验证结果记录完整，CLS 不因优化上升
### Phase 4: 双重指标验收
- [ ] **文件:** `packages/components/analytics/WebVitals.tsx`、提案基线记录
- [ ] 复测四个关键页面的移动端 FP/FCP/LCP/TTFB/CLS，并比较优化前后差异
- [ ] 核对真实用户 P75 能按 pathname 区分页面，记录样本量和观测窗口
- [ ] **预计耗时:** 60 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** Lighthouse FCP ≤ 1.8 秒、LCP ≤ 2.5 秒，或相对基线明确改善并记录限制
- [ ] 首页 Hero 不等待非首屏数据，延后内容仍有稳定占位、空状态和错误处理
- [ ] 文章正文不等待相关文章，正文服务端渲染和 SEO 行为保持不变
- [ ] About profile、Blog 文章列表优先可见，热力图、仓库、labels 等次要内容最终可用
- [ ] 主题防闪烁、图片语义、分页筛选、响应式布局和可访问性无回归
- [ ] Lighthouse 移动端 FP/FCP/LCP/TTFB/CLS 有优化前后对比记录
- [ ] 真实用户 Web Vitals P75 可按页面路径聚合
- [ ] `NODE_OPTIONS=--max-old-space-size=4096 ./node_modules/.bin/tsc --noEmit --pretty false` 零错误

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: optimize-first-load
date: 2026-07-29
type: P
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/296
```

### `design.md`
# 设计文档

## 架构

首屏数据按页面建立“必要数据优先、次要数据延后”的边界。服务端组件只等待形成首屏内容所需的数据；次要数据通过已有的客户端边界、动态导入或独立请求在首屏后加载。文章正文继续服务端渲染，避免以客户端 loading 换取表面上的首屏速度。

```text
请求页面
  ├─ 首屏必要数据
  │    └─ 服务端渲染 HTML → 浏览器绘制 Hero / 列表 / 正文
  └─ 非首屏数据
       └─ 延后请求或延后渲染 → 首屏后补齐内容

浏览器指标
  ├─ Lighthouse：移动端 FP/FCP/LCP/TTFB/CLS
  └─ RUM：按 pathname 聚合 P75
```

实施前先固定测试环境，记录四个关键页面的基线，包括服务端响应耗时、请求瀑布、FP/FCP/LCP/TTFB/CLS、LCP 元素、图片和字体请求。每项优化完成后复测，只有能改善阻塞路径且不破坏既有行为的改动才保留。

页面策略如下：

- **首页:** Hero 和当前确实属于首屏的内容优先；`getRepos`、`getYearlySummaries`、`getWereadBooks` 不再默认阻塞 Hero。精选文章是否属于首屏由基线和 LCP 元素确认。保留 `LazySection` 的稳定占位和空状态。
- **文章详情:** `getIssue`、正文渲染、标题和元数据优先返回；`getRelatedPosts` 在正文首屏之后请求或渲染。canonical redirect、metadata、正文服务端渲染和相关文章最终展示保持不变。
- **About:** profile 作为首屏主体；仓库、GitHub/站点活动热力图等次要内容延后，保留加载态、错误态、响应式网格和现有语义。
- **Blog:** 文章列表和分页主体优先；labels 是否延后由请求瀑布和交互需求决定。筛选、分页 URL、SEO metadata 和无数据状态保持不变。
- **客户端初始化:** 主题初始化脚本继续在首屏前执行以防止闪烁；检查 AppProviders、全局播放器和 TypewriterMotto 是否被 LCP 或 hydration 阻塞，Dialog 与 ContactCard 的现有延迟加载策略继续保留。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 首屏数据边界 | 服务端必要数据 + 首屏后延后数据 | 直接缩短 HTML 返回和首次绘制阻塞，保留 SEO |
| 次要内容加载 | 复用现有 `LazySection`、动态导入和客户端请求模式 | 减少新抽象，避免改变已有 UI 语义 |
| 文章正文 | 保持服务端渲染 | 正文是详情页核心内容，兼顾 SEO、可读性和稳定 LCP |
| 缓存策略 | 沿用各请求现有 `revalidate`，仅调整调用时机 | 不扩大缓存语义变化，降低回归风险 |
| 指标采集 | `useReportWebVitals` + pathname 上下文 | 复用现有基础设施，支持按页面观察真实用户 P75 |
| 字体处理 | 仅做 Network、`document.fonts.check()` 和 CLS 验证 | 最近字体架构已完成，本次不重复迁移 |
| 验收 | Lighthouse 移动端 + RUM P75 | 同时覆盖实验室回归和真实用户体验 |

## 数据模型（如涉及）

不涉及数据模型、DTO 或数据库 Schema 变更。

首屏延后数据的组件接口应优先复用现有数据类型；如必须增加状态，使用现有数据对象、加载态和错误态，不新增持久化字段。

## API 设计（如涉及）

不新增 API。继续使用现有首页、仓库、文章、活动和标签接口；改动仅限于调用时机、服务端/客户端边界和渲染顺序。

## 组件/模块设计

### 首屏基线与 LCP 识别

记录每个页面的实际 LCP 节点、其依赖的数据和资源。图片需核对尺寸、响应式 source、优先级和懒加载属性；文本 LCP 需核对字体请求、动态导入和动画延迟。基线记录与代码改动分开，避免用猜测替代测量。

### 首页首屏边界

调整 `app/page.tsx` 与 `HomeView.tsx` 的数据传递方式，使 Hero 不等待非首屏数据。延后内容必须有稳定占位、空状态和错误日志；首屏后内容仍能正常展示，不改变现有排序和数量语义。

### 文章主体与相关文章

保持 `getIssue` 返回的文章主体、相邻文章和 metadata 所需信息。将 `getRelatedPosts` 从正文首屏的同步路径移出，在正文展示后触发；加载失败只影响相关文章区域，不影响正文阅读。

### About 与 Blog 数据边界

About 先渲染 profile 主体，再加载仓库和活动内容；热力图保留现有稳定布局。Blog 先渲染文章列表，labels 若不属于初始可见内容则在首屏后补齐，但必须保留筛选控件可用状态、分页联动和 URL 同步。

### Web Vitals 上报

在现有 Web Vitals 回调中补充稳定的 pathname 或等价页面上下文，并确保上报逻辑仅在浏览器端异步执行，不增加首屏阻塞脚本。不得因采集失败影响页面渲染。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 保持现有桌面布局；优先验证首屏内容高度、封面/头像尺寸和热力图稳定性 |
| < 768px | 以移动端 Lighthouse 为主要实验室基线；避免首屏后内容回填造成布局跳动，保留移动端文章、筛选和热力图行为 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无意改变公开 API、URL、SEO、正文渲染和主题行为；延后加载可能改变次要内容出现时机。
- **向后兼容:** 保持现有数据类型、空状态、错误态、分页筛选、相关文章和活动模块的最终展示语义。
- **性能影响:** 预期减少首屏服务端等待和非必要 hydration，改善 TTFB、FP/FCP 和 LCP；延后数据请求可能使次要内容稍晚出现，但不应影响首屏阅读和交互。

### `proposal.md`
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

### `specs/first-load-performance/spec.md`
# Spec: 首屏加载性能

## ADDED Requirements

### Requirement: 首屏必要数据优先返回
服务端生成初始 HTML 时 SHALL 只等待形成首屏主体所需的数据；非首屏数据 SHALL NOT 无条件阻塞首屏 HTML 返回。
- **GIVEN** 用户访问首页、Blog、About 或文章详情页
- **WHEN** 服务端生成初始 HTML
- **THEN** 服务端生成初始 HTML 时，SHALL 只等待形成首屏主体所需的数据
- **AND** 非首屏数据 SHALL NOT 无条件阻塞首屏 HTML 返回

#### Scenario: 服务端返回首屏主体
- **GIVEN** 非首屏数据请求尚未完成
- **WHEN** 服务端生成页面 HTML
- **THEN** 首屏主体先返回，非首屏数据不阻塞响应

### Requirement: 首页非首屏内容延后加载
Hero 及确认属于首屏的内容 SHALL 优先展示；仓库、年度总结、微信读书和其他非首屏区块 MAY 在首屏后加载或渲染；延后区块 SHALL 保留稳定占位、空状态和错误日志。
- **GIVEN** 首页需要展示 Hero、精选内容、年度总结、微信读书和项目等区块
- **WHEN** 首页首屏 HTML 返回并开始绘制
- **THEN** Hero 及确认属于首屏的内容 SHALL 优先展示
- **AND** 仓库、年度总结、微信读书和其他非首屏区块 MAY 在首屏后加载或渲染
- **AND** 延后区块 SHALL 保留稳定占位、空状态和错误日志

#### Scenario: 首页首屏不等待次要区块
- **GIVEN** 仓库、年度总结或微信读书接口响应较慢
- **WHEN** 用户访问首页
- **THEN** Hero 和精选内容仍可先绘制
- **AND** 次要区块在请求完成后展示或显示对应状态

### Requirement: 文章正文不依赖相关文章
标题、元数据和正文 SHALL NOT 等待 `getRelatedPosts`；相关文章 SHALL 在正文首屏之后加载或渲染；相关文章失败 SHALL NOT 阻断正文阅读。
- **GIVEN** 文章主体已由 `getIssue` 获取并完成必要的正文渲染
- **WHEN** 服务端生成文章详情首屏
- **THEN** 标题、元数据和正文 SHALL NOT 等待 `getRelatedPosts`
- **AND** 相关文章 SHALL 在正文首屏之后加载或渲染
- **AND** 相关文章失败 SHALL NOT 阻断正文阅读

#### Scenario: 相关文章请求失败
- **GIVEN** 文章正文请求成功但相关文章请求失败
- **WHEN** 服务端生成文章详情页
- **THEN** 标题、元数据和正文正常返回
- **AND** 相关文章失败被隔离

### Requirement: About 首屏主体优先
profile 主体 SHALL 优先展示；仓库和活动数据 MAY 在首屏后加载；热力图 SHALL 继续提供稳定加载态、错误态和响应式布局。
- **GIVEN** About 页面同时需要 profile、仓库和活动热力图数据
- **WHEN** 页面生成初始 HTML
- **THEN** profile 主体 SHALL 优先展示
- **AND** 仓库和活动数据 MAY 在首屏后加载
- **AND** 热力图 SHALL 继续提供稳定加载态、错误态和响应式布局

#### Scenario: About 次要数据未就绪
- **GIVEN** profile 已获取但仓库或活动数据尚未返回
- **WHEN** 用户访问 About 页面
- **THEN** profile 主体先展示
- **AND** 热力图显示稳定加载态或错误态

### Requirement: Blog 列表主体优先
文章列表和分页主体 SHALL 优先展示；labels MAY 依据性能基线在首屏后加载；筛选、分页 URL 同步和 SEO metadata 行为 SHALL 保持不变。
- **GIVEN** Blog 页面同时需要文章列表和可用 labels
- **WHEN** 页面生成初始 HTML
- **THEN** 文章列表和分页主体 SHALL 优先展示
- **AND** labels MAY 依据性能基线在首屏后加载
- **AND** 筛选、分页 URL 同步和 SEO metadata 行为 SHALL 保持不变

#### Scenario: Blog labels 延迟返回
- **GIVEN** 文章列表请求已完成但 labels 请求尚未完成
- **WHEN** 用户访问 Blog 页面
- **THEN** 文章列表和分页先展示
- **AND** labels 控件随后加载且不阻塞文章阅读

### Requirement: LCP 元素和资源可测量
每个页面 SHALL 能识别实际 LCP 元素及其数据、图片、字体或客户端依赖；图片优先级、尺寸、字体请求和动态加载 SHALL 只依据测量结果调整。
- **GIVEN** 关键页面完成首屏结构调整
- **WHEN** 在固定的移动端实验室环境和真实浏览器中测量
- **THEN** 每个页面 SHALL 能识别实际 LCP 元素及其数据、图片、字体或客户端依赖
- **AND** 图片优先级、尺寸、字体请求和动态加载 SHALL 只依据测量结果调整

#### Scenario: 记录首屏指标
- **GIVEN** 页面在固定实验室环境中加载完成
- **WHEN** 运行性能测量
- **THEN** 记录 FP、FCP、LCP、TTFB、CLS、请求瀑布和实际 LCP 元素

### Requirement: 真实用户指标按页面聚合
指标 SHALL 包含可用于按 pathname 聚合的页面上下文；指标上报失败或延迟 SHALL NOT 阻塞页面渲染。
- **GIVEN** 浏览器执行现有 Web Vitals 上报逻辑
- **WHEN** 上报 FP、FCP、LCP、TTFB 或 CLS
- **THEN** 指标 SHALL 包含可用于按 pathname 聚合的页面上下文
- **AND** 指标上报失败或延迟 SHALL NOT 阻塞页面渲染

#### Scenario: Web Vitals 上报失败
- **GIVEN** 指标上报接口不可用或响应延迟
- **WHEN** 页面加载和绘制发生
- **THEN** 页面渲染继续进行
- **AND** 指标事件保留页面路径上下文供后续聚合

## MODIFIED Requirements

### Requirement: Homepage fetches data at runtime after production build
生产构建完成且用户访问首页时，首页 SHALL 仍在运行时获取必要数据，而不是依赖构建期快照；非首屏数据 MAY 在首屏主体返回后获取。
- **GIVEN** 生产构建已完成且用户访问首页
- **WHEN** 首页运行时获取数据
- **THEN** 首页 SHALL 仍在运行时获取必要数据，而不是依赖构建期快照
- **AND** 非首屏数据 MAY 在首屏主体返回后获取

#### Scenario: 生产运行时获取首页数据
- **GIVEN** 生产构建没有预取动态内容
- **WHEN** 用户访问首页
- **THEN** 必要数据在运行时请求
- **AND** 非首屏数据不要求构建阶段提供快照

### Requirement: Homepage logs server data fetch failures
首页首屏或延后数据请求失败时，服务端 SHALL 继续遵守既有错误日志约定；非首屏请求失败 SHALL NOT 使已返回的首屏主体不可用。
- **GIVEN** 首页首屏或延后数据请求失败
- **WHEN** 请求异常被捕获
- **THEN** 服务端 SHALL 继续遵守既有错误日志约定
- **AND** 非首屏请求失败 SHALL NOT 使已返回的首屏主体不可用

#### Scenario: 首页次要请求失败
- **GIVEN** 首页非首屏数据请求返回错误
- **WHEN** 错误被捕获
- **THEN** 服务端记录错误
- **AND** 首页首屏主体保持可用

### `tasks.md`
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
