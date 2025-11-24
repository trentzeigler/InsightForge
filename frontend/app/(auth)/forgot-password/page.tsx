'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <h1 className="text-2xl font-semibold text-white">Forgot password</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter the email associated with your account and we&apos;ll send a reset
        link if it exists in our system.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-950"
        >
          Send reset link
        </button>
        {submitted && (
          <p className="text-sm text-emerald-400">
            If that email exists, you&apos;ll receive instructions shortly.
          </p>
        )}
      </form>
    </div>
  );
}
