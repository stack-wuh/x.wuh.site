'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetcher, type FetchError, type FetchResult, type RequestOptions } from './fetcher'

export type UseFetchOptions<TData = unknown, TBody = unknown> = {
  manual?: boolean
  defaultData?: TData | null
  deps?: React.DependencyList
  onStart?: (ctx: { url: string; options: RequestOptions<TBody> }) => void
  onSuccess?: (ctx: { url: string; options: RequestOptions<TBody>; data: TData }) => void
  onError?: (ctx: { url: string; options: RequestOptions<TBody>; error: FetchError }) => void
  onFinally?: (ctx: { url: string; options: RequestOptions<TBody>; result: FetchResult<TData> }) => void
}

export type UseFetchReturn<TData> = {
  data: TData | null
  error: FetchError | null
  loading: boolean
  status: number | null
  ok: boolean
  run: (override?: { url?: string; options?: RequestOptions }) => Promise<FetchResult<TData>>
  reload: () => Promise<FetchResult<TData>>
  cancel: () => void
  setData: React.Dispatch<React.SetStateAction<TData | null>>
}

const createOptionsKey = (options?: RequestOptions) => {
  if (!options) return ''
  try {
    const { onStart, onSuccess, onError, onFinally, fetch, signal, ...rest } = options
    return JSON.stringify(rest)
  } catch {
    return ''
  }
}

const mergeOptions = (base?: RequestOptions, override?: RequestOptions) => {
  if (!base && !override) return undefined
  if (!base) return override
  if (!override) return base
  return {
    ...base,
    ...override,
    headers: { ...base.headers, ...override.headers },
    query: { ...base.query, ...override.query },
  }
}

export const useFetch = <TData = unknown, TBody = unknown>(
  url: string,
  options?: RequestOptions<TBody>,
  hooks?: UseFetchOptions<TData, TBody>
): UseFetchReturn<TData> => {
  const {
    manual = false,
    defaultData = null,
    deps,
    onStart,
    onSuccess,
    onError,
    onFinally,
  } = hooks ?? {}

  const [data, setData] = useState<TData | null>(defaultData)
  const [error, setError] = useState<FetchError | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<number | null>(null)
  const [ok, setOk] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const optionsKey = useMemo(() => createOptionsKey(options), [options])

  const run = useCallback(
    async (override?: { url?: string; options?: RequestOptions }) => {
      const targetUrl = override?.url ?? url
      const mergedOptions = mergeOptions(options, override?.options) ?? {}

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const finalOptions: RequestOptions = {
        ...mergedOptions,
        signal: mergedOptions.signal ?? controller.signal,
        onStart,
        onSuccess,
        onError,
        onFinally,
      }

      setLoading(true)
      setError(null)

      const result = await fetcher<TData>(targetUrl, finalOptions)

      if (abortRef.current === controller) {
        abortRef.current = null
      }

      setLoading(false)
      setStatus(result.status)
      setOk(result.ok)
      setError(result.error)
      if (result.ok) {
        setData(result.data)
      }

      return result
    },
    [url, options, onStart, onSuccess, onError, onFinally]
  )

  const reload = useCallback(() => run(), [run])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  useEffect(() => {
    if (manual) return
    void run()
  }, deps ?? [url, optionsKey])

  return {
    data,
    error,
    loading,
    status,
    ok,
    run,
    reload,
    cancel,
    setData,
  }
}

export default useFetch
