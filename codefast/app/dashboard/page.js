"use client";
import Link from "next/link";
import ButtonLogout from "@/components/ButtonLogout";
import FormNewBoard from "@/components/FormNewBoard";
import { auth } from "@/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import ButtonCheckout from "@/components/ButtonCheckout";

async function getUser() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  await connectMongo();
  return await User.findById(session.user.id).populate("boards");
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
      {/* HEADER */}
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
            {user.boards?.length || 0} Boards
          </h1>

          <ul className="space-y-4">
            {user.boards?.map((board) => {
              if (!board?._id) return null;

              return (
                <li key={board._id}>
                  <Link
                    href={`/dashboard/b/${board._id}`}
                    className="block bg-base-100 p-6 rounded-3xl hover:bg-neutral hover:text-neutral-content duration-1000"
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
