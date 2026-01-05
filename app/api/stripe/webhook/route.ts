import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  async function setStatus(customerId: string, status: string, endsAt?: number | null) {
    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: status,
        subscriptionEndsAt: endsAt ? new Date(endsAt * 1000) : null
      }
    });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;
      const isPro = ["active", "trialing"].includes(sub.status);
      const endsAt = sub.current_period_end ?? null;
      await setStatus(customerId, isPro ? "PRO" : "PAST_DUE", endsAt);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const customerId = sub.customer as string;
      await setStatus(customerId, "CANCELED", null);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
