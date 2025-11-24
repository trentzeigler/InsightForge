'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { loginAction } from '@/app/api/auth/login';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await loginAction(formData);
        setSuccess('Welcome back! Redirecting to dashboard...');
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to login');
      }
    });
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <h1 className="text-2xl font-semibold text-white">Log in to InsightForge</h1>
      <p className="mt-2 text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-cyan-300">
          Sign up
        </Link>
      </p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-950 disabled:opacity-70"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}
      </form>
      <Link href="/forgot-password" className="mt-6 inline-block text-sm text-slate-400">
        Forgot password?
      </Link>
    </div>
  );
}
