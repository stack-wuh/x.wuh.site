import { BadGatewayException, Inject, Injectable, Logger } from '@nestjs/common';
import { MusicConfig } from './music.config';
import { NETEASE_CLIENT, type NeteaseClient, type NeteaseResponse } from './netease-client';
import {
  MUSIC_LEVEL_DEFAULT,
  SEARCH_LIMIT_DEFAULT,
  SEARCH_LIMIT_MAX,
  type MusicLevel,
  type MusicTrackDto,
  type PlaylistResultDto,
  type SearchResultDto,
  type TrackSourceResultDto
} from './dto/music.dto';

const COVER_PARAM = 'param=600y600';

type NeteaseArtist = { name?: string };
type NeteaseAlbum = { name?: string; picUrl?: string };

interface RawNeteaseTrack {
  id?: number | string;
  name?: string;
  ar?: NeteaseArtist[];
  artists?: NeteaseArtist[];
  al?: NeteaseAlbum;
  album?: NeteaseAlbum;
  dt?: number;
}

/**
 * 播放地址与封面在网易云侧都是 http，站点是 https —— 不改写会被浏览器按混合内容拦掉。
 * 实测同一 URL 换 https 可正常返回音频与图片。
 */
export const toHttps = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  return url.replace(/^http:\/\//, 'https://');
};

export const withCoverSize = (url?: string): string | undefined => {
  const secured = toHttps(url);
  if (!secured) return undefined;
  return secured.includes('param=') ? secured : `${secured}?${COVER_PARAM}`;
};

/** 网易云同一资源在不同接口下有 ar/al/dt 与 artists/album 两套字段名，这里统一 */
export const normalizeTrack = (track: RawNeteaseTrack): MusicTrackDto => {
  const artists = track?.ar ?? track?.artists ?? [];
  const album = track?.al ?? track?.album ?? {};
  const numericId = Number(track?.id);
  return {
    id: Number.isFinite(numericId) ? numericId : 0,
    name: track?.name ?? '',
    artist: artists
      .map((item) => item?.name)
      .filter(Boolean)
      .join(' / '),
    album: album.name,
    coverUrl: withCoverSize(album.picUrl),
    duration: typeof track?.dt === 'number' ? track.dt / 1000 : undefined
  };
};

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);

  constructor(
    @Inject(NETEASE_CLIENT) private readonly client: NeteaseClient,
    private readonly config: MusicConfig
  ) {}

  private get credential(): string | undefined {
    return this.config.cookie;
  }

  /** 上游 2xx 才算拿到数据；其余一律按上游故障映射，不透传上游状态码语义 */
  private assertUpstream(response: NeteaseResponse | undefined, moduleName: string): void {
    const status = response?.status;
    if (typeof status === 'number' && status >= 200 && status < 300) return;
    this.logger.warn(`网易云音乐接口响应异常: ${moduleName} status=${status}`);
    throw new BadGatewayException('网易云音乐接口响应异常');
  }

  async getPlaylist(playlistId?: string): Promise<PlaylistResultDto> {
    const id = playlistId?.trim() || this.config.defaultPlaylistId;
    const response = await this.client.playlistDetail({ id, cookie: this.credential });
    this.assertUpstream(response, 'playlist_detail');

    const playlist = response.body?.playlist ?? {};
    const rawTracks: RawNeteaseTrack[] = Array.isArray(playlist.tracks) ? playlist.tracks : [];
    const numericPlaylistId = Number(id);

    return {
      playlistId: Number.isFinite(numericPlaylistId) ? numericPlaylistId : 0,
      name: playlist.name,
      description: playlist.description,
      coverUrl: withCoverSize(playlist.coverImgUrl),
      tracks: rawTracks.map(normalizeTrack)
    };
  }

  async getTrackSource(id: string, level?: MusicLevel): Promise<TrackSourceResultDto> {
    // 歌词失败不得影响播放：两条请求各自结算，只有播放地址失败才算整体失败
    const [urlOutcome, lyricOutcome] = await Promise.allSettled([
      this.client.songUrlV1({ id, level: level ?? MUSIC_LEVEL_DEFAULT, cookie: this.credential }),
      this.client.lyric({ id, cookie: this.credential })
    ]);

    if (urlOutcome.status === 'rejected') {
      throw urlOutcome.reason;
    }
    this.assertUpstream(urlOutcome.value, 'song_url_v1');

    const urlData = Array.isArray(urlOutcome.value.body?.data) ? urlOutcome.value.body.data[0] : urlOutcome.value.body?.data;

    let lyrics: string | undefined;
    if (lyricOutcome.status === 'fulfilled') {
      lyrics = lyricOutcome.value.body?.lrc?.lyric ?? lyricOutcome.value.body?.klyric?.lyric;
    } else {
      this.logger.warn(`网易云歌词获取失败，跳过歌词: id=${id}`);
    }

    return {
      // 版权/VIP 曲目匿名态返回空地址，这里保持 200 + null，由消费方跳过
      streamUrl: toHttps(urlData?.url) ?? null,
      duration: typeof urlData?.time === 'number' ? urlData.time / 1000 : undefined,
      lyrics
    };
  }

  async search(keywords: string, limit?: number): Promise<SearchResultDto> {
    const requested = Math.trunc(Number(limit));
    const safeLimit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, SEARCH_LIMIT_MAX) : SEARCH_LIMIT_DEFAULT;

    const response = await this.client.cloudsearch({
      keywords,
      limit: safeLimit,
      cookie: this.credential
    });
    this.assertUpstream(response, 'cloudsearch');

    const songs: RawNeteaseTrack[] = response.body?.result?.songs ?? [];
    return {
      keywords,
      tracks: Array.isArray(songs) ? songs.map(normalizeTrack) : []
    };
  }
}
