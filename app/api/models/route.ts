import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

type ModelInfo = { id: string; label: string; tier: "free" | "pro" };

const FREE_MODELS: ModelInfo[] = [
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini", tier: "free" },
  { id: "google/gemini-1.5-flash", label: "Gemini 1.5 Flash", tier: "free" },
];

const PRO_MODELS: ModelInfo[] = [
  { id: "openai/gpt-4o", label: "GPT-4o", tier: "pro" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", tier: "pro" },
];

function isProEnabledForNow() {
  // Fase 1: toggle manuale per far funzionare la UI.
  // Fase 2: lo colleghiamo a Stripe + DB (customer subscription).
  return process.env.PRO_UNLOCK_ENABLED === "true";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const models = isProEnabledForNow() ? [...FREE_MODELS, ...PRO_MODELS] : FREE_MODELS;

  return NextResponse.json({
    proEnabled: isProEnabledForNow(),
    models,
  });
}
