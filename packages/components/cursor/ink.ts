/**
 * 墨迹粒子池（决策 T1–T5 + K1–K8）：指 = 笔尖，轨迹 = 纸上留下的墨；尘 = 书形四周的墨气，晕 = 落笔一圈。
 * 纯 DOM 直写引擎：48 池位 round-robin 覆盖、onMove 从上一出生点位移 ≥6px 沿段「钉」墨（一帧多粒）、
 * 速度分档圆点/墨丝、断崖急停甩珠、点击溅 5–8 粒朱砂渣 + 一粒放大淡出的墨晕、
 * 接管后 setInterval 发射钟按拍出飘浮微尘（静止缓升、移动拖曳向尾、1/6 朱砂）——
 * 运行期零 DOM 增删、零 React 渲染、零新监听器（寄生 CursorLayer 既有事件时序 + 域内唯一发射钟）。
 * 几何与浓淡全部经 CSS 自定义属性（--px/--py/--ang/--dx/--dy/--dl/--o）内联写入，
 * keyframes 只动 transform/opacity；颜色令牌钉在 style 层，本文件零色值。
 */
export const INK_POOL = 48
/** T1 出生阈值：与上一出生点距离 ≥6px 才钉一粒墨 */
export const SPAWN_GAP = 6
/** T1 分档：平滑速度 ≥1.2px/ms → 沿速度向拉长的墨丝 */
const FLOSS_SPEED = 1.2
/** T2 急停甩珠：速度自 ≥1.5px/ms 断崖跌破 <0.2px/ms */
const FAST_SPEED = 1.5
const STOP_SPEED = 0.2
/** 单步位移超此距离视为传送：只重锚不连线 */
const TELEPORT = 140
/** 单帧出生上限：突发保护 */
const MAX_PER_MOVE = 8
/** K1 发射钟：接管后每 200ms 一拍，每拍 80% 概率出一粒尘（静止 ~4 粒/s） */
const DUST_INTERVAL = 200
const DUST_PROB = 0.8
/** K2 拖曳：平滑速度 ≥0.3px/ms 时尘出生点向速度反方向偏置，最多退 24px */
const DRAG_SPEED = 0.3
const DRAG_MAX = 24

type Kind = 'dot' | 'floss' | 'bead' | 'speck' | 'halo' | 'dust' | 'dust hot'

export class InkField {
  private els: HTMLElement[]
  private cur = 0
  private timer = 0
  // 上一事件位（测瞬时速度）与上一出生锚点（位移节流）
  private px = 0
  private py = 0
  private pt = 0
  private ax = 0
  private ay = 0
  private speed = 0
  private ang = 0

  constructor(host: HTMLElement) {
    this.els = Array.from(host.children) as HTMLElement[]
  }

  /** 占一个池位：写几何变量 → 清类 → 强制重排 → 重挂（动画重启机制同 popping） */
  private put(x: number, y: number, ang: number, kind: Kind, dx = 0, dy = 0, dl = 0, o = 0) {
    const el = this.els[this.cur % INK_POOL]
    this.cur++
    const s = el.style
    s.setProperty('--px', `${x.toFixed(1)}px`)
    s.setProperty('--py', `${y.toFixed(1)}px`)
    s.setProperty('--ang', `${ang.toFixed(3)}rad`)
    s.setProperty('--dx', `${dx.toFixed(1)}px`)
    s.setProperty('--dy', `${dy.toFixed(1)}px`)
    s.setProperty('--dl', `${dl}ms`)
    s.setProperty('--o', `${o.toFixed(3)}`)
    el.className = ''
    void el.offsetWidth
    el.className = `go ${kind}`
  }

  /** K1 起钟（幂等）：takeover 内调用；未接管永不起钟 */
  start() {
    if (this.timer) return
    this.timer = window.setInterval(() => this.tick(), DUST_INTERVAL)
  }

  /** K1 停钟：leave / effect cleanup；池内半死尘停止出生，寿终自然淡出 */
  stop() {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = 0
    }
  }

  /** K1–K3：一拍尘——当前位环带 10–24px 随机角，移动中向速度反方向拖曳；缓升 + 微摆 + 极低透 */
  private tick() {
    if (this.pt === 0 || Math.random() > DUST_PROB) return
    const a = Math.random() * Math.PI * 2
    const r = 10 + Math.random() * 14
    let bx = this.px
    let by = this.py
    if (this.speed >= DRAG_SPEED) {
      const back = Math.min(DRAG_MAX, this.speed * 12)
      bx -= Math.cos(this.ang) * back
      by -= Math.sin(this.ang) * back
    }
    const rise = 12 + Math.random() * 18
    const sway = (Math.random() - 0.5) * 6
    const o = 0.05 + Math.random() * 0.13
    const kind: Kind = Math.random() < 1 / 6 ? 'dust hot' : 'dust'
    this.put(bx + Math.cos(a) * r, by + Math.sin(a) * r, 0, kind, sway, -rise, (Math.random() * 100) | 0, o)
  }

  /** onMove 喂入：传送/首帧只重锚；否则急停判定 → 沿段出生 → 更新平滑速度 */
  move(x: number, y: number, t: number) {
    const dt = t - this.pt
    const evDist = Math.hypot(x - this.px, y - this.py)
    const first = this.pt === 0 || evDist > TELEPORT
    const inst = !first && dt > 0 ? evDist / dt : 0
    if (first) {
      this.ax = x
      this.ay = y
    } else {
      if (this.speed >= FAST_SPEED && inst < STOP_SPEED && evDist > 1) this.sling()
      this.walk(x, y)
    }
    this.px = x
    this.py = y
    this.pt = t
    this.speed = first ? 0 : this.speed * 0.7 + inst * 0.3
  }

  /** T3/K8 点击：5–8 粒朱砂墨渣 + 恰 1 粒墨晕（笔尖落纸一晕） */
  tap(x: number, y: number) {
    const n = 5 + ((Math.random() * 4) | 0)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const fly = 8 + Math.random() * 10
      this.put(x, y, a, 'speck', Math.cos(a) * fly, Math.sin(a) * fly, (Math.random() * 140) | 0)
    }
    this.put(x, y, 0, 'halo', 0, 0, 0)
  }

  /** 接管后首帧 / pointerleave 重入：重锚清零速度，避免假「急停甩珠」或长连线 */
  reset() {
    this.pt = 0
    this.speed = 0
    this.px = 0
    this.py = 0
  }

  /** T2：沿末速度向（带 ±0.4rad 扰动）甩 1–2 粒墨珠 */
  private sling() {
    const n = 1 + (Math.random() < 0.5 ? 1 : 0)
    for (let i = 0; i < n; i++) {
      const a = this.ang + (Math.random() - 0.5) * 0.8
      const fly = 6 + Math.random() * 8
      this.put(this.px, this.py, a, 'bead', Math.cos(a) * fly, Math.sin(a) * fly, (Math.random() * 60) | 0)
    }
  }

  /** T1：从锚点向目标按 SPAWN_GAP 步进出生（一帧跨多段），垂直向抖动 ±0.8px 去机械感 */
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
      const jx = this.ax + Math.cos(dir + Math.PI / 2) * j
      const jy = this.ay + Math.sin(dir + Math.PI / 2) * j
      this.ang = dir
      this.put(jx, jy, dir, this.speed >= FLOSS_SPEED ? 'floss' : 'dot')
    }
  }
}
