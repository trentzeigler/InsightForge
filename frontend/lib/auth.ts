import { API_BASE_URL } from './api';

export async function handleAuth(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || 'Authentication failed');
  }

  return res.json().catch(() => undefined);
}
