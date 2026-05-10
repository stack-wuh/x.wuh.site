# 设计文档

## 架构对比

### 之前

```
page.tsx (server) → PostView.tsx (client)
                       ├── marked.parse() → HTML
                       ├── useToc (DOMParser, 添加 heading id/anchor)
                       └── usePostImagePreview
                             ├── CDN highlight.js 加载 + highlightAll()
                             ├── 复制按钮注入
                             └── 图片预览收集
```

### 之后

```
page.tsx (server)
  ├── api.content.getPost() → 原始 markdown
  └── renderMarkdown() → HTML (unified pipeline, 含语法高亮)
        │
PostView.tsx (client)
  ├── 直接使用预渲染 HTML
  ├── useToc (DOMParser, 仅提取 TOC)
  └── usePostImagePreview
        ├── 复制按钮注入 (保留)
        └── 图片预览收集 (保留)
```

## unified pipeline

```
remark-parse → remark-gfm → remark-rehype → rehype-highlight → rehype-slug → rehype-autolink-headings → rehype-stringify
```

## 关键决策

- **服务端渲染**: unified 管道在 page.tsx 执行，不进入客户端 bundle
- **代码高亮主题**: `rehype-highlight` 输出 hljs 类名，CSS 变量控制配色，响应 `prefers-color-scheme`
- **TOC 保留客户端提取**: `rehype-slug` 负责 id，`useToc` 仅提取数据
- **锚点链接**: `rehype-autolink-headings` 在服务端生成

## 涉及文件

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `package.json` | 修改 | +unified 生态，-marked |
| `app/lib/markdown.ts` | 新增 | unified pipeline |
| `app/post/[number]/page.tsx` | 修改 | 服务端调用 renderMarkdown |
| `app/post/PostView.tsx` | 修改 | 移除 marked |
| `app/post/usePostImagePreview.ts` | 修改 | 移除 CDN highlight.js |
| `app/post/hooks/useToc.ts` | 修改 | 简化为仅提取 TOC |
| `app/post/styles/index.ts` | 修改 | 代码块主题配色 + hljs token |
