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
    createdAt: message?.createdAt ?? new Date().toISOString(),
    status: message?.status ?? 'sending',
  })
}

export function normalizeGuestbookComments(payload) {
  const rows = Array.isArray(payload?.data) ? payload.data : []

  return rows
    .map((item, index) => {
      const nickname = String(item?.nickname || item?.user?.login || '访客').trim()
      const content = String(item?.content || item?.body || '').trim()
      if (!content) return null

      return {
        id: String(item?.externalId || item?._id || item?.id || `comment-${index}`),
        nickname: nickname || '访客',
        content,
        createdAt: item?.createdAt || item?.createdAtGitHub || new Date().toISOString(),
        status: 'sent',
      }
    })
    .filter(Boolean)
    .reverse()
}
