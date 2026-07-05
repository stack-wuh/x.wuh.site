# 设计文档

## 架构

本需求采用“服务端推导 + 前端展示”的方式。内容详情接口负责在返回文章前补齐封面 URL，前端不再解析正文，只消费 `issue.metadata.cover`。

```
GitHub Issue / MongoDB Content
          |
          v
ContentService.findBySlugOrNumber()
          |
          v
ContentController.getPostDetail()
          |
          v
buildPostDetailResponse()
  - 保留 metadata.cover
  - 否则从 bodyHtml 第一张 img 提取
  - 再否则从 body Markdown 第一张图提取
          |
          v
PostView
  - PostHeader 渲染标题/作者/摘要
  - PostCover 渲染封面图并在 onError 后隐藏
  - MarkdownBody 正文保持原样
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 封面来源 | 复用 `metadata.cover` | 现有契约已表达封面语义，避免新增字段和前后端映射成本 |
| 推导位置 | 详情接口响应层 | 旧文章无需回填即可生效，避免把自动推导值写入数据库污染手动配置 |
| 提取顺序 | `metadata.cover` > `bodyHtml` 首图 > `body` Markdown 首图 | 手动配置优先，HTML 更接近实际渲染结果，Markdown 作为兜底 |
| 图片失败处理 | 前端 `onError` 隐藏组件 | 图片可用性依赖远端资源，客户端最适合处理加载失败 |

## 数据模型（如涉及）

不新增字段，继续使用现有契约：

```ts
metadata?: {
  slug?: string
  summary?: string
  cover?: string
  keywords?: string[]
  rssExcluded?: boolean
  extra?: Record<string, unknown>
}
```

响应层需要保证：当 `metadata.cover` 原本不存在但正文可提取第一张图片时，返回值中的 `metadata.cover` 为该图片 URL；数据库中的原始 `metadata` 不被修改。

## API 设计（如涉及）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/content/posts/:slugOrNumber` | 返回文章详情，`metadata.cover` 可能由服务端从正文首图推导 |

**响应示例:**

```json
{
  "number": 155,
  "title": "一篇有图片的文章",
  "metadata": {
    "summary": "文章摘要",
    "cover": "https://example.com/cover.png"
  },
  "bodyHtml": "<p><img src=\"https://example.com/cover.png\" /></p>",
  "prev": null,
  "next": null,
  "total": 1,
  "position": 1
}
```

## 组件/模块设计

### `extractFirstImageUrl`

负责从内容中提取首张图片 URL。建议作为纯函数放在内容模块附近，便于单元测试。

- 输入：`bodyHtml?: string | null`、`body?: string | null`
- 输出：`string | undefined`
- 行为：优先解析 HTML `<img src="...">`；如果没有命中，再解析 Markdown 图片语法 `![alt](url)`。
- 约束：只返回 URL，不校验远程资源是否可访问。

### 详情响应组装

`ContentController.getPostDetail()` 当前直接返回 `result.toJSON()`。本次引入响应组装逻辑：

- 将 Mongoose 文档转为 plain object。
- 复制并补齐 `metadata`，避免修改原文档对象。
- 保留已有 `liked`、`prev`、`next`、`total`、`position` 字段。

### `PostHeader`

只负责文章标题、作者、日期、阅读数、摘要和装饰分隔线，不再渲染封面图。

### `PostCover`

新增或拆分一个轻量客户端组件，职责单一：

- 接收 `src` 和 `alt`。
- 无 `src` 时不渲染。
- 图片 `onError` 后设置本地隐藏状态，不渲染封面区域。
- 放置在 `PostHeader` 之后、`ArticleCard` 之前。

## 响应式策略（如涉及）

| 断点 | 行为 |
|------|------|
| >= 768px | 封面图在主内容列内完整展示，保持圆角和最大宽度，不超过文章卡片宽度 |
| < 768px | 封面图跟随主内容列宽度缩放，避免横向滚动 |

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；`metadata.cover` 是既有可选字段。
- **向后兼容:** 没有正文图片的文章返回行为保持等价；已有手动 `metadata.cover` 优先级不变。
- **性能影响:** 每次详情响应会做一次轻量字符串匹配；仅针对单篇文章，影响可忽略。
