// api/user/route.js
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Your authentication function
import connectMongo from "@/libs/mongoose"; // Import your MongoDB connection
import User from "@/models/User"; // Import your Mongoose model

export async function GET(req) {
  try {
    const session = await auth(); // Get the session from your auth system
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongo();

    // Fetch user data
    const user = await User.findById(session.user.id); // Assuming `user.id` is the session user ID

    return NextResponse.json(user); // Respond with user data
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
