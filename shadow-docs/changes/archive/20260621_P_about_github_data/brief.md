# About 页接入 GitHub 真实数据

> 原始变更名：`20260621_P_about_github_data`

## 元数据
- 日期：2026-06-21
- 类型：P
- 状态：archived
- Issue：历史记录未提供

## 动机
历史记录未提供

## 引用规范
- `specs/about-github-data/spec.md`

## 决策
# 设计：About 页接入 GitHub 真实数据

## 方案

### 1. 数据流

```
GitHub API (api.github.com)
    │
    ▼
ReposService (已有 Octokit, 5min 缓存)
    ├── getRepos()          → GET /repos          (已有)
    └── getUserProfile()    → GET /repos/profile  (新增)
    │
    ▼
Next.js Server Component (app/about/page.tsx)
    ├── fetch reposService.getAll     → repos
    └── fetch reposService.getProfile → profile
    │
    ▼
Client Component (app/about/AboutView.tsx)
    ├── 接收 profile + repos props
    ├── useRequest → /v2/github/contributions → heatmap
    ├── useState → activeContact → Dialog + ContactCard
    └── 渲染全部区块
```

### 2. 后端扩展

**新增 DTO** `GitHubProfileDto`：

| 字段 | 类型 | 来源 |
|------|------|------|
| login | string | `GET /users/stack-wuh` |
| name | string | `GET /users/stack-wuh` |
| avatar_url | string | `GET /users/stack-wuh` |
| bio | string \| null | `GET /users/stack-wuh` |
| blog | string \| null | `GET /users/stack-wuh` |
| location | string \| null | `GET /users/stack-wuh` |
| public_repos | number | `GET /users/stack-wuh` |
| followers | number | `GET /users/stack-wuh` |
| following | number | `GET /users/stack-wuh` |
| created_at | string | `GET /users/stack-wuh` |

**ReposService.getUserProfile()**：
- 复用已有 `octokit.rest.users.getByUsername({ username: login })`
- 5 分钟内存缓存（与 `getRepos()` 共用 `CACHE_TTL`）
- 出错优先返回 stale cache，无 cache 返回 `null`
- Login 从 `CONTENT_REPO_OWNER` 配置读取，默认 `'stack-wuh'`

**ReposController**：
- `GET /repos/profile` → `{ profile: GitHubProfileDto }`

### 3. 前端改造

**page.tsx → Server Component**（参考 `app/page.tsx` 模式）：
- `getProfile()` + `getRepos()` 并行 fetch，ISR 1h
- 传递 `profile` + `repos` 给 AboutView

**AboutView.tsx → Client Component**：
- 头像：`profile.avatar_url` 渲染 `<img>`，fallback 到字母 W
- 姓名：`profile.name`，fallback "Shadow Wu"
- 角色：`profile.location`，fallback "ShenZhen GuangDong China"
- Bio：`personalBio` 常量（基于 43 篇博客的客观总结）
- Tags：`blogTags` 常量（博客 labels 频率 ≥ 3）
- GitHub 平台卡：动态显示 `{public_repos} repos · {followers} followers`
- 指标行：移除
- 联系方式：`LinkGroup`（8 个社交入口，size='small'）+ `Dialog` + `ContactCard`，复用首页 ContactConfig
- 热力图：`useRequest` 从 `/v2/github/contributions?username=stack-wuh` 获取，传入 `@wuh.site/components/heatmap`

**styles.ts**：
- 删除 `ContactRow`、`ContactItem`（已被 LinkGroup 替代）
- Hero `padding` 从 `32px 0 0` 改为 `32px 0 24px`（底部加呼吸空间）

### 4. 数据来源

| 数据项 | 来源 | 更新频率 |
|--------|------|----------|
| 头像/姓名 | `GET /users/stack-wuh` | ISR 1h |
| Tags | 博客 labels 分析（硬编码） | 手动 |
| 个人简介 | 博客内容分析（硬编码） | 手动 |
| 平台·GitHub | `profile.public_repos` / `profile.followers` | ISR 1h |
| 平台·语雀/公众号 | 硬编码 | 手动 |
| 联系方式 | ContactConfig（与首页共享） | 手动 |
| 热力图 | `/v2/github/contributions` | 客户端 fetch |

### 5. 错误处理

| 场景 | 策略 |
|------|------|
| GitHub API 失败 | 日志记录 → stale cache → null |
| `profile` 为 null | 前端 fallback 到静态默认值 |
| avatar 加载失败 | 无 onError handler，显示浏览器默认占位 |
| 网络超时 | Next.js ISR stale-while-revalidate |
| heatmap fetch 失败 | `useRequest` error 状态，组件内部展示空态 |

## 依赖

- 零新依赖
- 复用已有 Octokit 实例、`defineService` 端点注册、ISR 数据获取模式
- 复用首页 `ContactConfig`、`ContactCard`、`LinkGroup` 组件
- 复用 `@wuh.site/components/heatmap` 组件

## 任务
### Phase 1 — 后端
- [x] T1: 创建 `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts`
- [x] T2: 扩展 `repos.service.ts` — 新增 `getUserProfile()`
- [x] T3: 扩展 `repos.controller.ts` — 新增 `GET /repos/profile`
- [x] T4: 注册端点 + 共享类型
### Phase 2 — 前端
- [x] T5: 清理 `data.ts`
- [x] T6: 创建 `AboutView.tsx`
- [x] T7: 重写 `page.tsx`
- [x] T8: 清理 `styles.ts`
### Phase 3 — 验证
- [x] T9: TypeScript 类型检查

## 结果
- 状态：archived
- Issue：历史记录未提供
- 原始验证/完成信息：历史记录未提供

## 原始资料摘录
> 以下摘录保留父提交中的全部历史产物内容，便于追溯。

### `.openspec.yaml`
```yaml
project: about 页接入 GitHub 真实数据
change: about-github-data
date: 2026-06-21
type: P
status: archived
```

### `design.md`
# 设计：About 页接入 GitHub 真实数据

## 方案

### 1. 数据流

```
GitHub API (api.github.com)
    │
    ▼
ReposService (已有 Octokit, 5min 缓存)
    ├── getRepos()          → GET /repos          (已有)
    └── getUserProfile()    → GET /repos/profile  (新增)
    │
    ▼
Next.js Server Component (app/about/page.tsx)
    ├── fetch reposService.getAll     → repos
    └── fetch reposService.getProfile → profile
    │
    ▼
Client Component (app/about/AboutView.tsx)
    ├── 接收 profile + repos props
    ├── useRequest → /v2/github/contributions → heatmap
    ├── useState → activeContact → Dialog + ContactCard
    └── 渲染全部区块
```

### 2. 后端扩展

**新增 DTO** `GitHubProfileDto`：

| 字段 | 类型 | 来源 |
|------|------|------|
| login | string | `GET /users/stack-wuh` |
| name | string | `GET /users/stack-wuh` |
| avatar_url | string | `GET /users/stack-wuh` |
| bio | string \| null | `GET /users/stack-wuh` |
| blog | string \| null | `GET /users/stack-wuh` |
| location | string \| null | `GET /users/stack-wuh` |
| public_repos | number | `GET /users/stack-wuh` |
| followers | number | `GET /users/stack-wuh` |
| following | number | `GET /users/stack-wuh` |
| created_at | string | `GET /users/stack-wuh` |

**ReposService.getUserProfile()**：
- 复用已有 `octokit.rest.users.getByUsername({ username: login })`
- 5 分钟内存缓存（与 `getRepos()` 共用 `CACHE_TTL`）
- 出错优先返回 stale cache，无 cache 返回 `null`
- Login 从 `CONTENT_REPO_OWNER` 配置读取，默认 `'stack-wuh'`

**ReposController**：
- `GET /repos/profile` → `{ profile: GitHubProfileDto }`

### 3. 前端改造

**page.tsx → Server Component**（参考 `app/page.tsx` 模式）：
- `getProfile()` + `getRepos()` 并行 fetch，ISR 1h
- 传递 `profile` + `repos` 给 AboutView

**AboutView.tsx → Client Component**：
- 头像：`profile.avatar_url` 渲染 `<img>`，fallback 到字母 W
- 姓名：`profile.name`，fallback "Shadow Wu"
- 角色：`profile.location`，fallback "ShenZhen GuangDong China"
- Bio：`personalBio` 常量（基于 43 篇博客的客观总结）
- Tags：`blogTags` 常量（博客 labels 频率 ≥ 3）
- GitHub 平台卡：动态显示 `{public_repos} repos · {followers} followers`
- 指标行：移除
- 联系方式：`LinkGroup`（8 个社交入口，size='small'）+ `Dialog` + `ContactCard`，复用首页 ContactConfig
- 热力图：`useRequest` 从 `/v2/github/contributions?username=stack-wuh` 获取，传入 `@wuh.site/components/heatmap`

**styles.ts**：
- 删除 `ContactRow`、`ContactItem`（已被 LinkGroup 替代）
- Hero `padding` 从 `32px 0 0` 改为 `32px 0 24px`（底部加呼吸空间）

### 4. 数据来源

| 数据项 | 来源 | 更新频率 |
|--------|------|----------|
| 头像/姓名 | `GET /users/stack-wuh` | ISR 1h |
| Tags | 博客 labels 分析（硬编码） | 手动 |
| 个人简介 | 博客内容分析（硬编码） | 手动 |
| 平台·GitHub | `profile.public_repos` / `profile.followers` | ISR 1h |
| 平台·语雀/公众号 | 硬编码 | 手动 |
| 联系方式 | ContactConfig（与首页共享） | 手动 |
| 热力图 | `/v2/github/contributions` | 客户端 fetch |

### 5. 错误处理

| 场景 | 策略 |
|------|------|
| GitHub API 失败 | 日志记录 → stale cache → null |
| `profile` 为 null | 前端 fallback 到静态默认值 |
| avatar 加载失败 | 无 onError handler，显示浏览器默认占位 |
| 网络超时 | Next.js ISR stale-while-revalidate |
| heatmap fetch 失败 | `useRequest` error 状态，组件内部展示空态 |

## 依赖

- 零新依赖
- 复用已有 Octokit 实例、`defineService` 端点注册、ISR 数据获取模式
- 复用首页 `ContactConfig`、`ContactCard`、`LinkGroup` 组件
- 复用 `@wuh.site/components/heatmap` 组件

### `proposal.md`
# About 页接入 GitHub 真实数据

## 为什么做

About 页"关于我"区块的个人（头像、姓名、Bio、Tags）、平台、联系、指标数据全部硬编码在 `data.ts` 中，头像用字母替代、指标是假数据。项目已有 `stack-wuh` 的 GitHub Personal Token，`ReposService` 已用 Octokit 调 GitHub API，可在最小改动下接入真实数据。

## 做什么

- 后端新增 `GET /repos/profile` 端点，复用 ReposService 已有 Octokit 实例获取 GitHub 用户信息
- 前端 About 页拆为 Server Component（fetch 数据）+ Client Component（渲染），遵循首页 `page.tsx → HomeView.tsx` 模式
- 个人区：GitHub 真实头像、姓名、简介
- Tags：博客 labels 按频率 ≥ 3 过滤，6 个技术标签
- 平台区：GitHub 卡片注入 `public_repos` + `followers` 真实数据
- 指标行：替换为基于 43 篇博客内容的客观个人简介
- 联系方式：从简单 `ContactRow` 升级为 `LinkGroup` + `Dialog` + `ContactCard`，与首页统一
- 热力图：接入 `@wuh.site/components/heatmap` 真实组件，从 `/v2/github/contributions` 获取数据
- Hero 间距：增加底部 padding，改善副标题与内容区的呼吸空间

## 覆盖范围

- `packages/wuh.site.nest/src/modules/repos/` — 新增 DTO + service 方法 + controller 端点
- `packages/shared-contracts/src/` — 注册端点 + 新增 `GitHubProfileDto` 类型
- `packages/wuh.site.next/app/about/` — page.tsx 重写、新增 AboutView.tsx、data.ts 瘦身、styles.ts 清理
- 复用 `app/components/ContactConfig.ts` + `ContactCard.tsx`（来自首页）

## 不改什么

- 语雀、微信公众号平台卡片保留静态描述
- timelineLogs 仍用 mock 数据
- 不新增 npm 依赖

## 影响范围

| 操作 | 文件 |
|------|------|
| 新建 | `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts` |
| 修改 | `packages/wuh.site.nest/src/modules/repos/repos.service.ts` |
| 修改 | `packages/wuh.site.nest/src/modules/repos/repos.controller.ts` |
| 修改 | `packages/shared-contracts/src/endpoints.ts` |
| 修改 | `packages/shared-contracts/src/index.ts` |
| 修改 | `packages/wuh.site.next/app/about/data.ts` |
| 新建 | `packages/wuh.site.next/app/about/AboutView.tsx` |
| 重写 | `packages/wuh.site.next/app/about/page.tsx` |
| 修改 | `packages/wuh.site.next/app/about/styles.ts` |

### `specs/about-github-data/spec.md`
# spec: about-github-data

## 后端 API

### GET /repos/profile

返回 GitHub 用户信息。

**Response 200**:

```json
{
  "profile": {
    "login": "stack-wuh",
    "name": "吴尒红",
    "avatar_url": "https://avatars.githubusercontent.com/u/34117238?v=4",
    "bio": "a boy just ~",
    "blog": "wuh.site",
    "location": "ShenZhen GuangDong China",
    "public_repos": 64,
    "followers": 12,
    "following": 36,
    "created_at": "2017-11-30T03:48:47Z"
  }
}
```

- 缓存: 5 分钟内存缓存
- 降级: API 失败返回 stale cache，无 cache 时 `profile` 为 `null`
- 认证: 使用 `GITHUB_PERSONAL_TOKEN` 环境变量

## 前端数据映射

### 个人

| UI 区块 | 数据来源 | Fallback |
|---------|---------|----------|
| 头像 | `profile.avatar_url` | 字母 "W" 渐变圆形 |
| 姓名 | `profile.name` | "Shadow Wu" |
| 角色 | `profile.location` | "ShenZhen GuangDong China" |
| Bio | `personalBio` 常量 | — |
| Tags | `blogTags` 常量 | — |

### 平台

| 平台 | 数据来源 |
|------|---------|
| GitHub | `profile.public_repos` repos · `profile.followers` followers |
| 语雀 | 静态文案 |
| 微信公众号 | 静态文案 |

### 联系方式

使用 `LinkGroup`（size='small'）+ `Dialog` + `ContactCard`，与首页共享 `ContactConfig`：

微信、QQ、Twitter、邮箱、GitHub、豆瓣、网易云、Discord — 8 个社交入口。点击微信/QQ 弹出二维码，点击 Twitter/GitHub/豆瓣/网易云/Discord 跳转链接，邮箱直接 mailto。

### 热力图

`useRequest` 从 `/v2/github/contributions?username=stack-wuh` 获取，传入 `@wuh.site/components/heatmap`。

## Tags

基于博客 labels 频率分析，取频率 ≥ 3 的技术标签：

```
Javascript(6)  React(6)  Git(5)  Node(4)  Nginx(3)  Vue(3)
```

## 个人简介

基于 43 篇博客内容客观总结：

> 全栈工程师，2018 年开始用 GitHub Issues 记录技术实践与个人思考。内容覆盖前端（React/Vue）、Node 服务端、运维部署（Docker/Nginx）及工程化。信奉实践驱动写作，写过的每一篇都是踩过的坑或拆过的轮子。现居深圳，业余时间喜欢读历史与推理小说。

## 页面结构

```
app/about/
├── page.tsx        # Server Component (ISR 1h, fetch profile + repos)
├── AboutView.tsx   # Client Component (LinkGroup, Dialog, useRequest heatmap)
├── data.ts         # blogTags, personalBio, timelineLogs, formatMonthDay
├── styles.ts       # Hero padding 32px 0 24px, LinkGroup small icons
└── layout.tsx      # 不变
```

## 样式调整

- Hero: `padding: 32px 0 24px`（底部留白改善副标题与内容的间距）
- 删除了 `ContactRow`、`ContactItem` 样式组件（LinkGroup 替代）

### `tasks.md`
# 任务拆分

## Phase 1 — 后端

- [x] T1: 创建 `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts`
  - 定义 `GitHubProfileDto`（10 字段）和 `GitHubProfileResponseDto`

- [x] T2: 扩展 `repos.service.ts` — 新增 `getUserProfile()`
  - 调用 `octokit.rest.users.getByUsername()`，5min 缓存，出错 fallback

- [x] T3: 扩展 `repos.controller.ts` — 新增 `GET /repos/profile`
  - Swagger 装饰器，返回 `{ profile }`

- [x] T4: 注册端点 + 共享类型
  - `endpoints.ts`: `getProfile: { url: '/repos/profile', method: 'GET' }`
  - `index.ts`: 新增 `GitHubProfileDto` 接口

## Phase 2 — 前端

- [x] T5: 清理 `data.ts`
  - 删除 `metrics`、`expertiseTags`、`platformStories`
  - 新增 `blogTags`（6 标签）、`personalBio`（简介文本）

- [x] T6: 创建 `AboutView.tsx`
  - Client Component，接收 `profile: GitHubProfileDto | null` + `repos: RepoDto[]`
  - 头像/姓名/简介/Tags/平台 全部用真实数据
  - 联系方式迁移为 `LinkGroup` + `Dialog` + `ContactCard`
  - 热力图接入 `@wuh.site/components/heatmap` + `useRequest`

- [x] T7: 重写 `page.tsx`
  - Server Component，并行 fetch profile + repos，ISR 1h
  - 传递 props 给 AboutView

- [x] T8: 清理 `styles.ts`
  - 删除 `ContactRow`、`ContactItem`
  - Hero `padding` 增加底部间距

## Phase 3 — 验证

- [x] T9: TypeScript 类型检查
  - `tsc --noEmit` 确认 about 目录零新增错误
