import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MusicService } from './music.service';
import {
  PlaylistQueryDto,
  PlaylistResultDto,
  SearchQueryDto,
  SearchResultDto,
  TrackQueryDto,
  TrackSourceResultDto
} from './dto/music.dto';

@ApiTags('Music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get('playlist')
  @ApiOperation({ summary: '获取网易云歌单与曲目列表' })
  @ApiResponse({ status: 200, description: '歌单与曲目列表', type: PlaylistResultDto })
  async getPlaylist(@Query() query: PlaylistQueryDto): Promise<PlaylistResultDto> {
    return this.musicService.getPlaylist(query.playlistId);
  }

  @Get('track')
  @ApiOperation({ summary: '获取歌曲播放地址与歌词（受限曲目 streamUrl 为 null）' })
  @ApiResponse({ status: 200, description: '播放地址与歌词', type: TrackSourceResultDto })
  async getTrackSource(@Query() query: TrackQueryDto): Promise<TrackSourceResultDto> {
    return this.musicService.getTrackSource(query.id, query.level);
  }

  @Get('search')
  @ApiOperation({ summary: '搜索网易云歌曲' })
  @ApiResponse({ status: 200, description: '匹配曲目', type: SearchResultDto })
  async search(@Query() query: SearchQueryDto): Promise<SearchResultDto> {
    return this.musicService.search(query.keywords, query.limit);
  }
}
