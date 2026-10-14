// 框架无关的请求内核：useRequest hook 的行为底座，node:test 可直测（useRequest.test.mjs）。
// 能力面按仓内 5 个消费点实测收敛：auto / manual+runAsync / run 吞错 / onSuccess·onError /
// refresh 沿 lastArgs / stale 响应保护 / cacheKey（挂载种子秒显 + SWR 重校验，staleTime=0）。
// 与 ahooks useRequest 的一处有意差异：cacheKey 种子延迟到 start()（挂载语义），构造与 SSR 期
// 不读缓存——保证 hydrate 首帧与服务端 HTML 一致；种子后仍后台重发并更新。

export type RequestRunnerState<TData> = {
  data: TData | null
  loading: boolean
  error: unknown
}

export type RequestRunnerOptions<TData, TParams extends any[]> = {
  manual?: boolean
  onSuccess?: (data: TData, params: TParams) => void
  onError?: (error: unknown, params: TParams) => void
  cacheKey?: string
}

// 与 ahooks 相同：同一 JS runtime 内按 key 共享最近一次成功数据；node 进程侧无预填路径（SSR 期不读）。
const dataCache = new Map<string, unknown>()

export class RequestRunner<TData, TParams extends any[]> {
  private readonly service: (...args: TParams) => Promise<TData>
  private readonly options: RequestRunnerOptions<TData, TParams>
  private state: RequestRunnerState<TData> = { data: null, loading: false, error: null }
  private readonly listeners = new Set<() => void>()
  private callId = 0
  private lastParams: TParams = [] as unknown as TParams

  constructor(
    service: (...args: TParams) => Promise<TData>,
    options: RequestRunnerOptions<TData, TParams> = {},
  ) {
    this.service = service
    this.options = options
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  getSnapshot = (): RequestRunnerState<TData> => this.state

  /** 挂载语义入口：cacheKey 命中则种子秒显；auto 时后台发起请求，manual 只种子。 */
  start(): void {
    const { cacheKey, manual } = this.options
    if (cacheKey && dataCache.has(cacheKey)) {
      this.setState({ ...this.state, data: dataCache.get(cacheKey) as TData })
    }
    if (!manual) {
      void this.refresh().catch(() => undefined)
    }
  }

  run = (...args: TParams): void => {
    void this.exec(args).catch(() => undefined)
  }

  runAsync = (...args: TParams): Promise<TData> => this.exec(args)

  /** 以最近一次参数重发（ahooks refresh 语义）。 */
  refresh = (): Promise<TData> => this.exec(this.lastParams)

  private async exec(args: TParams): Promise<TData> {
    const id = ++this.callId
    this.lastParams = args
    this.setState({ ...this.state, loading: true })
    try {
      const data = await this.service(...args)
      if (id === this.callId) {
        this.setState({ data, error: null, loading: false })
        if (this.options.cacheKey) dataCache.set(this.options.cacheKey, data)
        this.options.onSuccess?.(data, args)
      }
      return data
    } catch (error) {
      if (id === this.callId) {
        this.setState({ ...this.state, error, loading: false })
        this.options.onError?.(error, args)
      }
      throw error
    }
  }

  private setState(next: RequestRunnerState<TData>): void {
    const prev = this.state
    if (prev.data === next.data && prev.loading === next.loading && prev.error === next.error) return
    this.state = next
    for (const listener of this.listeners) listener()
  }
}
