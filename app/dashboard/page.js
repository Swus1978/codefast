import Link from "next/link";
import ButtonLogout from "@/components/ButtonLogout";
import FormNewBoard from "@/components/FormNewBoard";
import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import "@/models/Board";
import ButtonCheckout from "@/components/ButtonCheckout";
import ButtonPortal from "@/components/ButtonPortal";

async function getUser() {
  const session = await auth();
  if (!session || !session.user) return null;

  try {
    await connectMongo();
    const user = await User.findById(session.user.id).populate("boards");

    console.log("User fetched:", {
      id: user._id,
      hasAccess: user.hasAccess,
      customerId: user.customerId,
      email: user.email,
    });

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return (
      <main className="bg-base-200 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl">Please log in to access the dashboard.</p>
          <ButtonLogout />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-base-200 min-h-screen">
      <section className="bg-base-100 sticky top-0 z-10 shadow-sm">
        <div className="px-5 py-3 flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center space-x-3">
            {user.hasAccess ? (
              <>
                <ButtonPortal />
                <span className="text-sm text-success">
                  Active Subscription
                </span>
              </>
            ) : (
              <>
                <ButtonCheckout />
                <span className="text-sm text-warning">No Subscription</span>
              </>
            )}
            <ButtonLogout />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <FormNewBoard />

        <div className="bg-base-100 p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-extrabold text-xl">
              {user.boards?.length || 0} Boards
            </h1>
            {user.boards?.length > 0 && (
              <span className="text-sm text-neutral-content">
                Click to view/edit
              </span>
            )}
          </div>

          {user.boards?.length > 0 ? (
            <ul className="space-y-4">
              {user.boards.map((board) => (
                <li key={board._id}>
                  <Link
                    href={`/dashboard/b/${board._id}`}
                    className="block bg-base-200 hover:bg-neutral hover:text-neutral-content p-6 rounded-3xl transition-all duration-200"
                  >
                    <h2 className="font-semibold">{board.name}</h2>
                    {board.description && (
                      <p className="text-sm text-neutral-content mt-1">
                        {board.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-content">
                You don't have any boards yet. Create your first one above!
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
