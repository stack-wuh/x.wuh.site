export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development'
}

export const isProd = (): boolean => {
  return process.env.NODE_ENV === 'production'
}

export const getLocaleId = (): string => {
  return Math.random().toString(32).slice(2)
}

export const isSafeAudio = (audio?: {}): boolean => {
  if (typeof Audio !== 'undefined') {
    return true
  }

  if (audio && Object.keys(audio).length) {
    return true
  }

  return false
}
