import test from 'node:test'
import assert from 'node:assert/strict'
import { buildTopicUrl, decodeTopicParam } from '../app/lib/topic-url.ts'

test('builds stable topic URLs with encoded labels', () => {
  assert.equal(buildTopicUrl('Next.js SEO'), '/topics/Next.js%20SEO')
  assert.equal(buildTopicUrl('  中文 标签  '), '/topics/%E4%B8%AD%E6%96%87%20%E6%A0%87%E7%AD%BE')
})

test('decodes topic route parameters into labels', () => {
  assert.equal(decodeTopicParam('Next.js%20SEO'), 'Next.js SEO')
  assert.equal(decodeTopicParam('%E4%B8%AD%E6%96%87%20%E6%A0%87%E7%AD%BE'), '中文 标签')
})
