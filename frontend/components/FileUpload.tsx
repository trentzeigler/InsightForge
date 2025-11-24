'use client';

import { useState, useTransition } from 'react';
import { uploadDatasetAction } from '@/app/api/datasets/upload';
import { runAnalysisAction } from '@/app/api/datasets/analyze';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FileUpload() {
  const [filename, setFilename] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const { dataset_id } = await uploadDatasetAction(formData);
        toast.success('Upload complete — kicking off analysis');
        await runAnalysisAction(dataset_id);
        toast.info('Analysis started. Check dashboard shortly.');
        event.currentTarget.reset();
        setFilename('');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      }
    });
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">Dataset name</label>
          <input
            name="dataset_name"
            placeholder="e.g. q3_revenue_forecast"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200">CSV or XLSX</label>
          <input
            type="file"
            name="file"
            accept=".csv,.xlsx,.xls"
            required
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFilename(file ? file.name : '');
            }}
            className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-10 text-center"
          />
          {filename && <p className="text-xs text-slate-400">Selected: {filename}</p>}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 disabled:opacity-70"
        >
          {isPending ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </form>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}
