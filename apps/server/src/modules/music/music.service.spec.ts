import { BadGatewayException, ServiceUnavailableException } from '@nestjs/common'
import { MusicService } from './music.service'
import { MusicConfig } from './music.config'
import type { NeteaseClient, NeteaseResponse } from './netease-client'

const ok = (body: unknown): NeteaseResponse => ({ status: 200, body })

const createClient = (overrides: Partial<NeteaseClient> = {}): NeteaseClient => ({
  playlistDetail: jest.fn().mockResolvedValue(ok({})),
  songUrlV1: jest.fn().mockResolvedValue(ok({ data: [] })),
  lyric: jest.fn().mockResolvedValue(ok({ lrc: { lyric: '[00:00.00] 歌词' } })),
  cloudsearch: jest.fn().mockResolvedValue(ok({ result: { songs: [] } })),
  userAccount: jest.fn().mockResolvedValue(ok({ profile: { userId: 123 }, account: { id: 123 } })),
  userPlaylist: jest.fn().mockResolvedValue(ok({ more: false, playlist: [] })),
  userRecord: jest.fn().mockResolvedValue(ok({ allData: [] })),
  ...overrides
})

const createConfig = (musicU?: string, playlistId?: string) =>
  new MusicConfig({
    get: (key: string) => (key === 'NETEASE_MUSIC_U' ? musicU : playlistId)
  } as never)

const playlistBody = {
  playlist: {
    name: '热歌榜',
    description: '榜单',
    coverImgUrl: 'http://p1.music.126.net/cover.jpg',
    tracks: [
      {
        id: 1973665667,
        name: '海屿你',
        ar: [{ name: '马也_Crabbit' }],
        al: { name: '海屿你', picUrl: 'http://p3.music.126.net/a.jpg' },
        dt: 295940
      },
      {
        id: 3342319503,
        name: '明知故犯',
        artists: [{ name: 'Max李玄' }],
        album: { name: '明知故犯', picUrl: 'https://p4.music.126.net/b.jpg' },
        dt: 166416
      }
    ]
  }
}

describe('MusicService', () => {
  describe('getPlaylist', () => {
    it('normalizes tracks from the legacy ar/al/dt shape', async () => {
      const client = createClient({ playlistDetail: jest.fn().mockResolvedValue(ok(playlistBody)) })
      const service = new MusicService(client, createConfig())

      const result = await service.getPlaylist()

      expect(result.playlistId).toBe(3778678)
      expect(result.name).toBe('热歌榜')
      expect(result.coverUrl).toBe('https://p1.music.126.net/cover.jpg?param=600y600')
      expect(result.tracks).toEqual([
        {
          id: 1973665667,
          name: '海屿你',
          artist: '马也_Crabbit',
          album: '海屿你',
          coverUrl: 'https://p3.music.126.net/a.jpg?param=600y600',
          duration: 295.94
        },
        {
          id: 3342319503,
          name: '明知故犯',
          artist: 'Max李玄',
          album: '明知故犯',
          coverUrl: 'https://p4.music.126.net/b.jpg?param=600y600',
          duration: 166.416
        }
      ])
    })

    it('accepts the alternate artists/album shape used by newer endpoints', async () => {
      const client = createClient({ playlistDetail: jest.fn().mockResolvedValue(ok(playlistBody)) })
      const service = new MusicService(client, createConfig())

      const result = await service.getPlaylist()

      expect(result.tracks[1]).toMatchObject({ artist: 'Max李玄', album: '明知故犯' })
    })

    it('falls back to the configured default playlist when no id is given', async () => {
      const playlistDetail = jest.fn().mockResolvedValue(ok(playlistBody))
      const service = new MusicService(createClient({ playlistDetail }), createConfig(undefined, '999'))

      const result = await service.getPlaylist()

      expect(playlistDetail).toHaveBeenCalledWith(expect.objectContaining({ id: '999' }))
      expect(result.playlistId).toBe(999)
    })

    it('returns an empty track list when the payload has no tracks', async () => {
      const client = createClient({ playlistDetail: jest.fn().mockResolvedValue(ok({ playlist: { name: '空' } })) })
      const service = new MusicService(client, createConfig())

      await expect(service.getPlaylist()).resolves.toMatchObject({ tracks: [] })
    })

    it('maps a non-2xx upstream status to BadGatewayException', async () => {
      const client = createClient({ playlistDetail: jest.fn().mockResolvedValue({ status: 502, body: {} }) })
      const service = new MusicService(client, createConfig())

      await expect(service.getPlaylist()).rejects.toBeInstanceOf(BadGatewayException)
    })

    it('passes no credential for anonymous requests and the configured cookie otherwise', async () => {
      const anonymous = jest.fn().mockResolvedValue(ok(playlistBody))
      await new MusicService(createClient({ playlistDetail: anonymous }), createConfig()).getPlaylist()
      expect(anonymous).toHaveBeenCalledWith(expect.objectContaining({ cookie: undefined }))

      const authorized = jest.fn().mockResolvedValue(ok(playlistBody))
      await new MusicService(createClient({ playlistDetail: authorized }), createConfig('token-value')).getPlaylist()
      expect(authorized).toHaveBeenCalledWith(expect.objectContaining({ cookie: 'MUSIC_U=token-value' }))
    })

    it('joins play counts from the all-time user record when a credential is configured', async () => {
      const userRecord = jest.fn().mockResolvedValue(
        ok({
          allData: [
            { playCount: 88, song: { id: 1973665667 } },
            { playCount: 7, song: { id: '999' } }
          ]
        })
      )
      const service = new MusicService(
        createClient({ playlistDetail: jest.fn().mockResolvedValue(ok(playlistBody)), userRecord }),
        createConfig('token-value')
      )

      const result = await service.getPlaylist()

      expect(userRecord).toHaveBeenCalledWith(expect.objectContaining({ type: 0, cookie: 'MUSIC_U=token-value' }))
      expect(result.tracks[0]).toMatchObject({ id: 1973665667, playCount: 88 })
      expect(result.tracks[1]).not.toHaveProperty('playCount')
    })

    it('keeps the playlist usable without play counts when the user record join fails', async () => {
      const service = new MusicService(
        createClient({
          playlistDetail: jest.fn().mockResolvedValue(ok(playlistBody)),
          userRecord: jest.fn().mockRejectedValue(new ServiceUnavailableException('网易云音乐接口不可用：user_record'))
        }),
        createConfig('token-value')
      )

      const result = await service.getPlaylist()

      expect(result.tracks).toHaveLength(2)
      expect(result.tracks[0]).not.toHaveProperty('playCount')
    })

    it('skips the play-count join for anonymous requests', async () => {
      const userRecord = jest.fn()
      const service = new MusicService(
        createClient({ playlistDetail: jest.fn().mockResolvedValue(ok(playlistBody)), userRecord }),
        createConfig()
      )

      const result = await service.getPlaylist()

      expect(userRecord).not.toHaveBeenCalled()
      expect(result.tracks[0]).not.toHaveProperty('playCount')
    })
  })

  describe('getTrackSource', () => {
    it('rewrites the http stream and cover url to https and converts time to seconds', async () => {
      const client = createClient({
        songUrlV1: jest.fn().mockResolvedValue(
          ok({
            data: [
              {
                id: 1973665667,
                url: 'http://m701.music.126.net/song.mp3?token=x',
                time: 295940,
                code: 200
              }
            ]
          })
        )
      })
      const service = new MusicService(client, createConfig())

      const result = await service.getTrackSource('1973665667')

      expect(result).toEqual({
        streamUrl: 'https://m701.music.126.net/song.mp3?token=x',
        duration: 295.94,
        lyrics: '[00:00.00] 歌词'
      })
    })

    it('returns a null stream url for vip or copyright-restricted tracks instead of throwing', async () => {
      const client = createClient({
        songUrlV1: jest.fn().mockResolvedValue(
          ok({ data: [{ id: 186016, url: null, code: 404, freeTrialPrivilege: { cannotListenReason: 1 } }] })
        )
      })
      const service = new MusicService(client, createConfig())

      const result = await service.getTrackSource('186016')

      expect(result.streamUrl).toBeNull()
      expect(result.lyrics).toBe('[00:00.00] 歌词')
    })

    it('keeps the stream usable when the lyric request fails', async () => {
      const client = createClient({
        songUrlV1: jest.fn().mockResolvedValue(
          ok({ data: [{ id: 1, url: 'http://m801.music.126.net/song.mp3', time: 1000, code: 200 }] })
        ),
        lyric: jest.fn().mockRejectedValue(new Error('lyric upstream down'))
      })
      const service = new MusicService(client, createConfig())

      await expect(service.getTrackSource('1')).resolves.toMatchObject({
        streamUrl: 'https://m801.music.126.net/song.mp3',
        lyrics: undefined
      })
    })

    it('defaults to the exhigh level so anonymous playback still gets 320k when available', async () => {
      const songUrlV1 = jest.fn().mockResolvedValue(ok({ data: [{ url: 'http://a/b.mp3', time: 1 }] }))
      const service = new MusicService(createClient({ songUrlV1 }), createConfig())

      await service.getTrackSource('1')

      expect(songUrlV1).toHaveBeenCalledWith(expect.objectContaining({ level: 'exhigh' }))
    })
  })

  describe('search', () => {
    it('normalizes cloud search results and clamps the limit', async () => {
      const client = createClient({
        cloudsearch: jest.fn().mockResolvedValue(
          ok({
            result: {
              songs: [
                {
                  id: 1,
                  name: '晴天',
                  ar: [{ name: '周杰伦' }],
                  al: { name: '叶惠美', picUrl: 'http://p1.music.126.net/c.jpg' },
                  dt: 269000
                }
              ]
            }
          })
        )
      })
      const service = new MusicService(client, createConfig())

      const result = await service.search('晴天', 999)

      expect(client.cloudsearch).toHaveBeenCalledWith(expect.objectContaining({ keywords: '晴天', limit: 50 }))
      expect(result.tracks).toEqual([
        {
          id: 1,
          name: '晴天',
          artist: '周杰伦',
          album: '叶惠美',
          coverUrl: 'https://p1.music.126.net/c.jpg?param=600y600',
          duration: 269
        }
      ])
    })

    it('tolerates an empty search payload', async () => {
      const service = new MusicService(createClient({ cloudsearch: jest.fn().mockResolvedValue(ok({})) }), createConfig())

      await expect(service.search('nothing')).resolves.toEqual({ keywords: 'nothing', tracks: [] })
    })
  })

  describe('getUserPlaylists', () => {
    const uid = 123

    const mine = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
      id: 100,
      name: '2024年度歌单',
      coverImgUrl: 'http://p1.music.126.net/m.jpg',
      trackCount: 12,
      userId: uid,
      creator: { userId: uid },
      ...overrides
    })

    const playlistBody = (playlists: Record<string, unknown>[], more = false) => ({ more, playlist: playlists })

    const getLoggerWarn = (service: MusicService) =>
      jest.spyOn((service as unknown as { logger: { warn: (message: string) => void } }).logger, 'warn')

    it('exposes the netease profile with https avatar alongside the annual playlists', async () => {
      const userAccount = jest.fn().mockResolvedValue(
        ok({
          profile: {
            userId: uid,
            nickname: '吴尒红',
            avatarUrl: 'http://p1.music.126.net/avatar.jpg',
            level: 9
          },
          account: { id: uid }
        })
      )
      const service = new MusicService(
        createClient({ userAccount, userPlaylist: jest.fn().mockResolvedValue(ok(playlistBody([mine()]))) }),
        createConfig('token-value')
      )

      const result = await service.getUserPlaylists()

      expect(result.profile).toEqual({
        nickname: '吴尒红',
        avatarUrl: 'https://p1.music.126.net/avatar.jpg?param=120y120',
        level: 9
      })
    })

    it('omits the profile when no credential is configured', async () => {
      const userAccount = jest.fn()
      const userPlaylist = jest.fn()
      const service = new MusicService(createClient({ userAccount, userPlaylist }), createConfig())

      const result = await service.getUserPlaylists()

      expect(result.profile).toBeUndefined()
      expect(userAccount).not.toHaveBeenCalled()
    })

    it('returns an empty list without touching the upstream when no credential is configured', async () => {
      const userAccount = jest.fn()
      const userPlaylist = jest.fn()
      const service = new MusicService(createClient({ userAccount, userPlaylist }), createConfig())

      await expect(service.getUserPlaylists()).resolves.toEqual({ playlists: [] })
      expect(userAccount).not.toHaveBeenCalled()
      expect(userPlaylist).not.toHaveBeenCalled()
    })

    it('keeps only my created annual playlists sorted by year descending with yearless ones last', async () => {
      const userPlaylist = jest.fn().mockResolvedValue(
        ok(
          playlistBody([
            mine({ id: 300, name: '日常听' }),
            mine({ id: 301, name: '私人珍藏' }),
            mine({ id: 999, name: '别人分享的年度歌单', userId: 456, creator: { userId: 456 } }),
            mine({ id: 101, name: '2024年度歌单' }),
            mine({ id: 102, name: '2026年度歌单' }),
            mine({ id: 105, name: '2024年度精选' }),
            mine({ id: 104, name: '年度混剪' })
          ])
        )
      )
      const service = new MusicService(createClient({ userPlaylist }), createConfig('token-value'))

      const result = await service.getUserPlaylists()

      expect(userPlaylist).toHaveBeenCalledWith(expect.objectContaining({ uid, limit: 100, cookie: 'MUSIC_U=token-value' }))
      expect(result.playlists.map((playlist) => playlist.id)).toEqual([102, 101, 105, 104])
    })

    it('maps summaries with https covers and track counts', async () => {
      const userPlaylist = jest.fn().mockResolvedValue(ok(playlistBody([mine()])))
      const service = new MusicService(createClient({ userPlaylist }), createConfig('token-value'))

      const result = await service.getUserPlaylists()

      expect(result.playlists).toEqual([
        { id: 100, name: '2024年度歌单', coverUrl: 'https://p1.music.126.net/m.jpg?param=600y600', trackCount: 12 }
      ])
    })

    it('returns an empty list when the login state no longer yields a uid', async () => {
      const userAccount = jest.fn().mockResolvedValue(ok({}))
      const userPlaylist = jest.fn()
      const service = new MusicService(createClient({ userAccount, userPlaylist }), createConfig('token-value'))
      const warn = getLoggerWarn(service)

      await expect(service.getUserPlaylists()).resolves.toEqual({ playlists: [] })
      expect(userPlaylist).not.toHaveBeenCalled()
      expect(warn).toHaveBeenCalled()
    })

    it('warns and keeps the first page when the created playlists exceed the page limit', async () => {
      const userPlaylist = jest.fn().mockResolvedValue(ok(playlistBody([mine()], true)))
      const service = new MusicService(createClient({ userPlaylist }), createConfig('token-value'))
      const warn = getLoggerWarn(service)

      await expect(service.getUserPlaylists()).resolves.toMatchObject({ playlists: [{ id: 100 }] })
      expect(warn).toHaveBeenCalled()
    })

    it('maps a non-2xx account response to BadGatewayException', async () => {
      const userAccount = jest.fn().mockResolvedValue({ status: 502, body: {} })
      const service = new MusicService(createClient({ userAccount }), createConfig('token-value'))

      await expect(service.getUserPlaylists()).rejects.toBeInstanceOf(BadGatewayException)
    })

    it('propagates a playlist transport failure as ServiceUnavailableException', async () => {
      const userPlaylist = jest.fn().mockRejectedValue(new ServiceUnavailableException('网易云音乐接口不可用：user_playlist'))
      const service = new MusicService(createClient({ userPlaylist }), createConfig('token-value'))

      await expect(service.getUserPlaylists()).rejects.toBeInstanceOf(ServiceUnavailableException)
    })
  })
})
