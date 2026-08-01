# 首页内容丰富

> 原始变更名：`20260607_P_homepage_enrich`

## 元数据
- 日期：2026-06-07
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- 历史记录未提供 specs 引用规范

## 决策
历史记录未提供

## 任务
### Phase 1：历史任务
- [x] 创建 weread schema (weread_books collection)
- [x] 创建 weread service (sync + getBooks)
- [x] 创建 weread controller (POST /sync, GET /books)
- [x] 创建 weread module
- [x] 注册到 app.module.ts
- [x] api.ts 新增 weread API client
- [x] page.tsx 新增 getWereadBooks 并行数据获取
- [x] HomeView.tsx 替换静态 WECHAT_BOOKS 为真实数据
- [x] 创建 /weread 详情页
- [x] .openspec.yaml
- [x] proposal.md
- [x] tasks.md

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: x.wuh.site
change: homepage-enrich
date: 2026-06-07
type: P
status: archived
```

### `proposal.md`
# 首页内容丰富

## 新增板块

| 板块 | 样式 | 数据来源 |
|------|------|---------|
| 年度总结 | 时间线列表（同精选博客） | 博客文章，标题含"年度总结" |
| 微信读书 | 紧凑列表（封面+书名+进度） | 静态配置 |
| 技术栈（合并项目） | 标签云 + 下方保留项目列表 | 静态配置 + 已有 GitHub API |

## 改动范围

- `app/page.tsx` — 新增年度总结数据获取
- `app/HomeView.tsx` — 新增 3 个板块，合并技术栈到项目板块

### `tasks.md`
# 任务清单

## Task 1: NestJS weread 模块
- [x] 创建 weread schema (weread_books collection)
- [x] 创建 weread service (sync + getBooks)
- [x] 创建 weread controller (POST /sync, GET /books)
- [x] 创建 weread module
- [x] 注册到 app.module.ts

## Task 2: Next.js 前端
- [x] api.ts 新增 weread API client
- [x] page.tsx 新增 getWereadBooks 并行数据获取
- [x] HomeView.tsx 替换静态 WECHAT_BOOKS 为真实数据
- [x] 创建 /weread 详情页

## Task 3: OpenSpec 制品
- [x] .openspec.yaml
- [x] proposal.md
- [x] tasks.md
