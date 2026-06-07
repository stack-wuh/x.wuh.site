# 任务清单

## Task 1: 类型迁移到 shared-contracts
- [ ] 将 `Book` → `WereadBook` 迁入 `shared-contracts/src/index.ts`
- [ ] 将 `Repo` 合并到已有 `RepoDto`
- [ ] 将 `PostItem` → `PostListItem` 迁入 `shared-contracts/src/index.ts`
- [ ] 将 `AdjacentPost`, `PostDetail`, `FetchOptions` 迁入 `shared-contracts/src/index.ts`
- [ ] Next.js 中删除重复类型，改为从 shared-contracts 导入
- [ ] 验证 TypeScript 编译通过

## Task 2: 运行时实现 createService.ts
- [ ] `packages/hooks` 安装 ahooks 依赖
- [ ] 实现 `defineService()` — 端点定义 → 生成 `.server()` + `.use()`
- [ ] 实现 `configureService()` — 设置全局 onError
- [ ] `.server()` 返回 `Promise<{ data, error, loading }>`
- [ ] `.use()` 封装 ahooks `useRequest`，返回 `{ data, error, loading, run, refresh }`

## Task 3: 端点声明 endpoints.ts
- [ ] 创建 `packages/shared-contracts/src/endpoints.ts`
- [ ] 声明 contentService（getPosts, getPost, getProjects）
- [ ] 声明 reposService（getAll）
- [ ] 声明 wereadService（getBooks）
- [ ] 声明 commentsService（getByIssue）

## Task 4: 试点替换 /weread
- [ ] `app/weread/page.tsx` 改用 `wereadService.getBooks.server()`
- [ ] `app/weread/WereadView.tsx` 类型改为从 shared-contracts 导入
- [ ] 确认列表渲染和分页功能正常

## Task 5: 替换剩余 Server Components
- [ ] `app/blog/page.tsx` 改用 `contentService.getPosts.server()`
- [ ] `app/page.tsx` 改用 contentService + reposService + wereadService
- [ ] `app/post/[number]/page.tsx` 改用 `contentService.getPost.server()`
- [ ] `app/sitemap.ts` 改用 service
- [ ] 确认各页面 ISR revalidate 配置不变

## Task 6: 替换 Client Components
- [ ] `app/components/AppProviders.tsx` 裸 fetch → service
- [ ] `app/components/player/GlobalAudioPlayer.tsx` 裸 fetch → service
- [ ] 确认 loading/error 状态正常

## Task 7: 清理
- [ ] 删除 `app/lib/api.ts`
- [ ] 删除 `packages/hooks/src/useFetch/useFetch.ts`
- [ ] TypeScript 类型检查通过
- [ ] Next.js build 通过
