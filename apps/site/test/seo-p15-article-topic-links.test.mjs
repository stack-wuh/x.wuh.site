import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const repoRoot = resolve(appRoot, '../..')
const postViewSource = await readFile(resolve(appRoot, 'app/post/PostView.tsx'), 'utf8')
const alertSource = await readFile(resolve(repoRoot, 'packages/components/alert/index.tsx'), 'utf8')

test('post alert labels link to internal topic pages', () => {
  assert.match(postViewSource, /buildTopicUrl/)
  assert.match(postViewSource, /href:\s*buildTopicUrl\(label\.name\)/)
  assert.doesNotMatch(postViewSource, /is:issue label:/)
})

test('alert label links only open external hrefs in a new tab', () => {
  assert.match(alertSource, /const isExternalHref/)
  assert.match(alertSource, /target=\{isExternalHref\(label\.href\) \? '_blank' : undefined\}/)
  assert.match(alertSource, /rel=\{isExternalHref\(label\.href\) \? 'noopener noreferrer' : undefined\}/)
})
