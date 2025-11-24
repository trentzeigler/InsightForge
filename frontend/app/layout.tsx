import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'InsightForge',
  description: 'Upload data. Get smart insights instantly.'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Navbar currentUser={currentUser} />
        <main className="mx-auto max-w-6xl px-6 pb-12 pt-6">{children}</main>
      </body>
    </html>
  );
}
