import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const component = readFileSync(new URL('./index.tsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('./styles.tsx', import.meta.url), 'utf8')

test('月份、星期与周列共享响应式网格且不使用横向滚动', () => {
  assert.doesNotMatch(styles, /overflow-x:\s*auto/)
  assert.match(styles, /--heatmap-columns:/)
  assert.match(styles, /grid-template-columns:\s*var\(--heatmap-columns\)/)
  assert.match(styles, /repeat\(53,\s*minmax\(0,\s*1fr\)\)/)
  assert.doesNotMatch(component, /weekIndex\s*\*\s*15/)
  assert.match(component, /column:\s*weekIndex\s*\+\s*2/)
})

test('Tooltip 根据顶部和左右边缘向组件内部展开并允许换行', () => {
  assert.match(component, /vertical=\{rowIndex === 0 \? 'down' : 'up'\}/)
  assert.match(component, /horizontal=\{colIndex < 4 \? 'left' : colIndex >= data\.weeks\.length - 4 \? 'right' : 'center'\}/)
  assert.match(styles, /white-space:\s*normal/)
  assert.match(styles, /max-width:\s*calc\(100vw - 32px\)/)
})

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

test('Tooltip 使用舒适间距、响应式限宽和键值对齐', () => {
  assert.match(styles, /width:\s*clamp\(190px,\s*22vw,\s*240px\)/)
  assert.match(styles, /max-width:\s*calc\(100vw - 32px\)/)
  assert.match(styles, /padding:\s*12px/)
  assert.match(styles, /export const TooltipDetails = styled\.div/)
  assert.match(styles, /border-top:\s*1px solid/)
  assert.match(styles, /grid-template-columns:\s*minmax\(0,\s*1fr\) auto/)
  assert.match(styles, /white-space:\s*nowrap/)
})
