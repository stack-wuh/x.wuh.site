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

export type UseFetchReturn<TData, TBody = unknown> = {
  data: TData | null
  error: FetchError | null
  loading: boolean
  status: number | null
  ok: boolean
  run: (override?: { url?: string; options?: RequestOptions<TBody> }) => Promise<FetchResult<TData>>
  reload: () => Promise<FetchResult<TData>>
  cancel: () => void
  setData: React.Dispatch<React.SetStateAction<TData | null>>
}

export const useFetch = <TData = unknown, TBody = unknown>(
  url: string,
  options?: RequestOptions<TBody>,
  hooks?: UseFetchOptions<TData, TBody>
): UseFetchReturn<TData, TBody> => {
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

  const optionsKey = useMemo(() => {
    if (!options) return ''
    const { signal, fetch: _fetch, ...rest } = options
    return JSON.stringify(rest)
  }, [options])

  const run = useCallback(
    async (override?: { url?: string; options?: RequestOptions<TBody> }) => {
      const targetUrl = override?.url ?? url
      const mergedOptions: RequestOptions<TBody> = {
        ...options,
        ...override?.options,
        headers: { ...options?.headers, ...override?.options?.headers },
        query: { ...options?.query, ...override?.options?.query },
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const finalOptions: RequestOptions<TBody> = {
        ...mergedOptions,
        signal: mergedOptions.signal ?? controller.signal,
      }

      setLoading(true)
      setError(null)

      onStart?.({ url: targetUrl, options: finalOptions })

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
        onSuccess?.({ url: targetUrl, options: finalOptions, data: result.data as TData })
      } else {
        onError?.({ url: targetUrl, options: finalOptions, error: result.error! })
      }

      onFinally?.({ url: targetUrl, options: finalOptions, result })

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
