import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** 网易云 /song/url/v1 支持的音质档位 */
export const MUSIC_LEVELS = [
  'standard',
  'higher',
  'exhigh',
  'lossless',
  'hires',
  'jyeffect',
  'sky',
  'jymaster'
] as const;

export type MusicLevel = (typeof MUSIC_LEVELS)[number];

export const MUSIC_LEVEL_DEFAULT: MusicLevel = 'exhigh';

export const SEARCH_LIMIT_DEFAULT = 30;
export const SEARCH_LIMIT_MAX = 50;

export class PlaylistQueryDto {
  @ApiPropertyOptional({ description: '网易云歌单 id，缺省用 NETEASE_DEFAULT_PLAYLIST_ID' })
  @IsOptional()
  @IsString()
  playlistId?: string;
}

export class TrackQueryDto {
  @ApiProperty({ description: '歌曲 id' })
  @IsString()
  id: string;

  @ApiPropertyOptional({ description: '音质档位（登录态越高越可能拿到无损）', enum: MUSIC_LEVELS })
  @IsOptional()
  @IsIn(MUSIC_LEVELS as unknown as string[])
  level?: MusicLevel;
}

export class SearchQueryDto {
  @ApiProperty({ description: '搜索关键词' })
  @IsString()
  keywords: string;

  @ApiPropertyOptional({ description: '返回条数，1-50', minimum: 1, maximum: SEARCH_LIMIT_MAX })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SEARCH_LIMIT_MAX)
  limit?: number;
}

/** 站点 Track 契约的字段名（artist/album/coverUrl/duration）保持不变，客户端零改动 */
export class MusicTrackDto {
  @ApiProperty({ description: '歌曲 id' })
  id: number;

  @ApiProperty({ description: '歌曲名' })
  name: string;

  @ApiProperty({ description: '歌手，多名用 / 连接' })
  artist: string;

  @ApiPropertyOptional({ description: '专辑名' })
  album?: string;

  @ApiPropertyOptional({ description: '封面地址（已改写为 https）' })
  coverUrl?: string;

  @ApiPropertyOptional({ description: '时长（秒）' })
  duration?: number;
}

export class PlaylistResultDto {
  @ApiProperty({ description: '歌单 id' })
  playlistId: number;

  @ApiPropertyOptional({ description: '歌单名' })
  name?: string;

  @ApiPropertyOptional({ description: '歌单简介' })
  description?: string;

  @ApiPropertyOptional({ description: '歌单封面' })
  coverUrl?: string;

  @ApiProperty({ description: '曲目列表', type: [MusicTrackDto] })
  tracks: MusicTrackDto[];
}

export class TrackSourceResultDto {
  @ApiPropertyOptional({
    description: '播放地址（https）。VIP/版权受限曲目为 null，消费方应跳过而不是报错',
    nullable: true
  })
  streamUrl: string | null;

  @ApiPropertyOptional({ description: '时长（秒）' })
  duration?: number;

  @ApiPropertyOptional({ description: 'LRC 歌词原文' })
  lyrics?: string;
}

export class SearchResultDto {
  @ApiProperty({ description: '搜索关键词' })
  keywords: string;

  @ApiProperty({ description: '匹配曲目', type: [MusicTrackDto] })
  tracks: MusicTrackDto[];
}
