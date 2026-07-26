# SEO 内容发现与站内导航设计

## 架构

SEO 能力按“规范 URL → 可抓取入口 → 聚合页 → 结构化数据”组织：

```text
Content API
├─ 分页文章 ──► canonical post URLs ──► sitemap / archive
├─ 标签汇总 ──► canonical topic URLs ──► sitemap / topic pages
└─ 标签候选 ──► related-post selector ──► post detail links

Next.js server pages
├─ Metadata API：canonical、robots、title、description
├─ JSON-LD builders：WebSite、Person、BlogPosting、BreadcrumbList、CollectionPage、ItemList
└─ ISR：公开内容按小时重验证，不依赖用户 Cookie
```

文章编号继续作为内容查询键，标题 slug 只承担规范 URL 和可读性。非规范路径永久重定向至当前标题生成的 canonical URL。主题参数通过单一 URL 工具编码和解码，避免页面、sitemap 与链接生成规则分叉。

## 技术选型

- 使用 Next.js App Router Metadata API 输出 canonical、robots 和页面 metadata。
- 使用纯 TypeScript builder 生成 Schema.org JSON-LD，页面仅负责提供数据和渲染。
- 使用现有 Content API 的分页、单标签查询与标签汇总能力，不新增接口。
- 使用服务端组件获取公开内容并配置 `revalidate: 3600`。
- 相关文章使用纯函数完成排除当前文章、按编号去重、共享标签数与更新时间排序，最多返回三篇。

## 复用分析

- 复用 `buildPostUrl` 生成文章 canonical URL。
- 复用 Content API 的 `getPosts.server` 与 `getLabels.server`。
- 复用现有 `JsonLd` 渲染组件。
- 复用博客列表样式与文章详情 `PostView`，不建立新的通用组件包抽象。
- 已归档的“阅读余韵索引”继续作为相关文章表现层规范，本变更不覆盖其视觉契约。

## 影响分析

- `app/post/[number]/page.tsx` 不再依赖请求 Cookie，可由 ISR 缓存；非 canonical 路径会永久重定向。
- sitemap 必须分页读取全部 open 文章；任一页加载失败时显式失败，避免生成不完整索引。
- `/blog?labels=` 保留兼容但设为 noindex/follow，索引入口迁移至 `/topics/[label]`。
- 主题页与归档页均输出 canonical metadata 和 CollectionPage/ItemList JSON-LD。
- Alert 仅对外部链接设置新窗口与安全属性，站内主题链接保持同窗口导航。
- 不涉及数据库、DTO 或后端路由变更。

## 数据与接口

- 文章 sitemap 数据使用 `number`、`title`、`updatedAtGitHub`、`createdAtGitHub`。
- 相关文章候选使用 `number`、`title`、`labels`、`updatedAt` 和可选 `summary`。
- topic URL 采用 `/topics/<encodeURIComponent(label)>`。
- archive URL 固定为 `/archive`，内容按文章年份分组。
- 集合 JSON-LD 的 `ItemList` 条目使用 canonical 文章 URL，并按页面顺序从 1 递增。

## 回滚

- 主题页、归档页与结构化数据均为新增公开入口，可独立移除。
- canonical 重定向回滚时仍需保留旧数字 URL 的正常渲染能力。
- sitemap 变更可回退到上一个生成器，但不得输出调试页或 query 筛选 URL。
