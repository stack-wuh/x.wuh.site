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
  assert.match(src, /translateY\(\$\{dEl\.offsetTop/)
  assert.match(src, /translateY\(\$\{mEl\.offsetTop/)
  assert.match(src, /classList\.add\('on'\)/)
  assert.doesNotMatch(src, /addEventListener\('scroll/)
  assert.doesNotMatch(src, /addEventListener\('resize'/)
})

test('dock 结构：桌面锚定面板底边 / 移动端册页化（pages + ticks + dock）', () => {
  assert.match(src, /grid-template-areas: 'now lyrics queue' 'dock lyrics queue'/)
  assert.match(src, /grid-template-areas: 'pages' 'ticks' 'dock'/)
  assert.doesNotMatch(src, /'header' 'tabs' 'body' 'dock'/)
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

test('册页横翻：MobileTabs/MobileSection 退役，scroll-snap 对页 + 页缘翻页钮', () => {
  assert.doesNotMatch(src, /const Mobile(Tabs?|Section)\b/)
  const pagesBlock = src.slice(src.indexOf('const LeafPages ='), src.indexOf('const LeafPage ='))
  assert.ok(pagesBlock.length > 0, 'LeafPages 定义缺失')
  assert.match(pagesBlock, /scroll-snap-type/)
  assert.match(pagesBlock, /scrollbar-width: none/)
  assert.match(src, /scroll-snap-align: start/)
  const tickBlock = src.slice(src.indexOf('const PageTicks ='), src.indexOf('const MODE_LABELS'))
  assert.ok(tickBlock.length > 0, 'PageTicks 定义缺失')
  assert.match(tickBlock, /scaleX\(/)
  const tickButtonBlock = src.slice(src.indexOf('const PageTick ='), src.indexOf('/* ===== 右侧：歌词 / 播放列表 ===== */'))
  assert.ok(tickButtonBlock.length > 0, 'PageTick 定义缺失')
  // 选中态必须挂 aria-current 属性选择器（静态 CSS），禁 transient 三元插值（动态类规则删除竞态）
  assert.match(tickButtonBlock, /&\[aria-current='true'\]/)
  assert.doesNotMatch(tickButtonBlock, /\$active/)
  assert.match(src, /aria-current=/)
  assert.match(src, /onScroll=\{/)
})

test('装裱图版：纸框发丝线 + 纸边 + 内发丝线 + mono 朱砂题签 + 居中题名', () => {
  const plateBlock = src.slice(src.indexOf('const Plate ='), src.indexOf('const PlateNo ='))
  assert.ok(plateBlock.length > 0, 'Plate/PlateArt 定义缺失')
  assert.match(plateBlock, /padding: 10px/)
  assert.match(plateBlock, /border: 1px solid/)
  assert.match(plateBlock, /inset 0 0 0 1px/)
  const noBlock = src.slice(src.indexOf('const PlateNo ='), src.indexOf('const LeafTitle ='))
  assert.ok(noBlock.length > 0, 'PlateNo 定义缺失')
  assert.match(noBlock, /font-family: var\(--font-mono\)/)
  assert.match(noBlock, /var\(--primary-color\)/)
  const titleBlock = src.slice(src.indexOf('const LeafTitle ='), src.indexOf('const LeafArtist ='))
  assert.ok(titleBlock.length > 0, 'LeafTitle 定义缺失')
  assert.match(titleBlock, /text-align: center/)
  assert.doesNotMatch(titleBlock, /text-overflow: ellipsis/)
})

test('短词窗：mask 渐隐 + 点按跳播 + 「词未录」印章空态', () => {
  const winBlock = src.slice(src.indexOf('const WordWindow ='), src.indexOf('const WordLine ='))
  assert.ok(winBlock.length > 0, 'WordWindow 定义缺失')
  assert.match(winBlock, /mask-image: linear-gradient/)
  assert.match(winBlock, /overflow: hidden/)
  const lineBlock = src.slice(src.indexOf('const WordLine ='), src.indexOf('const WordEmpty ='))
  assert.ok(lineBlock.length > 0, 'WordLine 定义缺失')
  assert.match(lineBlock, /font-family: var\(--font-serif\)/)
  assert.match(lineBlock, /text-align: center/)
  assert.match(src, /onClick=\{\(\) => seek\(line\.time\)\}/)
  const emptyBlock = src.slice(src.indexOf('const WordEmpty ='), src.indexOf('const PageTicks ='))
  assert.ok(emptyBlock.length > 0, 'WordEmpty 定义缺失')
  assert.match(emptyBlock, /var\(--primary-color\)/)
  assert.match(src, /词未录/)
})

test('下滑关闭手柄：横杆手柄 + 拖拽跟手（$drag 位移）+ 阈值关闭', () => {
  const grabBlock = src.slice(src.indexOf('const GrabHandle ='), src.indexOf('const LeafPages ='))
  assert.ok(grabBlock.length > 0, 'GrabHandle 定义缺失')
  assert.match(grabBlock, /&::before/)
  assert.match(src, /onTouchStart/)
  assert.match(src, /onTouchMove/)
  assert.match(src, /onTouchEnd/)
  assert.match(src, /\$drag/)
  assert.match(src, /togglePanel\(\)/)
})
