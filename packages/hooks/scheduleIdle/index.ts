export interface ScheduleIdleOptions {
  /** requestIdleCallback 的 idle 超时上限；亦为 fallbackMs 缺省值。默认 2000 */
  timeout?: number
  /** requestIdleCallback 不可用（旧 Safari）时 setTimeout 的延迟；默认同 timeout */
  fallbackMs?: number
}

/**
 * 浏览器能力（非 hook）：空闲调度统一入口。
 * requestIdleCallback 可用走 idle（timeout 上限），否则 setTimeout 回落（fallbackMs）。
 * 返回的 cancel 闭包按实际分支收敛对应 API——避免手写版「idle 分支存在时误用
 * cancelIdleCallback 清 setTimeout 句柄」的跨 id 空间错位。SSR 返回空函数。
 */
export const scheduleIdle = (callback: () => void, options: ScheduleIdleOptions = {}): (() => void) => {
  const { timeout = 2000, fallbackMs = timeout } = options

  if (typeof window === 'undefined') return () => {}

  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(() => callback(), { timeout })
    return () => {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(id)
      }
    }
  }

  const timer = window.setTimeout(callback, fallbackMs)
  return () => window.clearTimeout(timer)
}

export { scheduleIdle as default }
