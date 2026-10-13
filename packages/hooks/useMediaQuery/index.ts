import { useEffect, useMemo, useState } from 'react'
import { useEventListener } from '../useEventListener'

export interface UseMediaQueryOptions {
  /** SSR 与首帧的占位值；挂载后与系统真实状态同步。默认 false（避免水合不一致） */
  defaultValue?: boolean
}

// matchMedia 查询的布尔订阅：SSR/首帧返回 defaultValue，挂载后同步真实值并跟随 change。
// 只用于布尔消费（响应式渲染、latch 触发）；change 上挂副作用的站点直接 useEventListener(mql)。
export const useMediaQuery = (query: string, options: UseMediaQueryOptions = {}): boolean => {
  const { defaultValue = false } = options

  // memo 而非 ref：query 变化才重建 MediaQueryList；SSR 渲染期返回 null，effect 侧自动跳过
  const mql = useMemo(
    () => (typeof window === 'undefined' ? null : window.matchMedia(query)),
    [query]
  )

  const [matches, setMatches] = useState(defaultValue)

  useEffect(() => {
    if (!mql) return
    setMatches(mql.matches)
  }, [mql])

  useEventListener(
    'change',
    (event: MediaQueryListEvent) => setMatches(event.matches),
    mql ?? undefined,
    { enabled: mql !== null }
  )

  return matches
}

export default useMediaQuery
