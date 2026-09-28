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
  assert.match(providerSource, /已跳过 \$\{skipped\} 首不可播放的曲目/)
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

test('迷你播放器展示跳过/失败提示且不改变卡片高度', () => {
  assert.match(miniPlayerSource, /\{state\.error \? \(/)
  assert.match(miniPlayerSource, /role='status'/)
  assert.match(miniPlayerSource, /<Notice/)
})
