import test from 'node:test'
import assert from 'node:assert/strict'
import {
  clampGuestbookContent,
  createGuestbookMessage,
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
