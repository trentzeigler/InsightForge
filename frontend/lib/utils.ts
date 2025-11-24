export function formatBytes(bytes = 0): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const idx = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, idx);
  return `${value.toFixed(1)} ${units[idx]}`;
}

export function formatDate(value?: string): string {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function getChartPalette(count: number) {
  const base = ['#22d3ee', '#f97316', '#6366f1', '#34d399', '#facc15'];
  const colors = [] as string[];
  for (let i = 0; i < count; i++) {
    colors.push(base[i % base.length]);
  }
  return colors;
}
