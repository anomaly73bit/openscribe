"use client";

export default function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-3xl rounded-2xl px-4 py-3 border",
          isUser ? "bg-[rgba(37,99,235,0.10)] border-[rgba(37,99,235,0.20)]" : "paper-soft"
        ].join(" ")}
      >
        <div className="text-xs text-[rgb(var(--muted))] mb-1">{isUser ? "Tu" : "Assistente"}</div>
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
      </div>
    </div>
  );
}
