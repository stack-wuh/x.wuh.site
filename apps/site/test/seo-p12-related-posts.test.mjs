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
  // 20261107 对账：文案全面 i18n 化（t('post.related.*')），字面量断言改词典键位等强替换
  assert.match(relatedPostsSource, /posts\.length === 0\) return null/)
  assert.match(relatedPostsSource, /RelatedPostsSection aria-labelledby='related-posts-title'/)
  assert.match(relatedPostsSource, /RelatedPostsHeader/)
  assert.match(relatedPostsSource, /id='related-posts-title'>\{t\('post\.related\.heading'\)\}/)
  assert.match(relatedPostsSource, /t\('post\.related\.intro'\)/)
  assert.match(relatedPostsSource, /t\('post\.related\.count', \{ n: posts\.length \}\)/)
  assert.match(relatedPostsSource, /summary && <RelatedPostSummary>/)
  assert.match(relatedPostsSource, /t\('post\.related\.clues', \{ labels: sharedLabels \}\)/)
  assert.match(relatedPostsSource, /aria-label=\{t\('post\.related\.itemAria', \{ title: post\.title \}\)\}/)
  assert.match(relatedPostsSource, /RelatedPostMarker aria-hidden='true'/)
  assert.match(relatedPostsSource, /RelatedPostArrow aria-hidden='true'/)
  assert.match(relatedPostsSource, /buildPostUrl\(post\.number\)/)
})

test('related posts use the tokenized thread-in-card style', () => {
  // 20261107 对账：文学线视觉由 Leader 点线 + Link 悬停态承载，Section 收敛为版式留白；
  // 载体已是 styled(Link)（soft-navigation 白名单同源），禁用装饰残留断言一并等强迁移
  const relatedSection = postArticleStyles.match(/export const RelatedPostsSection = styled\.section`([\s\S]*?)`/)?.[1] || ''
  const relatedLink = postArticleStyles.match(/export const RelatedPostLink = styled\(Link\)`([\s\S]*?)`/)?.[1] || ''
  const relatedLeader = postArticleStyles.match(/export const RelatedPostLeader = styled\.span`([\s\S]*?)`/)?.[1] || ''

  assert.match(postArticleStyles, /export const RelatedPostsHeader/)
  assert.match(postArticleStyles, /export const RelatedPostSummary/)
  assert.match(postArticleStyles, /export const RelatedPostArrow/)
  assert.doesNotMatch(postArticleStyles, /export const RelatedPostIndex/)
  assert.match(relatedSection, /margin-top: var\(--space-xl\)/)
  assert.match(relatedSection, /font-family: var\(--font-serif\)/)
  assert.match(relatedLeader, /border-bottom: 1px dotted color-mix/)
  assert.match(relatedLeader, /transition: border-color var\(--motion-dur-quick\)/)
  assert.match(relatedLink, /padding: var\(--space-xs\) 0;/)
  assert.match(relatedLink, /prefers-reduced-motion: reduce/)
  assert.match(relatedLink, /&:focus-visible/)
  assert.doesNotMatch(relatedLink, /box-shadow:|translateY/)
})
