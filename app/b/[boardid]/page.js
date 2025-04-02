import Link from "next/link";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";
import Post from "@/models/Post"; // Import Post model
import FormAddPost from "@/components/FormAddPost";
import CardPost from "@/components/CardPost"; // Import CardPost
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
  // eslint-disable-next-line @next/next/no-sync-dynamic-apis
  const boardId = await params.boardId;

  const { board, posts } = await getData(boardId);

  return (
    <main className="bg-base-200 min-h-screen">
      <section className="max-w-5xl mx-auto p-5">
        <h1 className="text-lg font-bold"> {board.name}</h1>
      </section>
      <section className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row gap-8 pd-12">
        <FormAddPost boardId={boardId} />
        {posts.length > 0 && (
          <ul className="space-y-4 flex-grow">
            {posts.map((post) => (
              <li key={post._id.toString()}>
                <CardPost post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
