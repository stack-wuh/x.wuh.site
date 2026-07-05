import test from 'node:test'
import assert from 'node:assert/strict'
import {
  clampGuestbookContent,
  flushGuestbookDrafts,
  queueGuestbookDraft,
  resolveGuestbookLayout,
} from './guestbook-barrage.helpers.js'

test('clampGuestbookContent truncates input to 100 characters', () => {
  const result = clampGuestbookContent('a'.repeat(101))
  assert.equal(result.value, 'a'.repeat(100))
  assert.equal(result.length, 100)
  assert.equal(result.remaining, 0)
})

test('resolveGuestbookLayout uses split layout only when list is open', () => {
  assert.equal(resolveGuestbookLayout(false, false), 'barrage')
  assert.equal(resolveGuestbookLayout(false, true), 'split')
  assert.equal(resolveGuestbookLayout(true, true), 'stack')
})

test('queueGuestbookDraft appends a local draft without submitting immediately', () => {
  const queue = queueGuestbookDraft([], {
    nickname: 'Shadow',
    content: '先本地弹幕展示',
  })

  assert.equal(queue.length, 1)
  assert.equal(queue[0].nickname, 'Shadow')
  assert.equal(queue[0].content, '先本地弹幕展示')
  assert.equal(queue[0].status, 'pending')
})

test('flushGuestbookDrafts submits queued drafts and clears the queue', async () => {
  const drafts = queueGuestbookDraft([], {
    nickname: 'Shadow',
    content: '关闭时统一提交',
  })

  const seen = []
  const next = await flushGuestbookDrafts(drafts, async (draft) => {
    seen.push(draft.content)
  })

  assert.deepEqual(seen, ['关闭时统一提交'])
  assert.equal(next.length, 0)
})
