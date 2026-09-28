import { Logger, ServiceUnavailableException } from '@nestjs/common';

export type NeteaseQuery = Record<string, unknown>;

export interface NeteaseResponse {
  status: number;
  body: any;
}

export type NeteaseModuleFn = (query: NeteaseQuery) => Promise<NeteaseResponse>;

/** 库只暴露所需模块；其余数百个模块不进入类型面 */
export interface NeteaseModuleMap {
  playlist_detail?: NeteaseModuleFn;
  song_url_v1?: NeteaseModuleFn;
  lyric?: NeteaseModuleFn;
  cloudsearch?: NeteaseModuleFn;
  [key: string]: NeteaseModuleFn | undefined;
}

export type NeteaseModuleLoader = () => NeteaseModuleMap;

export interface NeteaseClient {
  playlistDetail(query: NeteaseQuery): Promise<NeteaseResponse>;
  songUrlV1(query: NeteaseQuery): Promise<NeteaseResponse>;
  lyric(query: NeteaseQuery): Promise<NeteaseResponse>;
  cloudsearch(query: NeteaseQuery): Promise<NeteaseResponse>;
}

export const NETEASE_CLIENT = 'NETEASE_CLIENT';

/** 上游超时上限：库自身不设超时，这里统一兜住，避免请求悬停拖垮 Nest 线程 */
export const NETEASE_TIMEOUT_MS = 8000;

const CREDENTIAL_PATTERN = /(MUSIC_U|__csrf|NMTID)=[^;\s]*/g;

/** 报错与日志只允许出现脱敏后的上游原因，凭证值不得外流 */
export const redactCredential = (text: string): string => text.replace(CREDENTIAL_PATTERN, '$1=***');

export class NeteaseLibraryClient implements NeteaseClient {
  private readonly logger = new Logger(NeteaseLibraryClient.name);
  private modules: NeteaseModuleMap | null = null;

  constructor(
    private readonly loadModules: NeteaseModuleLoader = () => require('NeteaseCloudMusicApi'),
    private readonly timeoutMs: number = NETEASE_TIMEOUT_MS
  ) {}

  playlistDetail(query: NeteaseQuery): Promise<NeteaseResponse> {
    return this.call('playlist_detail', query);
  }

  songUrlV1(query: NeteaseQuery): Promise<NeteaseResponse> {
    return this.call('song_url_v1', query);
  }

  lyric(query: NeteaseQuery): Promise<NeteaseResponse> {
    return this.call('lyric', query);
  }

  cloudsearch(query: NeteaseQuery): Promise<NeteaseResponse> {
    return this.call('cloudsearch', query);
  }

  private async call(moduleName: keyof NeteaseModuleMap & string, query: NeteaseQuery): Promise<NeteaseResponse> {
    if (!this.modules) {
      this.modules = this.loadModules();
    }
    const fn = this.modules[moduleName];
    if (typeof fn !== 'function') {
      throw new ServiceUnavailableException(`网易云音乐接口不可用：缺少模块 ${moduleName}`);
    }

    let pending: Promise<NeteaseResponse>;
    try {
      pending = Promise.resolve(fn(query));
    } catch (error) {
      pending = Promise.reject(error);
    }
    return this.withTimeout(pending, moduleName);
  }

  private async withTimeout(promise: Promise<NeteaseResponse>, moduleName: string): Promise<NeteaseResponse> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error(`请求超时（${this.timeoutMs}ms）`)), this.timeoutMs);
        })
      ]);
    } catch (error) {
      const reason = redactCredential(error instanceof Error ? error.message : String(error));
      this.logger.warn(`网易云音乐接口调用失败: ${moduleName} · ${reason}`);
      throw new ServiceUnavailableException(`网易云音乐接口不可用：${moduleName}（${reason}）`);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
