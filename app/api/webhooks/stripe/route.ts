import { HandleCheckoutSessionCompleted } from "@/lib/helper/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/helper/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request: Request,) {
    const body = await request.text();
    const signature = headers().get("stripe-signature") as string;
    try {
        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        switch(event.type) {
            case "checkout.session.completed":
                HandleCheckoutSessionCompleted(event.data.object);
                break;
            default:
                break;
        }
        return new NextResponse( null, { status: 200 });
    }
    catch(error) {
        console.error("Stripe Webhook Error: ", error);
        return new NextResponse("Webhook Error", { status: 400 });
    }

}