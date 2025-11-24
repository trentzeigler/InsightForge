'use server';

import { API_BASE_URL } from '@/lib/api';

export async function uploadDatasetAction(formData: FormData) {
  const file = formData.get('file');
  const datasetName = formData.get('dataset_name')?.toString();

  if (!(file instanceof File)) {
    throw new Error('A CSV or XLSX file is required');
  }

  const uploadForm = new FormData();
  uploadForm.append('file', file);
  uploadForm.append('dataset_name', datasetName ?? file.name);

  const res = await fetch(`${API_BASE_URL}/datasets/upload`, {
    method: 'POST',
    body: uploadForm,
    credentials: 'include'
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || 'Upload failed');
  }

  return res.json();
}
