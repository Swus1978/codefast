"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ButtonLogout from "@/components/ButtonLogout";
import FormNewBoard from "@/components/FormNewBoard";
import ButtonCheckout from "@/components/ButtonCheckout";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        console.log("API response:", data); // Debug log

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }

        setUser(data);
        console.log("Boards data:", data.boards); // Verify boards data
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <main className="bg-base-200 min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-base-200 min-h-screen flex items-center justify-center">
        <p className="text-xl text-error">Error: {error}</p>
      </main>
    );
  }

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
          {user && !user.hasAccess && <ButtonCheckout />}
          <ButtonLogout />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <FormNewBoard />
        <div>
          <h1 className="font-extrabold text-xl mb-4">
            {user.boards?.length || 0} Boards
          </h1>

          {user.boards?.length === 0 ? (
            <div className="bg-base-100 p-6 rounded-3xl text-center">
              <p>You don't have any boards yet. Create your first board!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {user.boards?.map((board) => {
                if (!board?._id) {
                  console.warn("Board missing _id:", board);
                  return null;
                }

                return (
                  <li key={board._id}>
                    <Link
                      href={`/dashboard/b/${board._id}`}
                      className="block bg-base-100 p-6 rounded-3xl hover:bg-neutral hover:text-neutral-content duration-100"
                    >
                      {board.name || "Untitled Board"}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
