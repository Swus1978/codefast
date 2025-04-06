import { NextResponse } from "next/server";
import { Filter } from "bad-words";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import { auth } from "@/app/auth";

export async function POST(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { title, description } = body;

    // Get boardId from query parameters
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    // Sanitize input data
    const badWordsFilter = new Filter();
    const saniteziedTitle = badWordsFilter.clean(title);
    const saniteziedDescription = badWordsFilter.clean(description);

    // Validate required fields
    if (!saniteziedTitle) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }
    if (!boardId) {
      return NextResponse.json(
        { error: "boardId is required in query parameters" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectMongo();

    // Check if the user is logged in (optional userId)
    const session = await auth();
    const userId = session?.user?.id || null;

    // Create the new post
    const post = await Post.create({
      title: saniteziedTitle,
      description: saniteziedDescription,
      boardId,
      userId,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
