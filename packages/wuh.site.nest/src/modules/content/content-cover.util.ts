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
