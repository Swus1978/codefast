import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongo";

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
  debug: process.env.NODE_ENV === "development", // Keep this one
  trustHost: true, // For Vercel
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard"; // Ensure redirect works post-login
    },
  },
};

// Default export for Next.js API route
const handler = NextAuth(config);

export { handler as GET, handler as POST };

// Optional: Export custom helpers if used elsewhere
export const { signIn, signOut, auth, handlers } = NextAuth(config);
