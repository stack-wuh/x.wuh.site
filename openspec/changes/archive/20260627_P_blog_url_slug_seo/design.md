# 设计文档

## 架构

路由结构不变，`/post/[number]` 路由保持不变。链接生成时将标题 slug 拼接到 number 后面，形成 `/post/123-标题slug` 格式。`page.tsx` 从 param 中提取数字部分。

```
首页 / HomeView         博客列表 / BlogListView
    │                        │
    └── /post/123-标题slug ◄─┘
              │
    page.tsx 解析 param → "123-标题slug".split("-")[0] → "123"
              │
              └── getIssue(123) → 后端 API 不变
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| Slug 生成 | 中文字符直接保留 | 中文 URL 在现代浏览器和搜索引擎中已成熟支持 |
| 路由变更 | 不动路由结构 | 最小改动，零破坏性 |
| 特殊字符处理 | 替换为 `-`，连续去重 | 保证 URL 整洁 |

## 组件/模块设计

### Slug 工具函数 `app/lib/slug.ts`

```ts
export function toSlug(title: string): string {
  return title
    .replace(/[#?&/\\]/g, '-')   // URL 敏感字符 → -
    .replace(/-+/g, '-')          // 连续 - 压缩
    .replace(/^-|-$/g, '')        // 去除首尾 -
}

export function buildPostUrl(number: number | string, title: string): string {
  return `/post/${number}-${toSlug(title)}`
}
```

### page.tsx 参数解析

```ts
const rawNumber = (await params).number
const number = rawNumber.split('-')[0]
```

### 链接生成

所有指向 `/post/${number}` 的链接统一使用 `buildPostUrl(post.number, post.title)`。

## 影响分析

- **新增依赖:** 无
- **破坏性变更:** 无（路由不变，`/post/123` 仍可访问）
- **向后兼容:** `/post/123` 仍正常渲染（param 提取第一个 `-` 前的数字）
- **性能影响:** slug 函数为纯字符串操作，零性能影响
