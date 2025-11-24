'use client';

import { useState } from 'react';

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="mx-auto mt-12 max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <h1 className="text-2xl font-semibold text-white">Reset password</h1>
      <p className="mt-2 text-sm text-slate-400">
        Paste the reset token we emailed you and pick a new password.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSuccess(true);
        }}
      >
        <label className="block space-y-2 text-sm">
          <span>Reset token</span>
          <input
            name="token"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2"
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span>New password</span>
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
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-medium text-slate-950"
        >
          Update password
        </button>
        {success && (
          <p className="text-sm text-emerald-400">
            Password updated. You can now log in with your new credentials.
          </p>
        )}
      </form>
    </div>
  );
}
