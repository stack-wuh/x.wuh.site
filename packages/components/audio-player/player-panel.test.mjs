import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const componentDir = dirname(fileURLToPath(import.meta.url))
const src = await readFile(resolve(componentDir, 'PlayerPanel.tsx'), 'utf8')

test('晕染纸底配方：模糊色场 + 纸色罩 + 文字列局部纸罩 + 暗色反转', () => {
  assert.match(src, /blur\(64px\)/)
  assert.match(src, /saturate\(0\.92\)/)
  assert.match(src, /brightness\(1\.18\)/)
  assert.match(src, /brightness\(0\.62\)/)
  assert.match(src, /\[data-color-scheme='dark'\]/)
  assert.match(src, /color-mix\(in oklab, var\(--background-100\) 72%, transparent\)/)
  assert.match(src, /color-mix\(in oklab, var\(--background-100\) 40%, transparent\)/)
  // 旧「原图 1:1 铺满」晕染必须移除
  assert.doesNotMatch(src, /CoverWash|WashScrim/)
  assert.doesNotMatch(src, /brightness\(1\.04\)/)
})

test('纸纹叠印：噪点印进纸里而非悬浮发光', () => {
  assert.match(src, /feTurbulence/)
  assert.match(src, /mix-blend-mode: multiply/)
  assert.match(src, /pointer-events: none/)
})

test('歌词签名：当前句放大 + 朱砂侧标 + 书写显现 + 相邻句淡化', () => {
  assert.match(src, /const writeIn = keyframes/)
  assert.match(src, /animation: \$\{writeIn\}/)
  assert.match(src, /font-size: var\(--font-size-lg\)/)
  assert.match(src, /background: var\(--primary-color\)/)
  assert.match(src, /\$near/)
  assert.match(src, /font-family: var\(--font-serif\)/)
})

test('墨随声走：墨晕跟随当前句位移，不引入滚动监听', () => {
  assert.match(src, /LyricBloom/)
  assert.match(src, /BloomRef = useRef/)
  assert.match(src, /translateY\(\$\{el\.offsetTop/)
  assert.match(src, /classList\.add\('on'\)/)
  assert.doesNotMatch(src, /addEventListener\('scroll/)
  assert.doesNotMatch(src, /addEventListener\('resize'/)
})

test('dock 结构：桌面锚定面板底边 / 移动端吸底 safe-area', () => {
  assert.match(src, /grid-template-areas: 'now lyrics queue' 'dock lyrics queue'/)
  assert.match(src, /grid-template-areas: 'header' 'tabs' 'body' 'dock'/)
  assert.match(src, /env\(safe-area-inset-bottom/)
})

test('播放列表序号与朱砂左标', () => {
  assert.match(src, /padStart\(2, '0'\)/)
})

test('既有交互保持：焦点管理 / Escape / 歌词跟随 / 弹层语义', () => {
  assert.match(src, /'Escape'/)
  assert.match(src, /restoreFocusRef/)
  assert.match(src, /scrollIntoView/)
  assert.match(src, /role='dialog'/)
  assert.match(src, /aria-modal='true'/)
})

test('reduced-motion 降级必须存在', () => {
  assert.match(src, /prefers-reduced-motion: reduce/)
})

test('控制甲板 gutter：桌面左栏获得装裱内距，甲板离开面板边缘', () => {
  assert.match(src, /padding: var\(--space-xl\) 0 0 var\(--space-xl\)/)
  assert.match(src, /padding: 0 var\(--space-lg\) var\(--space-xl\) var\(--space-xl\)/)
})

test('进度/音量接入共享 Progress 交互态（度曲尺与凹槽私有实现已退役）', () => {
  assert.doesNotMatch(src, /RulerLayer|RulerNeedle|RulerRange|GrooveSlider|VolumeSlider|TICK_MINOR|TICK_MAJOR/)
  assert.match(src, /import Progress from '@wuh\.site\/components\/progress'/)
  // 进度：百分比换算（progressPct*100 进、seek 回写秒），印光标 + 播放态呼吸晕接真实 playing
  assert.match(src, /<Progress\s+value=\{progressPct \* 100\}/)
  assert.match(src, /onChange=\{\(pct\) => seek\(\(pct \/ 100\) \* totalDuration\)\}/)
  assert.match(src, /breathing=\{playing\}/)
  // 音量：120px 原位窄条，0-100 换算
  assert.match(src, /<Progress\s+value=\{state\.volume \* 100\}/)
  assert.match(src, /onChange=\{\(v\) => setVolume\(v \/ 100\)\}/)
  assert.match(src, /const VolumeBox = styled\.div`/)
  assert.match(src, /width: 120px/)
})

test('进度行布局：时间码两端保留，中段为共享进度条', () => {
  assert.doesNotMatch(src, /const TimeRow/)
  const timeCodeBlock = src.slice(src.indexOf('const TimeCode'), src.indexOf('const ControlRow'))
  assert.ok(timeCodeBlock.length > 0, 'TimeCode 定义缺失')
  assert.match(timeCodeBlock, /font-family: var\(--font-mono\)/)
  assert.match(timeCodeBlock, /line-height: 1/)
  assert.match(timeCodeBlock, /\$now/)
  assert.match(src, /<ProgressRow>/)
  assert.match(src, /<TimeCode \$now>/)
})

test('传输钮居中：桌面与移动同构图，修复左聚失衡', () => {
  const ctlBlock = src.slice(src.indexOf('const ControlRow'), src.indexOf('const SkipButton'))
  assert.ok(ctlBlock.length > 0)
  const basePart = ctlBlock.slice(0, ctlBlock.indexOf('@media'))
  assert.match(basePart, /justify-content: center/)
})

test('幽灵传输与碟面环：层级收敛到唯一实心盘', () => {
  const skipBlock = src.slice(src.indexOf('const SkipButton'), src.indexOf('const PlayButton'))
  assert.ok(skipBlock.length > 0)
  assert.match(skipBlock, /border: none/)
  assert.doesNotMatch(skipBlock, /border: 1px solid/)
  assert.match(src, /inset: 9px/)
})

test('下划线模式带：文字带替代描边 pill，图标退场', () => {
  const modeBlock = src.slice(src.indexOf('const ModeButton'), src.indexOf('const VolumeRow'))
  assert.ok(modeBlock.length > 0)
  assert.match(modeBlock, /border-bottom: 2px solid/)
  assert.doesNotMatch(modeBlock, /border-radius: 999px/)
  assert.doesNotMatch(src, /IconRepeat|IconShuffle/)
  assert.match(src, /aria-pressed/)
})

test('弹层滚动锁：面板打开锁 body 滚动（Dialog lockScroll 配方），关闭还原滚动位置', () => {
  assert.match(src, /document\.body\.style\.overflow = 'hidden'/)
  assert.match(src, /document\.body\.style\.position = 'fixed'/)
  assert.match(src, /top = `-\$\{scrollY\}px`/)
  assert.match(src, /window\.scrollTo\(0, scrollY\)/)
})
