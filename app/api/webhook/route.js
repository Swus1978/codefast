import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

// Initialize Stripe with error handling
let stripe;
try {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} catch (err) {
  console.error("Stripe initialization error:", err);
  throw new Error("Failed to initialize Stripe");
}

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Rest of your existing code...
    const { data, type } = event;

    if (type === "checkout.session.completed") {
      await connectMongo();
      const user = await User.findById(data.object.client_reference_id);
      if (!user) {
        console.error("User not found:", data.object.client_reference_id);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      user.hasAccess = true;
      user.customerId = data.object.customer;
      await user.save();
    }
    // ... other event handlers

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: err.message || "Webhook handler failed" },
      { status: 400 }
    );
  }
}
