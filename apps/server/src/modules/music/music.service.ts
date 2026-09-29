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
  type TrackSourceResultDto,
  type UserPlaylistSummaryDto,
  type UserPlaylistsResultDto,
  type UserProfileDto
} from './dto/music.dto';

const COVER_PARAM = 'param=600y600';

/** 头像走小图：页头展示 34px，120 足够 */
const AVATAR_PARAM = 'param=120y120';

/** 账号维度窄列表：创建歌单排在收藏前，单页 100 足够，不做翻页（超页记 warn 只处理首屏） */
const USER_PLAYLIST_PAGE_LIMIT = 100;

/** 年度歌单的命名约定：歌单名含「年度」即入选 */
const ANNUAL_PLAYLIST_KEYWORD = '年度';

/** 听歌排行 type=0 为全期数据（top 1000），type=1 只有周榜 */
const USER_RECORD_TYPE_ALL = 0;

const YEAR_PATTERN = /(?:19|20)\d{2}/;

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

interface RawNeteasePlaylist {
  id?: number | string;
  name?: string;
  coverImgUrl?: string;
  trackCount?: number;
  userId?: number;
  creator?: { userId?: number };
}

/** 听歌排行（user_record）返回的单条记录 */
interface RawNeteaseRecordEntry {
  playCount?: number | string;
  song?: { id?: number | string };
}

/** 歌单名中的 4 位年份；无年份返回 null（排序时放最后） */
export const extractPlaylistYear = (name: string): number | null => {
  const matched = name.match(YEAR_PATTERN);
  return matched ? Number(matched[0]) : null;
};

/** 只保留我创建的、名字含「年度」的歌单，年份倒序、无年份按名称排最后 */
export const selectAnnualPlaylists = (playlists: RawNeteasePlaylist[], uid: number): UserPlaylistSummaryDto[] =>
  playlists
    .filter((playlist) => (playlist?.creator?.userId ?? playlist?.userId) === uid)
    .filter((playlist) => typeof playlist?.name === 'string' && playlist.name.includes(ANNUAL_PLAYLIST_KEYWORD))
    .map((playlist) => {
      const numericId = Number(playlist.id);
      const trackCount = Number(playlist.trackCount);
      return {
        id: Number.isFinite(numericId) ? numericId : 0,
        name: playlist.name ?? '',
        coverUrl: withCoverSize(playlist.coverImgUrl),
        trackCount: Number.isFinite(trackCount) ? trackCount : 0
      };
    })
    .sort((a, b) => {
      const yearA = extractPlaylistYear(a.name);
      const yearB = extractPlaylistYear(b.name);
      if (yearA !== null && yearB === null) return -1;
      if (yearA === null && yearB !== null) return 1;
      if (yearA !== null && yearB !== null && yearA !== yearB) return yearB - yearA;
      return a.name.localeCompare(b.name, 'zh');
    });

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

export const withAvatarSize = (url?: string): string | undefined => {
  const secured = toHttps(url);
  if (!secured) return undefined;
  return secured.includes('param=') ? secured : `${secured}?${AVATAR_PARAM}`;
};

/** 听歌排行全期记录 → 曲目 id 到播放次数的映射；非法条目直接跳过 */
export const buildPlayCountMap = (records: RawNeteaseRecordEntry[]): Map<number, number> => {
  const map = new Map<number, number>();
  for (const entry of records ?? []) {
    const id = Number(entry?.song?.id);
    const playCount = Number(entry?.playCount);
    if (Number.isFinite(id) && Number.isFinite(playCount)) map.set(id, playCount);
  }
  return map;
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

  /**
   * 听歌排行（全期）→ 曲目 id 到播放次数的映射。上游细节失败由调用方决定降级：
   * 这里只负责拿到数据，不做兜底判断。
   */
  private async fetchPlayCountMap(): Promise<Map<number, number>> {
    const accountResponse = await this.client.userAccount({ cookie: this.credential });
    this.assertUpstream(accountResponse, 'user_account');

    const uid = Number(accountResponse.body?.profile?.userId ?? accountResponse.body?.account?.id);
    if (!Number.isFinite(uid)) return new Map();

    const recordResponse = await this.client.userRecord({
      uid,
      type: USER_RECORD_TYPE_ALL,
      cookie: this.credential
    });
    this.assertUpstream(recordResponse, 'user_record');

    const records: RawNeteaseRecordEntry[] = Array.isArray(recordResponse.body?.allData)
      ? recordResponse.body.allData
      : [];
    return buildPlayCountMap(records);
  }

  async getPlaylist(playlistId?: string): Promise<PlaylistResultDto> {
    const id = playlistId?.trim() || this.config.defaultPlaylistId;
    const response = await this.client.playlistDetail({ id, cookie: this.credential });
    this.assertUpstream(response, 'playlist_detail');

    const playlist = response.body?.playlist ?? {};
    const rawTracks: RawNeteaseTrack[] = Array.isArray(playlist.tracks) ? playlist.tracks : [];
    const numericPlaylistId = Number(id);
    const tracks = rawTracks.map(normalizeTrack);

    if (!this.config.hasCredential) {
      return {
        playlistId: Number.isFinite(numericPlaylistId) ? numericPlaylistId : 0,
        name: playlist.name,
        description: playlist.description,
        coverUrl: withCoverSize(playlist.coverImgUrl),
        tracks
      };
    }

    // 播放次数是增强信息：联表失败只记 warn 缺省字段，不拖垮歌单返回
    const playCounts = await this.fetchPlayCountMap().catch((error: unknown) => {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.warn(`听歌排行联表失败，曲目播放次数缺省: ${reason}`);
      return new Map<number, number>();
    });

    return {
      playlistId: Number.isFinite(numericPlaylistId) ? numericPlaylistId : 0,
      name: playlist.name,
      description: playlist.description,
      coverUrl: withCoverSize(playlist.coverImgUrl),
      tracks: tracks.map((track) =>
        playCounts.has(track.id) ? { ...track, playCount: playCounts.get(track.id) } : track
      )
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

  /**
   * 我的年度歌单。未配置登录态是正常业务态：直接返回空列表（不发上游请求），
   * 消费方对空列表与失败一律隐藏年度分组。账号资料（昵称/头像/等级）与歌单一并返回。
   */
  async getUserPlaylists(): Promise<UserPlaylistsResultDto> {
    if (!this.config.hasCredential) {
      return { playlists: [] };
    }

    const accountResponse = await this.client.userAccount({ cookie: this.credential });
    this.assertUpstream(accountResponse, 'user_account');

    const uid = Number(accountResponse.body?.profile?.userId ?? accountResponse.body?.account?.id);
    if (!Number.isFinite(uid)) {
      this.logger.warn('网易云音乐登录态无法解析出账号 uid，年度歌单返回空列表');
      return { playlists: [] };
    }

    const listResponse = await this.client.userPlaylist({
      uid,
      limit: USER_PLAYLIST_PAGE_LIMIT,
      cookie: this.credential
    });
    this.assertUpstream(listResponse, 'user_playlist');

    if (listResponse.body?.more) {
      this.logger.warn(`网易云音乐创建歌单超过单页上限（${USER_PLAYLIST_PAGE_LIMIT}），年度歌单仅处理首屏`);
    }

    const rawPlaylists: RawNeteasePlaylist[] = Array.isArray(listResponse.body?.playlist) ? listResponse.body.playlist : [];
    const profile = accountResponse.body?.profile ?? {};
    const level = Number(profile.level);
    const profileDto: UserProfileDto = {
      nickname: typeof profile.nickname === 'string' ? profile.nickname : undefined,
      avatarUrl: withAvatarSize(profile.avatarUrl),
      level: Number.isFinite(level) ? level : undefined
    };
    return { playlists: selectAnnualPlaylists(rawPlaylists, uid), profile: profileDto };
  }
}
