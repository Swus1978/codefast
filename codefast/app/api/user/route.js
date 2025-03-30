import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

// Enhanced MongoDB connection settings
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10, // Maximum number of connections
  minPoolSize: 2, // Minimum number of connections
};

export async function GET(_req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connection with enhanced error handling
    try {
      await connectMongo(MONGO_OPTIONS);
    } catch (connectionError) {
      console.error("MongoDB connection failed:", connectionError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    // Query with timeout protection
    const user = await Promise.race([
      User.findById(session.user.id).populate("boards").lean().exec(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Query timeout")), 10000)
      ),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Data sanitization
    const sanitizedUser = {
      ...user,
      password: undefined,
      __v: undefined,
    };

    return NextResponse.json(sanitizedUser);
  } catch (error) {
    console.error("API Error:", error);

    // Differentiate between error types
    const statusCode = error.message.includes("timeout") ? 504 : 500;

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: statusCode }
    );
  }
}
