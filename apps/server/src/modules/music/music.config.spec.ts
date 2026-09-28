import { MusicConfig } from './music.config'

const createConfig = (values: Record<string, string | undefined>) =>
  new MusicConfig({ get: (key: string) => values[key] } as never)

describe('MusicConfig', () => {
  it('turns a bare MUSIC_U token into a cookie pair', () => {
    expect(createConfig({ NETEASE_MUSIC_U: 'abc123' }).cookie).toBe('MUSIC_U=abc123')
  })

  it('accepts a full cookie string as-is and trims it', () => {
    expect(createConfig({ NETEASE_MUSIC_U: '  MUSIC_U=abc123; __csrf=def  ' }).cookie).toBe(
      'MUSIC_U=abc123; __csrf=def'
    )
  })

  it('stays anonymous when the credential is missing or blank', () => {
    expect(createConfig({}).cookie).toBeUndefined()
    expect(createConfig({ NETEASE_MUSIC_U: '   ' }).cookie).toBeUndefined()
    expect(createConfig({ NETEASE_MUSIC_U: '   ' }).hasCredential).toBe(false)
  })

  it('defaults the playlist to the hot chart and honours an override', () => {
    expect(createConfig({}).defaultPlaylistId).toBe('3778678')
    expect(createConfig({ NETEASE_DEFAULT_PLAYLIST_ID: ' 24381616 ' }).defaultPlaylistId).toBe('24381616')
  })
})
