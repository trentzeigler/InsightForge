'use server';

import { handleAuth } from '@/lib/auth';

export async function logoutAction() {
  await handleAuth('/auth/logout', {});
}
