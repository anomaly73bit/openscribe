"use client";

export default function SettingsPage() {
  async function checkout() {
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
  }

  async function portal() {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto paper rounded-2xl p-6">
        <div className="text-2xl font-semibold">Impostazioni</div>
        <div className="mt-2 text-sm text-[rgb(var(--muted))]">
          Gestisci abbonamento e modelli.
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="rounded-xl px-4 py-3 font-medium bg-[rgb(var(--primary))] text-white hover:opacity-95 transition"
            onClick={checkout}
          >
            Attiva PRO (7€/mese)
          </button>

          <button
            className="rounded-xl px-4 py-3 font-medium bg-black/5 hover:bg-black/10 transition border border-black/10"
            onClick={portal}
          >
            Gestisci su Stripe
          </button>
        </div>

        <div className="mt-6 text-xs text-[rgb(var(--muted))]">
          Lo sblocco modelli avviene via Stripe webhook.
        </div>
      </div>
    </div>
  );
}
