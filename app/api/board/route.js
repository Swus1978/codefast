import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";

export async function GET(req) {
  await connectMongo();
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const boards = await Board.find({ userId: session.user.id });
  return Response.json(boards);
}

export async function POST(req) {
  await connectMongo();
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const { name } = await req.json();
  const board = new Board({ name, userId: session.user.id });
  await board.save();
  await User.findByIdAndUpdate(session.user.id, {
    $push: { boards: board._id },
  });
  return Response.json(board);
}
