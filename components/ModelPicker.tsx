"use client";

export default function ModelPicker(props: {
  models: { id: string; label: string; tier: "FREE" | "PRO"; locked: boolean }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {props.models.map(m => (
        <button
          key={m.id}
          onClick={() => props.onSelect(m.id)}
          className={[
            "w-full text-left rounded-xl px-3 py-2 transition border",
            props.selected === m.id ? "border-black/20 bg-black/5" : "border-black/10 hover:bg-black/5"
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{m.label}</div>
            <div className="text-xs px-2 py-1 rounded-full bg-black/5 border border-black/10">
              {m.tier}{m.locked ? " 🔒" : ""}
            </div>
          </div>
          <div className="text-xs text-[rgb(var(--muted))] mt-1">{m.id}</div>
        </button>
      ))}
    </div>
  );
}
