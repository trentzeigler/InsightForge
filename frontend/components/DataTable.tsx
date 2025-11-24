'use client';

import { useMemo } from 'react';

type DataTableProps = {
  rows?: Array<Record<string, unknown>>;
  maxRows?: number;
};

export default function DataTable({ rows = [], maxRows = 10 }: DataTableProps) {
  const headers = useMemo(() => Object.keys(rows[0] ?? {}), [rows]);
  const slice = rows.slice(0, maxRows);

  if (!rows.length) {
    return <p className="text-sm text-slate-400">No preview rows available.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-slate-900/30">
              {headers.map((header) => (
                <td key={header} className="px-4 py-2 text-slate-100">
                  {String(row[header] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
