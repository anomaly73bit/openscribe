"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md paper rounded-2xl p-6">
        <div className="text-2xl font-semibold">Accedi</div>
        <div className="text-sm text-[rgb(var(--muted))] mt-2">
          Login per usare la chat e sbloccare i modelli PRO.
        </div>

        <button
          className="mt-6 w-full rounded-xl px-4 py-3 font-medium bg-[rgb(var(--primary))] text-white hover:opacity-95 transition"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          Continua con GitHub
        </button>

        <div className="mt-6 text-xs text-[rgb(var(--muted))]">
          PRO: 7€/mese. Puoi cancellare quando vuoi.
        </div>
      </div>
    </div>
  );
}
