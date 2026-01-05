export type ModelDef = {
  id: string;
  label: string;
  tier: "FREE" | "PRO";
};

export const MODELS: ModelDef[] = [
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini", tier: "FREE" },
  { id: "google/gemini-flash-1.5", label: "Gemini Flash 1.5", tier: "FREE" },

  { id: "openai/gpt-4o", label: "GPT-4o", tier: "PRO" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", tier: "PRO" },
  { id: "google/gemini-1.5-pro", label: "Gemini 1.5 Pro", tier: "PRO" }
];

export function canUseModel(subscriptionStatus: string, modelId: string) {
  const m = MODELS.find(x => x.id === modelId);
  if (!m) return false;
  if (m.tier === "FREE") return true;
  return subscriptionStatus === "PRO";
}
