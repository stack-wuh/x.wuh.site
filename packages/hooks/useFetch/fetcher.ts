export type QueryValue = string | number | boolean | null | undefined
export type QueryRecord = Record<string, QueryValue | QueryValue[]>

export type FetchError = {
  message: string
  status: number
  code?: string | number
  details?: unknown
}

export type FetchResult<T> = {
  data: T | null
  error: FetchError | null
  status: number | null
  ok: boolean
  headers: Headers | null
}

export type RequestOptions<TBody = unknown> = {
  method?: string
  headers?: Record<string, string>
  query?: QueryRecord
  body?: TBody
  parse?: 'json' | 'text' | 'blob' | 'arrayBuffer'
  timeout?: number
  signal?: AbortSignal
  cache?: RequestCache
  credentials?: RequestCredentials
  redirect?: RequestRedirect
  mode?: RequestMode
  referrer?: string
  referrerPolicy?: ReferrerPolicy
  ext?: Record<string, unknown>
  fetch?: typeof fetch
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const buildUrl = (input: string, query?: QueryRecord) => {
  if (!query) return input
  const url = new URL(input, 'http://localhost')

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === null || item === undefined) return
        url.searchParams.append(key, String(item))
      })
      return
    }
    url.searchParams.set(key, String(value))
  })

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return url.toString()
  }

  return url.toString().replace(url.origin, '')
}

const resolveBody = (body: unknown, headers: Record<string, string>) => {
  if (body === undefined || body === null) return undefined
  if (typeof body === 'string') return body
  if (body instanceof ArrayBuffer || body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams) {
    return body
  }
  if (isRecord(body) || Array.isArray(body)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }
    return JSON.stringify(body)
  }
  return body as BodyInit
}

const parseResponse = async (res: Response, parse: RequestOptions['parse']) => {
  if (res.status === 204) return null
  const contentType = res.headers.get('content-type') || ''
  const mode = parse ?? (contentType.includes('application/json') ? 'json' : 'text')

  if (mode === 'arrayBuffer') return res.arrayBuffer()
  if (mode === 'blob') return res.blob()
  if (mode === 'text') return res.text()

  try {
    return await res.json()
  } catch {
    return null
  }
}

export const fetcher = async <T>(url: string, options: RequestOptions = {}): Promise<FetchResult<T>> => {
  const {
    method = 'GET',
    headers = {},
    query,
    body,
    parse,
    timeout,
    signal,
    cache,
    credentials,
    redirect,
    mode,
    referrer,
    referrerPolicy,
    ext,
    fetch: customFetch,
  } = options

  const mergedHeaders: Record<string, string> = { ...headers }
  const resolvedBody = resolveBody(body, mergedHeaders)
  const finalUrl = buildUrl(url, query)

  const controller = !signal && timeout ? new AbortController() : null
  const finalSignal = signal ?? controller?.signal
  let timer: ReturnType<typeof setTimeout> | null = null

  if (controller && timeout) {
    timer = setTimeout(() => controller.abort(), timeout)
  }

  const fetchImpl = customFetch ?? fetch

  const requestInit = {
    method,
    headers: mergedHeaders,
    body: resolvedBody,
    signal: finalSignal,
    cache,
    credentials,
    redirect,
    mode,
    referrer,
    referrerPolicy,
    ...ext,
  } as RequestInit

  try {
    const res = await fetchImpl(finalUrl, requestInit)
    const parsed = await parseResponse(res, parse)

    if (!res.ok) {
      const message =
        (isRecord(parsed) && typeof parsed.message === 'string' && parsed.message) ||
        res.statusText ||
        'Request failed'
      const error: FetchError = {
        message,
        status: res.status,
        code: isRecord(parsed) ? (parsed.code as string | number | undefined) : undefined,
        details: parsed ?? null,
      }
      return {
        data: null,
        error,
        status: res.status,
        ok: false,
        headers: res.headers,
      }
    }

    return {
      data: parsed as T,
      error: null,
      status: res.status,
      ok: true,
      headers: res.headers,
    }
  } catch (err) {
    const error: FetchError = {
      message: err instanceof Error ? err.message : 'Network error',
      status: 0,
      details: err,
    }
    return {
      data: null,
      error,
      status: 0,
      ok: false,
      headers: null,
    }
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export default fetcher
