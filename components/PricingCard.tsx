"use client";

export default function PricingCard() {
  async function goCheckout() {
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
  }

  return (
    <div className="paper rounded-2xl p-4">
      <div className="text-lg font-semibold">Sblocca PRO</div>
      <div className="mt-2 text-sm text-[rgb(var(--muted))]">
        Modelli premium disponibili con abbonamento.
      </div>

      <div className="mt-4 rounded-xl p-4 bg-black/5 border border-black/10">
        <div className="text-3xl font-bold">
          7€ <span className="text-sm font-medium text-[rgb(var(--muted))]">/ mese</span>
        </div>
        <ul className="mt-3 text-sm text-[rgb(var(--muted))] space-y-2">
          <li>✅ Modelli PRO</li>
          <li>✅ Accesso immediato dopo pagamento</li>
          <li>✅ Cancella quando vuoi</li>
        </ul>
      </div>

      <button
        className="mt-4 w-full rounded-xl px-4 py-3 font-medium bg-[rgb(var(--primary))] text-white hover:opacity-95 transition"
        onClick={goCheckout}
      >
        Attiva PRO
      </button>
    </div>
  );
}
