import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    await connectMongo();
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const { successUrl, cancelUrl } = await req.json();
    const user = await User.findById(session.user.id);
    if (!user) throw new Error("User not found");

    if (!user.customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
      });
      await User.updateOne(
        { _id: session.user.id },
        { $set: { customerId: customer.id } }
      );
      console.log("Customer created:", customer.id);
    }

    const successUrlWithSession =
      successUrl ||
      `${req.headers.get(
        "origin"
      )}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`;
    console.log("Success URL configured:", successUrlWithSession);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: "price_1R7oZR2NjqSanNMBeMp4jXsJ", quantity: 1 }],
      mode: "subscription",
      customer: user.customerId,
      success_url: successUrlWithSession,
      cancel_url:
        cancelUrl || `${req.headers.get("origin")}/dashboard?canceled=true`,
    });

    console.log("Checkout session created:", {
      id: checkoutSession.id,
      url: checkoutSession.url,
    });
    return Response.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
