import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const postPageSource = await readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8')
const postViewSource = await readFile(resolve(appRoot, 'app/post/PostView.tsx'), 'utf8')

test('post page fetches candidates by labels with cached parallel requests', () => {
  assert.match(postPageSource, /async function getRelatedPosts/)
  assert.match(postPageSource, /Promise\.all/)
  assert.match(postPageSource, /labels: \[label\]/)
  assert.match(postPageSource, /revalidate:\s*3600/)
  assert.match(postPageSource, /selectRelatedPosts/)
  assert.match(postPageSource, /relatedPosts=\{relatedPosts\}/)
})

test('post view renders related posts only when candidates exist', () => {
  assert.match(postViewSource, /relatedPosts\.length > 0/)
  assert.match(postViewSource, /RelatedPostsSection aria-labelledby='related-posts-title'/)
  assert.match(postViewSource, /id='related-posts-title'>相关文章/)
  assert.match(postViewSource, /buildPostUrl\(post.number, post.title\)/)
})
