"use client";

import { signOut } from "next-auth/react";

export default function TopBar({ subscriptionStatus }: { subscriptionStatus: string }) {
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-black/10 bg-[rgba(255,252,245,0.6)]">
      <div className="font-semibold">
        OpenScribe <span className="text-xs text-[rgb(var(--muted))]">({subscriptionStatus})</span>
      </div>
      <div className="flex gap-2">
        <a className="rounded-xl px-3 py-2 bg-black/5 border border-black/10 hover:bg-black/10 transition text-sm" href="/settings">
          Impostazioni
        </a>
        <button
          className="rounded-xl px-3 py-2 bg-black/5 border border-black/10 hover:bg-black/10 transition text-sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
