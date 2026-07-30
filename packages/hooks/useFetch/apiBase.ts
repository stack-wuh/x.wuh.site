export type ApiBaseEnv = {
  NEST_API_URL?: string
  NODE_ENV?: string
}

export function resolveApiBase(env: ApiBaseEnv = process.env): string {
  const explicitApiUrl = env.NEST_API_URL?.trim()
  if (explicitApiUrl) return explicitApiUrl

  if (typeof window !== 'undefined') return '/api'
  return env.NODE_ENV === 'production' ? 'http://nest:3200/v2' : 'http://localhost:3200/v2'
}

export const API_BASE = resolveApiBase()
