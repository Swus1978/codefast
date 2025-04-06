// app/api/auth/[...nextauth]/route.js
import { handlers } from "@/app/auth";

console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);

export const { GET, POST } = handlers;
