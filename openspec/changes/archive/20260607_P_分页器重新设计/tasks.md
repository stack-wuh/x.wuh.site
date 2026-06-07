# 任务列表

## Phase 1: 组件实现

### Task 1: 创建 Pagination 组件 ✅
- **涉及文件**: `packages/components/pagination/index.tsx`
- **预计耗时**: 1h | **实际**: ~0.5h
- 实现 Pagination 组件：字母映射、窗口裁剪、导航、边界处理

### Task 2: 替换 BlogListView 内联分页 ✅
- **涉及文件**: `packages/wuh.site.next/app/blog/BlogListView.tsx`, `packages/wuh.site.next/app/blog/page.tsx`
- **预计耗时**: 0.5h | **实际**: ~0.3h
- 删除内联分页代码，替换为 Pagination 组件，清理多余类型（lastPage null → number）

### Task 3: 更新 loading 骨架屏 ✅
- **涉及文件**: `packages/wuh.site.next/app/blog/loading.tsx`
- **预计耗时**: 0.5h | **实际**: ~0.2h
- 适配新分页器样式

## Phase 2: 验证

### Task 4: 类型检查 ✅
- **涉及文件**: 所有修改文件
- **预计耗时**: 0.5h | **实际**: ~0.1h
- `npx tsc --noEmit --project packages/wuh.site.next/tsconfig.json` 通过
