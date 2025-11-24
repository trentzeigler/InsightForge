'use server';

import { triggerAnalysis } from '@/lib/api';

export async function runAnalysisAction(datasetId: string) {
  return triggerAnalysis(datasetId);
}
