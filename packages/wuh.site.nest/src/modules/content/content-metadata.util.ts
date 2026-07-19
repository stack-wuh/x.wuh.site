const METADATA_RE = /<!--\s*wuh-site-metadata:\s*(\{[\s\S]*?\})\s*-->/;

export type IssueMetadata = Record<string, unknown>;

function findMetadataMatch(body?: string | null): RegExpMatchArray | null {
  return body?.match(METADATA_RE) ?? null;
}

export function parseIssueMetadata(body?: string | null): IssueMetadata | null {
  const match = findMetadataMatch(body);
  if (!match) return null;

  try {
    const metadata: unknown = JSON.parse(match[1]);
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
    return metadata as IssueMetadata;
  } catch {
    return null;
  }
}

export function stripIssueMetadata(body?: string | null): string | null | undefined {
  const match = findMetadataMatch(body);
  if (!match || !parseIssueMetadata(body)) return body;

  return body?.replace(match[0], '').trimStart();
}
