'use server';

import { requestInsight } from '@/lib/api';

export async function generateInsightAction(datasetId: string, question?: string) {
  const payload = question ? { question } : undefined;
  return requestInsight(datasetId, payload);
}
