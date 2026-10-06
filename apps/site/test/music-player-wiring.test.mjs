import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const testDir = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(testDir, '..')
const [globalPlayer, appProviders, musicPage, musicView, musicSpecs, musicStyles] = await Promise.all([
  readFile(resolve(appRoot, 'app/components/player/GlobalAudioPlayer.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/components/AppProviders.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/page.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/MusicView/index.tsx'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/specs.ts'), 'utf8'),
  readFile(resolve(appRoot, 'app/music/styles.ts'), 'utf8')
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
  // 文案已迁 i18n 词典（player.playlist.retry），守卫改为断言 t() 调用形状
  assert.match(globalPlayer, /t\('player\.playlist\.retry'\)/)
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

test('移动端年谱刻度带：滚动条全隐藏、两端渐隐 mask、切年滚到居中', () => {
  assert.match(musicStyles, /scrollbar-width: none/)
  assert.match(musicStyles, /&::-webkit-scrollbar \{\s*display: none;/)
  assert.match(musicStyles, /mask: linear-gradient\(90deg, transparent/)
  assert.match(musicView, /scrollIntoView\(\{ behavior: reduce \? 'auto' : 'smooth', inline: 'center', block: 'nearest' \}\)/)
})

test('移动端刻度带桌面可拖拽横滑且不劫持触屏原生滚动', () => {
  assert.match(musicView, /\(pointer: fine\)/)
  assert.match(musicView, /pointerType !== 'mouse'/)
  assert.match(musicView, /setPointerCapture/)
})

test('曲目行两行制：右列归组桌面溶入行布局、移动端竖排，触控目标 54px', () => {
  assert.match(musicStyles, /export const TrackSide = styled\.span`\s*display: contents;/)
  assert.match(musicStyles, /grid-template-columns: auto minmax\(0, 1fr\) auto/)
  assert.match(musicStyles, /min-height: 54px/)
  assert.match(musicView, /<TrackSide>/)
})

test('正在播放等化器接替红点（20261006 #487）：/music 当前行三柱，暂停冻结', () => {
  // 红点退役（暂停也不消失是假状态）；等化器单源从包出口消费，禁页面复制 keyframes
  assert.match(musicView, /import \{[^}]*Equalizer[^}]*\} from '@wuh\.site\/components\/audio-player'/, 'Equalizer 未经包导入')
  assert.match(musicView, /\{isCurrent \? <Equalizer \$playing=\{playing\}>/, '当前行条件渲染等化器缺失')
  assert.doesNotMatch(musicView, /PlayingDot/, 'PlayingDot 已退役，禁回潮')
  // 命名误导修复：现码把「是当前行」误名 isPlaying（暂停红点不消失根因）
  assert.doesNotMatch(musicView, /const isPlaying = currentTrack\?\.id === track\.id/, 'isCurrent 命名修复不得回退')
  assert.match(musicStyles, /export const PlayingSlot = styled\.span`/, '等宽防抖槽位缺失')
  // 槽位 13px（三柱 3×3px + 双 gap 2px），移动端维持「歌名主色+编号翻播放键」触控语言不占空间
  assert.match(musicStyles, /width: 13px/)
  assert.match(musicStyles, /PlayingSlot[\s\S]*?@media \(max-width: \$\{BREAKPOINTS\.mobile\}px\)[\s\S]*?display: none/)
  assert.doesNotMatch(musicStyles, /PlayingDot/, 'styles 侧红点同退')
})

test('卷名随队列流入面板卷题签：两消费者 loadQueue 均带 playlistName（20261006）', () => {
  // /music 本卷名（年轮编年同源）与兜底默认队列都要带；漏引 = 卷题签永不点亮且无报错
  assert.match(musicView, /loadQueue\(tracks, \{ startIndex: index, autoPlay: true, playlistName: selectedPlaylist\?\.name \}\)/)
  assert.match(musicView, /\[tracks, actions, selectedPlaylist\?\.name\]/)
  assert.match(globalPlayer, /loadQueue\(normalized, \{ playlistName: data\.name \}\)/)
  // fetch 层类型必须透传 name（窄化成 { tracks } 会让 data.name 编译期消失）
  assert.match(globalPlayer, /Promise<\{ tracks\?: Track\[\]; name\?: string \}>/)
})
