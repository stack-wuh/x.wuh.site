export function StatusBadge({ status }: { status?: string }) {
  const value = status || 'unknown';
  return <span className={`status-badge status-${value}`}>{value}</span>;
}
