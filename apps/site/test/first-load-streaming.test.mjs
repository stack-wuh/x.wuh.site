import test from 'node:test'
import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const read = (relative) => readFile(resolve(appRoot, relative), 'utf8')

async function fileExists(relative) {
  try {
    await access(resolve(appRoot, relative))
    return true
  } catch {
    return false
  }
}

const homeViewSource = await read('app/HomeView/index.tsx')

test('blog and music routes no longer ship route-level loading skeletons', async () => {
  assert.equal(await fileExists('app/blog/loading.tsx'), false, 'app/blog/loading.tsx must be removed')
  assert.equal(await fileExists('app/music/loading.tsx'), false, 'app/music/loading.tsx must be removed')
})

test('post route keeps the no-loading-skeleton precedent', async () => {
  assert.equal(await fileExists('app/post/loading.tsx'), false, 'app/post/loading.tsx must stay absent')
})

test('home page typewriter is statically imported without a dynamic loading boundary', () => {
  assert.match(homeViewSource, /import TypewriterMotto from ['"]\.\.\/components\/TypewriterMotto['"]/)
  assert.doesNotMatch(homeViewSource, /dynamic\(\s*\(\)\s*=>\s*import\(['"]\.\.\/components\/TypewriterMotto['"]/)
  assert.doesNotMatch(homeViewSource, /MottoSkeleton/)
})
