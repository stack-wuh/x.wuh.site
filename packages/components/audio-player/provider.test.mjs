import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const componentDir = dirname(fileURLToPath(import.meta.url))
const [providerSource, miniPlayerSource, specsSource] = await Promise.all([
  readFile(resolve(componentDir, 'provider.tsx'), 'utf8'),
  readFile(resolve(componentDir, 'MiniPlayer.tsx'), 'utf8'),
  readFile(resolve(componentDir, 'specs.tsx'), 'utf8')
])

test('播放器状态类型不再被收窄成 idle 字面量', () => {
  assert.doesNotMatch(providerSource, /typeof initialState\.status/)
  assert.match(providerSource, /import type \{[^}]*PlayerStatus[^}]*\} from '\.\/specs'/s)
  assert.match(providerSource, /const initialState: AudioPlayerState/)
  assert.match(providerSource, /payload: \{ status: PlayerStatus; error\?: string \}/)
  assert.match(providerSource, /\(state: AudioPlayerState, action: Action\): AudioPlayerState/)
})

test('不可播曲目按队列顺序推进且整轮尝试不超过队列长度', () => {
  assert.match(providerSource, /const getSkipIndex = \(currentIndex: number, queueLength: number\)/)
  assert.match(providerSource, /const skipped = attempts \+ 1/)
  assert.match(providerSource, /if \(nextIndex === -1 \|\| skipped >= queue\.length\)/)
  assert.match(providerSource, /playTrackAtRef\.current\(nextIndex, skipped\)/)
  // 文案已迁 i18n 词典（player.skippedNotice），守卫改为断言带 count 插值的 t() 调用形状
  assert.match(providerSource, /t\('player\.skippedNotice', \{ count: skipped \}\)/)
  assert.match(providerSource, /status: 'idle', error: /)
})

test('音频元素报错也走跳过路径，而不是把播放停在 error', () => {
  const errorHandler = providerSource.match(/const handleError = \(\) => \{[\s\S]*?\n {4}\}/)
  assert.ok(errorHandler, 'handleError 必须存在')
  assert.match(errorHandler[0], /skipRef\.current/)
  assert.doesNotMatch(errorHandler[0], /status: 'error'/)
})

test('公开契约不变，跳过语义不需要新增 action', () => {
  assert.match(specsSource, /export interface AudioPlayerState \{[\s\S]*error\?: string/)
  assert.doesNotMatch(specsSource, /setError/)
})

test('跳过提示在用户操作前保持可见', () => {
  assert.match(providerSource, /'error' in action\.payload \? \{ error: action\.payload\.error \} : \{\}/)
  assert.match(providerSource, /const dismissNotice = useCallback/)
  assert.match(providerSource, /payload: \{ status: stateRef\.current\.status, error: undefined \}/)
  assert.match(providerSource, /playAt,/)
  assert.doesNotMatch(providerSource, /playAt: playTrackAt/)
})

test('歌单名契约：loadQueue 随队列整体替换、缺省落 undefined（20261006 卷题签）', () => {
  // State 位与 options 位都在；只增字段，公开契约向后兼容
  assert.match(specsSource, /playlistName\?: string/)
  assert.match(specsSource, /startIndex\?: number; autoPlay\?: boolean; playlistName\?: string/)
  assert.match(providerSource, /payload: \{ queue: Track\[\]; startIndex: number; playlistName\?: string \}/)
  // 整体替换语义：未传即 undefined——换队列必换卷名，禁「保留旧卷名」的黏滞分支
  assert.match(providerSource, /playlistName: action\.payload\.playlistName/)
})

test('迷你播放器展示跳过/失败提示且不改变卡片高度', () => {
  assert.match(miniPlayerSource, /\{state\.error \? \(/)
  assert.match(miniPlayerSource, /role='status'/)
  assert.match(miniPlayerSource, /<Notice/)
})
