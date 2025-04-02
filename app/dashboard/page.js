import Link from "next/link";
import ButtonLogout from "@/components/ButtonLogout";
import FormNewBoard from "@/components/FormNewBoard"; // Verify this path
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";
import mongoose from "mongoose";
import ButtonCheckout from "@/components/ButtonCheckout";

// Force Board model registration
console.log("Checking Board model registration");
if (!mongoose.models.Board) {
  console.log("Board model not found, registering manually");
  const boardSchema = require("@/models/Board").default.schema;
  mongoose.model("Board", boardSchema);
} else {
  console.log("Board model already registered");
}

async function getUser() {
  const session = await auth();
  if (!session || !session.user) {
    console.log("No session or user");
    return null;
  }
  await connectMongo();
  console.log("Board model status before query:", !!mongoose.models.Board);
  const user = await User.findById(session.user.id).populate("boards").lean();
  if (!user) {
    console.log("User not found");
    return null;
  }
  user.boards = user.boards?.map((board) => ({ ...board })) || [];
  return user;
}

export default async function Dashboard() {
  const user = await getUser();
  if (!user) {
    return (
      <main className="bg-base-200 min-h-screen flex items-center justify-center">
        <p className="text-xl">Please log in to access the dashboard.</p>
      </main>
    );
  }
  return (
    <main className="bg-base-200 min-h-screen">
      <section className="bg-base-100">
        <div className="px-5 py-3 flex justify-between max-w-5xl mx-auto">
          {!user.hasAccess && <ButtonCheckout />}
          <ButtonLogout />
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <FormNewBoard />
        <div>
          <h1 className="font-extrabold text-xl mb-4">
            {user.boards.length} Boards
          </h1>
          <ul className="space-y-4">
            {user.boards.map((board) => {
              if (!board?._id) return null;
              return (
                <li key={board._id.toString()}>
                  <Link
                    href={`/dashboard/b/${board._id}`}
                    className="block bg-base-100 p-6 rounded-3xl hover:bg-neutral hover:text-neutral-content"
                  >
                    {board.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
