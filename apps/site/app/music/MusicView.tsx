'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Button from '@wuh.site/components/button'
import Empty from '@wuh.site/components/empty'
import { useAudioPlayer, type Track } from '@wuh.site/components/audio-player'
import { BREAKPOINTS } from '@wuh.site/components/themes/breakpoints'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import {
  MUSIC_PLAYLIST_PRESETS,
  SEARCH_LIMIT,
  formatTrackDuration,
  type MusicPlaylist,
  type MusicSearchResult
} from './specs'

const Section = styled.section`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-base) var(--space-3xl);
  font-family: var(--font-sans);
  color: var(--text-color);
`

const PlaylistHeader = styled.div`
  display: flex;
  gap: var(--space-lg);
  align-items: flex-end;
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-base);
  }
`

const Cover = styled.div<{ $src?: string }>`
  width: 168px;
  height: 168px;
  flex-shrink: 0;
  border-radius: var(--border-radius-base);
  background: ${(p) => (p.$src ? `url(${p.$src}) center/cover` : 'var(--background-300)')};
  box-shadow: var(--elevation-soft);

  @media (max-width: ${BREAKPOINTS.mobile}px) {
    width: 120px;
    height: 120px;
  }
`

const HeaderCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  line-height: 1.25;
`

const Description = styled.p`
  margin: 0;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-base) 0;
`

const PlaylistTabs = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-base);
  padding-bottom: var(--space-base);
`

const PlaylistTab = styled(Link)`
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-size: var(--font-size-sm);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;

  &[aria-current='page'] {
    color: var(--text-color);
    border-bottom-color: var(--primary-color);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

const SearchForm = styled.form`
  display: flex;
  gap: var(--space-xs);
  flex: 1 1 260px;
  min-width: 0;
`

const SearchInput = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  height: 40px;
  padding: 0 var(--space-sm);
  border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  color: var(--text-color);
  font-family: inherit;
  font-size: var(--font-size-sm);

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
`

const TrackList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`

const TrackRow = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
  border-bottom: 1px solid color-mix(in oklab, var(--normal-400) 30%, transparent);
`

const TrackIndex = styled.span`
  width: 2.5em;
  flex-shrink: 0;
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
  font-size: var(--font-size-xs);
  font-variant-numeric: tabular-nums;
`

const TrackButton = styled.button`
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font-family: inherit;

  &:hover .track-name {
    color: var(--primary-color);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &[aria-current='true'] .track-name {
    color: var(--primary-color);
  }
`

const TrackName = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--font-size-sm);
`

const TrackArtist = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-size: var(--font-size-xs);
`

const TrackDuration = styled.span`
  flex-shrink: 0;
  color: color-mix(in oklab, var(--text-color) 55%, transparent);
  font-size: var(--font-size-xs);
  font-variant-numeric: tabular-nums;
`

const StatusLine = styled.p`
  margin: var(--space-sm) 0 0;
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-size: var(--font-size-sm);
`

const SectionTitle = styled.h2`
  margin: var(--space-lg) 0 var(--space-xs);
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
`

type Props = {
  playlistId: string
  playlist: MusicPlaylist | null
}

export default function MusicView({ playlistId, playlist }: Props) {
  const {
    currentTrack,
    actions: { loadQueue }
  } = useAudioPlayer()
  const [keyword, setKeyword] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<MusicSearchResult | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const tracks = playlist?.tracks ?? []

  const playFrom = useCallback(
    (list: Track[], index: number) => {
      if (!list.length) return
      loadQueue(list, { startIndex: index, autoPlay: true })
    },
    [loadQueue]
  )

  const onSearch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const value = keyword.trim()
      if (!value || searching) return

      setSearching(true)
      setSearchError(null)
      const { data, error } = await fetcher<MusicSearchResult>('/api/music/search', {
        query: { keywords: value, limit: SEARCH_LIMIT }
      })
      setSearching(false)

      if (error || !data) {
        setSearchResult(null)
        setSearchError('搜索失败，请稍后重试')
        return
      }
      setSearchResult(data)
    },
    [keyword, searching]
  )

  const renderTracks = (list: Track[], emptyHint: string) => {
    if (!list.length) {
      return <StatusLine role='status'>{emptyHint}</StatusLine>
    }
    return (
      <TrackList>
        {list.map((track, index) => {
          const isCurrent = currentTrack?.id === track.id
          return (
            <TrackRow key={`${track.id}-${index}`}>
              <TrackIndex aria-hidden='true'>{String(index + 1).padStart(2, '0')}</TrackIndex>
              <TrackButton
                type='button'
                aria-label={`播放 ${track.name}${track.artist ? ` - ${track.artist}` : ''}`}
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => playFrom(list, index)}
              >
                <TrackName className='track-name'>{track.name}</TrackName>
                <TrackArtist>{track.artist}</TrackArtist>
              </TrackButton>
              <TrackDuration>{formatTrackDuration(track.duration)}</TrackDuration>
            </TrackRow>
          )
        })}
      </TrackList>
    )
  }

  return (
    <Section>
      {playlist ? (
        <>
          <PlaylistHeader>
            <Cover $src={playlist.coverUrl} />
            <HeaderCopy>
              <Title>{playlist.name ?? '歌单'}</Title>
              {playlist.description ? <Description>{playlist.description}</Description> : null}
              <StatusLine as='p'>共 {tracks.length} 首</StatusLine>
            </HeaderCopy>
          </PlaylistHeader>

          <Toolbar>
            <Button variant='filled' color='primary' onClick={() => playFrom(tracks, 0)}>
              播放全部
            </Button>
            <SearchForm onSubmit={onSearch} role='search'>
              <SearchInput
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder='搜索歌曲'
                aria-label='搜索歌曲'
                type='search'
              />
              <Button type='submit' variant='outlined' disabled={searching}>
                {searching ? '搜索中' : '搜索'}
              </Button>
            </SearchForm>
          </Toolbar>

          <PlaylistTabs aria-label='歌单切换'>
            {MUSIC_PLAYLIST_PRESETS.map((preset) => (
              <PlaylistTab
                key={preset.id}
                href={`/music?playlist=${preset.id}`}
                aria-current={preset.id === playlistId ? 'page' : undefined}
              >
                {preset.label}
              </PlaylistTab>
            ))}
          </PlaylistTabs>

          {searchError ? <StatusLine role='status'>{searchError}</StatusLine> : null}
          {searchResult ? (
            <>
              <SectionTitle>「{searchResult.keywords}」的搜索结果</SectionTitle>
              {renderTracks(searchResult.tracks, '没有找到可播放的曲目')}
            </>
          ) : null}
          <SectionTitle>{searchResult ? '歌单曲目' : '曲目'}</SectionTitle>
          {renderTracks(tracks, '这个歌单暂时没有曲目')}
        </>
      ) : (
        <Empty
          title='歌单加载失败'
          description='网易云歌单暂时取不到，可以稍后刷新重试。'
          actions={[{ label: '刷新重试', href: `/music?playlist=${playlistId}` }]}
        />
      )}
    </Section>
  )
}
