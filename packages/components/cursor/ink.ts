/**
 * 墨迹粒子池（决策 T1–T5）：指 = 笔尖，轨迹 = 纸上留下的墨。
 * 纯 DOM 直写引擎：32 池位 round-robin 覆盖、onMove 从上一出生点位移 ≥6px 沿段「钉」墨（一帧多粒）、
 * 速度分档圆点/墨丝、断崖急停沿末速度向甩珠、点击溅 3–5 粒朱砂错峰——
 * 运行期零 DOM 增删、零 React 渲染、零新监听器（完全寄生 CursorLayer 既有事件时序）。
 * 几何全部经 CSS 自定义属性（--px/--py/--ang/--dx/--dy/--dl）写入，keyframes 只动 transform/opacity；
 * 颜色令牌钉在 style 层，本文件零色值。
 */
export const INK_POOL = 32
/** T1 出生阈值：与上一出生点距离 ≥6px 才钉一粒墨（事件 120Hz vs 帧率错位抹平后仍留得住「笔压感」） */
export const SPAWN_GAP = 6
/** T1 分档：平滑速度 ≥1.2px/ms → 出生为沿速度向拉长的墨丝（笔快墨丝长） */
const FLOSS_SPEED = 1.2
/** T2 急停甩珠：速度自 ≥1.5px/ms 断崖跌破 <0.2px/ms → 沿末速度方向离心甩出 */
const FAST_SPEED = 1.5
const STOP_SPEED = 0.2
/** 单步位移超此距离视为传送（tab 返回/重入/大幅跳变）：只重锚不连线 */
const TELEPORT = 140
/** 单帧出生上限：突发保护（正常快速移动一帧 ≤4 粒） */
const MAX_PER_MOVE = 8

type Kind = 'dot' | 'floss' | 'bead' | 'speck'

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
  private ang = 0

  constructor(host: HTMLElement) {
    this.els = Array.from(host.children) as HTMLElement[]
  }

  /** 占一个池位：写几何变量 → 清类 → 强制重排 → 重挂（动画重启机制同 popping 一记轻合） */
  private put(x: number, y: number, ang: number, kind: Kind, dx = 0, dy = 0, dl = 0) {
    const el = this.els[this.cur % INK_POOL]
    this.cur++
    const s = el.style
    s.setProperty('--px', `${x.toFixed(1)}px`)
    s.setProperty('--py', `${y.toFixed(1)}px`)
    s.setProperty('--ang', `${ang.toFixed(3)}rad`)
    s.setProperty('--dx', `${dx.toFixed(1)}px`)
    s.setProperty('--dy', `${dy.toFixed(1)}px`)
    s.setProperty('--dl', `${dl}ms`)
    el.className = ''
    void el.offsetWidth
    el.className = `go ${kind}`
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

  /** T3 点击溅墨：3–5 粒朱砂墨渣，随机方向飞 4–11px，粒内错峰延迟 */
  tap(x: number, y: number) {
    const n = 3 + ((Math.random() * 3) | 0)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const fly = 4 + Math.random() * 7
      this.put(x, y, a, 'speck', Math.cos(a) * fly, Math.sin(a) * fly, (Math.random() * 110) | 0)
    }
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
