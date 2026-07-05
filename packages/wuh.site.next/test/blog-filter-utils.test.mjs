import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildBlogUrl,
  formatFilterOptionLabel,
  getFilterSummaryLabel,
  toLabelParams,
  toggleLabel,
} from '../app/blog/blog-filter-utils.ts'

test('normalizes repeated and comma-separated labels', () => {
  assert.deepEqual(toLabelParams(['javascript, react', 'nextjs', 'react']), [
    'javascript',
    'react',
    'nextjs',
  ])
})

test('builds blog urls with all active labels and optional page', () => {
  assert.equal(buildBlogUrl(2, ['javascript', 'react']), '/blog?labels=javascript&labels=react&page=2')
  assert.equal(buildBlogUrl(1, []), '/blog')
})

test('toggles labels while preserving selection order', () => {
  assert.deepEqual(toggleLabel(['javascript'], 'react'), ['javascript', 'react'])
  assert.deepEqual(toggleLabel(['javascript', 'react'], 'javascript'), ['react'])
})

test('formats label counts and filtered result summary total', () => {
  const labels = [
    { name: 'javascript', count: 8 },
    { name: 'vue', count: 3 },
    { name: 'react', count: 5 },
  ]

  assert.equal(formatFilterOptionLabel({ name: 'javascript', count: 8 }), 'javascript(+8)')
  assert.equal(getFilterSummaryLabel(labels, ['javascript'], 8), 'Labels(+8)')
  assert.equal(getFilterSummaryLabel(labels, ['javascript', 'vue'], 2), 'Labels(+2)')
  assert.equal(getFilterSummaryLabel(labels, [], 16), 'Labels')
})
