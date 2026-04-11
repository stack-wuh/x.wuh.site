export interface LyricLine {
  time: number
  text: string
}

const timeRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/

export const parseLyrics = (raw?: string): LyricLine[] => {
  if (!raw) return []
  return raw
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(timeRegex)
      if (!match) {
        return null
      }
      const [, m, s, ms] = match
      const time = Number(m) * 60 + Number(s) + (ms ? Number(ms) / 1000 : 0)
      const text = line.replace(timeRegex, '').trim()
      if (!text) {
        return null
      }
      return { time, text }
    })
    .filter((v): v is LyricLine => Boolean(v))
    .sort((a, b) => a.time - b.time)
}

export const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00'
  }
  const mm = Math.floor(seconds / 60)
  const ss = Math.floor(seconds % 60)
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export const findActiveLyricIndex = (lyrics: LyricLine[], current: number) => {
  if (!lyrics.length) return -1
  for (let i = lyrics.length - 1; i >= 0; i -= 1) {
    if (current >= lyrics[i].time) {
      return i
    }
  }
  return -1
}
