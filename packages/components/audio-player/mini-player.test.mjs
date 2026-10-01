import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const componentDir = dirname(fileURLToPath(import.meta.url))
const miniPlayerSource = await readFile(resolve(componentDir, 'MiniPlayer.tsx'), 'utf8')
const marqueeSource = await readFile(resolve(componentDir, 'useMarquee.ts'), 'utf8')

test('标题溢出测量走共享 useMarquee 量尺（ResizeObserver 单点实现）', () => {
  assert.match(miniPlayerSource, /const name = currentTrack\?\.name \?\?/)
  assert.match(miniPlayerSource, /useMarqueeOverflow\(name\)/)
  assert.match(miniPlayerSource, /from '\.\/useMarquee'/)
  // 量尺实现（ResizeObserver + observe wrapper/ghost）单点存放于 useMarquee.ts，禁复制
  assert.match(marqueeSource, /typeof ResizeObserver === 'undefined'/)
  assert.match(marqueeSource, /new ResizeObserver\(measure\)/)
  assert.match(marqueeSource, /observer\.observe\(wrapper\)/)
  assert.match(marqueeSource, /observer\.observe\(ghost\)/)
  // 禁止为溢出测量引入全局 scroll/resize 监听器（animation-system 约束）
  assert.doesNotMatch(miniPlayerSource, /addEventListener\('resize'/)
  assert.doesNotMatch(marqueeSource, /addEventListener\('resize'/)
})

test('溢出时渲染双份歌名做无缝循环，未溢出保持省略号', () => {
  assert.match(miniPlayerSource, /<TitleCopy aria-hidden='true'>/)
  assert.match(miniPlayerSource, /p\.\$marquee \? 'clip' : 'ellipsis'/)
  // 0→-50% 无缝循环关键帧单点存放于 useMarquee.ts
  assert.match(marqueeSource, /translateX\(-50%\)/)
})

test('跑马灯恒速换算时长并带首尾停顿', () => {
  assert.match(miniPlayerSource, /MARQUEE_SPEED_PX_PER_S/)
  assert.match(miniPlayerSource, /\(metrics\.text \+ MARQUEE_GAP_PX\) \/ MARQUEE_SPEED_PX_PER_S/)
  assert.match(marqueeSource, /MARQUEE_GAP_PX = 48/)
  assert.match(marqueeSource, /MARQUEE_SPEED_PX_PER_S = 30/)
  assert.match(marqueeSource, /0%, 10% \{ transform: translateX\(0\); \}/)
  assert.match(marqueeSource, /90%, 100% \{ transform: translateX\(-50%\); \}/)
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

test('收起态书耳播放中换装墨柱等化器，暂停回落展开箭头', () => {
  // 书耳与印章都携带播放态 transient prop（源码中两处同型签名）
  const typed = miniPlayerSource.match(/styled\.button<\{ \$visible: boolean; \$playing: boolean \}>/g) ?? []
  assert.ok(typed.length >= 2, 'CollapsedEar 与 SealButton 都要接 $playing')
  // 播放中渲染展开卡同款 Equalizer（零新视觉语汇），暂停/空闲渲染箭头
  assert.match(miniPlayerSource, /\{playing \? \(\s*<Equalizer \$playing=\{playing\} aria-hidden='true'>/)
  assert.match(miniPlayerSource, /<IconChevronRight size=\{16\} \/>/)
})

test('移动端印章播放中泛朱砂涟漪环，暂停静止', () => {
  assert.match(miniPlayerSource, /const ripple = keyframes/)
  // keyframes 插值必须经 css 帮助函数包裹（裸字符串会运行时报错）；动画只在播放态启动，暂停回到 none
  assert.match(
    miniPlayerSource,
    /animation: \$\{\(p\) => \(p\.\$playing \? css`\$\{ripple\} [^`]*infinite` : 'none'\)\}/
  )
})

test('收起态声源动效尊重 reduced-motion', () => {
  const blocks = miniPlayerSource.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n  \}/g) ?? []
  assert.ok(
    blocks.some((block) => /&::after/.test(block) && /animation: none/.test(block)),
    'reduced-motion 下印章涟漪必须关闭'
  )
})
