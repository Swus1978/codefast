// app/api/update-access/route.js
import { auth } from "@/app/auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function POST() {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectMongo();
  await User.findByIdAndUpdate(session.user.id, {
    hasAccess: true,
  });

  return new Response("Access updated", { status: 200 });
}
