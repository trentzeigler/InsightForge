'use client';

import { useState, useTransition } from 'react';
import { generateInsightAction } from '@/app/api/insights/generate';

function InsightCard({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">{title}</p>
      <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-slate-200">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function InsightsPanel({
  datasetId,
  analysis,
  insights
}: {
  datasetId: string;
  analysis: any;
  insights: any;
}) {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const latest = insights?.latest ?? null;

  const handleGenerate = (customQuestion?: string) => {
    startTransition(async () => {
      setStatus('Generating fresh insight...');
      await generateInsightAction(datasetId, customQuestion || question || undefined);
      setStatus('Insight request queued. Refresh shortly.');
      if (!customQuestion) {
        setQuestion('');
      }
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Insights</p>
          <h2 className="text-2xl font-semibold text-white">AI narrative</h2>
        </div>
        <button
          onClick={() => handleGenerate()}
          disabled={isPending}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-100 disabled:opacity-60"
        >
          {isPending ? 'Requesting...' : 'Regenerate' }
        </button>
      </div>
      {latest ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Executive summary</p>
              <p className="mt-3 text-lg text-slate-100">{latest.summary}</p>
            </div>
            <InsightCard title="Top trends" items={latest.top_trends} />
            <InsightCard title="Data quality" items={latest.data_quality_notes} />
          </div>
          <div className="space-y-4">
            <InsightCard title="Anomalies" items={latest.anomalies} />
            <InsightCard title="Suggested charts" items={latest.suggested_charts} />
            <InsightCard title="Follow-up questions" items={latest.follow_up_questions} />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          No AI insights yet. Kick off analysis above to generate the first
          narrative.
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-sm font-medium text-white">Ask a follow-up</p>
        <p className="text-sm text-slate-400">
          Your question plus fresh statistics will be routed through the LLM for
          a contextual response saved to history.
        </p>
        <form
          className="mt-4 flex flex-col gap-3 md:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerate(question);
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. Why did revenue dip in Q2?"
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={!question || isPending}
            className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            Ask
          </button>
        </form>
        {status && <p className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">{status}</p>}
      </div>
    </section>
  );
}
