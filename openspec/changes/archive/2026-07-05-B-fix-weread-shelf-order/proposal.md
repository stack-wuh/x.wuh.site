# 修复微信读书书架顺序与首页在读展示

## 背景

首页微信读书模块当前请求 `page=5&limit=6`，不会展示微信读书书架里的前 6 本书。后端 `GET /weread/books` 目前按 `readUpdateTime` 倒序返回，导致 `/weread` 页面展示的是最近阅读顺序，而不是微信读书“我的书架”顺序。

使用 WeRead `/shelf/sync` 对比后，接口 `books[]` 的原始列表顺序与当前后端 `readUpdateTime` 排序结果明显不同；当前实现会把最近阅读的书提前，破坏用户在微信读书书架中的排序语义。

## 目标

- `/weread` 页面按微信读书书架顺序展示书籍，并保持分页稳定。
- 首页微信读书模块展示微信读书书架顺序中“在读”的前 6 本。
- 后端同步时持久化书架顺序，避免查询阶段依赖 `readUpdateTime` 推断排序。

## 非目标（明确不做）

- 不展示专辑/有声书和文章收藏入口；本次只处理现有电子书 `books[]`。
- 不调整微信读书页面的视觉布局、分页组件样式或文案。
- 不改变同步入口的鉴权方式和 WeRead API 调用方式。

## 影响范围

- `packages/wuh.site.nest/src/modules/weread/schemas/weread.schema.ts` — 增加书架顺序字段。
- `packages/wuh.site.nest/src/modules/weread/weread.service.ts` — 同步时保存顺序，查询时按书架顺序排序，并支持在读过滤。
- `packages/wuh.site.nest/src/modules/weread/weread.controller.ts` — 如需新增查询参数，补充 API 参数解析。
- `packages/wuh.site.nest/src/modules/api-v2/api-v2.service.ts` — 补充接口清单中的在读过滤参数。
- `packages/wuh.site.nest/src/modules/weread/weread.service.spec.ts` — 覆盖同步顺序、默认排序与在读过滤。
- `packages/wuh.site.next/app/page.tsx` — 首页请求第一页在读书籍，不再请求第 5 页。
- `packages/shared-contracts/src/index.ts` — 如共享类型需要暴露顺序字段，补齐 DTO 类型。
