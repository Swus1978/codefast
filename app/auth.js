import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";

console.log("process.env.RESEND_KEY", process.env.RESEND_KEY);

const config = {
  providers: [
    Resend({
      apiKey: process.env.RESEND_KEY,
      from: "noreply@resend.swustech.com",
      name: "Email",
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
};

// Default export for Next.js API route
const handler = NextAuth(config);

// If you're relying on your custom handlers, we can export them here
export { handler as GET, handler as POST };

// Custom signIn and signOut logic if needed
export const { signIn, signOut, auth, handlers } = NextAuth(config);
