import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connectMongo();
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1R7oZR2NjqSanNMBeMp4jXsJ", // Replace with your Stripe price ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${req.headers.get("origin")}/dashboard?success=true`,
    cancel_url: `${req.headers.get("origin")}/dashboard?canceled=true`,
    customer_email: session.user.email,
  });

  await User.findByIdAndUpdate(session.user.id, {
    customerId: checkoutSession.customer,
  });
  return Response.json({ id: checkoutSession.id });
}
