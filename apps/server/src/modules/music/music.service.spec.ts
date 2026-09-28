import { BadGatewayException } from '@nestjs/common'
import { MusicService } from './music.service'
import { MusicConfig } from './music.config'
import type { NeteaseClient, NeteaseResponse } from './netease-client'

const ok = (body: unknown): NeteaseResponse => ({ status: 200, body })

const createClient = (overrides: Partial<NeteaseClient> = {}): NeteaseClient => ({
  playlistDetail: jest.fn().mockResolvedValue(ok({})),
  songUrlV1: jest.fn().mockResolvedValue(ok({ data: [] })),
  lyric: jest.fn().mockResolvedValue(ok({ lrc: { lyric: '[00:00.00] 歌词' } })),
  cloudsearch: jest.fn().mockResolvedValue(ok({ result: { songs: [] } })),
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
})
