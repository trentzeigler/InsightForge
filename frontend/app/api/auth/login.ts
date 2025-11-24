'use server';

import { handleAuth } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  await handleAuth('/auth/login', { email, password });
}
