import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const [globalPlayer, appProviders, musicPage, musicView, musicSpecs] = await Promise.all([
  readFile(resolve(appRoot, 'app/components/player/GlobalAudioPlayer.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/components/AppProviders.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/MusicView/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/specs.ts'), 'utf8')
])

test('播放器数据来自 Nest /v2/music，站点不再自持代理 route', async () => {
  await assert.rejects(access(resolve(appRoot, 'app/api/music')), 'app/api/music 应已删除')
  assert.match(globalPlayer, /\/api\/music\/playlist/)
  assert.match(appProviders, /\/api\/music\/track/)
  assert.doesNotMatch(globalPlayer, /neteasecloudmusicapi-main-api|NETEASE_API_BASE/)
})

test('歌单加载失败不再静默吞掉，给出可见失败态与重试入口', () => {
  assert.match(globalPlayer, /setPlaylistError\(/)
  assert.match(globalPlayer, /role='status'/)
  assert.match(globalPlayer, /重试/)
  assert.match(globalPlayer, /onClick=\{retryPlaylist\}/)
})

test('idle 回调降级使用 window 上的定时器，避免跨平台返回类型分叉', () => {
  assert.match(globalPlayer, /window\.requestIdleCallback/)
  assert.match(globalPlayer, /window\.setTimeout/)
  assert.match(globalPlayer, /window\.cancelIdleCallback/)
  assert.match(globalPlayer, /window\.clearTimeout/)
  assert.doesNotMatch(globalPlayer, /typeof requestIdleCallback !== 'undefined'/)
})

test('失败提示不遮挡迷你播放器且只用主题令牌', () => {
  assert.match(globalPlayer, /bottom: 124px/)
  assert.match(globalPlayer, /var\(--background-100\)/)
  assert.doesNotMatch(globalPlayer, /--text-secondary/)
})

test('音乐页入口来自账号年度歌单，官方榜单预设已移除', () => {
  assert.doesNotMatch(musicSpecs, /MUSIC_PLAYLIST_PRESETS/)
  assert.match(musicSpecs, /MusicUserPlaylists/)
  assert.match(musicPage, /\/music\/user-playlists/)
  assert.match(musicView, /annualPlaylists\.map/)
  assert.match(musicView, /\/music\?playlist=/)
})

test('未指定歌单时缺省选中最新一年的年度歌单，拉不到回落 env 兜底', () => {
  assert.match(musicPage, /playlists\[0\]/)
  assert.match(musicPage, /DEFAULT_PLAYLIST_ID/)
})

test('迷你播放器默认队列跟随年度歌单，年度链路失败回落兜底歌单', () => {
  assert.match(globalPlayer, /\/api\/music\/user-playlists/)
  assert.match(globalPlayer, /playlists\[0\]/)
  assert.match(globalPlayer, /FALLBACK_PLAYLIST_ID/)
})
