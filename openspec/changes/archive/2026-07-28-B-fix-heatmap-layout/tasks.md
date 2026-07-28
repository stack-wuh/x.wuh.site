# 任务清单

## Phase 1: 建立布局回归

### Task 1: 固化共享轨道与无滚动要求

- [x] **文件:** `packages/components/heatmap/heatmap-layout.test.mjs`
- [x] 增加网格不使用横向滚动的失败断言。
- [x] 增加月份、星期和周列共享轨道定义的失败断言。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 8 分钟
- [x] **验证:** 修复前 0/2 通过；无滚动与共享轨道断言按预期失败。

### Task 2: 固化 Tooltip 防裁切要求

- [x] **文件:** `packages/components/heatmap/heatmap-layout.test.mjs`
- [x] 增加首行 Tooltip 向下、左右边缘内向对齐和多行限宽的失败断言。
- [x] 保留 hover、click、focus 交互断言。
- [x] **预计耗时:** 25 分钟
- [x] **实际耗时:** 5 分钟
- [x] **验证:** 修复前 0/2 通过；Tooltip 方向与换行断言按预期失败。

## Phase 2: 最小布局修复

### Task 3: 统一月份、星期和周列轨道

- [x] **文件:** `packages/components/heatmap/index.tsx`、`packages/components/heatmap/styles.tsx`
- [x] 使用同一 CSS Grid 轨道渲染月份、星期和 53 周数据。
- [x] 移除 `weekIndex * 15` 和独立 `margin-left` 手工偏移。
- [x] 使用响应式单元格尺寸完整展示 365 天，并移除组件内部横向滚动。
- [x] **预计耗时:** 45 分钟
- [x] **实际耗时:** 18 分钟
- [x] **验证:** 布局回归测试 2/2 通过，Oxlint 与 `git diff --check` 通过。

### Task 4: 修复 Tooltip 边缘可见性

- [x] **文件:** `packages/components/heatmap/index.tsx`、`packages/components/heatmap/styles.tsx`
- [x] 根据行列边缘状态调整 Tooltip 垂直方向和水平对齐。
- [x] 为综合明细设置最大宽度、换行和行高。
- [x] 保持 hover、click、focus 与 `aria-label` 行为。
- [x] **预计耗时:** 35 分钟
- [x] **实际耗时:** 12 分钟
- [x] **验证:** Tooltip 回归测试 2/2 通过，原有交互事件与可访问名称保留。

## Phase 3: 页面验证

### Task 5: 验证桌面和移动布局

- [ ] **文件:** 无生产文件修改
- [ ] 在 About 页面验证桌面、平板和移动视口。
- [ ] 检查加载态与真实数据态没有布局跳变。
- [ ] 运行相关测试、Oxlint、类型检查和浏览器控制台检查。
- [ ] **预计耗时:** 30 分钟
- [ ] **实际耗时:** 待填写
- [ ] **验证:** 320px、375px、768px、1280px 下无横向溢出，标题和 Tooltip 行为符合规范。

## 验收

- [ ] Heatmap 组件内部和 About 页面均不出现由热力图导致的横向滚动条。
- [ ] 月份标题与对应周列准确对齐。
- [ ] 星期标题与对应日期行准确对齐。
- [ ] 最近 365 天数据在桌面和移动端完整展示。
- [ ] 首行、末行及左右边缘 Tooltip 内容完整可见。
- [ ] Tooltip 支持综合活动明细换行，hover、click、focus 和可访问名称保持有效。
- [ ] 相关测试、Oxlint、TypeScript 类型检查和真实页面验证通过。
