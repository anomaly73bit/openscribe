import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseModel } from "@/lib/access";
import { openRouterChatCompletion } from "@/lib/openrouter";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { chatId, model, message } = await req.json() as {
    chatId?: string;
    model: string;
    message: string;
  };

  if (!canUseModel(user.subscriptionStatus, model)) {
    return NextResponse.json({ error: "Model locked. Upgrade to PRO." }, { status: 403 });
  }

  const chat = chatId
    ? await prisma.chat.findFirst({ where: { id: chatId, userId } })
    : await prisma.chat.create({ data: { userId, title: message.slice(0, 40) || "New chat" } });

  if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

  await prisma.message.create({ data: { chatId: chat.id, role: "user", content: message } });

  const history = await prisma.message.findMany({
    where: { chatId: chat.id },
    orderBy: { createdAt: "asc" },
    take: 30
  });

  const messages = history.map(m => ({ role: m.role as any, content: m.content }));

  const out = await openRouterChatCompletion({ model, messages });
  const assistantText = out?.choices?.[0]?.message?.content ?? "No response.";

  await prisma.message.create({
    data: { chatId: chat.id, role: "assistant", content: assistantText, model }
  });

  return NextResponse.json({ chatId: chat.id, assistant: assistantText });
}
