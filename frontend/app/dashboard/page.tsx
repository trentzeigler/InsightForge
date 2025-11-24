import Link from 'next/link';
import { fetchDatasets } from '@/lib/api';
import { formatBytes, formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const datasets = await fetchDatasets().catch(() => []);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Dashboards</p>
        <h1 className="text-3xl font-semibold text-white">Your datasets</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {datasets.map((dataset) => (
          <Link
            key={dataset.id}
            href={`/dashboard/${dataset.id}`}
            className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-cyan-400"
          >
            <p className="text-sm text-slate-400">{formatDate(dataset.uploaded_at)}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{dataset.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{formatBytes(dataset.size_bytes)}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
              <span>Rows: {dataset.row_count ?? '—'}</span>
              <span>Columns: {dataset.column_count ?? '—'}</span>
            </div>
          </Link>
        ))}
        {!datasets.length && (
          <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
            No datasets yet. <Link className="text-cyan-300" href="/upload">Upload one</Link> to get started.
          </div>
        )}
      </div>
    </section>
  );
}
