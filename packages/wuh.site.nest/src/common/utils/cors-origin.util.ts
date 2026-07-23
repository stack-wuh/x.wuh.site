export function parseCorsOrigin(value: string | undefined): string | string[] {
  const origins = (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) return '*';
  if (origins.length === 1) return origins[0];
  return origins;
}
