import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Board name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const board = await Board.create({
      userId: user._id,
      name: name.trim(),
    });

    user.boards.push(board._id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        board: {
          _id: board._id.toString(),
          name: board.name,
          userId: board.userId.toString(),
          createdAt: board.createdAt
            ? board.createdAt.toISOString()
            : new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Board creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const boardId = url.searchParams.get("boardId");

    if (!boardId) {
      return NextResponse.json(
        { success: false, error: "Board ID is required" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongo();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const board = await Board.findOneAndDelete({
      _id: boardId,
      userId: user._id,
    });

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found or not owned by user" },
        { status: 404 }
      );
    }

    user.boards = user.boards.filter((id) => id.toString() !== boardId);
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Board deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
