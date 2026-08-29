import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const postPageSource = await readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8')
const relatedPostsSource = await readFile(resolve(appRoot, 'app/post/components/RelatedPosts/index.tsx'), 'utf8')
const postArticleStyles = await readFile(resolve(appRoot, 'app/post/styles/post-article.ts'), 'utf8')

test('related posts fetch candidates by labels with parallel requests', () => {
  assert.match(relatedPostsSource, /Promise\.all/)
  assert.match(relatedPostsSource, /labels: \[label\]/)
  assert.match(relatedPostsSource, /selectRelatedPosts/)
  assert.match(relatedPostsSource, /state: 'open'/)
})

test('related posts render as a literary thread when candidates exist', () => {
  assert.match(relatedPostsSource, /posts\.length === 0\) return null/)
  assert.match(relatedPostsSource, /RelatedPostsSection aria-labelledby='related-posts-title'/)
  assert.match(relatedPostsSource, /RelatedPostsHeader/)
  assert.match(relatedPostsSource, /id='related-posts-title'>继续阅读/)
  assert.match(relatedPostsSource, /读罢意犹未尽/)
  assert.match(relatedPostsSource, /拾遗 \{posts\.length\} 则/)
  assert.match(relatedPostsSource, /summary && <RelatedPostSummary>/)
  assert.match(relatedPostsSource, /线索 \/ \{sharedLabels\}/)
  assert.match(relatedPostsSource, /aria-label=\{`继续阅读：\$\{post\.title\}`\}/)
  assert.match(relatedPostsSource, /RelatedPostArrow aria-hidden='true'/)
  assert.match(relatedPostsSource, /buildPostUrl\(post\.number\)/)
})

test('related posts use the tokenized thread-in-card style', () => {
  const relatedSection = postArticleStyles.match(/export const RelatedPostsSection = styled\.section`([\s\S]*?)`/)?.[1] || ''
  const relatedLink = postArticleStyles.match(/export const RelatedPostLink = styled\.a`([\s\S]*?)`/)?.[1] || ''

  assert.match(postArticleStyles, /export const RelatedPostsHeader/)
  assert.match(postArticleStyles, /export const RelatedPostSummary/)
  assert.match(postArticleStyles, /export const RelatedPostArrow/)
  assert.doesNotMatch(postArticleStyles, /export const RelatedPostIndex/)
  assert.match(relatedSection, /border:/)
  assert.match(relatedSection, /border-radius:/)
  assert.match(relatedSection, /background:/)
  assert.match(relatedSection, /border-radius: 50%/)
  assert.match(relatedSection, /width: 1px/)
  assert.match(relatedLink, /min-height: 44px;/)
  assert.match(relatedLink, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(relatedLink, /border-radius:|box-shadow:|translateY|border-bottom-left-radius/)
})
