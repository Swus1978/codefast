// app/api/post/route.js
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import { auth } from "@/app/auth";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    if (!boardId || !mongoose.isValidObjectId(boardId)) {
      return NextResponse.json(
        { error: "Valid boardId is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectMongo();
    const post = await Post.create({
      title,
      description: description || "",
      boardId,
      userId: session.user.id,
      upvotedBy: [],
      downvotedBy: [],
      upvotes: 0,
      downvotes: 0,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
