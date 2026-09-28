import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// 播放器样式纪律门禁（shadow-docs/knowledge/design-system.md + norms/ui-patterns.md）：
// 颜色只走主题变量、断点只用 BREAKPOINTS 语义常量、动效不碰布局属性、
// 暗色淡化禁 --text-secondary、无障碍与 reduced-motion 必须在场。
const dir = dirname(fileURLToPath(import.meta.url))
const STYLE_SOURCES = ['MiniPlayer.tsx', 'PlayerPanel.tsx'].map((file) => join(dir, file))

const readSource = (file) => readFileSync(join(dir, file), 'utf8')

test('styled 源码不使用裸十六进制色值（颜色必须经主题变量）', () => {
  for (const file of ['MiniPlayer.tsx', 'PlayerPanel.tsx']) {
    const source = readSource(file)
    const match = source.match(/#[0-9a-fA-F]{3,8}\b/)
    assert.equal(match, null, `${file} 出现裸十六进制色值: ${match?.[0]}`)
  }
})

test('media query 不使用裸断点数值（必须经 BREAKPOINTS 常量插值）', () => {
  for (const file of ['MiniPlayer.tsx', 'PlayerPanel.tsx']) {
    const source = readSource(file)
    const match = source.match(/@media[^{]*\(\s*(?:max|min)-width\s*:\s*\d/)
    assert.equal(match, null, `${file} 出现裸断点: ${match?.[0]}`)
  }
})

test('不引用 --text-secondary（暗色调色板方向反转，淡化用 --text-color 的 color-mix）', () => {
  for (const file of ['MiniPlayer.tsx', 'PlayerPanel.tsx']) {
    const source = readSource(file)
    assert.equal(source.includes('--text-secondary'), false, `${file} 引用了 --text-secondary`)
  }
})

test('transition 不作用于布局属性（width/height/top/left）', () => {
  for (const file of ['MiniPlayer.tsx', 'PlayerPanel.tsx']) {
    const source = readSource(file)
    const match = source.match(/transition[^;\n]*\b(?:width|height|top|left)\b/)
    assert.equal(match, null, `${file} 存在布局位移动画: ${match?.[0]}`)
  }
})

test('无障碍与动效降级基线在场', () => {
  for (const file of ['MiniPlayer.tsx', 'PlayerPanel.tsx']) {
    const source = readSource(file)
    assert.ok(source.includes('aria-label'), `${file} 缺少 aria-label`)
    assert.ok(source.includes('prefers-reduced-motion'), `${file} 缺少 prefers-reduced-motion 降级`)
  }
  const mini = readSource('MiniPlayer.tsx')
  assert.ok(mini.includes("role='status'"), 'MiniPlayer 需保留跳过提示 role=status 语义')
  const panel = readSource('PlayerPanel.tsx')
  assert.ok(panel.includes("'Escape'"), 'PlayerPanel 需支持 Escape 关闭')
  assert.ok(panel.includes('safe-area-inset-bottom'), 'PlayerPanel 移动端需适配安全区')
})

test('STYLE_SOURCES 指向存在的文件', () => {
  for (const path of STYLE_SOURCES) {
    assert.ok(readFileSync(path, 'utf8').length > 0, `${path} 为空`)
  }
})
