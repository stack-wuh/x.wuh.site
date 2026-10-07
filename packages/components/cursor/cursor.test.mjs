import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const load = async (rel) => import(pathToFileURL(join(dir, rel)).href)

// 「一页书」光标纪律门禁（shadow-docs/knowledge/design-system.md + animation-system.md + norms/ui-patterns.md）：
// 颜色零裸 hex 手抄（纸色 = oklab 预混推导）、data URI 禁 CSS 变量/color-mix、
// keyframes 只动 transform/opacity、pointer:fine ∧ no-preference 双门控在场、
// idle 规则序必须先于交互态（交互态可覆盖 ambient）、几何 d 值与视觉稿逐字一致。
const dir = dirname(fileURLToPath(import.meta.url))
const read = (f) => readFileSync(join(dir, f), 'utf8')
const TINTS = read('tints.ts')
const BOOK = read('book.tsx')
const LAYER = read('index.tsx')
const STYLE = read('style.tsx')
const INK = read('ink.ts')

/** 独立实现的 sRGB↔OKLab 混色（Björn Ottosson），用作 tints 推导的交叉验证 */
const toLinear = (c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92)
const toGamma = (c) => (c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c)
const oklabMix = (hexA, hexB, w) => {
  const un = (h) => [1, 3, 5].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255))
  const fwd = ([r, g, b]) => {
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]
  }
  const inv = ([L, a, b2]) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b2) ** 3
    const m = (L - 0.1055613458 * a - 0.0638541728 * b2) ** 3
    const s = (L - 0.0894841775 * a - 1.291485548 * b2) ** 3
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
  }
  const A = fwd(un(hexA)), B = fwd(un(hexB))
  const rgb = inv(A.map((v, i) => v * (1 - w) + B[i] * w))
  return '#' + rgb.map((c) => Math.max(0, Math.min(255, Math.round(toGamma(c) * 255))).toString(16).padStart(2, '0')).join('')
}

// tints.ts 是色值数据表（预混结果），豁免裸 hex 扫描；扫描域=表现层三件套，颜色必须走 CSS 变量/主题函数。
test('表现层源码不使用裸十六进制色值（颜色只走主题变量，实色只准待在 tints 数据表）', () => {
  for (const [f, src] of [['book.tsx', BOOK], ['index.tsx', LAYER], ['style.tsx', STYLE], ['ink.ts', INK]]) {
    const match = src.match(/#[0-9a-fA-F]{3,8}\b/)
    assert.equal(match, null, `${f} 出现裸十六进制色值: ${match?.[0]}`)
  }
})

test('tints 纸色 == oklabMix(primary, background-100, {30,18,38}%)——调色板漂移即红', async () => {
  const { palettes } = await load('../themes/generator-color.ts')
  const { PAPER } = await load('tints.ts')
  const SRC = {
    wl: [palettes.wl.primary[500], palettes.wl.background[100]],
    wd: [palettes.wd.primary[500], palettes.wd.background[100]],
    pl: [palettes.pl.primary[600], palettes.pl.background[100]],
    pd: [palettes.pd.primary[600], palettes.pd.background[100]],
  }
  const RATIO = { pg: 0.3, pgb: 0.18, pgf: 0.38 }
  for (const theme of ['wl', 'wd', 'pl', 'pd']) {
    const [primary, paper] = SRC[theme]
    for (const key of ['pg', 'pgb', 'pgf']) {
      assert.equal(PAPER[theme][key], oklabMix(primary, paper, RATIO[key]), `${theme}.${key} 与 oklab 预混不一致`)
    }
  }
})

test('静态光标 data URI 禁 CSS 变量 / color-mix（cursor url 独立解析路径）', async () => {
  const { stateSvg } = await load('tints.ts')
  for (const theme of ['wl', 'wd', 'pl', 'pd']) {
    for (const state of ['default', 'pointer', 'text', 'wait', 'grab', 'grabbing']) {
      const svg = stateSvg(theme, state)
      assert.ok(svg.startsWith('<svg'), `${theme}.${state} 非 SVG 串`)
      assert.ok(!svg.includes('var(') && !svg.includes('color-mix'), `${theme}.${state} data URI 混入变量/color-mix`)
    }
  }
})

test('几何 d 值与视觉稿 cursor-v4.html 逐字一致（无损移植锚点）', async () => {
  const { P1, P2, EDGE, LIFT, FLIP, GRAB_L, GRAB_R, TB_L, TB_R } = await load('tints.ts')
  assert.equal(P1, 'M11.5 6.5C9 5.2 6.4 4.6 4.3 4.9L4.3 14.7C6.4 14.4 9 15 11.5 16.2Z')
  assert.equal(P2, 'M12.5 6.5C15 5.2 17.6 4.6 19.7 4.9L19.7 14.7C17.6 14.4 15 15 12.5 16.2Z')
  assert.equal(EDGE, 'M19.7 4.9C20 8 20 11.8 19.7 14.7')
  assert.equal(LIFT, 'M12.5 6.5C13.9 5.7 14.9 5.2 15.8 4.9L15.8 14.9C14.9 14.7 13.9 15.2 12.5 16.2Z')
  assert.equal(FLIP, 'M12.5 6.5C10 5.2 7.4 4.6 5.3 4.9L5.3 14.7C7.4 14.4 10 15 12.5 16.2Z')
  assert.equal(GRAB_L, 'M11.5 6.5C9.9 5.6 8.5 5.1 7 5.1L7 14.8C8.5 14.6 9.9 15.2 11.5 16.2Z')
  assert.equal(GRAB_R, 'M12.5 6.5C14.1 5.6 15.2 5.1 16.3 5.1L16.3 14.8C15.2 14.6 14.1 15.2 12.5 16.2Z')
  assert.equal(TB_L, 'M4.3 14.3C6.6 13.9 9.2 14.7 11.5 15.6L11.5 16.6C9.2 15.8 6.6 15.1 4.3 15.4Z')
  assert.equal(TB_R, 'M19.7 14.3C17.4 13.9 14.8 14.7 12.5 15.6L12.5 16.6C14.8 15.8 17.4 15.1 19.7 15.4Z')
})

test('跟随层书形结构计数：path×5 字面（pl/pr/pt.face/pt.edge/rules 组内 map×3）+ spine line×1 + pin circle×1 + base rect×1', () => {
  // rules 三行是 map 渲染（源码 1 个字面 <path>），故字面 path=5
  assert.equal((BOOK.match(/<path/g) || []).length, 5)
  assert.equal((BOOK.match(/<line/g) || []).length, 1)
  assert.equal((BOOK.match(/<circle/g) || []).length, 1)
  assert.equal((BOOK.match(/<rect/g) || []).length, 1)
})

test('keyframes 只动 transform/opacity（禁布局属性动画）', () => {
  const blocks = [...STYLE.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n\s*\}/g)]
  assert.ok(blocks.length >= 10, '应含 breeze/lift/turn/closeL/pressR/idleTurn + ink 四类（dot/floss/bead/speck）')
  for (const [, name, body] of blocks) {
    const props = [...body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1])
    for (const p of props) assert.ok(['transform', 'opacity'].includes(p), `idleTurn/…/${name} 出现非 transform/opacity 属性: ${p}`)
  }
  assert.equal(STYLE.match(/transition[^;\n]*\b(?:width|height|top|left)\b/), null)
})

test('pointer:fine ∧ prefers-reduced-motion 双门控在场；reduce 降级静帧', () => {
  assert.ok(STYLE.includes('(pointer: fine)'), '缺 pointer:fine 门控（触控设备必须零影响）')
  assert.ok(STYLE.includes('(prefers-reduced-motion: no-preference)'), '缺 no-preference 动画门控')
  const reduce = STYLE.split('(prefers-reduced-motion: reduce)')[1]
  assert.ok(reduce && reduce.includes('.pt'), 'reduce 降级块必须隐藏翻页件')
})

test('idle 自读书：≥5s 触发、一动收回、规则序先于交互态', () => {
  assert.match(LAYER, /IDLE_DELAY = 5000/, 'idle 阈值必须 5s')
  assert.match(LAYER, /const armIdle[\s\S]{0,300}?window\.clearTimeout\(idleTimer\)[\s\S]{0,300}?window\.setTimeout/, 'D2：armIdle 必须先清新定时器再挂新（长移动逐帧闪 idle 的根因）')
  assert.match(LAYER, /setTimeout\([\s\S]*?IDLE_DELAY\)/, 'setTimeout 必须挂 IDLE_DELAY')
  assert.ok(LAYER.includes("classList.remove('idle')"), 'pointermove 必须收回 idle')
  assert.ok(LAYER.includes("'idle'"), 'idle 类名接线')
  const idlePos = STYLE.indexOf('.bk-cursor.idle .pt')
  const hoverPos = STYLE.indexOf("[data-state='pointer'] .pt")
  assert.ok(idlePos > -1 && hoverPos > idlePos, 'idle 规则必须先于 hover 态（交互态覆盖 ambient）')
})

test('跟随层引擎 = framer-motion 弹簧随动；自持 rAF 已除；D1 延迟接管时序（首动 jump 落位、leave 重武装）', () => {
  assert.ok(LAYER.includes('useMotionValue') && LAYER.includes('useSpring') && LAYER.includes('motion.div'), '跟随引擎断言：framer-motion 三件套')
  assert.match(LAYER, /\.jump\(/, '接管必须 jump 落位（无左上角扫移）')
  assert.equal(LAYER.match(/requestAnimationFrame/), null, 'D4：自持 rAF 必须删除，由 framer 统一帧调度接管')
  assert.equal(LAYER.match(/translate3d/), null, 'translate3d 由引擎写入，源码不再手抄字符串')
  assert.equal(LAYER.match(/className='bk-cursor on'/), null, 'JSX 初始不得含 on——钉角 bug 的源头')
  assert.equal((LAYER.match(/classList\.add\('bk-cursor-active'\)/g) || []).length, 1, 'bk-cursor-active 必须恰好添加一次')
  assert.match(LAYER, /const takeover[\s\S]{0,500}?classList\.add\('on'\)[\s\S]{0,160}?classList\.add\('bk-cursor-active'\)[\s\S]{0,80}?taken = true/, '系统光标接管只发生在 takeover 内（首个 pointermove 触发）')
  assert.match(LAYER, /if \(taken\)[\s\S]*?else \{\s*takeover\(/, 'onMove：接管后弹簧跟位，接管前先 takeover')
  assert.match(LAYER, /const onLeave[\s\S]{0,300}?taken = false/, 'pointerleave 后重置接管标记，重入重新落位')
})

test('跟随层无布局副作用、无滚动/尺寸监听、无开关', () => {
  assert.equal(LAYER.match(/addEventListener\(['"](scroll|resize)/), null, '禁 scroll/resize listener')
  for (const [f, src] of [['index.tsx', LAYER], ['style.tsx', STYLE]]) {
    assert.ok(!src.includes('localStorage'), `${f} 出现 localStorage——D8 无开关纪律`)
  }
  assert.ok(LAYER.includes('aria-hidden'), '装饰层必须 aria-hidden')
})

test('热点锚 (4,4) + 书形右下偏移 OFFSET(6,6)：指针对位点与书页明显错开（R4），data URI 整数化 4 4', async () => {
  const { HOT, OFFSET } = await load('tints.ts')
  assert.deepEqual(HOT, [4, 4])
  assert.deepEqual(OFFSET, [6, 6])
  assert.ok(BOOK.includes('translate(${OFFSET[0]},${OFFSET[1]})') || /translate\(\s*6\s*,\s*6\s*\)/.test(BOOK), '跟随层书形必须按 OFFSET 平移')
  assert.ok(STYLE.includes('} 4 4, default'), '静帧 cursor 热点必须输出 4 4')
})

test('墨迹粒子层：池 round-robin + 位移节流寄生既有事件时序（零新监听器），四类 keyframes 与 token 色在场', () => {
  // 引擎（ink.ts）
  assert.match(INK, /INK_POOL = 48/, '池上限 48（尘/晕在飞 + 拖尾余量）')
  assert.match(INK, /SPAWN_GAP = 6/, 'T1 位移节流阈值 6px')
  assert.match(INK, /this\.cur % INK_POOL/, 'T4 round-robin 覆盖最老池位')
  assert.match(INK, /void el\.offsetWidth/, '重启动画 = 清类→强制重排→重挂（机制同 popping）')
  assert.match(INK, /TELEPORT/, '传送防护（tab 返回/大幅跳变不连线）')
  assert.match(INK, /MAX_PER_MOVE/, '单帧出生上限（突发保护）')
  assert.equal(INK.match(/requestAnimationFrame|localStorage|addEventListener/), null, '池引擎自持零监听器零 rAF')
  // 接线（index.tsx）：粒子只寄生现有 handler，监听器计数纹丝不动
  assert.equal((LAYER.match(/\.addEventListener/g) || []).length, 4, '仍为 move/down/up/leave 四个 addEventListener——墨层零新增')
  assert.match(LAYER, /new InkField\(/, 'effect 内实例化池引擎')
  assert.match(LAYER, /const onMove[\s\S]{0,400}?field\.move\(/, 'onMove 喂粒子（弹簧跟位/接管落位同帧）')
  assert.match(LAYER, /const onDown[\s\S]{0,400}?field\.tap\(/, 'onDown 溅墨与 popping 同源')
  assert.match(LAYER, /const onLeave[\s\S]{0,300}?field\.reset\(\)/, 'pointerleave 重锚池，重入不假甩珠')
  assert.match(LAYER, /length: INK_POOL/, 'JSX 池元素 48 一次渲染，运行期零增删')
  assert.equal(LAYER.match(/useState/), null, '移动路径（含粒子）零 React state')
  // 样式层（style.tsx）：容器纯装饰、四类 keyframes、颜色全 token
  assert.match(STYLE, /\.bk-ink \{[\s\S]{0,200}?pointer-events: none/, '粒子层 pointer-events:none 纯装饰')
  assert.match(STYLE, /\.bk-ink \{[^}]*color: var\(--text-color\)/, '墨色 = --text-color（currentColor 继承）')
  assert.match(STYLE, /\.bk-ink i\.speck \{[^}]*var\(--primary-color\)/, '朱砂渣 = --primary-color')
  for (const k of ['bk-ink-dot', 'bk-ink-floss', 'bk-ink-bead', 'bk-ink-speck']) {
    assert.ok(STYLE.includes(`@keyframes ${k}`), `缺 keyframes ${k}`)
  }
  // 错峰延迟必须长写（animation 简写会把 var(--dl) 重置为 0s）
  assert.match(STYLE, /\.bk-ink i\.go\.speck \{[^}]*animation-delay: var\(--dl, 0ms\)/, 'speck 错峰延迟长写在场')
})

test('环绕墨尘与点击墨晕：单发射钟生命周期（takeover 起 / leave+cleanup 停）、halo 恰一粒、尘晕 keyframes 与色纪律', () => {
  // 发射钟：域内唯一 setInterval，stop 唯一 clearInterval；起停只挂现有生命周期（零新监听器口径不变）
  assert.equal((INK.match(/window\.setInterval/g) || []).length, 1, 'K1 域内 window.setInterval 恰一处')
  assert.equal((INK.match(/window\.clearInterval/g) || []).length, 1, 'stop() 为唯一清钟出口')
  assert.match(INK, /start\(\) \{[\s\S]{0,120}?if \(this\.timer\) return[\s\S]{0,120}?window\.setInterval/, 'start 幂等（重入不叠钟）')
  assert.match(INK, /DUST_INTERVAL = 200/, 'K1 发射节拍 200ms')
  assert.match(INK, /const tick[\s\S]|private tick\(\)/, 'tick 拍生尘存在')
  // K2 拖曳：出生点随速度反向偏置（DRAG 常量参与）
  assert.match(INK, /DRAG_SPEED[\s\S]{0,300}?bx -= Math\.cos\(this\.ang\)/, '移动中尘向速度反方向拖曳')
  // K3 形态：dust 低透随机（--o 由 JS 逐粒写入）、1/6 朱砂
  assert.match(INK, /'dust hot'/, '1/6 概率朱砂热尘')
  assert.match(INK, /setProperty\('--o'/, '尘浓淡 --o 逐粒指定')
  // K8 点击一晕：tap 恰出 1 粒 halo
  assert.match(INK, /this\.put\(x, y, 0, 'halo'/, 'K8 每击恰一粒墨晕')
  // 接线生命周期
  assert.match(LAYER, /const takeover[\s\S]{0,400}?field\.start\(\)/, 'K1 takeover 内起钟')
  assert.match(LAYER, /const onLeave[\s\S]{0,200}?field\.stop\(\)/, 'leave 停钟')
  assert.match(LAYER, /return \(\) => \{[\s\S]{0,60}?field\.stop\(\)/, 'cleanup 停钟（热更新/卸载不遗留）')
  // 样式层：尘/晕 keyframes 与色纪律（尘 --o、晕 currentColor 描边环、hot 朱砂）
  assert.ok(STYLE.includes('@keyframes bk-ink-dust'), '缺 bk-ink-dust')
  assert.ok(STYLE.includes('@keyframes bk-ink-halo'), '缺 bk-ink-halo')
  assert.match(STYLE, /@keyframes bk-ink-dust \{[\s\S]{0,200}?var\(--o/, '尘峰值透明度走 --o')
  assert.match(STYLE, /\.bk-ink i\.halo \{[^}]*border: 1px solid currentColor/, '晕 = currentColor 细描边环（静态 border，动画只 transform/opacity）')
  assert.match(STYLE, /\.bk-ink i\.hot \{[^}]*var\(--primary-color\)/, '热尘朱砂 = --primary-color')
  assert.match(STYLE, /\.bk-ink i\.go\.dust \{[^}]*animation-delay: var\(--dl, 0ms\)/, 'dust 延迟长写在场')
  assert.equal((INK.match(/#[0-9a-fA-F]{3,8}\b/g) || []).length, 0, 'ink.ts 零色值')
})
