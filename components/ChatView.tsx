"use client";

import { useMemo, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatView(props: {
  chatId: string | null;
  setChatId: (id: string) => void;
  model: string;
  modelLocked: boolean;
  messages: { role: "user" | "assistant"; content: string }[];
  setMessages: (m: { role: "user" | "assistant"; content: string }[]) => void;
}) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !busy && !props.modelLocked, [input, busy, props.modelLocked]);

  async function send() {
    if (!canSend) return;

    const text = input.trim();
    setInput("");

    props.setMessages([...props.messages, { role: "user", content: text }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: props.chatId,
          model: props.model,
          message: text
        })
      });

      const json = await res.json();

      if (!res.ok) {
        props.setMessages([
          ...props.messages,
          { role: "user", content: text },
          { role: "assistant", content: `⚠️ ${json.error ?? "Errore"}` }
        ]);
        return;
      }

      props.setChatId(json.chatId);
      props.setMessages([
        ...props.messages,
        { role: "user", content: text },
        { role: "assistant", content: json.assistant }
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {props.messages.length === 0 ? (
          <div className="max-w-2xl mx-auto paper rounded-2xl p-6">
            <div className="text-xl font-semibold">Scrivi un messaggio</div>
            <div className="mt-2 text-sm text-[rgb(var(--muted))]">
              Modello selezionato: <span className="font-mono">{props.model}</span>
            </div>
            {props.modelLocked ? (
              <div className="mt-4 text-sm">
                🔒 Questo modello è PRO. Vai in{" "}
                <a className="underline text-[rgb(var(--primary2))]" href="/settings">
                  Impostazioni
                </a>{" "}
                per attivare 7€/mese.
              </div>
            ) : null}
          </div>
        ) : (
          props.messages.map((m, i) => <MessageBubble key={i} role={m.role} content={m.content} />)
        )}
      </div>

      <div className="p-4 border-t border-black/10 bg-[rgba(255,252,245,0.6)]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            className="flex-1 rounded-2xl p-3 bg-[rgb(var(--card))] border border-black/10 outline-none
                       focus:ring-2 focus:ring-[rgb(var(--ring))] min-h-[52px] max-h-[180px]"
            placeholder={props.modelLocked ? "Modello bloccato: attiva PRO" : "Scrivi…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={busy || props.modelLocked}
          />
          <button
            className="rounded-2xl px-5 font-medium bg-[rgb(var(--primary2))] text-white hover:opacity-95 transition disabled:opacity-50"
            onClick={send}
            disabled={!canSend}
          >
            {busy ? "…" : "Invia"}
          </button>
        </div>
      </div>
    </div>
  );
}
