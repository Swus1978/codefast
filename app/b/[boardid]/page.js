import Link from "next/link";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import Post from "@/models/Post";
import FormAddPost from "@/components/FormAddPost";
import CardPost from "@/components/CardPost";
import { redirect } from "next/navigation";

const getData = async (boardId) => {
  if (!boardId) {
    console.log("No boardId provided, redirecting to home");
    return redirect("/");
  }

  try {
    await connectMongo();
    const board = await Board.findById(boardId).lean();
    if (!board) {
      console.log(
        `Board not found for boardId: ${boardId}, redirecting to home`
      );
      return redirect("/");
    }

    const posts = await Post.find({ boardId }).sort({ createdAt: -1 }).lean();

    console.log(`Public board found: ${board.name}, Posts: ${posts.length}`);
    return { board, posts };
  } catch (error) {
    console.error("Error fetching public board data:", error);
    return redirect("/");
  }
};

export default async function PublicFeedbackBoard({ params }) {
  const boardId = await params.boardId;
  const { board, posts } = await getData(boardId);

  return (
    <main className="bg-base-200 min-h-screen">
      <section className="bg-base-100">
        <div className="max-w-5xl mx-auto px-5 py-3 flex">
          <Link href="/" className="btn">
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
      <section className="max-w-5xl mx-auto p-5">
        <h1 className="text-lg font-bold">{board.name} (public)</h1>
      </section>
      <section className="max-w-5xl mx-auto px-5 py-12 flex flex-col [665px]:flex-row [665px]:justify-between gap-8">
        <FormAddPost boardId={boardId} />
        {posts.length > 0 ? (
          <ul className="space-y-5 w-full [665px]:w-auto flex-grow">
            {posts.map((post) => (
              <CardPost key={post._id.toString()} post={post} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 w-full [665px]:w-auto flex-grow">
            No posts yet. Be the first to add one!
          </p>
        )}
      </section>
    </main>
  );
}
