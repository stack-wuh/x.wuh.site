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

test('凹槽滑杆（音量）：定制 range 保留凹槽几何，进度自此改行度曲尺', () => {
  assert.match(src, /-webkit-appearance: none/)
  assert.match(src, /::-webkit-slider-runnable-track/)
  assert.match(src, /::-webkit-slider-thumb/)
  assert.match(src, /::-moz-range-progress/)
  assert.match(src, /\$fill/)
  assert.match(src, /background: var\(--background-100\)/)
})

test('度曲尺进度：双层刻度 + 已播朱砂层 + 指针，交互仍是原生 range 透明覆盖', () => {
  // 刻度层：单一声明 prop 化（细刻/主刻 × 余段/已播），JSX 组合出四层
  const layerBlock = src.slice(src.indexOf('const RulerLayer'), src.indexOf('const RulerNeedle'))
  assert.ok(layerBlock.length > 0, 'RulerLayer 定义缺失')
  assert.match(layerBlock, /repeating-linear-gradient\(\s*90deg/)
  assert.match(layerBlock, /\$major/)
  assert.match(layerBlock, /\$on/)
  // 已播段必须整宽裁切（clip-path），窄条宽度会让刻度周期随宽度收缩、与余段错位
  assert.match(layerBlock, /clip-path: inset/)
  const layerUsages = src.match(/<RulerLayer[^>]*\/>/g) ?? []
  assert.equal(layerUsages.length, 4, `RulerLayer 应组合 4 层（细/主 × 余/已播），实际 ${layerUsages.length}`)
  assert.equal(layerUsages.filter((u) => u.includes('$major')).length, 2, '主刻层应 2 层')
  assert.equal(layerUsages.filter((u) => u.includes('$on')).length, 2, '已播层应 2 层')
  assert.match(src, /const RulerNeedle/)
  const rangeBlock = src.slice(src.indexOf('const RulerRange'), src.indexOf('const MODE_LABELS'))
  assert.ok(rangeBlock.length > 0, 'RulerRange 定义缺失')
  assert.match(rangeBlock, /appearance: none/)
  assert.match(rangeBlock, /background: transparent/)
  assert.match(src, /<RulerRange\s+type='range'/)
})

test('时间码嵌尺两端：独立 TimeRow 移除，mono 时间码与尺同行', () => {
  assert.doesNotMatch(src, /const TimeRow/)
  const timeCodeBlock = src.slice(src.indexOf('const TimeCode'), src.indexOf('const Ruler ='))
  assert.ok(timeCodeBlock.length > 0, 'TimeCode 定义缺失')
  assert.match(timeCodeBlock, /font-family: var\(--font-mono\)/)
  assert.match(timeCodeBlock, /line-height: 1/)
  assert.match(timeCodeBlock, /\$now/)
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
