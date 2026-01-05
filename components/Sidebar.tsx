"use client";

import ModelPicker from "./ModelPicker";
import PricingCard from "./PricingCard";

export default function Sidebar(props: {
  subscriptionStatus: string;
  models: { id: string; label: string; tier: "FREE" | "PRO"; locked: boolean }[];
  selectedModel: string;
  onSelectModel: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <aside className="w-[320px] p-4 hidden md:flex flex-col gap-4 border-r border-black/10">
      <div className="paper rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg">OpenScribe</div>
          <span className="text-xs px-2 py-1 rounded-full bg-black/5 border border-black/10">
            {props.subscriptionStatus === "PRO" ? "PRO" : "FREE"}
          </span>
        </div>

        <button
          className="mt-4 w-full rounded-xl px-4 py-3 font-medium bg-[rgb(var(--primary))] text-white hover:opacity-95 transition"
          onClick={props.onNewChat}
        >
          + Nuova chat
        </button>

        <div className="mt-4">
          <div className="text-xs text-[rgb(var(--muted))] mb-2">Modello</div>
          <ModelPicker models={props.models} selected={props.selectedModel} onSelect={props.onSelectModel} />
        </div>
      </div>

      {props.subscriptionStatus !== "PRO" ? (
        <PricingCard />
      ) : (
        <div className="paper rounded-2xl p-4 text-sm text-[rgb(var(--muted))]">
          Sei PRO ✅ I modelli premium sono sbloccati.
          <div className="mt-3">
            <a className="underline hover:opacity-90 text-[rgb(var(--primary2))]" href="/settings">
              Gestisci abbonamento
            </a>
          </div>
        </div>
      )}

      <div className="mt-auto text-xs text-[rgb(var(--muted))] p-2">
        Powered by OpenRouter
      </div>
    </aside>
  );
}
