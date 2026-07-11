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
