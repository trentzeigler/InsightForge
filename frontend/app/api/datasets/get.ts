'use server';

import { fetchDataset, fetchDatasets } from '@/lib/api';

export async function listDatasetsAction() {
  return fetchDatasets();
}

export async function getDatasetAction(datasetId: string) {
  return fetchDataset(datasetId);
}
