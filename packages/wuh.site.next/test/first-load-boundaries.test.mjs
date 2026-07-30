import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const [homePage, postPage, aboutPage, blogPage] = await Promise.all([
  readFile(resolve(appRoot, 'app/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/post/[number]/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/about/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/blog/page.tsx'), 'utf8'),
])

test('首页首屏不等待非首屏数据', () => {
  assert.match(homePage, /getFeaturedIssues\(\)/)
  assert.doesNotMatch(homePage, /Promise\.all\(\[\s*getRepos\(\)/)
  assert.match(homePage, /HomeView repos=\{\[\]\} posts=\{posts\}/)
})

test('文章详情首屏不等待相关文章', () => {
  assert.doesNotMatch(postPage, /const relatedPosts = await getRelatedPosts\(issue\)/)
  assert.doesNotMatch(postPage, /void getRelatedPosts\(issue\)/)
  assert.match(postPage, /<PostView issue=\{issue\}/)
})

test('首页非首屏数据在客户端加载', async () => {
  const homeView = await readFile(resolve(appRoot, 'app/HomeView.tsx'), 'utf8')
  assert.match(homeView, /reposService\.getAll/)
  assert.match(homeView, /contentService\.getPosts/)
  assert.match(homeView, /wereadService\.getBooks/)
})

test('博客分类在客户端加载', async () => {
  const blogView = await readFile(resolve(appRoot, 'app/blog/BlogListView.tsx'), 'utf8')
  assert.match(blogView, /contentService\.getLabels/)
})

test('关于页首屏不等待仓库数据', () => {
  assert.doesNotMatch(aboutPage, /await getRepos\(\)/)
  assert.match(aboutPage, /getProfile\(\)/)
})

test('博客列表首屏不等待分类数据', () => {
  assert.match(blogPage, /getIssues\(currentPage, activeLabels\)/)
  assert.doesNotMatch(blogPage, /Promise\.all\(\[\s*getIssues\(currentPage, activeLabels\),\s*getLabels\(\)/)
})
