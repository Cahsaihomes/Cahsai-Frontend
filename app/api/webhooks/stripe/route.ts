import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

/**
 * Webhook handler for Stripe events
 * 
 * This handles:
 * 1. payment_intent.succeeded - Update lead status to claimed in database
 * 2. payment_intent.payment_failed - Log failed payments
 * 
 * Setup:
 * 1. Go to https://dashboard.stripe.com/webhooks
 * 2. Create webhook endpoint pointing to: YOUR_DOMAIN/api/webhooks/stripe
 * 3. Select events: payment_intent.succeeded, payment_intent.payment_failed
 * 4. Copy signing secret and add to .env.local as STRIPE_WEBHOOK_SECRET
 */

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Check if this is a lead claim payment
      if (paymentIntent.metadata.type === "lead_claim") {
        const { leadId, agentId, propertyPrice } = paymentIntent.metadata;

        // UPDATE YOUR DATABASE HERE
        // Call your backend API to update lead status
        const updateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tour/claim-tour/${leadId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.BACKEND_API_TOKEN}`,
            },
            body: JSON.stringify({
              status: "claimed",
              agentId: agentId,
              claimFee: propertyPrice ? (Number(propertyPrice) * 0.0002).toFixed(2) : null,
              paymentIntentId: paymentIntent.id,
              paymentStatus: "success",
            }),
          }
        );

        if (!updateResponse.ok) {
          console.error("Failed to update lead status:", await updateResponse.text());
        }

        console.log(
          `Lead ${leadId} claimed by agent ${agentId} for fee $${paymentIntent.amount / 100}`
        );
      }
    }

    // Handle payment_intent.payment_failed event
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.error(
        `Payment failed for lead ${paymentIntent.metadata.leadId}:`,
        paymentIntent.last_payment_error
      );

      // Optional: Update database to log failed payment
      // You could store this in a failed_payments table for auditing
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
