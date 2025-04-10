import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { sessionId } = await req.json();
    console.log("Verify checkout request, sessionId:", sessionId);

    if (!sessionId) {
      console.error("No session ID provided");
      return NextResponse.json(
        { success: false, error: "Session ID required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session) {
      console.error("Unauthorized request");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();
    const user = await User.findById(session.user.id);
    if (!user) {
      console.error("User not found:", session.user.id);
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Checkout session:", {
      payment_status: checkoutSession.payment_status,
      customer: checkoutSession.customer,
    });

    if (checkoutSession.payment_status === "paid" && checkoutSession.customer) {
      const updateResult = await User.updateOne(
        { _id: user._id },
        { $set: { customerId: checkoutSession.customer, hasAccess: true } }
      );
      console.log("User update result:", updateResult);
      return NextResponse.json({ success: true });
    } else {
      console.error("Payment not completed or no customer:", checkoutSession);
      return NextResponse.json(
        { success: false, error: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verify checkout error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
