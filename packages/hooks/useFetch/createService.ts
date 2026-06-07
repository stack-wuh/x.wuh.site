import { fetcher, type RequestOptions, type FetchResult, type FetchError } from './fetcher'
import { useRequest } from 'ahooks'

const API_BASE = process.env.NEST_API_URL || 'http://localhost:3200/v2'

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

async function serverCall<TResponse, TQuery = Record<string, unknown>, TBody = unknown>(
  endpoint: EndpointDef,
  callOptions: ServerCallOptions<TQuery, TBody> = {}
): Promise<{ data: TResponse | null; error: FetchError | null; loading: false }> {
  const { query, body, params, revalidate, headers } = callOptions
  const url = `${API_BASE}${resolveUrl(endpoint.url, params)}`

  const fetcherOptions: RequestOptions<TBody> = {
    method: endpoint.method,
    headers: { 'Accept': 'application/json', ...headers },
    query: query as Record<string, unknown>,
    body,
  }

  if (revalidate !== undefined) {
    fetcherOptions.ext = { next: { revalidate } }
  }

  const result: FetchResult<TResponse> = await fetcher<TResponse>(url, fetcherOptions)

  if (!result.ok || !result.data) {
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

function createUseHook<TResponse, TQuery = Record<string, unknown>, TBody = unknown>(
  endpoint: EndpointDef,
  globalOnError?: (error: FetchError) => void
) {
  return function useEndpoint(callOptions: UseCallOptions<TQuery, TBody> = {}) {
    const { query, body, params, headers, onError: localOnError } = callOptions
    const url = `${API_BASE}${resolveUrl(endpoint.url, params)}`

    const onError = localOnError || globalOnError

    const result = useRequest<TResponse, []>(
      () =>
        fetcher<TResponse>(url, {
          method: endpoint.method,
          headers: { 'Accept': 'application/json', ...headers },
          query: query as Record<string, unknown>,
          body,
        }) as Promise<TResponse>,
      {
        onError: (e) => onError?.(e as FetchError),
      }
    )

    return {
      data: result.data ?? null,
      error: (result.error as FetchError) ?? null,
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
