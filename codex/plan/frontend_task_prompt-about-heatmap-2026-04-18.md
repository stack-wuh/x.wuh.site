# About 页面 + 多平台热力图需求（2026-04-18）

## 任务背景 / Background
- 现有站点首页、博客与色彩展示已经稳定运行，用户期待了解站长的创作节奏与多平台输出。
- 想在关于页中补充更丰富的个人简介+内容输出履历，让访问者快速掌握近期动态与产出能力。
- 希望以 GitHub 热力图为灵感，将多个平台的发布轨迹聚合进同一个视觉：GitHub（仓库、Issues、发布日志）、语雀（文档更新）、微信公众号（推文）等，以天为粒度呈现内容密度。

## 目标与范围 / Goals
- 必须完成：
  1. 设计关于页的结构与各模块内容（简介、关键指标、日志热力图、平台汇总、联系/社交），并写成需求文档。
  2. 热力图要模仿 GitHub 贡献图的视觉风格，日/周格子、颜色梯度、Hover tooltip、平台切换与时间窗口控制。
  3. 明确各平台的数据来源、聚合策略（按天汇总、不同平台权重、颜色映射）、缓存要求。
- 可选增强：
  1. 允许点击某天打开底层内容列表或者跳转到对应平台。
  2. 为热力图提供「平台权重」开关（展示总投稿数 vs 活跃天数）。
- 不在范围：
  1. 明确的 API 实现与后端接口（只需定义数据契约）。
  2. 平台内容的具体抓取脚本。

## 栏目与布局 / Layout
1. 顶部 Hero：
   - 稍短标题+副标题（例如“数据驱动的个人空间”、“输出所见即所得”）。
   - 小段介绍+CTA（比如“查看简历”、“联系我”）。
   - 简要展示关键指标卡片（最近30天发布总量、活跃平台数量、响应速度等）。
2. About 板块：
   - 左侧人像/图形 + 右侧文字（岗位/经历、擅长领域、最近的研究兴趣），用关键词标签。
   - 可展示近期的项目/成果（小卡片条列）。
3. 多平台热力图：
   - 模仿 GitHub 贡献图：7 行×N 周的格子，按日期排列。
   - 每个“格子”展示该日的合并贡献量（数值或等级）。基于总投稿次数生成四段颜色梯度，低频/高频区分。
   - 右侧/上方添加平台切换器（GitHub、语雀、微信、全部），切换后热力图只展示选定平台的贡献。
   - 可选时间窗口切换（最新 90 / 180 / 365 天）以及“仅高频日”筛选。
   - Tooltip：鼠标悬停显示“2026-03-10：3 条（GitHub 1 / 语雀 2）”，并可点击跳转到日详情卡片。
4. 日志列表区（可折叠）：
   - 选择某天后，展示该日的所有发布内容摘要（平台+标题+链接），按平台分组。
   - 默认只展开最近 7 天，提供“查看全部”按钮。
5. Platform Story / 为每个平台设定一段说明：
   - GitHub：贡献/仓库/博客
   - 语雀：文档/课程/知识库更新
   - 微信：公众号与系列文章。
   - 每段配 icon + 最后一次更新时间 + 典型链接。
6. 联系/Social：
   - 头像/名称/岗位 + contact info buttons（Email、LinkedIn、微信）
   - 可加“欢迎约聊” CTA，引导 to 预约/私信。

## 多平台热力图规格 / Heatmap Details
- 数据时间粒度：一日为一格，按照 ISO 周对齐（周一开始）。
- 聚合方式：
  1. GitHub：统计 Issues 发布、仓库 release、commit（若可用）并统一为“贡献事件”。
  2. 语雀：以 Doc/Notebooks 通过更新 API 返回的 UTC 更新时间为准；按 day 去重。
  3. 微信公众号：以最近一次爬取/导出的文章发布时间；默认每周更新一次数据。
  4. 每个平台输出数量按日累加，形成 `platform`, `date`, `count` 结构。
- 颜色映射：
  1. 0：透明/浅灰。
  2. 1：微绿，2：中绿，3+：深绿。
  3. 所有平台聚合时，用总体最大值动态调节分段。
- 数据契约：
  ```ts
  type Contribution = {
    date: string // YYYY-MM-DD
    platform: 'github' | 'yuque' | 'wechat'
    count: number
    title?: string[] // 该日的标题列表
    links?: string[]
  }
  type HeatmapResult = {
    contributions: Contribution[]
    range: { start: string; end: string }
  }
  ```
- 缓存策略：前端从 `fetch` 获取数据，`revalidate` 30 分钟即可；热力图部分应支持 SSR+ISR.

## 交互与视觉 / UX & Visual
- 基于主题变量的 light/dark 适配，热力图格子遵循深浅变化，并额外提供高亮边框用于 hover/focus。
- 触控友好：格子大小保持 14-16px，且在 mobile 上允许通过 tooltip/Popover 查看具体数据。
- 鼠标/键盘悬停时显示 tooltip + “查看详情”链接，focus 可用 Enter 激活。
- 也可将 heatmap 抽象成组件，複用 `@wuh.site/components` 的 Card + Grid。

## 技术栈约束 / Tech Stack
1. Next.js App Router（已存在 about 路由，可在 `packages/wuh.site.next/app/about` 补充或替换）。
2. 使用现有的 styled-components/主题体系。
3. 避免引入新依赖，尽量复用 `@wuh.site/components` 的 Card、Tag、Tooltip 等。

## 交付物 / Deliverables
- 设计文档：按照本文件结构确定模块、数据契约、 UX 动效、样式参考。
- 界面布局草图：可用 Markdown + ASCII 或表格描述各区块位置。
- 数据列表：热力图所需要的 `Contribution` 示例 + 可视化结构。

## 校验标准 / Validation
1. 其他开发者能根据文档理解 about 页模块、热力图规则与数据契约。
2. 设计考虑 responsive、主题切换、平台筛选的可行性。
3. 交互点（hover、filter、tooltip）在文档中有明确说明。

## 风险与依赖 / Dependencies & Risks
- 多平台数据整合依赖后端或爬虫支持（若不可用需列为 Blocker）。
- 微信公众号数据更新频率低，需明确与爬虫/导出负责人确认。
- 需确认 GitHub API 速率限制，采用 `fetch` + ISR 时注意 revalidate 策略。

## Pending Input
- 微信公众号内容更新的负责方案（定期导出/API）。
- 是否要支持热力图的「按平台 / 全部」上下文同步（例如切换平台后 timeline 同步）。
- 若需更多 platform，需定义新的 `Contribution` 结构。

## Assumptions
- 所有发布时间都可以按 UTC 归入对应日期。
- 站点已有 `about` 路由，布局扩展不会影响其他页面。
- 目前已有 `@wuh.site/components` 中的 Tooltip/Popover 可以满足互动需求。
