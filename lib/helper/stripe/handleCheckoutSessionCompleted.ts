import { prisma } from "@/lib/prisma";
import { getCreditsPack, PackId } from "@/types/billing";
import "server-only";
import Stripe from "stripe";


export async function HandleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
   if(!event.metadata) {
    throw new Error("Missing Metadata");
   }
    const { userId, packId } = event.metadata;
    if(!userId) {
        throw new Error("Missing User ID");
    }
    if(!packId) {
        throw new Error("Missing User ID");
    }

    const purchasedPack = getCreditsPack(packId as PackId);
    if(!purchasedPack) {
        throw new Error("Purchased pack not found");
    }

    await prisma.userBalance.upsert({
        where: { userId },
        create: {
            userId,
            credits: purchasedPack.credits,
        },
        update: {
            credits: {
                increment: purchasedPack.credits
            }
        }
    });

    await prisma.userPurchase.create({
        data: {
            userId,
            stripeId: event.id,
            description: `${purchasedPack.name} -${purchasedPack.credits} credits`,
            amount: event.amount_total!,
            currency: event.currency!
        }
    });

}