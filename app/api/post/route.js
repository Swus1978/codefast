import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import Post from "@/models/Post"; // Assuming you have a Post model

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId"); // Corrected from boarId
    const { title, description } = await req.json();

    if (!boardId || !title) {
      return NextResponse.json(
        { error: "Board ID and title are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const board = await Board.findOne({
      _id: boardId,
      userId: session.user.id,
    });
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const post = await Post.create({
      boardId,
      userId: session.user.id,
      title,
      description,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
