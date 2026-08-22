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
    footprint: 'visitor-1',
  })

  assert.equal(queue.length, 1)
  assert.equal(queue[0].nickname, 'Shadow')
  assert.equal(queue[0].content, '先本地聊天展示')
  assert.equal(queue[0].footprint, 'visitor-1')
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

test('normalizeGuestbookComments marks messages from current footprint as mine', () => {
  const messages = normalizeGuestbookComments({
    data: [
      {
        externalId: 'mine-1',
        nickname: '我',
        body: '这是我之前保存的留言',
        footprint: 'visitor-1',
        createdAt: '2026-07-06T08:30:00.000Z',
      },
      {
        externalId: 'other-1',
        nickname: '别人',
        body: '这是其他人的留言',
        footprint: 'visitor-2',
        createdAt: '2026-07-06T08:31:00.000Z',
      },
    ],
  }, 'visitor-1')

  assert.equal(messages.find((item) => item.id === 'mine-1').mine, true)
  assert.equal(messages.find((item) => item.id === 'other-1').mine, false)
})
