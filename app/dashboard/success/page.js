"use client";
import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    const testCreatePortal = async () => {
      try {
        const res = await fetch("/api/billing/create-portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            returnUrl: "http://localhost:3000/dashboard", // change if you're deployed
          }),
        });

        const data = await res.json();
        console.log("Stripe Portal Response:", data);

        if (data.url) {
          // Redirect to portal if available
          window.location.href = data.url;
        } else {
          console.warn("No URL returned from portal creation");
        }
      } catch (err) {
        console.error("Failed to create portal session:", err);
      }
    };

    testCreatePortal();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Processing your subscription...</p>
    </main>
  );
}
