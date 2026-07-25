import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const postPageSource = await readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8')
const postViewSource = await readFile(resolve(appRoot, 'app/post/PostView.tsx'), 'utf8')
const postArticleStyles = await readFile(resolve(appRoot, 'app/post/styles/post-article.ts'), 'utf8')

test('post page fetches candidates by labels with cached parallel requests', () => {
  assert.match(postPageSource, /async function getRelatedPosts/)
  assert.match(postPageSource, /Promise\.all/)
  assert.match(postPageSource, /labels: \[label\]/)
  assert.match(postPageSource, /revalidate:\s*3600/)
  assert.match(postPageSource, /selectRelatedPosts/)
  assert.match(postPageSource, /relatedPosts=\{relatedPosts\}/)
})

test('post view renders related posts as a reading index only when candidates exist', () => {
  assert.match(postViewSource, /relatedPosts\.length > 0/)
  assert.match(postViewSource, /RelatedPostsSection aria-labelledby='related-posts-title'/)
  assert.match(postViewSource, /RelatedPostsHeader/)
  assert.match(postViewSource, /id='related-posts-title'>继续阅读/)
  assert.match(postViewSource, /relatedPosts.length} 篇同题文章/)
  assert.match(postViewSource, /RelatedPostIndex>\{String\(index \+ 1\)\.padStart\(2, '0'\)\}/)
  assert.match(postViewSource, /summary && <RelatedPostSummary>/)
  assert.match(postViewSource, /aria-label=\{`继续阅读：\$\{post.title\}`\}/)
  assert.match(postViewSource, /RelatedPostArrow aria-hidden='true'/)
  assert.match(postViewSource, /buildPostUrl\(post.number, post.title\)/)
})

test('related posts use the tokenized editorial index style', () => {
  const relatedSection = postArticleStyles.match(/export const RelatedPostsSection = styled\.section`([\s\S]*?)`/)?.[1] || ''
  const relatedLink = postArticleStyles.match(/export const RelatedPostLink = styled\.a`([\s\S]*?)`/)?.[1] || ''

  assert.match(postArticleStyles, /export const RelatedPostsHeader/)
  assert.match(postArticleStyles, /export const RelatedPostIndex/)
  assert.match(postArticleStyles, /export const RelatedPostSummary/)
  assert.match(postArticleStyles, /export const RelatedPostArrow/)
  assert.match(relatedSection, /border-top:/)
  assert.doesNotMatch(relatedSection, /background:|box-shadow:|border-radius:/)
  assert.match(relatedLink, /grid-template-columns:/)
  assert.match(relatedLink, /min-height: 44px;/)
  assert.match(relatedLink, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(relatedLink, /border-radius: 10px;|box-shadow:|translateY/)
})
