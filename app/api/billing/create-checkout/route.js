import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const dynamic = "force-dynamic"; // Skip prerendering for this route

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    const { data, type } = event;

    await connectMongo();

    if (type === "checkout.session.completed") {
      const user = await User.findById(data.object.client_reference_id);
      if (!user) {
        console.error(
          "User not found for ID:",
          data.object.client_reference_id
        );
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      user.hasAccess = true;
      user.customerId = data.object.customer;
      await user.save();
      console.log("User updated with hasAccess: true", user._id);
    } else if (type === "customer.subscription.deleted") {
      const user = await User.findOne({ customerId: data.object.customer });
      if (!user) {
        console.error("User not found for customer:", data.object.customer);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      user.hasAccess = false;
      await user.save();
      console.log("User updated with hasAccess: false", user._id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
