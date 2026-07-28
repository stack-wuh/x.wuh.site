const MAX_LENGTH = 100

export function clampGuestbookContent(input) {
  const value = String(input ?? '').slice(0, MAX_LENGTH)
  return {
    value,
    length: value.length,
    remaining: MAX_LENGTH - value.length,
  }
}

export function createGuestbookMessage(queue, message) {
  const nickname = String(message?.nickname ?? '').trim()
  const content = clampGuestbookContent(message?.content ?? '').value.trim()
  if (!nickname || !content) return queue

  return queue.concat({
    id: message?.id ?? `${queue.length + 1}`,
    nickname,
    content,
    footprint: message?.footprint,
    createdAt: message?.createdAt ?? new Date().toISOString(),
    status: message?.status ?? 'sending',
  })
}

export function normalizeGuestbookComments(payload, currentFootprint) {
  const rows = Array.isArray(payload?.data) ? payload.data : []
  const footprint = String(currentFootprint || '').trim()

  return rows
    .map((item, index) => {
      const nickname = String(item?.nickname || item?.user?.login || '访客').trim()
      const content = String(item?.content || item?.body || '').trim()
      const itemFootprint = String(item?.footprint || '').trim()
      if (!content) return null

      return {
        id: String(item?.externalId || item?._id || item?.id || `comment-${index}`),
        nickname: nickname || '访客',
        content,
        footprint: itemFootprint || undefined,
        createdAt: item?.createdAt || item?.createdAtGitHub || new Date().toISOString(),
        status: 'sent',
        mine: Boolean(footprint && itemFootprint && footprint === itemFootprint),
      }
    })
    .filter(Boolean)
    .reverse()
}

/**
 * 将留言按 createdAt 升序排列（旧→新），返回新数组，不改变原数组。
 * @param {Array<{createdAt: string}>} messages
 * @returns {Array}
 */
export function sortGuestbookAsc(messages) {
  return [...messages].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime()
    const tb = new Date(b.createdAt).getTime()
    return ta - tb
  })
}
