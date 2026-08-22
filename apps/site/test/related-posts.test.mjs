import test from 'node:test'
import assert from 'node:assert/strict'
import { selectRelatedPosts } from '../app/lib/related-posts.ts'

test('selects unique related posts by shared labels and recency', () => {
  const posts = selectRelatedPosts(
    { number: 10, labels: ['Next.js', 'SEO'] },
    [
      { number: 10, title: '当前文章', labels: ['Next.js'], updatedAt: '2026-07-22' },
      { number: 11, title: '两个标签', labels: ['Next.js', 'SEO'], updatedAt: '2026-07-20' },
      { number: 12, title: '一个标签较新', labels: ['SEO'], updatedAt: '2026-07-23' },
      { number: 12, title: '重复数据', labels: ['SEO'], updatedAt: '2026-07-19' },
      { number: 13, title: '无关文章', labels: ['NestJS'], updatedAt: '2026-07-24' },
    ],
  )

  assert.deepEqual(posts.map((post) => post.number), [11, 12])
})

test('caps related posts at three items', () => {
  const posts = selectRelatedPosts(
    { number: 10, labels: ['Next.js'] },
    [11, 12, 13, 14].map((number) => ({
      number,
      title: `文章 ${number}`,
      labels: ['Next.js'],
      updatedAt: `2026-07-${number}`,
    })),
  )

  assert.equal(posts.length, 3)
})
