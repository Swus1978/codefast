import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");
    const { title, description } = await req.json();

    if (!boardId || !title) {
      return NextResponse.json(
        { error: "boardId and title are required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const post = await Post.findOneAndDelete({
      _id: postId,
      userId: session.user.id, // Only the post's creator can delete it
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
