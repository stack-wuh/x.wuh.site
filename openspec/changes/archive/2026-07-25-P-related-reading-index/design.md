---
artifact: design
contractVersion: 1
requiredHeadings:
  - 架构
  - 技术选型
  - 复用分析
  - 影响分析
requiredPatterns:
  - '^# .+'
---

# 阅读余韵索引设计文档

## 架构

本次变更仅替换文章详情页中 `relatedPosts` 的表现层。服务端仍以标签查询候选、按共享标签和时间排序、去重后最多保留三篇；页面继续在 `ArticleCard` 后、版权信息前渲染模块。

```text
getRelatedPosts / selectRelatedPosts（保持不变）
                    │
                    ▼
PostView.relatedPosts
                    │
                    ▼
RelatedPostsSection
├─ RelatedPostsHeader（继续阅读 + 数量 + 菱形分隔）
└─ RelatedPostLink × 1..3
   ├─ RelatedPostIndex（01–03）
   ├─ RelatedPostContent
   │  ├─ RelatedPostTitle
   │  ├─ RelatedPostSummary（可选）
   │  └─ RelatedPostLabels
   └─ RelatedPostArrow（aria-hidden）
```

每项保持单一链接语义：标题、摘要、标签和箭头均属于同一个可点击目标。无摘要时不渲染摘要节点，避免占位留白。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 样式承载 | styled-components 与现有 post 样式模块 | 保持项目样式架构和主题变量解析方式一致。 |
| 视觉语言 | 编辑型索引、细分隔线、序号、低强调标签文本 | 贴合文章详情页的纸张感和衬线阅读节奏，避免产品卡片语言。 |
| 布局 | CSS Grid：序号 / 弹性内容 / 箭头 | 桌面与窄屏均能稳定保留阅读索引层级。 |
| 摘要 | 复用 `RelatedPost.summary`，CSS 两行截断 | 无需 API 或类型扩展，可提高继续阅读判断效率。 |
| 动效 | 仅箭头 160–200ms 色彩/3px 位移 | ui-ux-pro-max 建议减少同屏动效；不干扰阅读。 |
| 无障碍 | 整项链接、focus-visible、reduced-motion、44px 触达 | 支持键盘、触屏与减少动态偏好。 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| `PostView` | `packages/wuh.site.next/app/post/PostView.tsx` | 扩展 | 文章正文后模块组织方式 |
| `RelatedPost` 数据类型 | `packages/wuh.site.next/app/lib/related-posts.ts` | 复用 | 已含 `summary` 与 `sharedLabels` |
| `buildPostUrl` | `packages/wuh.site.next/app/lib/slug.ts` | 复用 | 维持 canonical 站内内链 |
| post 样式导出 | `packages/wuh.site.next/app/post/styles/index.ts` | 扩展 | 新增索引表现层导出 |
| post 样式模块 | `packages/wuh.site.next/app/post/styles/post-article.ts` | 扩展 | 复用主题 token 与文章布局上下文 |

**说明：**
- 复用 — 不修改数据选择、URL 生成或主题系统。
- 扩展 — 仅增加相关文章表现层样式与 JSX 结构。
- 新建 — 不在 `packages/components` 中新增通用组件；该模块是文章详情页专属场景。

## 数据模型（如涉及）

不新增 DTO、Schema 或接口。复用现有 `RelatedPost`：

```ts
type RelatedPost = {
  number: number
  title: string
  labels: string[]
  updatedAt: string
  summary?: string | null
  sharedLabels: string[]
}
```

`summary` 为空、仅空白或不存在时不渲染摘要区域；`sharedLabels` 最多显示两个，并格式化为 `#标签一 · #标签二`。

## API 设计（如涉及）

本变更不涉及 API、请求参数或响应格式变更。

## 组件/模块设计

### RelatedPostsSection

职责：提供正文后阅读延伸的语义 section 与装饰分隔。无外层背景、阴影、圆角容器或 hover 抬升。

### RelatedPostsHeader

职责：显示“继续阅读”、相关文章数量和 CSS 菱形分隔。标题采用 `--font-serif`；数量采用 `--text-muted`，不承担唯一语义。

### RelatedPostLink

职责：作为单一链接承载项目所有内容。使用三列 grid；`aria-label` 为“继续阅读：{title}”。Hover 仅改变标题和箭头颜色并使箭头右移 3px；focus-visible 覆盖整项。

### RelatedPostContent

职责：容纳标题、可选摘要与标签。标题单行截断，摘要两行截断，标签允许在窄屏换行。

### RelatedPostIndex / RelatedPostArrow

职责：分别提供索引节奏和方向暗示。箭头使用文本或 CSS 图形且 `aria-hidden="true"`，不增加单独焦点目标。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| > 640px | 三列 grid，标题计数同一行，标签与摘要位于内容列。 |
| ≤ 640px | 计数自然换行；序号、内容、箭头保留；内容列最小宽度为 0 以避免溢出。 |
| ≤ 420px | 单项最小高度 44px；摘要最多两行；标签可换行；不产生横向滚动。 |
| `prefers-reduced-motion: reduce` | 移除箭头 transform transition，保留颜色和焦点反馈。 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；数据选择、链接和 section 出现条件保持不变。
- **向后兼容:** `RelatedPost.summary` 已为可选字段；缺失时降级为标题与标签索引。
- **性能影响:** 仅增加少量静态 DOM 和 CSS；不新增请求、图片或客户端状态。
- **视觉验收:** 使用 `--font-serif`、`--text-*`、`--primary-color`、`--accent-color`、`--space-*`；无 raw hex、新字体、外层卡片、阴影和抬升动效。
- **回滚:** 可仅回滚 `PostView.tsx` 与 post-article 样式改动，数据层不受影响。
