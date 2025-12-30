import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { name, email, paymentMethodId } = await req.json();
  try {
    const customer = await stripe.customers.create({
      name,
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    return NextResponse.json({
      success: true,
      message: "Customer created successfully",
      stripeCustomerId: customer.id,
    });
  } catch (err) {
    console.log("Stripe Customer Creation Error:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
