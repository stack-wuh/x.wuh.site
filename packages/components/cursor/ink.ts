/**
 * 墨晕粒子池（S1 一滴水 · 决策 D1–D6）：指 = 笔尖，移动 = 纸上连续洇开的柔边墨晕，
 * 点击 = 落笔一晕加三圈同心水波（一滴墨落纸、水纹外扩）。
 * 纯 DOM 直写引擎：48 池位 round-robin 覆盖、onMove 从上一出生点位移 ≥11px 沿段出生
 * （相邻墨晕重叠成连续墨痕——旧 6px 硬边小圆点密排的「撒沙子」感由此消除）、
 * 速度决定浓淡与尺寸（慢=浓而小洇得深、快=淡而大）、接管落点补一记起笔晕
 * （否则首帧只重锚，轨迹没有起头）——运行期零 DOM 增删、零 React 渲染、
 * 零新监听器、零定时器（环绕墨尘的 200ms 发射钟随形态一起退役）。
 * 几何与浓淡全部经 CSS 自定义属性（--px/--py/--o/--sz/--dl）内联写入，
 * keyframes 只动 transform/opacity；颜色令牌钉在 style 层，本文件零色值。
 */
export const INK_POOL = 48
/** D5 出生阈值：与上一出生点距离 ≥11px 才出一记墨晕 */
export const SPAWN_GAP = 11
/** 墨晕浓淡区间与基准直径：--o 逐粒随机后再按平滑速度衰减 */
const O_MIN = 0.2
const O_MAX = 0.42
const BLEED_SIZE = 16
/** 尺寸随速放大系数（快移拉大晕体，读作笔速扫过纸面） */
const SIZE_BONUS = 3.5
/** D1 落笔一晕（唯一签名件） */
const SPLASH_SIZE = 14
const SPLASH_O = 0.52
/** D1 同心水波：恰三圈、依次错峰 140ms、逐圈变淡 */
export const RIPPLE_RINGS = 3
export const RIPPLE_STAGGER = 140
const WAVE_SIZE = 20
const WAVE_O = 0.46
const WAVE_O_STEP = 0.09
/** D6 起笔一晕浓淡 = 上限 × 0.85 */
const FIRST_STROKE_O = 0.85
/** 速度→浓淡衰减：每 1px/ms 把 --o 除以 1.14 */
const O_DECAY = 0.14
/** 单步位移超此距离视为传送：只重锚不连线 */
const TELEPORT = 140
/** 单帧出生上限：突发保护 */
const MAX_PER_MOVE = 8

type Kind = 'bleed' | 'wave' | 'splash'

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

export class InkField {
  private els: HTMLElement[]
  private cur = 0
  // 上一事件位（测瞬时速度）与上一出生锚点（位移节流）
  private px = 0
  private py = 0
  private pt = 0
  private ax = 0
  private ay = 0
  private speed = 0

  constructor(host: HTMLElement) {
    this.els = Array.from(host.children) as HTMLElement[]
  }

  /** 占一个池位：写几何变量 → 清类 → 强制重排 → 重挂（动画重启机制同 popping） */
  private put(x: number, y: number, kind: Kind, o: number, size: number, dl = 0) {
    const el = this.els[this.cur % INK_POOL]
    this.cur++
    const s = el.style
    s.setProperty('--px', `${x.toFixed(1)}px`)
    s.setProperty('--py', `${y.toFixed(1)}px`)
    s.setProperty('--o', o.toFixed(3))
    s.setProperty('--sz', `${size.toFixed(1)}px`)
    s.setProperty('--dl', `${Math.round(dl)}ms`)
    el.className = ''
    void el.offsetWidth
    el.className = `go ${kind}`
  }

  /** D6 起笔一晕：接管落点先出一晕，轨迹才有起头（首帧只重锚会留下「没有第一滴」的空档） */
  first(x: number, y: number) {
    this.put(x, y, 'bleed', O_MAX * FIRST_STROKE_O, BLEED_SIZE)
  }

  /** onMove 喂入：传送/首帧只重锚；否则沿段出生 → 更新平滑速度 */
  move(x: number, y: number, t: number) {
    const dt = t - this.pt
    const evDist = Math.hypot(x - this.px, y - this.py)
    const first = this.pt === 0 || evDist > TELEPORT
    const inst = !first && dt > 0 ? evDist / dt : 0
    if (first) {
      this.ax = x
      this.ay = y
    } else {
      this.walk(x, y)
    }
    this.px = x
    this.py = y
    this.pt = t
    this.speed = first ? 0 : this.speed * 0.7 + inst * 0.3
  }

  /** D1 点击：落笔一晕恰一粒 + 同心水波恰三圈（错峰外扩，逐圈变淡） */
  tap(x: number, y: number) {
    this.put(x, y, 'splash', SPLASH_O, SPLASH_SIZE)
    for (let i = 0; i < RIPPLE_RINGS; i++) {
      this.put(x, y, 'wave', clamp(WAVE_O - i * WAVE_O_STEP, 0.12, WAVE_O), WAVE_SIZE, i * RIPPLE_STAGGER)
    }
  }

  /** 接管后首帧 / pointerleave 重入：重锚清零速度，避免假连线 */
  reset() {
    this.pt = 0
    this.speed = 0
    this.px = 0
    this.py = 0
  }

  /** D5 从锚点向目标按 SPAWN_GAP 步进出生（一帧跨多段），垂直向抖动 ±0.8px 去机械感 */
  private walk(x: number, y: number) {
    let adx = x - this.ax
    let ady = y - this.ay
    let steps = 0
    while (Math.hypot(adx, ady) >= SPAWN_GAP && steps++ < MAX_PER_MOVE) {
      const len = Math.hypot(adx, ady)
      const dir = Math.atan2(ady, adx)
      this.ax += (adx / len) * SPAWN_GAP
      this.ay += (ady / len) * SPAWN_GAP
      adx = x - this.ax
      ady = y - this.ay
      const j = (Math.random() - 0.5) * 1.6
      this.emit(this.ax + Math.cos(dir + Math.PI / 2) * j, this.ay + Math.sin(dir + Math.PI / 2) * j)
    }
  }

  /** 行笔疾徐：慢=浓而小（洇得深）、快=淡而大；--o 逐粒随机避免机械感 */
  private emit(x: number, y: number) {
    const fast = Math.min(this.speed, 3)
    const o = clamp((O_MIN + Math.random() * (O_MAX - O_MIN)) / (1 + this.speed * O_DECAY), O_MIN, O_MAX)
    this.put(x, y, 'bleed', o, BLEED_SIZE + fast * SIZE_BONUS)
  }
}
