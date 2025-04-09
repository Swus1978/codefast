import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    if (!body.returnUrl) {
      return NextResponse.json(
        { error: "Return URL is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectMongo();
    const user = await User.findById(session.user.id);
    console.log("User data:", { id: user._id, customerId: user.customerId });
    if (!user.customerId) {
      return NextResponse.json(
        { error: "No customer ID found" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const stripeCustomerPortal = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: body.returnUrl,
    });

    console.log("Customer Portal URL:", stripeCustomerPortal.url);
    return NextResponse.json({ url: stripeCustomerPortal.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
