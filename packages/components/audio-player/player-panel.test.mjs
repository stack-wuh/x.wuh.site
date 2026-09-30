import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const componentDir = dirname(fileURLToPath(import.meta.url))
const src = await readFile(resolve(componentDir, 'PlayerPanel.tsx'), 'utf8')
const specsSrc = await readFile(resolve(componentDir, 'specs.tsx'), 'utf8')

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
  assert.match(src, /role='dialog'/)
  assert.match(src, /aria-modal='true'/)
})

test('弹层定位纪律：禁 scrollIntoView，桌面定位手动只滚目标容器，面板壳 overflow 用 clip', () => {
  // 生产实证（v1.4.44 验收）：scrollIntoView 沿祖先链滚动所有可滚容器——overflow:hidden 的面板壳
  // 被连带滚走 20–30px+（WashSrc inset:-12% 撑出 118px 纵向 / 139px 横向隐藏可滚溢出），
  // 顶部眉标被裁、底边露出未罩纸底的晕染色带。整文件禁入，含注释外的任何调用形态
  assert.doesNotMatch(src, /scrollIntoView/)
  // 桌面歌词居中镜像移动端词窗公式：手动 scrollTo 只滚 LyricsScroll（offsetParent 需 position: relative）
  assert.match(src, /top: dEl\.offsetTop - container\.clientHeight \/ 2 \+ dEl\.offsetHeight \/ 2/)
  // 队列 nearest 语义：高亮项可见不动、越界才对齐；移动端手动 scrollTop 保持
  assert.match(src, /dList\.scrollTop = /)
  assert.match(src, /mList\.scrollTop = /)
  // 面板壳 clip 使其彻底不是滚动容器（基础 + 移动两处）；WordWindow/QueueName 的 overflow: hidden 不受影响
  const clipCount = (src.match(/overflow: clip/g) ?? []).length
  assert.ok(clipCount >= 2, 'Panel 壳基础规则与移动媒体查询都必须 overflow: clip')
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
  // 进度：progressPct 已是 0–100 百分数，value 直传——二次 ×100 灌 0–10000 被钳 100，光标钉死末端（回归根因）
  assert.match(src, /<Progress\s+value=\{progressPct\}/)
  assert.doesNotMatch(src, /value=\{progressPct \* 100\}/)
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

test('下划线模式带：激活态走行内自定义属性驱动（选择器失效免疫），aria 语义保留', () => {
  const modeBlock = src.slice(src.indexOf('const ModeButton'), src.indexOf('const VolumeRow'))
  assert.ok(modeBlock.length > 0)
  assert.match(modeBlock, /border-bottom: 2px solid var\(--mode-line, transparent\)/)
  assert.match(modeBlock, /color: var\(--mode-ink, /)
  // 选择器驱动的激活态在生产行为表上两连败（动态类规则删除竞态、属性翻转失效失灵），禁入
  assert.doesNotMatch(modeBlock, /&\[aria-pressed=/)
  assert.doesNotMatch(modeBlock, /\$active/)
  assert.doesNotMatch(modeBlock, /border-radius: 999px/)
  // JSX 行内挂载 + aria 语义保留
  assert.match(src, /'--mode-line': 'var\(--primary-color\)'/)
  assert.match(src, /aria-pressed=\{state\.mode === mode\}/)
  assert.doesNotMatch(src, /IconRepeat|IconShuffle/)
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
  const tickButtonBlock = src.slice(src.indexOf('const PageTick ='), src.indexOf('/* ===== 右侧：歌词 / 播放列表 ===== */'))
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

test('最爱印：本卷 playCount 最高曲目播放时进度印为「愛」，其余「樂」，音量印恒「樂」', () => {
  // 口径与 /music 最爱徽标同源：maxPlays>0 且 currentTrack.playCount === maxPlays（含并列全标）
  assert.match(src, /maxPlays > 0 && currentTrack\?\.playCount === maxPlays/)
  assert.match(src, /glyph=\{favorite \? '愛' : '樂'\}/)
  // 音量 Progress 不传 glyph（维持默认「樂」）
  const volumeBlock = src.slice(src.indexOf('<VolumeRow>'), src.indexOf('</VolumeRow>'))
  assert.ok(volumeBlock.length > 0, 'VolumeRow 缺失')
  assert.doesNotMatch(volumeBlock, /glyph=/)
  // Track 契约镜像服务端 /v2/music 联表 playCount（可选字段）
  assert.match(specsSrc, /playCount\?: number/)
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
