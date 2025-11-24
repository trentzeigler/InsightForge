'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useTransition } from 'react';
import { logoutAction } from '@/app/api/auth/logout';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/upload', label: 'Upload' }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
        router.push('/login');
      } catch {
        // ignore
      }
    });
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm">
        <Link href="/" className="font-semibold tracking-tight">
          InsightForge
        </Link>
        <nav className="flex items-center gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'rounded px-3 py-1 transition',
                pathname?.startsWith(href)
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className={clsx(
              'rounded px-3 py-1 transition',
              pathname === '/login' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Sign in
          </Link>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="rounded border border-slate-600 px-3 py-1 text-slate-300 disabled:opacity-50"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
