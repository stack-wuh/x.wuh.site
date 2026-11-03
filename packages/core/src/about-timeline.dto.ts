/** 「最近日志」聚合的平台来源（provider 插拔口：新增源在此注册枚举 + 新增 provider） */
export const TIMELINE_PLATFORMS = ['github', 'douban', 'weread', 'site'] as const;

export type TimelinePlatform = (typeof TIMELINE_PLATFORMS)[number];

/** 动态类别（i18n 渲染标签与之一一对应，条目 title 保留源原始文本） */
export const TIMELINE_CATEGORIES = [
  'blogPost',
  'release',
  'repoCreated',
  'doubanMark',
  'doubanNote',
  'reading',
  'comment',
] as const;

export type TimelineCategory = (typeof TIMELINE_CATEGORIES)[number];

export interface TimelineEntry {
  /** 唯一键：`${platform}:${originId}` */
  id: string;
  platform: TimelinePlatform;
  category: TimelineCategory;
  /** 源原始标题（豆瓣「看过三体」、书名、文章标题等） */
  title: string;
  /** 真实链接；无真实链接时使用平台主页兜底，禁止 '#' 占位 */
  link: string;
  /** ISO 8601 时间戳 */
  timestamp: string;
}

/** 单源状态：部分降级语义的可观察出口（INV-3） */
export interface TimelineSourceStatus {
  platform: TimelinePlatform;
  ok: boolean;
  count: number;
}

export interface TimelineResponse {
  updatedAt: string;
  /** 按 timestamp 降序 */
  entries: TimelineEntry[];
  sources: TimelineSourceStatus[];
}
