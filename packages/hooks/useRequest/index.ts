'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { RequestRunner, type RequestRunnerOptions } from './runner'

export type { RequestRunnerOptions, RequestRunnerState } from './runner'

export type UseRequestResult<TData, TParams extends any[]> = {
  data: TData | null
  loading: boolean
  error: unknown
  /** 发起请求并吞掉 rejection（错误只进 state.error）。 */
  run: (...args: TParams) => void
  /** 发起请求并返回结果 Promise，失败时抛出。 */
  runAsync: (...args: TParams) => Promise<TData>
  /** 以最近一次参数重发。 */
  refresh: () => Promise<TData>
}

/**
 * 仓内最小等价 useRequest（替代 ahooks）：能力面按消费点实测收敛，
 * 行为契约见 runner.ts 注释与 useRequest.test.mjs（UR1–UR7）。
 * service/options 走 latest-ref：渲染中闭包更新，下次请求读到最新实现。
 */
export function useRequest<TData, TParams extends any[]>(
  service: (...args: TParams) => Promise<TData>,
  options: RequestRunnerOptions<TData, TParams> = {},
): UseRequestResult<TData, TParams> {
  const serviceRef = useRef(service)
  serviceRef.current = service
  const optionsRef = useRef(options)
  optionsRef.current = options

  const runnerRef = useRef<RequestRunner<TData, TParams> | null>(null)
  if (runnerRef.current === null) {
    runnerRef.current = new RequestRunner<TData, TParams>(
      (...args) => serviceRef.current(...args),
      {
        manual: options.manual,
        cacheKey: options.cacheKey,
        onSuccess: (data, params) => optionsRef.current.onSuccess?.(data, params),
        onError: (error, params) => optionsRef.current.onError?.(error, params),
      },
    )
  }
  const runner = runnerRef.current

  const snapshot = useSyncExternalStore(runner.subscribe, runner.getSnapshot, runner.getSnapshot)

  useEffect(() => {
    // 挂载语义：auto 首跑 / cacheKey 种子+后台重校验；仅 mount 触发（对齐 ahooks，deps 变化不重发）。
    runner.start()
  }, [runner])

  return {
    data: snapshot.data,
    loading: snapshot.loading,
    error: snapshot.error,
    run: (...args) => { runner.run(...args) },
    runAsync: (...args) => runner.runAsync(...args),
    refresh: () => runner.refresh(),
  }
}

export default useRequest
