import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const componentDir = dirname(fileURLToPath(import.meta.url))
const src = await readFile(resolve(componentDir, 'PlayerPanel.tsx'), 'utf8')

test('晕染纸底配方：模糊色场 + 纸色罩 + 词卷局部纸罩 + 暗色反转', () => {
  assert.match(src, /blur\(64px\)/)
  assert.match(src, /saturate\(0\.92\)/)
  assert.match(src, /brightness\(1\.18\)/)
  assert.match(src, /brightness\(0\.62\)/)
  assert.match(src, /\[data-color-scheme='dark'\]/)
  assert.match(src, /color-mix\(in oklab, var\(--background-100\) 72%, transparent\)/)
  // 词卷展开态整幅铺局部纸罩（88%），盖过晕染色场保证词句对比度
  assert.match(src, /color-mix\(in oklab, var\(--background-100\) 88%, transparent\)/)
  // 旧「原图 1:1 铺满」晕染必须移除
  assert.doesNotMatch(src, /CoverWash|WashScrim/)
  assert.doesNotMatch(src, /brightness\(1\.04\)/)
})

test('纸纹叠印：噪点印进纸里而非悬浮发光', () => {
  assert.match(src, /feTurbulence/)
  assert.match(src, /mix-blend-mode: multiply/)
  assert.match(src, /pointer-events: none/)
})

test('题跋签名：界格笺三行 + 当前句大字居格 + 朱砂句读环', () => {
  assert.match(src, /const Epigraph = styled\.div/)
  assert.match(src, /const EpiRow = styled\.p/)
  const epiBlock = src.slice(src.indexOf('const EpiRow ='), src.indexOf('/* ===== dock'))
  assert.match(epiBlock, /border-bottom: 1px solid \$\{RULE_LINE\}/)
  assert.match(epiBlock, /font-family: var\(--font-serif\)/)
  assert.match(epiBlock, /font-size: 22px/)
  assert.match(epiBlock, /border: 1\.5px solid var\(--primary-color\)/)
})

test('墨随声走：移动词窗墨晕跟随当前句位移，不引入滚动监听', () => {
  assert.match(src, /const WordBloom = styled\.div/)
  assert.match(src, /BloomRef = useRef/)
  assert.match(src, /translateY\(\$\{mEl\.offsetTop/)
  assert.match(src, /classList\.add\('on'\)/)
  assert.doesNotMatch(src, /addEventListener\('scroll/)
  assert.doesNotMatch(src, /addEventListener\('resize'/)
})

test('dock 结构：桌面舞台/码头两行 / 移动端册页化（pages + ticks + dock）', () => {
  assert.match(src, /grid-template-areas: 'stage' 'dock'/)
  assert.match(src, /grid-template-areas: 'pages' 'ticks' 'dock'/)
  assert.doesNotMatch(src, /'now lyrics queue'/)
  assert.match(src, /env\(safe-area-inset-bottom/)
})

test('居中单焦点舞台：装裱天薄地厚 + 竖排题签 + 暖晕', () => {
  assert.match(src, /const NowStage = styled\.div/)
  assert.match(src, /align-items: center/)
  assert.match(src, /const Plate = styled\.div/)
  assert.match(src, /padding: var\(--space-sm\) var\(--space-sm\) calc\(var\(--space-sm\) \* 2\)/)
  assert.match(src, /writing-mode: vertical-rl/)
  assert.match(src, /const StageGlow = styled\.div/)
  assert.match(src, /radial-gradient\(50% 50% at 50% 50%/)
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

test('控制甲板：桌面进度行 460px 居中，码头离开面板边缘', () => {
  assert.match(src, /width: min\(100%, 460px\)/)
  assert.match(src, /margin: 0 auto/)
  assert.match(src, /padding: 0 var\(--space-lg\) var\(--space-xl\)/)
})

test('进度接共享 Progress；音量为竖向樂印滑杆（私有横条退役）', () => {
  assert.doesNotMatch(src, /RulerLayer|RulerNeedle|RulerRange|GrooveSlider|VolumeSlider|TICK_MINOR|TICK_MAJOR/)
  assert.match(src, /import Progress from '@wuh\.site\/components\/progress'/)
  // 进度：progressPct 已是 0–100 百分数，value 直传——二次 ×100 灌 0–10000 被钳 100，光标钉死末端（回归根因）
  assert.match(src, /<Progress\s+value=\{progressPct\}/)
  assert.doesNotMatch(src, /value=\{progressPct \* 100\}/)
  assert.match(src, /onChange=\{\(pct\) => seek\(\(pct \/ 100\) \* totalDuration\)\}/)
  assert.match(src, /breathing=\{playing\}/)
  // 音量：竖向樂印滑杆（role=slider + 竖向 aria + 指针/键盘），印光标语言与共享 Progress 同源
  assert.match(src, /const VSlider = styled\.div/)
  assert.match(src, /role='slider'/)
  assert.match(src, /aria-orientation='vertical'/)
  assert.match(src, /setVolume\(Math\.min\(1, Math\.max\(0, pct\)\)\)/)
  assert.doesNotMatch(src, /const VolumeBox = styled\.div`/)
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

test('循环模式钮：icon-only 三态换装 + 点击循环 + modeDialLabel aria', () => {
  const modeBlock = src.slice(src.indexOf('const ModeButton'), src.indexOf('/* 音量'))
  assert.ok(modeBlock.length > 0, 'ModeButton 定义缺失')
  assert.match(modeBlock, /color: var\(--primary-color\)/)
  assert.match(modeBlock, /border-radius: 50%/)
  // 文字模式带（--mode-line/--mode-ink）已退役；图标本身即当前模式态
  assert.doesNotMatch(src, /--mode-line|--mode-ink/)
  assert.doesNotMatch(src, /aria-pressed=\{state\.mode === mode\}/)
  // 三态图标换装 + 循环 + 词典 aria
  assert.match(src, /const MODE_ICONS: Record<PlayerMode, typeof IconRepeat>/)
  assert.match(src, /order: IconRepeat/)
  assert.match(src, /'repeat-one': IconRepeatOne/)
  assert.match(src, /shuffle: IconShuffle/)
  assert.match(src, /MODE_CYCLE\[\(MODE_CYCLE\.indexOf\(state\.mode\) \+ 1\) % MODE_CYCLE\.length\]/)
  assert.match(src, /t\('player\.panel\.modeDialLabel'/)
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
  const tickBlock = src.slice(src.indexOf('const PageTicks ='), src.indexOf('const MODE_LABEL_KEYS'))
  assert.ok(tickBlock.length > 0, 'PageTicks 定义缺失')
  assert.match(tickBlock, /scaleX\(/)
  const tickButtonBlock = src.slice(src.indexOf('const PageTick ='), src.indexOf('const WordBloom ='))
  assert.ok(tickButtonBlock.length > 0, 'PageTick 定义缺失')
  // 选中态走行内自定义属性驱动（与 ModeButton 同一免疫机制），aria-current 语义保留
  assert.match(tickButtonBlock, /background: var\(--tick-line, /)
  assert.match(tickButtonBlock, /scaleX\(var\(--tick-fill, 0\.44\)\)/)
  assert.doesNotMatch(tickButtonBlock, /&\[aria-current=/)
  assert.doesNotMatch(tickButtonBlock, /\$active/)
  assert.match(src, /'--tick-fill': 1/)
  assert.match(src, /aria-current=/)
  assert.match(src, /onScroll=\{/)
})

test('册页图版：纸框发丝线 + 纸边 + 图面内发丝线 + mono 朱砂题签 + 题名单行省略', () => {
  const plateBlock = src.slice(src.indexOf('const LeafPlate ='), src.indexOf('const PlateNo ='))
  assert.ok(plateBlock.length > 0, 'LeafPlate/LeafPlateArt 定义缺失')
  assert.match(plateBlock, /padding: 10px/)
  assert.match(plateBlock, /border: 1px solid/)
  // 图面内发丝线定义在共享 PlateArt（LeafPlateArt 复用同款）
  const artBlock = src.slice(src.indexOf('const PlateArt ='), src.indexOf('const StageTitle ='))
  assert.match(artBlock, /inset 0 0 0 1px/)
  const noBlock = src.slice(src.indexOf('const PlateNo ='), src.indexOf('const LeafTitle ='))
  assert.ok(noBlock.length > 0, 'PlateNo 定义缺失')
  assert.match(noBlock, /font-family: var\(--font-mono\)/)
  assert.match(noBlock, /var\(--primary-color\)/)
  // i18n 长度防御：册页题名单行省略 + title 全名（不自由换行撑瘪词窗）
  const titleBlock = src.slice(src.indexOf('const LeafTitle ='), src.indexOf('const LeafArtist ='))
  assert.ok(titleBlock.length > 0, 'LeafTitle 定义缺失')
  assert.match(titleBlock, /text-align: center/)
  assert.match(titleBlock, /text-overflow: ellipsis/)
})

test('短词窗：mask 渐隐 + 点按跳播 + 「全体欣赏音乐」印章空态', () => {
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
  // 印章空态文案已迁 i18n 词典（zh 仍为「全体欣赏音乐」），守卫改为断言 t() 调用形状
  assert.match(src, /t\('player\.panel\.wordEmpty'\)/)
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
