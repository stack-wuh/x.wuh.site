import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const loading = await readFile(
  resolve(appRoot, 'app/post/[number]/loading.tsx'),
  'utf8',
)
const stylesIndex = await readFile(
  resolve(appRoot, 'app/post/styles/index.ts'),
  'utf8',
)

test('骨架复用终态布局壳组件，布局度量单一事实源', () => {
  assert.match(loading, /from '\.\.\/styles'/)
  for (const name of [
    'Container',
    'ContentGrid',
    'MainColumn',
    'PostLead',
    'CoverFrame',
    'TocAside',
  ]) {
    assert.match(loading, new RegExp(`\\b${name}\\b`), `loading.tsx 应复用 ${name}`)
    assert.match(stylesIndex, new RegExp(`\\b${name}\\b`), `styles 桶应导出 ${name}`)
  }
})

test('骨架不自持布局度量，旧文章卡语言已移除', () => {
  assert.match(loading, /@wuh\.site\/components\/skeleton/)
  assert.doesNotMatch(loading, /grid-template-columns/)
  assert.doesNotMatch(loading, /position: sticky/)
  assert.doesNotMatch(loading, /ArticleCard/)
})

test('骨架整页镜像终态各区域', () => {
  for (const name of [
    'TopRow',
    'TagGroup',
    'HeadRule',
    'TocMobile',
    'RelatedPostsSection',
    'ArticleColophon',
    'ColophonShareRow',
    'Toolbar',
    'TocTools',
    'TocPrevNext',
    'TocInfo',
  ]) {
    assert.match(loading, new RegExp(`\\b${name}\\b`), `骨架应镜像 ${name} 区域`)
  }
})

test('骨架为纯装饰占位，不向辅助技术泄漏语义文本', () => {
  assert.match(loading, /aria-hidden/)
  assert.doesNotMatch(loading, />(目录|评论|继续阅读)</)
})
