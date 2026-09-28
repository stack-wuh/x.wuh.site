import { ServiceUnavailableException } from '@nestjs/common'
import { NeteaseLibraryClient, type NeteaseModuleMap } from './netease-client'

const moduleMap = (overrides: Partial<NeteaseModuleMap> = {}): NeteaseModuleMap => ({
  playlist_detail: jest.fn().mockResolvedValue({ status: 200, body: { ok: true } }),
  song_url_v1: jest.fn().mockResolvedValue({ status: 200, body: { ok: true } }),
  lyric: jest.fn().mockResolvedValue({ status: 200, body: { ok: true } }),
  cloudsearch: jest.fn().mockResolvedValue({ status: 200, body: { ok: true } }),
  user_account: jest.fn().mockResolvedValue({ status: 200, body: { profile: { userId: 1 } } }),
  user_playlist: jest.fn().mockResolvedValue({ status: 200, body: { more: false, playlist: [] } }),
  ...overrides
})

describe('NeteaseLibraryClient', () => {
  it('lazily loads the library and passes a successful response through', async () => {
    const loader = jest.fn(() => moduleMap())
    const client = new NeteaseLibraryClient(loader)

    const response = await client.playlistDetail({ id: '1' })

    expect(loader).toHaveBeenCalledTimes(1)
    expect(response).toEqual({ status: 200, body: { ok: true } })
  })

  it('caches the loaded module map across calls', async () => {
    const loader = jest.fn(() => moduleMap())
    const client = new NeteaseLibraryClient(loader)

    await client.lyric({ id: '1' })
    await client.lyric({ id: '2' })

    expect(loader).toHaveBeenCalledTimes(1)
  })

  it('maps a library transport failure to ServiceUnavailableException', async () => {
    const client = new NeteaseLibraryClient(() =>
      moduleMap({
        playlist_detail: jest.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND interface.music.163.com'))
      })
    )

    await expect(client.playlistDetail({ id: '1' })).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(client.playlistDetail({ id: '1' })).rejects.toThrow(/网易云音乐接口不可用/)
  })

  it('keeps the credential value out of the mapped failure message', async () => {
    const client = new NeteaseLibraryClient(() =>
      moduleMap({
        song_url_v1: jest.fn().mockRejectedValue(new Error('request failed for cookie MUSIC_U=secret-token'))
      })
    )

    let message = ''
    try {
      await client.songUrlV1({ id: '1', cookie: 'MUSIC_U=secret-token' })
    } catch (error) {
      message = (error as Error).message
    }

    expect(message).not.toContain('secret-token')
    expect(message).toContain('MUSIC_U=***')
  })

  it('fails with a timeout error instead of hanging when the upstream never answers', async () => {
    const client = new NeteaseLibraryClient(
      () => moduleMap({ lyric: jest.fn(() => new Promise(() => {})) }),
      20
    )

    await expect(client.lyric({ id: '1' })).rejects.toThrow(ServiceUnavailableException)
    await expect(client.lyric({ id: '1' })).rejects.toThrow(/超时/)
  })

  it('rejects with ServiceUnavailableException when the library lacks the module', async () => {
    const client = new NeteaseLibraryClient(() => ({}) as NeteaseModuleMap)

    await expect(client.cloudsearch({ keywords: 'a' })).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(client.userAccount({})).rejects.toBeInstanceOf(ServiceUnavailableException)
    await expect(client.userPlaylist({ uid: 1 })).rejects.toBeInstanceOf(ServiceUnavailableException)
  })

  it('routes user_account and user_playlist through the shared call path', async () => {
    const loader = jest.fn(() => moduleMap())
    const client = new NeteaseLibraryClient(loader)

    const account = await client.userAccount({ cookie: 'MUSIC_U=token' })
    const playlists = await client.userPlaylist({ uid: 1, limit: 100 })

    expect(account).toEqual({ status: 200, body: { profile: { userId: 1 } } })
    expect(playlists).toEqual({ status: 200, body: { more: false, playlist: [] } })
    expect(loader).toHaveBeenCalledTimes(1)
  })
})
