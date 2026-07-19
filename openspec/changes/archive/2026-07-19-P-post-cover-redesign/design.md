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

# 博客详情页封面图体验设计

## 架构

封面配置继续使用现有 Issue 隐藏元数据约定，不新增第二种写作格式。同步层保存原始 Markdown 作为内容源；详情接口负责为前端生成不含隐藏元数据、且在首图回退时已去重的文章内容。前端只消费统一的 `metadata.cover` / `metadata.coverAlt`，根据断点调整同一个封面组件与文章头部的呈现顺序。

```
GitHub Issue
  └─ <!-- wuh-site-metadata: {"cover":"...","coverAlt":"..."} -->
       │
       ▼
SyncService ── parseIssueMetadata ──► MongoDB Content.metadata
       │                                      │
       │                                      ▼
       └─ 保留原始 body              ContentController 详情响应
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
              显式 cover：移除元数据                         无显式 cover：首图回退
              保留全部正文图片                             同时清理返回 body 与 bodyHtml
                         └─────────────────────┬─────────────────────┘
                                               ▼
                           Next.js 元数据 / PostView / PostCover
                                               │
                         ┌─────────────────────┴─────────────────────┐
                         ▼                                           ▼
                  移动端：封面在标题前                    桌面端：标题在前、封面在主栏
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Issue 元数据 | 复用 `<!-- wuh-site-metadata: {...} -->` JSON 注释 | 已被 `SyncService` 解析，GitHub 页面不显示，无需维护两套写作规范。 |
| 元数据清理 | 新增后端纯函数工具，分别解析和剥离元数据注释 | 防止隐藏配置进入页面正文和 SEO description，同时保持数据库原始 Issue 内容不变。 |
| 回退去重 | 后端在详情响应中同步清理 `body` 与 `bodyHtml` 的首张图 | Next.js 从 `body` 重新渲染 Markdown，单独清理 `bodyHtml` 会使首图重新出现。 |
| 响应式布局 | `PostLead` 聚合一个 `PostCover` 与 `PostHeader`，用 CSS `order` 切换顺序 | 同一封面节点只渲染一次，避免移动/桌面双节点下载与无障碍重复。 |
| 动效 | styled-components `keyframes` + `prefers-reduced-motion` | 不新增动画依赖，沿用当前样式与可访问性模式。 |

## 复用分析

| 组件 | import path | 决策 | 参考 demo |
|------|------------|------|-----------|
| Image | `@wuh.site/components/image` | 复用 | 现有 `PostCover` |
| PostHeader | `app/post/components/PostHeader.tsx` | 扩展布局位置，不改内部信息结构 | 现有详情页 |
| PostCover | `app/post/components/PostCover.tsx` | 扩展替代文本、优先加载和展示样式 | 现有详情页 |
| styled | `@wuh.site/components/styled` | 复用 | 现有 post styles |
| 封面/元数据工具 | 后端 `content` 模块 | 新建纯函数模块 | 无；需要独立单元测试覆盖解析和清理 |

**说明：**
- 复用 — 直接 import 现有组件，无需修改
- 扩展 — 现有组件基础上增加 props / 样式变体
- 新建 — 当前无可用组件，需要在 packages/components/ 下创建

## 数据模型（如涉及）

`Content.metadata` 与共享 `ContentItem.metadata` 增加可选字段：

```ts
type ContentMetadata = {
  cover?: string
  coverAlt?: string
  // existing fields: slug, summary, keywords, rssExcluded, extra
}
```

Issue 编写示例：

```md
<!-- wuh-site-metadata: {"cover":"https://cdn.wuh.site/covers/example.jpg","coverAlt":"夜间书桌上的笔记本电脑与台灯"} -->
```

解析规则：

1. 只匹配带 `wuh-site-metadata:` 前缀且 JSON 合法的 HTML 注释。
2. 非法 JSON 或普通 HTML 注释保持为正文，不阻断同步。
3. 响应中始终剥离匹配到的元数据注释。
4. `metadata.cover` 存在时视为显式封面，正文图片不做删除。
5. `metadata.cover` 缺失时，才推导正文第一张图片作为封面，并从响应 `body` 与 `bodyHtml` 删除同一张首图。

## API 设计（如涉及）

不新增 REST API。现有 `GET /content/posts/:slugOrNumber` 响应的 `metadata` 扩展为可选 `coverAlt`，并保证面向前端的 `body` 不包含隐藏元数据；字段保持向后兼容。

**响应示例:**

```json
{
  "number": 226,
  "body": "# 正文\n\n![内容图](https://cdn.wuh.site/content/example.jpg)",
  "metadata": {
    "cover": "https://cdn.wuh.site/covers/example.jpg",
    "coverAlt": "夜间书桌上的笔记本电脑与台灯"
  }
}
```

## 组件/模块设计

### `content-metadata.util`

负责从原始 Issue Markdown 中解析与移除 `wuh-site-metadata` 注释。该模块不访问数据库、不依赖 NestJS，方便测试同步和详情响应的边界行为。

### `content-cover.util`

扩展 `extractFirstImageAndClean` 的结果，使其同时提供清理后的 Markdown 与 HTML。仅当 controller 判定缺少显式封面时调用，确保显式封面与首张内容图可以共存。

### `ContentController`

在详情响应中执行统一的内容展示清理：先去掉隐藏元数据，再根据显式封面或首图回退决定是否删除正文首图。列表与数据库原始数据不受影响。

### `PostLead`、`PostCover` 与 `PostHeader`

`PostLead` 作为详情页的文章开场区域，持有一个 `PostCover` 和一个 `PostHeader`。移动端让封面排在标题之前；桌面端让标题、作者、摘要先出现，封面限制在主阅读栏内。`PostCover` 接收 `coverAlt ?? issue.title` 作为图片替代文本并使用优先加载。

封面样式限制：移动端使用 `clamp(220px, 60vw, 300px)` 的高度范围并突破页面水平内边距；桌面端保持横图展示、最大高度 360px。图片统一 `object-fit: cover`，并在加载完成后短暂淡入和回弹至原始缩放比例。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | `PostHeader` 位于封面前，封面在主阅读栏内；目录维持独立侧栏。 |
| < 768px | `PostCover` 位于标题、作者与摘要前，全宽呈现；目录继续使用现有折叠式移动目录。 |

所有断点下封面均不保留空白区域；未设置封面也找不到可回退首图时，文章直接从头部或正文开始。`prefers-reduced-motion: reduce` 下禁用封面自身入场动效。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；`coverAlt` 为可选字段，现有 Issue 不需迁移。
- **向后兼容:** 未显式配置封面的文章继续使用首图回退；旧客户端忽略新增 metadata 字段。
- **性能影响:** 使用单一封面节点避免重复下载；`priority` 仅作用于文章首屏封面。后端增加字符串级解析，开销相对 Markdown 渲染与数据库读取可忽略。
- **回滚:** 移除封面元数据清理和布局变动即可恢复首图回退行为；MongoDB 中新增可选字段不需要数据回滚。
