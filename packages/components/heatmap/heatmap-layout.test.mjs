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
  assert.match(styles, /max-width:\s*min\(280px,\s*calc\(100vw - 32px\)\)/)
})
