import DataTable from '@/components/DataTable';
import { fetchDataset } from '@/lib/api';
import { formatBytes, formatDate } from '@/lib/utils';
import ChartsSection from './charts';
import InsightsPanel from './insights';
import Link from 'next/link';

export default async function DatasetPage({ params }: { params: { datasetId: string } }) {
  const payload = await fetchDataset(params.datasetId);
  const metadata = payload.metadata ?? {};
  const analysis = payload.analysis ?? {};
  const insights = payload.insights ?? {};
  const previewRows = metadata.preview_rows as Array<Record<string, unknown>> | undefined;
  const summary = analysis.summary as Record<string, number> | undefined;
  const dataQuality = analysis.data_quality as Array<{ label: string; value: string }> | undefined;

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            Uploaded {formatDate(metadata.uploaded_at)} · {formatBytes(metadata.size_bytes)}
          </p>
          <h1 className="text-3xl font-semibold text-white">{metadata.name ?? 'Dataset'}</h1>
          <p className="text-sm text-slate-400">{metadata.row_count ?? '—'} rows · {metadata.column_count ?? '—'} columns</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200"
        >
          Back to all datasets
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summary &&
          Object.entries(summary).map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            </div>
          ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-white">Data preview</h2>
          <DataTable rows={previewRows} maxRows={15} />
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-300">
          <h3 className="text-lg font-semibold text-white">Data quality</h3>
          <ul className="mt-4 space-y-2">
            {(dataQuality ?? []).map((item) => (
              <li key={item.label} className="flex items-center justify-between text-slate-200">
                <span>{item.label}</span>
                <span className="text-slate-400">{item.value}</span>
              </li>
            ))}
            {!dataQuality?.length && <li className="text-slate-500">No issues detected</li>}
          </ul>
        </div>
      </div>

      <ChartsSection analysis={analysis} />
      <InsightsPanel datasetId={params.datasetId} analysis={analysis} insights={insights} />
    </section>
  );
}
