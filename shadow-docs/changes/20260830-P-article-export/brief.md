---
{
  "schema": "shadow-dev/v1",
  "name": "20260830-P-article-export",
  "type": "feature",
  "scope": "site",
  "status": "completed",
  "baseBranch": "main",
  "files": [
    "apps/site/app/api/image-proxy/route.ts",
    "apps/site/app/post/components/ArticleExporter/index.tsx",
    "apps/site/app/post/components/ArticleExporter/styles.ts",
    "apps/site/app/post/components/ArticleExporter/specs.tsx",
    "apps/site/app/post/PostView/index.tsx",
    "packages/components/icons/article.tsx",
    "packages/components/icons/share-image.tsx",
    "packages/components/icons/index.tsx"
  ],
  "workflow": {
    "checkpoint": "completed",
    "updatedAt": "2026-08-30"
  }
}
---

# 文章导出功能

## 动机

博客文章支持导出为长图，方便分享到社交媒体。需要：
1. 保持原有的分享图功能（ShareCard）
2. 新增全文导出功能（ArticleExporter），将整篇文章渲染为 PNG 长图

## 技术决策

### 导出方案
- 使用 `html-to-image` 库（`toBlob` API），将 DOM 元素转换为 PNG
- 导出容器通过 `createPortal` 渲染到 `document.body`，避免 Dialog 的 `transform` 属性干扰 `position: fixed` 定位

### 图片 CORS 问题
- 博客图片存储在 `cdn.wuh.site`，浏览器 CORS 限制导致 canvas 无法绘制跨域图片（tainted canvas）
- **解决方案**：创建 `/api/image-proxy` API 路由，服务端代理获取图片并添加 `Access-Control-Allow-Origin: *` 头
- 导出前将所有 `img[src]` 替换为代理 URL（`/api/image-proxy?url=...`），导出后在 `finally` 块中恢复原始 `src`

### 容器定位
- 导出容器需要有正确的 `clientHeight`/`scrollHeight`（否则导出空白图）
- 使用 `opacity: 0; width: 1px; height: 1px; overflow: hidden` 的包裹 div 隐藏容器，同时保持渲染尺寸正确

### 导出内容
- 导出头：标题、作者头像、作者名、发布日期、摘要
- 导出体：文章正文（Markdown HTML）
- 导出尾：二维码、文章 URL、站点标识

## 实现文件

| 文件 | 说明 |
|------|------|
| `apps/site/app/api/image-proxy/route.ts` | 图片代理 API，服务端 fetch CDN 图片 + CORS 头 |
| `apps/site/app/post/components/ArticleExporter/index.tsx` | 导出组件主逻辑 |
| `apps/site/app/post/components/ArticleExporter/styles.ts` | 导出组件样式 |
| `apps/site/app/post/components/ArticleExporter/specs.tsx` | 导出组件规格（尺寸、间距） |
| `apps/site/app/post/PostView/index.tsx` | 集成导出入口（分享菜单 → 导出全文） |
| `packages/components/icons/article.tsx` | 文章图标 |
| `packages/components/icons/share-image.tsx` | 分享图图标 |

## 测试验证

- [x] `pnpm --filter @wuh.site/site run lint` — 0 errors
- [x] `npx tsc --noEmit` — 0 errors
- [x] 图片代理 `curl` 返回 200 + 正确 content-type
- [ ] 浏览器测试：导出长图包含封面图和文章图片

## 知识评估

- 新增 `image-proxy.md`：说明图片代理的用途和实现
- 更新 `blog-detail.md`：新增导出功能说明
