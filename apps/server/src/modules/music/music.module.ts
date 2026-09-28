import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicConfig } from './music.config';
import { NETEASE_CLIENT, NeteaseLibraryClient } from './netease-client';

@Module({
  controllers: [MusicController],
  providers: [
    MusicService,
    MusicConfig,
    // 工厂构造：库在首次调用时才 require，模块加载期不产生副作用
    { provide: NETEASE_CLIENT, useFactory: () => new NeteaseLibraryClient() }
  ]
})
export class MusicModule {}
