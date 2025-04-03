import Link from "next/link";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import Post from "@/models/Post"; // Add Post model
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CardBoardLink from "@/components/CardBoardLink";
import ButtonDeleteBoard from "@/components/ButtonDeleteBoard";
import CardPostAdmin from "@/components/CardPostAdmin";

const getBoardData = async (boardId) => {
  if (!boardId) {
    console.log("No boardId provided, redirecting to dashboard");
    return null;
  }

  try {
    await connectMongo();
    const session = await auth();

    if (!session?.user) {
      console.log("No session or user, redirecting to login");
      return redirect("/login");
    }

    const board = await Board.findOne({
      _id: boardId,
      userId: session.user.id,
    }).lean();

    if (!board) {
      console.log(
        `Board not found for boardId: ${boardId}, redirecting to dashboard`
      );
      return null;
    }

    const posts = await Post.find({ boardId }).sort({ createdAt: -1 }).lean();

    console.log(`Board found: ${board.name}, Posts: ${posts.length}`);
    return { board, posts };
  } catch (error) {
    console.error("Error fetching board data:", error);
    return null;
  }
};

export default async function FeedbackBoard({ params }) {
  // eslint-disable-next-line @next/next/no-sync-dynamic-apis
  const boardId = await params.boardId; // Await explicitly to suppress warning

  if (!boardId) {
    console.log("No boardId in params, redirecting to dashboard");
    return redirect("/dashboard");
  }

  const data = await getBoardData(boardId);

  if (!data) {
    console.log(`Redirecting to dashboard for boardId: ${boardId}`);
    return redirect("/dashboard");
  }

  const { board, posts } = data;

  return (
    <main className="bg-base-200 min-h-screen">
      {/* Header Section */}
      <section className="bg-base-100">
        <div className="px-5 py-3 flex max-w-5xl mx-auto">
          <Link href="/dashboard" className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row gap-12">
        <div className="space-y-8">
          <h1 className="font-extrabold text-xl mb-4">{board.name}</h1>
          <CardBoardLink boardId={board._id.toString()} />
          <ButtonDeleteBoard boardId={board._id.toString()} />
        </div>

        {/* Posts List */}

        <ul className="space-y-4 ">
          {posts.map((post) => (
            <CardPostAdmin key={post._id.toString()} post={post} />
          ))}
        </ul>
      </section>
    </main>
  );
}
