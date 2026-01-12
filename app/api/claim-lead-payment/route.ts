import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      leadId,
      agentId,
      propertyPrice,
      paymentMethodId,
      cardholderName,
    } = await req.json();

    // Validate required fields
    if (!amount || !leadId || !agentId || !paymentMethodId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, leadId, agentId, paymentMethodId" },
        { status: 400 }
      );
    }

    // Create and confirm payment intent with metadata for database updates
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      off_session: true,
      metadata: {
        leadId: String(leadId),
        agentId: String(agentId),
        propertyPrice: String(propertyPrice),
        cardholderName: cardholderName || "",
        type: "lead_claim",
      },
      automatic_payment_methods: { enabled: true },
    });

    // Check payment status
    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({
        status: "success",
        message: "Lead claimed successfully",
        paymentIntentId: paymentIntent.id,
        leadId,
      });
    } else if (paymentIntent.status === "processing") {
      return NextResponse.json(
        {
          status: "processing",
          message: "Payment is processing",
          paymentIntentId: paymentIntent.id,
          leadId,
        },
        { status: 202 }
      );
    } else {
      return NextResponse.json(
        {
          error: `Payment failed with status: ${paymentIntent.status}`,
          paymentIntentId: paymentIntent.id,
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Payment intent error:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
