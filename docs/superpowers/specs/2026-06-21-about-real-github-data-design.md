# About 页接入 GitHub 真实数据

日期: 2026-06-21

## 背景

About 页"关于我"区块的个人、平台、联系、指标数据目前全部硬编码在 `data.ts` 中。本项目已有 `stack-wuh` 的 GitHub Personal Token，且 `ReposService` 已经用 Octokit 调 GitHub GraphQL。需要在最小改动下将 mock 数据替换为真实 GitHub 数据。

## 设计目标

- 个人：GitHub 真实头像、name、bio
- 平台：GitHub 卡片注入真实数据，语雀/公众号保留手动维护
- 联系：GitHub URL + blog URL + Email
- 指标：整行换成个人简介文本（基于 43 篇博客内容客观总结）
- Tags：博客 labels 按频率 ≥ 3 过滤，取技术标签 6 个：Javascript, React, Git, Node, Nginx, Vue
- 遵循项目现有模式（后端代理 GitHub → Server Component ISR → Client Component）

## 数据流

```
GitHub API (api.github.com)
    │
    ▼
ReposService (已有 Octokit, 5min 缓存)
    ├── getRepos()          → GET /repos          (已有)
    └── getUserProfile()    → GET /repos/profile  (新增)
         ├── GET /users/stack-wuh        → profile
         └── GET /repos/stack-wuh/blog/labels → labels
    │
    ▼
Next.js Server Component (app/about/page.tsx)
    ├── fetch reposService.getAll     → repos
    └── fetch reposService.getProfile → profile + labels
    │
    ▼
Client Component (app/about/AboutView.tsx)
    └── 接收 profile + labels + repos props，渲染页面
```

## 数据模型

### GitHubProfileDto（新增）

取自 GitHub REST API，两次调用合并返回：

**用户信息** `GET /users/stack-wuh`：

| 字段 | 类型 | 用途 |
|------|------|------|
| login | string | GitHub 用户名 |
| name | string | 显示姓名 |
| avatar_url | string | 头像 |
| bio | string | GitHub bio |
| blog | string | 个人网站 |
| location | string | 所在地 |
| public_repos | number | 仓库数 |
| followers | number | 关注者 |
| following | number | 正在关注 |
| created_at | string | 账号创建时间 |

**博客标签** `GET /repos/stack-wuh/blog/labels`：

返回博客 Issues 的全部标签，后端按频率 ≥ 3 过滤，保留技术标签：

| 标签 | 频率 | 说明 |
|------|------|------|
| Javascript | 6 | 核心语言 |
| React | 6 | 主力框架 |
| Git | 5 | 版本管理 |
| Node | 4 | 服务端 |
| Nginx | 3 | 运维 |
| Vue | 3 | 前端框架 |

过滤规则：排除 content-type 类（daily/weekly）和频率 < 3 的标签。

两个调用在 `getUserProfile()` 中并行执行，统一缓存。

### 前端 props

```
page.tsx (server) → AboutView receives:
  - profile: GitHubProfileDto | null
  - repos: RepoDto[]               (已有)
```

## UI 数据映射

| UI 区块 | 当前 | 改为 |
|---------|------|------|
| 头像 | 字母 W 的 div | `<img src={profile.avatar_url} />` |
| 姓名 | "Shadow Wu" | `profile.name`，fallback "Shadow Wu" |
| 角色 | "全栈开发 & 技术写作" | 简介文本（无单独角色行，并入 Bio） |
| Bio | 硬编码中文 | 基于 43 篇博客的客观总结：全栈工程师，2018 年开始用 GitHub Issues 记录技术实践与个人思考。内容覆盖前端（React/Vue）、Node 服务端、运维部署（Docker/Nginx）及工程化。信奉实践驱动写作，写过的每一篇都是踩过的坑或拆过的轮子。现居深圳，业余时间喜欢读历史与推理小说。 |
| Tags | 手写 5 个 | 博客 labels 按频率 ≥ 3 过滤：Javascript, React, Git, Node, Nginx, Vue |
| GitHub 平台卡 | 假描述 | `profile.public_repos` repos + followers |
| 语雀平台卡 | 硬编码 | 保留手动维护 |
| 公众号平台卡 | 硬编码 | 保留手动维护 |
| 联系方式 | 硬编码链接 | GitHub URL / blog / Email |
| 指标行 | "32 条 / 3/3 / 6小时" | 个人简介文本 |

## 文件变更

### 后端

| 操作 | 文件 | 内容 |
|------|------|------|
| 新建 | `packages/wuh.site.nest/src/modules/repos/dto/profile.dto.ts` | GitHubProfileDto |
| 修改 | `packages/wuh.site.nest/src/modules/repos/repos.service.ts` | 新增 `getUserProfile()` 方法 |
| 修改 | `packages/wuh.site.nest/src/modules/repos/repos.controller.ts` | 新增 `GET /repos/profile` 端点 |
| 修改 | `packages/shared-contracts/src/endpoints.ts` | 注册 `reposService.getProfile` |

### 前端

| 操作 | 文件 | 内容 |
|------|------|------|
| 修改 | `packages/wuh.site.next/app/about/page.tsx` | 改为 Server Component，fetch 数据后传给 AboutView |
| 新建 | `packages/wuh.site.next/app/about/AboutView.tsx` | 原 page.tsx 的 Client Component JSX |
| 修改 | `packages/wuh.site.next/app/about/data.ts` | 删除 `metrics`/`platformStories`/`expertiseTags`，保留工具函数 |

## 错误处理

| 场景 | 策略 |
|------|------|
| GitHub API 调用失败 | 记录日志，返回 stale cache，无 cache 则返回 null |
| `profile` 为 null | 前端 fallback：名字用静态默认值，头像显示字母 W |
| `repos` 为空数组 | GitHub 平台卡隐藏或显示静态文案 |
| avatar 图片加载失败 | `<img onError>` → 显示字母 W |
| 网络超时 | Next.js ISR stale-while-revalidate，返回上次成功页面 |

## 数据来源总结

| 数据项 | 来源 | 更新频率 |
|--------|------|----------|
| 头像/姓名 | `GET /users/stack-wuh` | ISR 1h |
| 个人简介 (Bio) | 43 篇博客内容客观总结 | 手动 |
| Tags | `GET /repos/stack-wuh/blog/labels`，频率 ≥ 3 过滤 | ISR 1h |
| 平台·GitHub | `profile.public_repos` / `profile.followers` | ISR 1h |
| 平台·语雀 | 手动维护 | 手动 |
| 平台·公众号 | 手动维护 | 手动 |
| 联系方式 | GitHub profile + 手动补充 Email | 手动 |
