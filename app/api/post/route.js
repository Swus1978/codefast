import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import Post from "@/models/Post";
import { Filter } from "bad-words";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");
    const { title, description } = await req.json();

    const badWordsFilter = new Filter();
    const saniteziedTitle = badWordsFilter.clean(title);
    const sanitizedDescription = badWordsFilter.clean(description);

    if (!saniteziedTitle || !sanitizedDescription) {
      return NextResponse.json(
        { error: "Board title and descriptions are required" },
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
      title: saniteziedTitle,
      description: sanitizedDescription,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
