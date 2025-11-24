'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-6 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">InsightForge</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
          Upload raw datasets. Get narrative intelligence in minutes.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          InsightForge combines automated analysis, AI-assisted narratives, and
          interactive dashboards so teams can move from spreadsheets to
          decisions faster.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/upload"
          className="rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
        >
          Upload a dataset
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-slate-600 px-6 py-3 text-slate-200 transition hover:border-slate-400"
        >
          View existing dashboards
        </Link>
      </div>
    </section>
  );
}
