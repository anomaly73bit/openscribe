import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  // Trova/crea un customer Stripe collegato all’email
  const existing = await stripe.customers.list({
    email: session.user.email,
    limit: 1,
  });

  const customerId =
    existing.data[0]?.id ??
    (
      await stripe.customers.create({
        email: session.user.email,
      })
    ).id;

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/settings`,
  });

  return NextResponse.json({ url: portal.url });
}
