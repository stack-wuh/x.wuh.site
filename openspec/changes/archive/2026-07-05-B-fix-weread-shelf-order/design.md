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
