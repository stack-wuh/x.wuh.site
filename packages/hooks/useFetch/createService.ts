import { fetcher, type QueryRecord, type RequestOptions, type FetchResult, type FetchError } from './fetcher'
import { useRequest } from '../useRequest'
import { API_BASE } from './apiBase'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type EndpointDef = {
  url: string
  method: HttpMethod
}

type EndpointsDef = Record<string, EndpointDef>

type ServiceOptions = {
  onError?: (error: FetchError) => void
}

function resolveUrl(template: string, params?: Record<string, string | number>): string {
  if (!params) return template
  return template.replace(/:(\w+)/g, (_, key) => {
    if (key in params) return String(params[key])
    return `:${key}`
  })
}

type ServerCallOptions<TQuery, TBody> = {
  query?: TQuery
  body?: TBody
  params?: Record<string, string | number>
  revalidate?: number
  headers?: Record<string, string>
}

// SSR 路径的默认超时护栏：nest 挂起时首页/sitemap 等整页 SSR 不能无限悬挂（P1-21）；
// fetcher 支持 timeout 但此前 serverCall 从未设置
const SERVER_CALL_TIMEOUT_MS = 15_000

async function serverCall<TResponse, TQuery = Record<string, unknown>, TBody = unknown>(
  endpoint: EndpointDef,
  callOptions: ServerCallOptions<TQuery, TBody> = {}
): Promise<{ data: TResponse | null; error: FetchError | null; loading: false }> {
  const { query, body, params, revalidate, headers } = callOptions
  const url = `${API_BASE}${resolveUrl(endpoint.url, params)}`

  const fetcherOptions: RequestOptions<TBody> = {
    method: endpoint.method,
    headers: { 'Accept': 'application/json', ...headers },
    query: query as QueryRecord,
    body,
    timeout: SERVER_CALL_TIMEOUT_MS,
  }

  if (revalidate !== undefined) {
    fetcherOptions.ext = { next: { revalidate } }
  }

  const result: FetchResult<TResponse> = await fetcher<TResponse>(url, fetcherOptions)

  // 只以 ok 判失败：data 为合法 falsy（204 空体 / data:0 / ''）不是错误（P1-27）
  if (!result.ok) {
    return {
      data: null,
      error: result.error || { message: 'Request failed', status: 0 },
      loading: false,
    }
  }

  return { data: result.data, error: null, loading: false }
}

type UseCallOptions<TQuery, TBody> = {
  query?: TQuery
  body?: TBody
  params?: Record<string, string | number>
  headers?: Record<string, string>
  onError?: (error: FetchError) => void
}

type ClientResult<TResponse> = Pick<FetchResult<TResponse>, 'data' | 'error'>

export function resolveClientResult<TResponse>(result?: FetchResult<TResponse>): ClientResult<TResponse> {
  return {
    data: result?.data ?? null,
    error: result?.error ?? null,
  }
}

function createUseHook<TResponse, TQuery = Record<string, unknown>, TBody = unknown>(
  endpoint: EndpointDef,
  globalOnError?: (error: FetchError) => void
) {
  return function useEndpoint(callOptions: UseCallOptions<TQuery, TBody> = {}) {
    const { query, body, params, headers, onError: localOnError } = callOptions
    const url = `${API_BASE}${resolveUrl(endpoint.url, params)}`

    const onError = localOnError || globalOnError

    const result = useRequest<FetchResult<TResponse>, []>(
      () =>
        fetcher<TResponse>(url, {
          method: endpoint.method,
          headers: { 'Accept': 'application/json', ...headers },
          query: query as QueryRecord,
          body,
        }),
      {
        onSuccess: (response) => {
          if (response.error) onError?.(response.error)
        },
      }
    )
    const clientResult = resolveClientResult(result.data ?? undefined)

    return {
      data: clientResult.data,
      error: clientResult.error ?? ((result.error as unknown as FetchError) || null),
      loading: result.loading,
      run: result.run,
      refresh: result.refresh,
    }
  }
}

type ServiceEndpoint<TResponse = unknown, TQuery = Record<string, unknown>, TBody = unknown> = {
  server: (opts?: ServerCallOptions<TQuery, TBody>) => Promise<{ data: TResponse | null; error: FetchError | null; loading: false }>
  use: ReturnType<typeof createUseHook<TResponse, TQuery, TBody>>
}

type Service<T extends EndpointsDef> = {
  [K in keyof T]: ServiceEndpoint<any, any, any>
}

let globalConfig: ServiceOptions = {}

export function configureService(config: ServiceOptions) {
  globalConfig = { ...globalConfig, ...config }
}

export function defineService<T extends EndpointsDef>(endpoints: T): Service<T> {
  const service: Record<string, ServiceEndpoint> = {}

  for (const [key, endpoint] of Object.entries(endpoints)) {
    service[key] = {
      server: (opts) => serverCall(endpoint, opts),
      use: createUseHook(endpoint, globalConfig.onError),
    }
  }

  return service as Service<T>
}
