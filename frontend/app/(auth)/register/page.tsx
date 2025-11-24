'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { registerAction } from '@/app/api/auth/register';
import Link from 'next/link';

export default function RegisterPage() {
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
        await registerAction(formData);
        setSuccess('Account created! Redirecting to dashboard...');
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to register');
      }
    });
  };

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <h1 className="text-2xl font-semibold text-white">Create an account</h1>
      <p className="mt-2 text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-300">
          Sign in
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
            minLength={8}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-950 disabled:opacity-70"
        >
          {isPending ? 'Creating account...' : 'Sign up'}
        </button>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}
      </form>
    </div>
  );
}
