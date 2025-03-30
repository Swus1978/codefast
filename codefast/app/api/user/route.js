import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectMongo();

    // Fetch user data with populated boards
    const user = await User.findById(session.user.id).populate("boards");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert Mongoose document to plain object and sanitize if needed
    const userData = user.toObject ? user.toObject() : user;

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in /api/user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
