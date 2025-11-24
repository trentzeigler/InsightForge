import { cookies } from 'next/headers';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

function getServerCookieHeader() {
  if (typeof window !== 'undefined') {
    return undefined;
  }

  try {
    const store = cookies();
    const serialized = store
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');
    return serialized || undefined;
  } catch {
    return undefined;
  }
}

export type DatasetSummary = {
  id: string;
  name: string;
  size_bytes: number;
  uploaded_at: string;
  row_count?: number;
  column_count?: number;
};

export type AnalysisPayload = {
  metadata: Record<string, unknown>;
  analysis: Record<string, unknown>;
  insights: Record<string, unknown>;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieHeader = getServerCookieHeader();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {})
    },
    ...init
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || res.statusText);
  }

  return res.json();
}

export function fetchDatasets() {
  return apiFetch<DatasetSummary[]>('/datasets');
}

export function fetchDataset(datasetId: string) {
  return apiFetch<AnalysisPayload>(`/datasets/${datasetId}`);
}

export function triggerAnalysis(datasetId: string) {
  return apiFetch<{ status: string }>(`/datasets/${datasetId}/analyze`, {
    method: 'POST'
  });
}

export function requestInsight(datasetId: string, payload?: Record<string, unknown>) {
  return apiFetch<{ insight_id: string; content?: Record<string, unknown> }>(
    `/insights/${datasetId}/generate`,
    {
      method: 'POST',
      body: JSON.stringify(payload ?? {}),
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
