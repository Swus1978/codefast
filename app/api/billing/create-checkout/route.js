import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Moved here
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const { userId } = await req.json();
    // Example checkout session (adjust based on your actual code)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1R7UQW2NjqSanNMB7t8ii4AG", // Replace with your Stripe price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard`,
      cancel_url: `${req.headers.get("origin")}/dashboard`,
      client_reference_id: userId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
