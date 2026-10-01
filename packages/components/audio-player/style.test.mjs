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

test('跑马灯基建三处同源（禁复制实现）', () => {
  const hook = readSource('useMarquee.ts')
  assert.ok(hook.includes('useMarqueeOverflow'), 'useMarquee.ts 缺少 useMarqueeOverflow')
  assert.ok(hook.includes('marquee'), 'useMarquee.ts 缺少 marquee keyframes')
  assert.ok(hook.includes('ResizeObserver'), 'useMarquee.ts 缺少 ResizeObserver 量尺')
  for (const file of ['MiniPlayer.tsx', 'PlayerPanel.tsx']) {
    const source = readSource(file)
    assert.ok(source.includes("from './useMarquee'"), `${file} 必须从 useMarquee 引入跑马灯基建`)
    assert.equal(source.includes('ResizeObserver'), false, `${file} 不得自带量尺实现`)
  }
})

test('循环模式钮 icon-only（三态图标换装，无文字标签）', () => {
  const panel = readSource('PlayerPanel.tsx')
  for (const icon of ['IconRepeat', 'IconRepeatOne', 'IconShuffle']) {
    assert.ok(panel.includes(icon), `PlayerPanel 缺少模式图标 ${icon}`)
  }
  assert.ok(panel.includes('modeDialLabel'), 'PlayerPanel 模式钮 aria 需走 modeDialLabel 词典 key')
  assert.equal(panel.includes('modeGroup'), false, '三钮文字模式带已退役，不得残留')
})

test('音量 popover：图标钮 + 竖向滑杆 + aria 同步', () => {
  const panel = readSource('PlayerPanel.tsx')
  assert.ok(panel.includes('aria-haspopup'), '音量钮缺 aria-haspopup')
  assert.ok(panel.includes('aria-expanded'), '音量/抽屉钮缺 aria-expanded')
  assert.ok(panel.includes("aria-orientation='vertical'"), '竖向滑杆缺 aria-orientation')
  assert.ok(panel.includes("role='slider'"), '竖向滑杆缺 role=slider')
  assert.ok(panel.includes('setVolume'), '竖向滑杆需接 setVolume')
})

test('墨痕歌词为纯装饰层且可关停', () => {
  const panel = readSource('PlayerPanel.tsx')
  assert.ok(panel.includes('GhostLayer'), 'PlayerPanel 缺少墨痕歌词层')
  assert.ok(panel.includes('GhostLayer aria-hidden'), '墨痕歌词层必须 aria-hidden')
})

test('播放列表歌手列限宽省略', () => {
  const panel = readSource('PlayerPanel.tsx')
  assert.ok(panel.includes('QueueArtist'), 'PlayerPanel 缺少限宽歌手列')
})

test('拉丁文语境字距降档走 html[lang] 钩子', () => {
  const panel = readSource('PlayerPanel.tsx')
  assert.ok(panel.includes("[lang='en']"), 'PlayerPanel 缺少 [lang=en] 字距降档钩子')
})

test('显隐态组件走行内样式驱动（动态类规则删除竞态免疫，music-player.md）', () => {
  const panel = readSource('PlayerPanel.tsx')
  // 词卷开关 $on、抽屉 $open 的 styled 插值形态已退役——选择器/动态类驱动激活态两连败禁入
  assert.doesNotMatch(panel, /\$on \?|\$open \?/)
  assert.doesNotMatch(panel, /<DrawerScrim \$open/)
  assert.doesNotMatch(panel, /<DrawerCard \$open/)
  assert.doesNotMatch(panel, /<WordsToggle \$on/)
  // JSX 行内挂载在场
  assert.ok(panel.includes("'--tick-fill': 1"), 'PageTick 选中态行内自定义属性缺失')
})

test('舞台预算：封面为因变量（帽与面板高度同源）+ 题名/歌手空间承诺（20261001 精修）', () => {
  const panel = readSource('PlayerPanel.tsx')
  // 面板高 = 100vh - 96px（inset 48px）：封面帽必须与之同源，常态档 252；
  // 旧帽 min(290px, 32vh) 与面板高度不同源，视口 ≤~920px 时题名被裁（生产实锤），禁入
  assert.match(panel, /min\(252px,\s*calc\(\(100vh - 96px\) \* 0\.3\)\)/, 'PlateArt 缺常态同源帽 252')
  assert.doesNotMatch(panel, /min\(290px,\s*32vh\)/, 'PlateArt 残留旧裸 32vh 帽')
  // 分档按视口高度驱动且经常量插值：一档 224 / 二档 184
  assert.match(panel, /max-height: \$\{STAGE_TIER_SHORT\}px/, '缺矮视口一档 max-height 规则')
  assert.match(panel, /min\(224px,\s*calc\(\(100vh - 96px\) \* 0\.3\)\)/, '缺一档 224 同源帽')
  assert.match(panel, /max-height: \$\{STAGE_TIER_COMPACT\}px/, '缺矮视口二档 max-height 规则')
  assert.match(panel, /min\(184px,\s*calc\(\(100vh - 96px\) \* 0\.26\)\)/, '缺二档 184 同源帽')
  // 题名/歌手行空间承诺：舞台再穷也不可挤压
  const titleBlock = panel.slice(panel.indexOf('const StageTitle'), panel.indexOf('const StageGhost'))
  assert.match(titleBlock, /flex-shrink: 0/, 'StageTitle 缺 flex-shrink: 0')
  const artistBlock = panel.slice(panel.indexOf('const StageArtist'), panel.indexOf('const Epigraph'))
  assert.match(artistBlock, /flex-shrink: 0/, 'StageArtist 缺 flex-shrink: 0')
  // 二档缓冲：非当前句题跋让位（语义：当前句±0，mask 渐隐语义保留）
  const epiBlock = panel.slice(panel.indexOf('const EpiRow'), panel.indexOf('/* ===== dock'))
  assert.match(epiBlock, /max-height: \$\{STAGE_TIER_COMPACT\}px[\s\S]*?display: none/, '题跋二档缓冲规则缺失')
})

test('STYLE_SOURCES 指向存在的文件', () => {
  for (const path of STYLE_SOURCES) {
    assert.ok(readFileSync(path, 'utf8').length > 0, `${path} 为空`)
  }
})
