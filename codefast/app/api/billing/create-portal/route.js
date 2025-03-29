import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Stripe from "stripe";

export async function POST(req) {
    try {
        const body = await req.json();

        // Ensure returnUrl is provided
        if (!body.returnUrl) {
            return NextResponse.json(
                { error: "Return URL is required" },
                { status: 400 }
            );
        }

        // Authenticate user
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { error: "Not authorized" },
                { status: 401 }
            );
        }

        // Connect to MongoDB and fetch user data
        await connectMongo();
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if the user has a Stripe customerId
        if (!user.customerId) {
            return NextResponse.json(
                { error: "User does not have a Stripe customerId" },
                { status: 400 }
            );
        }

        console.log("User's Customer ID:", user.customerId);  // For debugging

        // Initialize Stripe
        const stripe = new Stripe(process.env.STRIPE_API_KEY);

        // Create Stripe customer portal session
        const stripeCustomerPortal = await stripe.billingPortal.sessions.create({
            customer: user.customerId,
            return_url: body.returnUrl,  // Ensure the return URL is valid
        });

        return NextResponse.json({ url: stripeCustomerPortal.url });

    } catch (error) {
        console.error("Error creating portal:", error);  // Log the error for debugging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
