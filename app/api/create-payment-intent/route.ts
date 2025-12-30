import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { amount, billing_details, paymentMethodID, customerID } =
    await req.json();
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customerID,
      payment_method: paymentMethodID,
      off_session: true,
      confirm: true,
      metadata: {
        email: billing_details?.email || "",
      },
      automatic_payment_methods: { enabled: true },
    });

    // Step 3: Save useful data to 'paymentIntent' collection
    // await PaymentIntent.create({
    //   payment_id: paymentIntent.id,
    //   amount: paymentIntent.amount,
    //   currency: paymentIntent.currency,
    //   status: paymentIntent.status,
    //   payment_method: paymentIntent.payment_method,
    //   payment_method_types: paymentIntent.payment_method_types,
    //   client_secret: paymentIntent.client_secret,
    //   created_at: paymentIntent.created,
    //   capture_method: paymentIntent.capture_method,
    //   confirmation_method: paymentIntent.confirmation_method,
    //   livemode: paymentIntent.livemode,
    //   billing_details,
    // });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log("payment error: ", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
