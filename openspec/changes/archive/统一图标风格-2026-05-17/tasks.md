# 任务清单

## Phase 1: 依赖安装 + Brand 图标重绘（可并行）

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 1 | 安装 lucide-react 到 components 包 | 5min | `packages/components/package.json` |
| 2 | 重绘 9 个 Brand 图标为 Outline 风格 | 30min | `packages/components/icons/brand.tsx` |

## Phase 2: 图标系统重构（依赖 Phase 1）

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 3 | 重写 icons/index.tsx，UI/Status 从 lucide-react 重导出，统一接口 | 10min | `packages/components/icons/index.tsx` |
| 4 | 删除 ui.tsx 和 status.tsx | 2min | `packages/components/icons/ui.tsx`, `icons/status.tsx` |

## Phase 3: 引用适配（依赖 Phase 2）

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 5 | 搜索所有 IconChevronLeft/Right 使用处，移除 toolbar-icon span 包裹 | 10min | `packages/wuh.site.next/` 下引用文件 |
| 6 | 搜索图标引用，检查尺寸/props 是否需要适配 | 15min | `packages/wuh.site.next/` 下 ~20 个引用文件 |

## Phase 4: 验证

| # | 任务 | 预估 | 涉及文件 |
|---|------|------|----------|
| 7 | TypeScript 类型检查 + ESLint | 5min | 所有改动文件 |
| 8 | 构建验证（next build） | 5min | 全局 |

总预估：~82min
