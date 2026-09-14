export interface VisitStatsResponse {
  total: number;
  today: number;
  /** 全站文章字数（中文字符 + 英文单词，口径同 getArticleWordCount），1 小时缓存 */
  totalWords: number;
}
