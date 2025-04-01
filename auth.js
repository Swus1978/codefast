import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";

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
  adapter: {
    ...(await import("@auth/mongodb-adapter")).MongoDBAdapter(
      (await import("./libs/mongo")).default
    ),
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  trustHost: true, // Explicitly trust localhost
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);
