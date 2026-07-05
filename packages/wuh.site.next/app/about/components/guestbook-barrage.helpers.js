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
