# 优化热力图 Popover 内部样式

> 类型：需求
> 日期：2026-08-04
> Issue：未创建

## 动机

共享 Heatmap 当前将日期、总量和分类明细拼接为一段文本，并统一放入 Tooltip。综合活动包含多个分类时，所有信息依赖间隔点分隔，缺少明确的信息层级、对齐关系和区块间距，导致内容拥挤且难以快速扫描。

本次优化只调整 Popover 的内部结构与样式，在保留现有定位、交互和数据契约的前提下，提高桌面端和移动端的可读性。

## 现状证据

1. `packages/components/heatmap/index.tsx` 将日期、总量及 `breakdown` 明细拼接为单一 `label` 字符串。
2. `packages/components/heatmap/styles.tsx` 的 Tooltip 只有统一字号、行高和内边距，无法分别控制标题、总量和明细的视觉层级。
3. 分类名称与数值没有独立布局，明细增加时只能自然换行，无法保持数值对齐。
4. 现有 Tooltip 已支持 hover、focus、click，以及首行向下、左右边缘向内展开；这些行为应继续保留。

## 影响范围

- **受影响：** 共享 Heatmap 的 Popover 内容结构、排版、间距和响应式宽度。
- **调用方：** About 综合活动热力图及其他复用共享 Heatmap 的页面将获得一致的详情样式。
- **接口与数据：** 不修改 Heatmap 公开 Props、`HeatmapData`、`ContributionDay` 或后端接口。
- **交互：** 不改变 hover、focus、click 的显示与关闭行为。

## 决策

### 推荐方案：结构化 Popover

将当前单段 Tooltip 文本拆分为日期标题、总量和分类明细三个语义区块，保持现有 `TooltipCell` 作为交互和定位边界。

```text
Popover
┌──────────────────────┐
│ 8 月 4 日            │  日期标题
│ 总量 18              │  总量强调
│ ──────────────────── │  低对比度分隔线
│ 浏览              10 │
│ 发布               3 │  分类明细
│ 评论               5 │
└──────────────────────┘
```

选择理由：

- 阅读顺序稳定为“日期 → 总量 → 分类”，不再依赖分隔符理解内容。
- 分类名称和数值使用键值行布局，数值右对齐，便于纵向比较。
- 仅需调整 Heatmap 内部 JSX 和 styled-components，不引入新依赖或跨组件抽象。
- 现有定位和交互逻辑可以原样保留，变更范围可控。

### 视觉与布局规则

- 日期标题使用约 12px 字号和中等字重，作为首要视觉锚点。
- 总量使用约 13px 字号和较高字重，与日期形成次级层次。
- 分类明细使用约 12px 字号、约 1.5 行高，每行采用两列布局：名称占据剩余空间，数值右对齐。
- Popover 使用 10–12px 内边距、8px 区块间距和约 6px 明细行距，保持舒适密度。
- 总量与明细之间使用 1px 低对比度分隔线；颜色从现有主题令牌派生，不新增固定主题色。
- 圆角保持现有 4px，不改变 Heatmap 的整体视觉语言。
- 桌面端宽度控制在约 190–240px；移动端最大宽度不超过 `calc(100vw - 32px)`。
- 分类名称允许必要换行，数值保持单行，不得发生名称与数值重叠。

### 内容规则

- 有 `breakdown` 时显示“总量 N”及分类明细。
- 分类明细只展示数值大于 0 的项目，减少无效信息和浮窗高度。
- 未知分类 key 继续显示原始 key，避免扩展数据被静默丢弃。
- 没有可展示分类时不渲染分隔线或明细区。
- 无 `breakdown` 时继续显示“N 条{activityLabel}”，但使用新的日期与总量层级。
- `aria-label` 保留完整的日期、总量及明细语义，不因视觉结构调整而减少可访问信息。

### 定位与响应式

- 保留当前绝对定位，不引入 Portal、运行时测量或第三方 Popover 依赖。
- 保留首行向下、其他行向上，以及左右边缘向热力图内部对齐的策略。
- 320px、375px 及更宽视口下，Popover 均受视口安全边距约束。
- 内容超出理想宽度时优先让分类名称换行，不压缩数值列，也不产生页面横向滚动。

### 备选方案

- **仅优化 CSS：** 保留单段字符串，只增加内边距、行高和换行。改动更小，但无法建立稳定的信息层级和数值对齐，因此不采用。
- **抽离通用 Popover 组件：** 将内容和定位封装为共享组件。复用能力更强，但当前只有 Heatmap 的明确需求，会增加不必要的抽象，因此不采用。
- **Portal 或动态测量：** 可进一步处理复杂容器边界，但会引入坐标同步和滚动监听；现有边缘定位已满足本次范围，因此不采用。

## 实施计划

> **执行约束：** 实施时使用 `shadow-dev-apply`，按下列复选框逐项推进。遵守 TDD：先看到新增断言失败，再修改生产代码。不得新增测试文件，不执行 Git 操作。

**目标：** 将 Heatmap 当前的单段 Tooltip 文本改为日期、总量和分类明细三级结构，同时保持既有交互、定位、数据契约和主题兼容性。

**实现边界：** `TooltipCell` 继续负责可见状态、可访问名称与边缘定位；`index.tsx` 只负责整理展示数据和输出语义结构；`styles.tsx` 只负责 Popover 内部布局与视觉规则。无新文件、无新依赖、无公开 API 变化。

**技术栈：** React 19、TypeScript 5、styled-components 6、Node.js `node:test` 静态回归测试。

### Task 1：建立结构化内容回归

**文件：**

- 修改：`packages/components/heatmap/heatmap-layout.test.mjs`
- 参考：`packages/components/heatmap/index.tsx`

- [ ] **Step 1：新增失败测试，固定三级结构、零值过滤和无空明细区**

在现有测试文件末尾追加：

```js
test('Tooltip 使用日期、总量和非零分类明细的结构化内容', () => {
  assert.match(component, /Object\.entries\(breakdown\)\.filter\(\(\[, value\]\) => value > 0\)/)
  assert.match(component, /<S\.TooltipDate>/)
  assert.match(component, /<S\.TooltipTotal>/)
  assert.match(component, /details\.length > 0 && \(/)
  assert.match(component, /<S\.TooltipDetails>/)
  assert.match(component, /<S\.TooltipDetailValue>\{value\}<\/S\.TooltipDetailValue>/)
  assert.match(component, /ACTIVITY_LABELS\[key\] \?\? key/)
})

test('Tooltip 保留完整可访问名称与既有交互', () => {
  assert.match(component, /aria-label=\{label\}/)
  assert.match(component, /onMouseEnter=\{\(\) => setVisible\(true\)\}/)
  assert.match(component, /onFocus=\{\(\) => setVisible\(true\)\}/)
  assert.match(component, /onClick=\{\(\) => setVisible\(\(current\) => !current\)\}/)
})
```

- [ ] **Step 2：运行测试并确认新增结构断言失败**

运行：

```bash
node --test packages/components/heatmap/heatmap-layout.test.mjs
```

预期：原有 2 个测试通过；“Tooltip 使用日期、总量和非零分类明细的结构化内容”失败，失败原因是 `TooltipDate` 等结构尚不存在。交互回归测试应通过。

### Task 2：实现 Popover 内容结构

**文件：**

- 修改：`packages/components/heatmap/index.tsx:43-61`
- 测试：`packages/components/heatmap/heatmap-layout.test.mjs`

- [ ] **Step 1：将日期、总量和有效明细整理为独立数据**

用以下逻辑替换当前 `details` 和 `label` 的构造：

```tsx
const dateLabel = `${d.getMonth() + 1} 月 ${d.getDate()} 日`
const details = breakdown
  ? Object.entries(breakdown).filter(([, value]) => value > 0)
  : []
const totalLabel = breakdown ? `总量 ${count}` : `${count} 条${activityLabel}`
const accessibleDetails = details
  .map(([key, value]) => `${ACTIVITY_LABELS[key] ?? key}: ${value}`)
  .join(' · ')
const label = [dateLabel, totalLabel, accessibleDetails].filter(Boolean).join(' · ')
```

该逻辑必须满足：零值项不进入视觉内容或 `aria-label`；未知 key 使用原始 key；无 `breakdown` 时保留现有活动语义。

- [ ] **Step 2：将 Tooltip 单段文本替换为三级语义结构**

保持 `S.Tooltip` 的定位属性不变，将其子内容替换为：

```tsx
<S.Tooltip $visible={visible} $vertical={vertical} $horizontal={horizontal}>
  <S.TooltipDate>{dateLabel}</S.TooltipDate>
  <S.TooltipTotal>{totalLabel}</S.TooltipTotal>
  {details.length > 0 && (
    <S.TooltipDetails>
      {details.map(([key, value]) => (
        <S.TooltipDetail key={key}>
          <S.TooltipDetailLabel>{ACTIVITY_LABELS[key] ?? key}</S.TooltipDetailLabel>
          <S.TooltipDetailValue>{value}</S.TooltipDetailValue>
        </S.TooltipDetail>
      ))}
    </S.TooltipDetails>
  )}
</S.Tooltip>
```

- [ ] **Step 3：运行测试，确认内容结构测试进入下一处预期失败或通过**

运行：

```bash
node --test packages/components/heatmap/heatmap-layout.test.mjs
```

预期：结构化内容和交互断言通过；样式尚未被新增测试约束。

### Task 3：建立并实现 Popover 样式回归

**文件：**

- 修改：`packages/components/heatmap/heatmap-layout.test.mjs`
- 修改：`packages/components/heatmap/styles.tsx:78-102`

- [ ] **Step 1：新增失败测试，固定宽度、间距、分隔线和键值布局**

在现有测试文件末尾追加：

```js
test('Tooltip 使用舒适间距、响应式限宽和键值对齐', () => {
  assert.match(styles, /width:\s*clamp\(190px,\s*22vw,\s*240px\)/)
  assert.match(styles, /max-width:\s*calc\(100vw - 32px\)/)
  assert.match(styles, /padding:\s*12px/)
  assert.match(styles, /export const TooltipDetails = styled\.div/)
  assert.match(styles, /border-top:\s*1px solid/)
  assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*1fr\) auto/)
  assert.match(styles, /white-space:\s*nowrap/)
})
```

- [ ] **Step 2：运行测试并确认样式断言失败**

运行：

```bash
node --test packages/components/heatmap/heatmap-layout.test.mjs
```

预期：“Tooltip 使用舒适间距、响应式限宽和键值对齐”失败，原因是现有 Tooltip 仍为 `width: max-content`、`padding: 6px 8px`，且没有明细样式组件。

- [ ] **Step 3：调整 Tooltip 容器宽度与基础排版**

在 `Tooltip` 中保留定位、显隐、`pointer-events` 和 `z-index` 规则，将尺寸及排版调整为：

```css
width: clamp(190px, 22vw, 240px);
max-width: calc(100vw - 32px);
box-sizing: border-box;
padding: 12px;
border-radius: 4px;
white-space: normal;
```

背景和文字颜色继续使用 `var(--text-primary)` 与 `var(--background-color)`，不新增固定色值。

- [ ] **Step 4：添加日期、总量和明细样式组件**

在 `Tooltip` 后新增：

```tsx
export const TooltipDate = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
`

export const TooltipTotal = styled.div`
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
`

export const TooltipDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid color-mix(in oklab, currentColor 22%, transparent);
`

export const TooltipDetail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
  font-size: 12px;
  line-height: 1.5;
`

export const TooltipDetailLabel = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`

export const TooltipDetailValue = styled.span`
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`
```

- [ ] **Step 5：运行 Heatmap 测试并确认全部通过**

运行：

```bash
node --test packages/components/heatmap/heatmap-layout.test.mjs
```

预期：全部测试通过，无失败或跳过项。

### Task 4：静态质量门禁

**文件：**

- 验证：`packages/components/heatmap/index.tsx`
- 验证：`packages/components/heatmap/styles.tsx`
- 验证：`packages/components/heatmap/heatmap-layout.test.mjs`

- [ ] **Step 1：运行前端 lint**

运行：

```bash
pnpm lint:next
```

预期：命令退出码为 0；Heatmap 修改文件没有 lint 错误。

- [ ] **Step 2：运行 TypeScript 类型检查**

运行：

```bash
pnpm typecheck
```

预期：命令退出码为 0；新增 styled-components 导出和 JSX 引用均能正确解析。

- [ ] **Step 3：检查变更格式**

运行：

```bash
git diff --check -- packages/components/heatmap/index.tsx packages/components/heatmap/styles.tsx packages/components/heatmap/heatmap-layout.test.mjs
```

预期：无输出，命令退出码为 0。该命令只检查 diff，不提交或修改 Git 状态。

### Task 5：真实页面交互与响应式验证

**文件：**

- 验证页面：`packages/wuh.site.next/app/about/AboutView.tsx`
- 验证组件：`packages/components/heatmap/index.tsx`

- [ ] **Step 1：通过项目预览工具启动 Next.js 开发服务器并打开 `/about`**

预期：页面成功渲染，浏览器控制台和服务端日志没有新增错误。

- [ ] **Step 2：在 1280px 与 768px 视口检查普通及边缘单元格**

预期：Popover 宽度在 190–240px 范围内；日期、总量和明细层级清晰；名称与数值不重叠；顶部及左右边缘浮窗向组件内部展开且未被裁切。

- [ ] **Step 3：在 375px 与 320px 视口检查响应式边界**

预期：Popover 最大宽度不超过视口减 32px；长分类名称可换行，数值保持单行；页面没有由 Popover 引起的横向滚动。

- [ ] **Step 4：验证鼠标、键盘与点击交互**

预期：hover 显示且移出隐藏；Tab 聚焦显示且失焦隐藏；点击可切换显示状态；焦点单元格仍暴露完整 `aria-label`。

- [ ] **Step 5：切换浅色与深色主题**

预期：背景、标题、总量、明细及低对比度分隔线均清晰可辨；没有新增固定颜色导致的主题不兼容。

- [ ] **Step 6：记录最终验证证据**

在本 brief 的任务项中填写实际验证结果；若任一视口、交互或质量命令失败，保持任务未完成并回到对应 Task 修复，不得以“视觉上应该可用”代替验证。

## 验收标准

- [ ] Popover 按日期、总量和分类明细形成清晰的三级阅读顺序。
- [ ] 分类名称左对齐、数值右对齐，任意支持的视口中均不重叠。
- [ ] 数值为 0 的分类不展示；无有效明细时不出现空分隔线或空明细区。
- [ ] 桌面端 Popover 宽度约为 190–240px，移动端不超过视口可用宽度。
- [ ] 320px、375px、768px 和 1280px 视口中内容不溢出、不被裁切，页面不产生横向滚动。
- [ ] 浅色与深色主题下标题、总量、明细和分隔线均清晰可辨。
- [ ] hover、focus、click、首行向下及左右边缘向内展开行为保持不变。
- [ ] `aria-label` 继续提供完整的日期、总量和分类明细。
- [ ] Heatmap 相关测试、前端 lint 和 TypeScript 类型检查通过。

## 非目标

- 不修改热力图颜色方案、单元格、月份标签、星期标签或图例样式。
- 不修改 About 页面其他区块的布局和视觉设计。
- 不修改后端接口、活动聚合逻辑、共享 DTO 或数据范围。
- 不新增通用 Popover 组件、Portal、动态定位算法或第三方依赖。
- 不改变现有显示和关闭交互，不增加动画或新的操作入口。
