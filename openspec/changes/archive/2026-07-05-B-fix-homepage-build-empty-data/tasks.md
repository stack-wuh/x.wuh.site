# 任务清单

## Phase 1: 回归测试

### Task 1: 覆盖 API base fallback

- [x] **文件:** `packages/hooks/useFetch/apiBase.test.mjs`
- [x] 验证生产环境默认 API base 为 `http://nest:3200/v2`。
- [x] 验证开发环境默认 API base 为 `http://localhost:3200/v2`。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [x] **验证:** `node packages/hooks/useFetch/apiBase.test.mjs`

## Phase 2: 修复实现

### Task 2: 修正 API base 与首页动态渲染

- [x] **文件:** `packages/hooks/useFetch/createService.ts`
- [x] 将生产 fallback 改为 `http://nest:3200/v2`。
- [x] **文件:** `packages/wuh.site.next/app/page.tsx`
- [x] 增加 `dynamic = 'force-dynamic'`。
- [x] 首页数据请求失败时输出服务端日志。
- [x] **预计耗时:** 30 分钟
- [x] **实际耗时:** 20 分钟
- [ ] **验证:** `PATH=/Users/wuhong/.nvm/versions/node/v20.20.2/bin:$PATH node_modules/.bin/tsc --noEmit --incremental false --pretty false` 当前最终复验 SIGSEGV

## 验收

- [x] 构建阶段不会把首页 API 失败结果固化为空数据。
- [x] 生产环境默认 API base 指向 `http://nest:3200/v2`。
- [x] 开发环境默认 API base 仍指向 `http://localhost:3200/v2`。
- [x] 首页请求失败时能从服务端日志看到具体模块和错误。


## 验证备注

- `node packages/hooks/useFetch/apiBase.test.mjs` 通过。
- `packages/wuh.site.next/node_modules/.bin/oxlint packages/wuh.site.next/app/page.tsx packages/hooks/useFetch/createService.ts packages/hooks/useFetch/apiBase.ts` 通过。
- `PATH=/Users/wuhong/.nvm/versions/node/v20.20.2/bin:$PATH node_modules/.bin/tsc --noEmit --incremental false --pretty false` 曾通过一次，最终复验连续 SIGSEGV，需在稳定本机/CI 环境复验。
- 本地 `next build` 在下载字体/编译阶段长时间无输出后手动中断；需要 CI 或有稳定网络的本机环境复验完整生产构建。
