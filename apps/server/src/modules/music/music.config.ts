import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** 默认歌单：网易云热歌榜（匿名态实测 200/200 可返回播放地址） */
const DEFAULT_PLAYLIST_ID = '3778678';

@Injectable()
export class MusicConfig {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 网易云登录态。env 值允许两种写法：裸 MUSIC_U token，或完整 cookie 串。
   * 未配置时返回 undefined，走匿名态（榜单类歌单可播放，VIP 曲目会返回空地址）。
   */
  get cookie(): string | undefined {
    const raw = this.configService.get<string>('NETEASE_MUSIC_U')?.trim();
    if (!raw) return undefined;
    return raw.includes('=') ? raw : `MUSIC_U=${raw}`;
  }

  get hasCredential(): boolean {
    return Boolean(this.cookie);
  }

  get defaultPlaylistId(): string {
    return this.configService.get<string>('NETEASE_DEFAULT_PLAYLIST_ID')?.trim() || DEFAULT_PLAYLIST_ID;
  }
}
