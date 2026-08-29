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
  assert.match(homePage, /repos=\{\[\]\}/)
  assert.match(homePage, /posts=\{posts\}/)
})

test('文章详情首屏不等待相关文章', () => {
  assert.doesNotMatch(postPage, /const relatedPosts = await getRelatedPosts\(issue\)/)
  assert.doesNotMatch(postPage, /void getRelatedPosts\(issue\)/)
  assert.match(postPage, /<PostView\s+issue=\{issue\}/)
})

test('首页非首屏数据在客户端加载', async () => {
  const [homeView, projectsSection, wereadSection] = await Promise.all([
    readFile(resolve(appRoot, 'app/HomeView/index.tsx'), 'utf8'),
    readFile(resolve(appRoot, 'app/HomeView/ProjectsSection.tsx'), 'utf8'),
    readFile(resolve(appRoot, 'app/HomeView/WereadSection.tsx'), 'utf8'),
  ])
  assert.doesNotMatch(homeView, /reposService|wereadService|contentService/)
  assert.match(projectsSection, /reposService\.getAll/)
  assert.match(wereadSection, /wereadService\.getBooks/)
})

test('首页年度总结映射 GitHub 创建时间到视图日期字段', () => {
  assert.match(homePage, /created_at:\s*item\.createdAtGitHub/)
})

test('AppProviders 引用的访问统计上报组件存在', async () => {
  const reporter = await readFile(resolve(appRoot, 'components/visit-stats/visit-stats-reporter.tsx'), 'utf8')
  assert.match(reporter, /export function VisitStatsReporter/)
})

test('博客分类在客户端加载', async () => {
  const blogView = await readFile(resolve(appRoot, 'app/blog/BlogListView/index.tsx'), 'utf8')
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
