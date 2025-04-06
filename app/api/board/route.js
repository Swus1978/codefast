// app/api/board/route.js
import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req) {
  await connectMongo();
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const boards = await Board.find({ userId: session.user.id });
  return Response.json(boards);
}

export async function POST(req) {
  try {
    await connectMongo();
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { name } = await req.json();
    if (!name) return new Response("Name is required", { status: 400 });

    const board = new Board({ name, userId: session.user.id });
    await board.save();

    await User.findByIdAndUpdate(session.user.id, {
      $push: { boards: board._id },
    });

    return Response.json(board, { status: 201 });
  } catch (error) {
    console.error("Error creating board:", error.message);
    return new Response(error.message, { status: 500 });
  }
}

// app/api/board/route.js (partial, add to your existing file)
export async function DELETE(req) {
  try {
    await connectMongo();
    const session = await auth();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    if (!boardId || !mongoose.isValidObjectId(boardId)) {
      return new Response("Valid boardId is required", { status: 400 });
    }

    const board = await Board.findOneAndDelete({
      _id: boardId,
      userId: session.user.id,
    });

    if (!board) {
      return new Response("Board not found or not authorized", { status: 404 });
    }

    await User.findByIdAndUpdate(session.user.id, {
      $pull: { boards: board._id },
    });

    return new Response("Board deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting board:", error.message);
    return new Response(error.message, { status: 500 });
  }
}
