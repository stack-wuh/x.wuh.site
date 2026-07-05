const MAX_LENGTH = 100

export function clampGuestbookContent(input) {
  const value = String(input ?? '').slice(0, MAX_LENGTH)
  return {
    value,
    length: value.length,
    remaining: MAX_LENGTH - value.length,
  }
}

export function resolveGuestbookLayout(isMobile, showList) {
  if (isMobile) return 'stack'
  return showList ? 'split' : 'barrage'
}

export function queueGuestbookDraft(queue, draft) {
  const nickname = String(draft?.nickname ?? '').trim()
  const content = clampGuestbookContent(draft?.content ?? '').value.trim()
  if (!nickname || !content) return queue

  return queue.concat({
    id: draft?.id ?? `${queue.length + 1}`,
    nickname,
    content,
    createdAt: draft?.createdAt ?? new Date().toISOString(),
    status: 'pending',
  })
}

export async function flushGuestbookDrafts(queue, submitDraft) {
  const remaining = []

  for (const draft of queue) {
    try {
      await submitDraft(draft)
    } catch {
      remaining.push(draft)
    }
  }

  return remaining
}
