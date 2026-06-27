# RSS 修复 + 前端订阅入口

## 背景

RSS 模块已存在（`/v2/rss.xml`），但有两处 Bug + 前端没有入口：

1. 链接格式是 `/posts/slug` 而不是当前的 `/post/123-标题slug`
2. 没过滤 `state`，可能输出 closed issue

## 目标

- 修复链接格式、加 state 过滤
- 前端 `<head>` 加 RSS `<link>` 标签（搜索引擎和 RSS 阅读器自动发现）
- footer 加 RSS 订阅入口

## 非目标

- 不新增定时同步
- 不新增依赖

## 影响范围

- `packages/wuh.site.nest/src/modules/rss/rss.service.ts` — 修复链接 + state 过滤
- `packages/wuh.site.next/app/layout.tsx` — <head> RSS <link>
- `packages/components/layout/footer.tsx` — RSS 订阅入口
