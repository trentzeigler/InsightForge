'use client';

import ChartRenderer from '@/components/ChartRenderer';

export default function ChartsSection({ analysis }: { analysis: any }) {
  const numericDistributions = analysis?.distributions?.numeric ?? [];
  const categoricalDistributions = analysis?.distributions?.categorical ?? [];
  const correlations = analysis?.correlations ?? [];

  if (!numericDistributions.length && !categoricalDistributions.length && !correlations.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Visuals</p>
          <h2 className="text-2xl font-semibold text-white">Automated charts</h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {numericDistributions.slice(0, 2).map((dist: any) => (
          <div key={dist.column} className="space-y-3">
            <p className="text-sm text-slate-300">{dist.column}</p>
            <ChartRenderer
              type="bar"
              labels={dist.bins}
              datasets={[{ label: 'Count', data: dist.counts }]}
            />
          </div>
        ))}
        {categoricalDistributions.slice(0, 2).map((dist: any) => (
          <div key={dist.column} className="space-y-3">
            <p className="text-sm text-slate-300">{dist.column}</p>
            <ChartRenderer
              type="pie"
              labels={dist.values.map((val: any) => val.label)}
              datasets={[
                {
                  label: dist.column,
                  data: dist.values.map((val: any) => val.value)
                }
              ]}
            />
          </div>
        ))}
      </div>
      {correlations.length > 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white">Strongest correlations</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {correlations.slice(0, 4).map((corr: any) => (
              <div key={`${corr.source}-${corr.target}`} className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4">
                <p className="text-sm text-slate-400">
                  {corr.source} ↔ {corr.target}
                </p>
                <p className="text-2xl font-semibold text-white">{corr.coefficient.toFixed(2)}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {corr.method ?? 'pearson'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
