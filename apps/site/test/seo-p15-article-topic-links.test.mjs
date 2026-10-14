import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')

// 20261014 chore-dead-components-retirement：本守卫原钉 packages/components/alert 与 PostView 传参形态，
// 两处载体均已退役（alert 零消费整删；labels 渲染迁入 PostHeader）。意图不变——文章标签必须链到站内专题页：
// 断言改钉现实载体。原 case2「外链 target=_blank」语义随 alert 消失（现形态 labels 全为站内链接，
// 外链新窗纪律由 soft-navigation 守卫覆盖），不再钉不存在的代码。
const postHeaderSource = await readFile(resolve(appRoot, 'app/post/components/PostHeader/index.tsx'), 'utf8')

test('post labels link to internal topic pages', () => {
  assert.match(postHeaderSource, /import \{ buildTopicUrl \} from '@\/app\/lib\/topic-url'/)
  assert.match(postHeaderSource, /href=\{buildTopicUrl\(label\.name\)\}/)
  assert.doesNotMatch(postHeaderSource, /is:issue label:/)
})
