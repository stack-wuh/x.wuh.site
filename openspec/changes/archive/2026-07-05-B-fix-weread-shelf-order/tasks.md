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
