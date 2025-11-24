import FileUpload from '@/components/FileUpload';

export default function UploadPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Upload</p>
        <h1 className="text-3xl font-semibold text-white">Bring your raw data</h1>
        <p className="max-w-2xl text-slate-300">
          Drop a CSV/XLSX file and InsightForge will automatically detect
          schema, run statistical profiling, and kick off AI insight
          generation.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
          <FileUpload />
        </div>
        <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-300">
          <h2 className="text-lg font-medium text-white">Accepted formats</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>CSV files up to 200MB</li>
            <li>XLSX workbooks (first sheet auto-selected)</li>
            <li>UTF-8 encoding recommended</li>
            <li>PII automatically redacted before AI calls</li>
          </ul>
          <h3 className="pt-4 text-lg font-medium text-white">Pipeline</h3>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Upload stored in object storage</li>
            <li>Schema + preview generated</li>
            <li>Profiling & correlation jobs run</li>
            <li>AI insight draft generated</li>
          </ol>
        </aside>
      </div>
    </section>
  );
}
