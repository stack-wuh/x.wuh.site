import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const stylesPath = resolve(testDir, 'guestbook-barrage.styles.ts')
const stylesSource = await readFile(stylesPath, 'utf8')

const componentSource = (name) =>
  stylesSource.match(new RegExp(`export const ${name} = styled(?:\\.[a-z]+|\\([^)]*\\))?\\x60([\\s\\S]*?)\\x60`))?.[1] ?? ''

test('留言板入口使用纸张轻染并同步过渡交互状态', () => {
  const trigger = componentSource('GuestbookTrigger')
  assert.match(trigger, /transition:[\s\S]*220ms ease/)
  assert.match(trigger, /linear-gradient\(\s*105deg,[\s\S]*var\(--primary-color\)/)
  assert.doesNotMatch(trigger, /linear-gradient\([^)]*var\(--accent-color\)/)
  assert.match(trigger, /\[data-color-scheme=["']dark["']\]\s*&/)
  assert.doesNotMatch(trigger, /prefers-color-scheme:\s*dark/)
  assert.match(trigger, /&:hover,[\s\S]*&:focus-visible/)
  assert.match(trigger, /var\(--background-100\)/)
  assert.match(trigger, /&:hover,[\s\S]*&:focus-visible[\s\S]*--guestbook-trigger-title:\s*var\(--text-primary\)/)
  assert.match(trigger, /--guestbook-trigger-preview:\s*var\(--text-secondary\)/)
  assert.match(trigger, /--guestbook-trigger-cta:\s*var\(--primary-color\)/)
  assert.doesNotMatch(trigger, /translate|scale\(/)
  assert.match(trigger, /prefers-reduced-motion:\s*reduce/)
})

test('留言板入口文字层级使用统一颜色过渡', () => {
  for (const [name, nextName] of [
    ['GuestbookTriggerTitle', 'GuestbookTriggerPreview'],
    ['GuestbookTriggerPreview', 'GuestbookTriggerCta'],
    ['GuestbookTriggerCta', null],
  ]) {
    const source = componentSource(name, nextName)
    assert.match(source, /transition:\s*color 220ms ease/)
  }
})
