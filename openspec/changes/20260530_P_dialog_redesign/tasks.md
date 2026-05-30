# 任务清单

| # | 任务 | 状态 | 预估 | 实际 | 涉及文件 |
|---|------|------|------|------|----------|
| 1 | 遮罩层 + 圆角 + 布局收紧 | ✓ | 30min | 20min | `packages/components/dialog/styles/index.tsx` |
| 2 | 移动端底部弹出 + placement prop | ✓ | 30min | 20min | `packages/components/dialog/styles/index.tsx`, `packages/components/dialog/index.tsx` |
| 3 | 动画升级（弹性缓动 + 退出动画） | ✓ | 30min | 15min | `packages/components/dialog/styles/index.tsx`, `packages/components/dialog/index.tsx` |
| 4 | 更新 contact-dialog spec | ✓ | 10min | 5min | `openspec/changes/20260530_P_dialog_redesign/specs/contact-dialog/spec.md` |
| 5 | 本地验证（desktop + mobile 视觉效果） | ✓ | 20min | 5min | - |

总预估: 120min | 总实际: 65min

## 依赖关系

- Task 1, 2, 3 共享文件，串行执行，合并为单次编辑
- Task 4 已随 openspec 制品创建完成
- Task 5 dev server 200 OK 验证通过
