import test from 'node:test'
import assert from 'node:assert/strict'
import {
  clampGuestbookContent,
  createGuestbookMessage,
  normalizeGuestbookComments,
} from './guestbook-barrage.helpers.js'

test('clampGuestbookContent truncates input to 100 characters', () => {
  const result = clampGuestbookContent('a'.repeat(101))
  assert.equal(result.value, 'a'.repeat(100))
  assert.equal(result.length, 100)
  assert.equal(result.remaining, 0)
})

test('createGuestbookMessage appends a local sending message', () => {
  const queue = createGuestbookMessage([], {
    nickname: 'Shadow',
    content: '先本地聊天展示',
  })

  assert.equal(queue.length, 1)
  assert.equal(queue[0].nickname, 'Shadow')
  assert.equal(queue[0].content, '先本地聊天展示')
  assert.equal(queue[0].status, 'sending')
})

test('normalizeGuestbookComments maps persisted comments into chat messages', () => {
  const messages = normalizeGuestbookComments({
    data: [
      {
        _id: 'mongo-1',
        externalId: 'external-1',
        nickname: '访客',
        body: '这是上一次保存的留言',
        createdAt: '2026-07-06T08:30:00.000Z',
      },
    ],
  })

  assert.equal(messages.length, 1)
  assert.equal(messages[0].id, 'external-1')
  assert.equal(messages[0].nickname, '访客')
  assert.equal(messages[0].content, '这是上一次保存的留言')
  assert.equal(messages[0].createdAt, '2026-07-06T08:30:00.000Z')
  assert.equal(messages[0].status, 'sent')
})
