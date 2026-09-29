import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const componentDir = dirname(fileURLToPath(import.meta.url))
const miniPlayerSource = await readFile(resolve(componentDir, 'MiniPlayer.tsx'), 'utf8')

test('标题溢出测量走 ResizeObserver 且随曲目名重测', () => {
  assert.match(miniPlayerSource, /typeof ResizeObserver === 'undefined'/)
  assert.match(miniPlayerSource, /new ResizeObserver\(measure\)/)
  assert.match(miniPlayerSource, /observer\.observe\(wrapper\)/)
  assert.match(miniPlayerSource, /observer\.observe\(ghost\)/)
  assert.match(miniPlayerSource, /const name = currentTrack\?\.name \?\?/)
  assert.match(miniPlayerSource, /useTitleOverflow\(name\)/)
  assert.match(miniPlayerSource, /\}, \[title\]\)/)
  // 禁止为溢出测量引入全局 scroll/resize 监听器（animation-system 约束）
  assert.doesNotMatch(miniPlayerSource, /addEventListener\('resize'/)
})

test('溢出时渲染双份歌名做无缝循环，未溢出保持省略号', () => {
  assert.match(miniPlayerSource, /<TitleCopy aria-hidden='true'>/)
  assert.match(miniPlayerSource, /translateX\(-50%\)/)
  assert.match(miniPlayerSource, /p\.\$marquee \? 'clip' : 'ellipsis'/)
})

test('跑马灯恒速换算时长并带首尾停顿', () => {
  assert.match(miniPlayerSource, /MARQUEE_SPEED_PX_PER_S/)
  assert.match(miniPlayerSource, /\(metrics\.text \+ MARQUEE_GAP_PX\) \/ MARQUEE_SPEED_PX_PER_S/)
  assert.match(miniPlayerSource, /0%, 10% \{ transform: translateX\(0\); \}/)
  assert.match(miniPlayerSource, /90%, 100% \{ transform: translateX\(-50%\); \}/)
})

test('暂停时跑马灯停走，与播放态一致', () => {
  assert.match(
    miniPlayerSource,
    /animation-play-state: \$\{\(p\) => \(p\.\$playing \? 'running' : 'paused'\)\}/
  )
})

test('reduced-motion 降级为静态省略号', () => {
  const blocks = miniPlayerSource.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n  \}/g) ?? []
  assert.ok(
    blocks.some((block) => /animation: none/.test(block)),
    '必须有 reduced-motion 块关闭 marquee 动画'
  )
  assert.ok(
    blocks.some((block) => /text-overflow: ellipsis/.test(block)),
    'reduced-motion 下标题必须回退省略号'
  )
})
