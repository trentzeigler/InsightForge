import 'server-only';

import { cookies } from 'next/headers';
import { API_BASE_URL } from './api';
import { CurrentUser } from './types';

function serializeCookies() {
  const store = cookies();
  const serialized = store
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
  return serialized || undefined;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieHeader = serializeCookies();
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookieHeader
      },
      cache: 'no-store',
      credentials: 'include'
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CurrentUser;
  } catch {
    return null;
  }
}
