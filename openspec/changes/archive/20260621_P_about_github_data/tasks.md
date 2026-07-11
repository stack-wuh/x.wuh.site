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
