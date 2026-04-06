const FALLBACK_ENDPOINTS = [
  process.env.NETEASE_API_BASE,
  'https://neteasecloudmusicapi-main-api.vercel.app'
].filter((base): base is string => Boolean(base))

export const requestNetEase = async (path: string, params: string, init?: RequestInit) => {
  const endpoints = FALLBACK_ENDPOINTS.length ? FALLBACK_ENDPOINTS : ['https://neteasecloudmusicapi-main-api.vercel.app']
  let lastError: unknown

  for (const base of endpoints) {
    try {
      const response = await fetch(`${base}${path}${params}`, init)
      if (response.ok) {
        return response
      }
      lastError = new Error(`${base} responded ${response.status}`)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('网易云 API 服务不可用')
}
