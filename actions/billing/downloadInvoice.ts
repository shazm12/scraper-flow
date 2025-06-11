"use server";

import { stripe } from "@/lib/helper/stripe/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function DownloadInvoice(id: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!purchase) {
    throw new Error("Bad Request");
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);

  if (!session.invoice) {
    throw new Error("Invoice not found");
  }

  const invoice = await stripe.invoices.retrieve(session.invoice as string);

  return invoice.hosted_invoice_url;
}
