const HTML_IMAGE_RE = /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))/i;
const MARKDOWN_IMAGE_RE = /!\[[^\]]*]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/;

function normalizeImageUrl(url?: string): string | undefined {
  const normalized = url?.trim();
  return normalized || undefined;
}

export function extractFirstImageUrl(bodyHtml?: string | null, body?: string | null): string | undefined {
  const htmlMatch = bodyHtml?.match(HTML_IMAGE_RE);
  const htmlUrl = normalizeImageUrl(htmlMatch?.[1] ?? htmlMatch?.[2] ?? htmlMatch?.[3]);
  if (htmlUrl) return htmlUrl;

  const markdownMatch = body?.match(MARKDOWN_IMAGE_RE);
  return normalizeImageUrl(markdownMatch?.[1] ?? markdownMatch?.[2]);
}

/**
 * 提取第一张图片 URL，并从 bodyHtml 中移除对应的 <img> 标签。
 * 用于封面图推导：当封面来自文章第一张图时，避免重复展示。
 */
export function extractFirstImageAndClean(
  bodyHtml?: string | null,
  body?: string | null,
): { url: string | undefined; cleanHtml: string | null | undefined } {
  const url = extractFirstImageUrl(bodyHtml, body);
  if (!url || !bodyHtml) {
    return { url, cleanHtml: bodyHtml };
  }
  const cleanHtml = bodyHtml.replace(HTML_IMAGE_RE, '');
  return { url, cleanHtml: cleanHtml || null };
}
