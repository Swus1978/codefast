import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import { auth } from "@/auth";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const hasUpvoted = post.upvotedBy.includes(userId);
    const hasDownvoted = post.downvotedBy.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      post.upvotedBy = post.upvotedBy.filter((id) => id.toString() !== userId);
      post.upvotes = post.upvotedBy.length;
    } else {
      // Add upvote and remove downvote if present
      if (hasDownvoted) {
        post.downvotedBy = post.downvotedBy.filter(
          (id) => id.toString() !== userId
        );
      }
      post.upvotedBy.push(userId);
      post.upvotes = post.upvotedBy.length;
      post.downvotes = post.downvotedBy.length;
    }

    await post.save();

    return NextResponse.json(
      {
        message: hasUpvoted ? "Upvote removed" : "Upvoted successfully",
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        upvoted: !hasUpvoted,
        downvoted: false,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error handling upvote:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const hasUpvoted = post.upvotedBy.includes(userId);
    const hasDownvoted = post.downvotedBy.includes(userId);

    if (hasDownvoted) {
      // Remove downvote
      post.downvotedBy = post.downvotedBy.filter(
        (id) => id.toString() !== userId
      );
      post.downvotes = post.downvotedBy.length;
    } else {
      // Add downvote and remove upvote if present
      if (hasUpvoted) {
        post.upvotedBy = post.upvotedBy.filter(
          (id) => id.toString() !== userId
        );
      }
      post.downvotedBy.push(userId);
      post.upvotes = post.upvotedBy.length;
      post.downvotes = post.downvotedBy.length;
    }

    await post.save();

    return NextResponse.json(
      {
        message: hasDownvoted ? "Downvote removed" : "Downvoted successfully",
        upvotes: post.upvotes,
        downvotes: post.downvotes,
        upvoted: false,
        downvoted: !hasDownvoted,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error handling downvote:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
