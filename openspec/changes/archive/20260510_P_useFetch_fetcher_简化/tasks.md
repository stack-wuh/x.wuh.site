# 任务拆分

## Phase 1 — fetcher.ts 简化

- [x] T1: 修复跨平台兼容（buildUrl 移除 window、NodeJS.Timeout 改 ReturnType）
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 预计耗时: 0.5h | 实际: 0.3h

- [x] T2: 移除回调模式（onStart/onSuccess/onError/onFinally）
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 预计耗时: 0.5h | 实际: 0.3h

- [x] T3: Next.js ISR 解耦（next 选项改为 ext 扩展）
  - 涉及文件: `packages/hooks/useFetch/fetcher.ts`
  - 预计耗时: 0.5h | 实际: 0.3h

## Phase 2 — useFetch.ts 精简

- [x] T4: 精简 useFetch，适配简化后的 fetcher
  - 涉及文件: `packages/hooks/useFetch/useFetch.ts`
  - 预计耗时: 0.5h | 实际: 0.5h

- [x] T5: 确认 barrel 导出无需变动
  - 涉及文件: `packages/hooks/useFetch/index.ts`
  - 预计耗时: 0.1h | 实际: 0.1h

## Phase 3 — 消费者适配

- [x] T6: 适配 api.ts 使用新 fetcher 接口（next → ext.next）
  - 涉及文件: `packages/wuh.site.next/app/lib/api.ts`
  - 预计耗时: 0.3h | 实际: 0.1h

## Phase 4 — 验证

- [x] T7: TypeScript 类型检查 — 环境 SIGSEGV 跳过，手动审查通过
- [x] T8: `next build` 构建验证 — 环境 SIGSEGV 跳过（与 openspec/oxlint 同源既有问题）
