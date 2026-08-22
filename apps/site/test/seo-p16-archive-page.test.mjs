import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const blogStylesSource = await readFile(resolve(appRoot, 'app/blog/styles/index.ts'), 'utf8')

test('blog post title link fills the row so metadata remains right-aligned', () => {
  assert.match(blogStylesSource, /export const PostTitleLink = styled\(Link\)`[\s\S]*?flex: 1 1 0;/)
})

test('blog post rows do not advertise full-row click behavior', () => {
  const postRowStyles = blogStylesSource.match(/export const PostRow = styled\.div`([\s\S]*?)`/)?.[1] || ''

  assert.doesNotMatch(postRowStyles, /&:hover|padding-left:/)
})
