# 修复微信读书书架顺序与首页在读展示

> 原始变更名：`2026-07-05-B-fix-weread-shelf-order`

## 元数据
- 日期：2026-07-05
- 类型：B
- 状态：proposed
- Issue：历史记录未提供

## 动机
首页微信读书模块当前请求 `page=5&limit=6`，不会展示微信读书书架里的前 6 本书。后端 `GET /weread/books` 目前按 `readUpdateTime` 倒序返回，导致 `/weread` 页面展示的是最近阅读顺序，而不是微信读书“我的书架”顺序。

使用 WeRead `/shelf/sync` 对比后，接口 `books[]` 的原始列表顺序与当前后端 `readUpdateTime` 排序结果明显不同；当前实现会把最近阅读的书提前，破坏用户在微信读书书架中的排序语义。

## 引用规范
- `specs/weread-shelf-order/spec.md`

## 决策
同步阶段把 WeRead `/shelf/sync` 返回的 `books[]` 数组下标固化为后端数据字段，查询阶段以这个字段作为默认排序依据。首页通过后端过滤在读书籍后取前 6 本，微信读书页面继续使用分页接口，但默认顺序改为书架顺序。WeRead 网关当前要求 `skill_version=1.0.4`，同步请求需要同步升级，避免返回升级提示导致同步不到书籍。

```
WeRead /shelf/sync
  -> books[] 原始顺序
  -> syncBooks 写入 shelfIndex
  -> getBooks 按 shelfIndex ASC 分页
  -> /weread 页面保持书架顺序
  -> 首页请求 finishReading=0 & limit=6
```

| 维度 | 选择 | 理由 |
|------|------|------|
| 排序来源 | WeRead `books[]` 原始数组下标 | 当前可获取的最直接书架顺序来源，避免用最近阅读时间误判 |
| 持久化字段 | `shelfIndex: number` | 简单稳定，适合 MongoDB 排序和分页 |
| 首页在读筛选 | 后端查询参数 `finishReading=0` | 避免前端只拿第一页后再过滤导致不足 6 本 |
| WeRead skill version | `1.0.4` | 与网关当前要求一致，保证同步接口可继续返回书架数据 |

## 任务
### Phase 1: 后端排序与筛选
- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/schemas/weread.schema.ts`
- [x] 为 `WereadBook` 增加 `shelfIndex` 字段和 Swagger 装饰器
- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/weread.service.ts`
- [x] 在 `syncBooks()` 映射 `books[]` 时写入数组下标
- [ ] **预计耗时:** 0.5h
- [x] **实际耗时:** 0.4h
- [x] **验证:** `./packages/wuh.site.nest/node_modules/.bin/jest --config packages/wuh.site.nest/jest.config.cjs packages/wuh.site.nest/src/modules/weread/weread.service.spec.ts --runInBand --detectOpenHandles`
- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/weread.service.ts`
- [x] 将默认排序从 `readUpdateTime` 倒序改为 `shelfIndex` 升序，并保留兜底排序
- [x] 支持可选 `finishReading` 过滤
- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/weread.controller.ts`
- [x] 增加可选 `finishReading` 查询参数解析
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/api-v2.service.ts`
- [x] 补充 API 文档中的 `finishReading` 查询参数
- [ ] **预计耗时:** 1h
- [x] **实际耗时:** 0.6h
- [x] **验证:** 单元测试覆盖默认排序、在读过滤和分页总数
### Phase 2: 前端数据请求
- [ ] **文件:** `packages/wuh.site.next/app/page.tsx`
- [x] 将微信读书请求改为 `page=1&limit=6&finishReading=0`
- [x] 确保首页展示顺序与接口返回顺序一致
- [ ] **预计耗时:** 0.25h
- [x] **实际耗时:** 0.1h
- [x] **验证:** 首页请求参数改为在读前 6 本
- [ ] **文件:** `packages/shared-contracts/src/index.ts`
- [x] 如前端需要使用 `shelfIndex`，补齐 `WereadBook` 类型字段
- [ ] **预计耗时:** 0.25h
- [x] **实际耗时:** 0.1h
- [x] **验证:** 后端构建通过；全局 `tsc --noEmit` 在当前 worktree 环境中 SIGSEGV，需在完整依赖环境复验
- [x] `/weread` 页面第一页顺序与 WeRead `/shelf/sync` 返回的 `books[]` 原始顺序一致
- [x] `/weread` 翻页时顺序稳定，不再按最近阅读时间重排
- [x] 首页微信读书模块展示书架顺序中 `finishReading=0` 的前 6 本
- [x] 已读完书籍不会占用首页微信读书模块名额
- [ ] `pnpm exec tsc --noEmit` 零错误

## 结果
- 状态：proposed
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: 2026-07-05-B-fix-weread-shelf-order
date: 2026-07-05
type: B
status: proposed
issue: https://github.com/stack-wuh/x.wuh.site/issues/187
```

### `design.md`
# 设计文档

## 架构

同步阶段把 WeRead `/shelf/sync` 返回的 `books[]` 数组下标固化为后端数据字段，查询阶段以这个字段作为默认排序依据。首页通过后端过滤在读书籍后取前 6 本，微信读书页面继续使用分页接口，但默认顺序改为书架顺序。WeRead 网关当前要求 `skill_version=1.0.4`，同步请求需要同步升级，避免返回升级提示导致同步不到书籍。

```
WeRead /shelf/sync
  -> books[] 原始顺序
  -> syncBooks 写入 shelfIndex
  -> getBooks 按 shelfIndex ASC 分页
  -> /weread 页面保持书架顺序
  -> 首页请求 finishReading=0 & limit=6
```

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 排序来源 | WeRead `books[]` 原始数组下标 | 当前可获取的最直接书架顺序来源，避免用最近阅读时间误判 |
| 持久化字段 | `shelfIndex: number` | 简单稳定，适合 MongoDB 排序和分页 |
| 首页在读筛选 | 后端查询参数 `finishReading=0` | 避免前端只拿第一页后再过滤导致不足 6 本 |
| WeRead skill version | `1.0.4` | 与网关当前要求一致，保证同步接口可继续返回书架数据 |

## 数据模型（如涉及）

`WereadBook` schema 新增：

```ts
shelfIndex: number
```

同步时按 `books.map((book, index) => ...)` 写入 `shelfIndex: index`。旧数据在下一次同步前可能没有该字段，查询排序应提供兼容兜底，例如按 `shelfIndex` 升序后再用 `readUpdateTime` 倒序作为次级排序。

## API 设计（如涉及）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/weread/books` | 默认按书架顺序分页返回 |
| GET | `/weread/books?finishReading=0` | 仅返回在读书籍，用于首页前 6 本 |

**请求示例:**

```json
{
  "page": "1",
  "limit": "6",
  "finishReading": "0"
}
```

**响应示例:**

```json
{
  "data": [
    {
      "bookId": "string",
      "title": "string",
      "finishReading": 0,
      "shelfIndex": 0
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 42,
    "totalPages": 7
  }
}
```

## 组件/模块设计

### WereadService

负责同步和查询的排序语义。`syncBooks()` 保存 `shelfIndex`；`getBooks()` 构造可选过滤条件，默认按 `shelfIndex` 升序返回，并保持现有分页响应结构。

### WereadController

保留现有 `page`、`limit` 查询参数，新增可选 `finishReading` 参数。参数值只接受 `0` 或 `1`，无效值按“不筛选”处理或返回明确错误，具体实现遵循现有 controller 风格。

### 首页数据获取

`app/page.tsx` 的 `getWereadBooks()` 请求 `page=1&limit=6&finishReading=0`，确保首页只显示书架顺序中的前 6 本在读书。

### 微信读书页面

`app/weread/page.tsx` 不需要新增 UI 控件；继续请求分页接口，由后端保证返回顺序与书架一致。

## 响应式策略（如涉及）

不涉及布局变更，保持现有首页和 `/weread` 页面响应式行为。

## 影响分析

- **新增依赖:** 无。
- **破坏性变更:** 无；接口响应保持分页结构，新增字段向后兼容。
- **向后兼容:** 旧数据缺少 `shelfIndex` 时允许通过下一次同步修复，查询排序提供兜底。
- **性能影响:** `shelfIndex` 排序可通过 MongoDB 普通字段排序完成；数据量较小，影响可忽略。后续如书架规模扩大，可补充索引。

### `proposal.md`
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

### `specs/weread-shelf-order/spec.md`
# Spec: 微信读书书架顺序

## ADDED

### Requirement: 微信读书页面保持书架顺序
- **GIVEN** 后端已从 WeRead `/shelf/sync` 同步 `books[]` 书籍列表
- **WHEN** 用户访问 `/weread` 页面并请求任意分页
- **THEN** 页面应按 WeRead `books[]` 原始列表顺序展示书籍
- **AND** 分页切换不应按最近阅读时间重新排序

### Requirement: 首页展示在读前 6 本
- **GIVEN** WeRead 书架中存在至少 6 本 `finishReading=0` 的书籍
- **WHEN** 用户访问首页微信读书模块
- **THEN** 模块应展示 WeRead 书架顺序中前 6 本在读书籍
- **AND** `finishReading=1` 的已读完书籍不应占用首页 6 个展示名额

### Requirement: 同步持久化书架位置
- **GIVEN** WeRead `/shelf/sync` 返回 `books[]` 数组
- **WHEN** 后端执行微信读书同步
- **THEN** 每本书应保存其在 `books[]` 中的顺序位置
- **AND** 后续查询应使用该顺序位置作为默认排序依据

---

## MODIFIED

### Requirement: 微信读书分页查询
- **GIVEN** 客户端请求微信读书书籍分页接口
- **WHEN** 请求携带 `page` 和 `limit`
- **THEN** 接口应在书架顺序基础上分页返回结果
- **AND** 当请求携带 `finishReading=0` 或 `finishReading=1` 时，应先按阅读完成状态过滤再计算分页总数

---

## REMOVED

### Requirement: 按最近阅读时间作为默认书架排序
- 移除原因：最近阅读时间不等同于微信读书“我的书架”顺序，会导致首页和 `/weread` 页面展示与用户书架不一致。

### `tasks.md`
# 任务清单

## Phase 1: 后端排序与筛选

### Task 1: 持久化书架顺序

- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/schemas/weread.schema.ts`
- [x] 为 `WereadBook` 增加 `shelfIndex` 字段和 Swagger 装饰器
- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/weread.service.ts`
- [x] 在 `syncBooks()` 映射 `books[]` 时写入数组下标
- [ ] **预计耗时:** 0.5h
- [x] **实际耗时:** 0.4h
- [x] **验证:** `./packages/wuh.site.nest/node_modules/.bin/jest --config packages/wuh.site.nest/jest.config.cjs packages/wuh.site.nest/src/modules/weread/weread.service.spec.ts --runInBand --detectOpenHandles`

### Task 2: 查询按书架顺序返回

- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/weread.service.ts`
- [x] 将默认排序从 `readUpdateTime` 倒序改为 `shelfIndex` 升序，并保留兜底排序
- [x] 支持可选 `finishReading` 过滤
- [ ] **文件:** `packages/wuh.site.nest/src/modules/weread/weread.controller.ts`
- [x] 增加可选 `finishReading` 查询参数解析
- [x] **文件:** `packages/wuh.site.nest/src/modules/api-v2/api-v2.service.ts`
- [x] 补充 API 文档中的 `finishReading` 查询参数
- [ ] **预计耗时:** 1h
- [x] **实际耗时:** 0.6h
- [x] **验证:** 单元测试覆盖默认排序、在读过滤和分页总数

## Phase 2: 前端数据请求

### Task 3: 首页请求在读前 6 本

- [ ] **文件:** `packages/wuh.site.next/app/page.tsx`
- [x] 将微信读书请求改为 `page=1&limit=6&finishReading=0`
- [x] 确保首页展示顺序与接口返回顺序一致
- [ ] **预计耗时:** 0.25h
- [x] **实际耗时:** 0.1h
- [x] **验证:** 首页请求参数改为在读前 6 本

### Task 4: 类型与契约补齐

- [ ] **文件:** `packages/shared-contracts/src/index.ts`
- [x] 如前端需要使用 `shelfIndex`，补齐 `WereadBook` 类型字段
- [ ] **预计耗时:** 0.25h
- [x] **实际耗时:** 0.1h
- [x] **验证:** 后端构建通过；全局 `tsc --noEmit` 在当前 worktree 环境中 SIGSEGV，需在完整依赖环境复验

## 验收

- [x] `/weread` 页面第一页顺序与 WeRead `/shelf/sync` 返回的 `books[]` 原始顺序一致
- [x] `/weread` 翻页时顺序稳定，不再按最近阅读时间重排
- [x] 首页微信读书模块展示书架顺序中 `finishReading=0` 的前 6 本
- [x] 已读完书籍不会占用首页微信读书模块名额
- [ ] `pnpm exec tsc --noEmit` 零错误
