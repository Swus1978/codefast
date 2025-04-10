"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Success page loaded, sessionId:", sessionId);

    if (!sessionId) {
      console.error("No session ID found in URL");
      toast.error("No session ID found");
      router.push("/dashboard");
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log("Verifying payment with sessionId:", sessionId);
        const response = await axios.post("/api/billing/verify-checkout", {
          sessionId,
        });
        console.log("Verify response:", response.data);

        if (response.data.success) {
          toast.success("Payment verified!");
          router.push("/dashboard");
        } else {
          throw new Error(response.data.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error.message);
        toast.error(error.message || "Failed to verify payment");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return (
    <main className="bg-base-200 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-extrabold text-2xl mb-4">
          {loading ? "Verifying Payment..." : "Payment Successful!"}
        </h1>
        <p>{loading ? "Please wait..." : "Redirecting to dashboard..."}</p>
      </div>
    </main>
  );
}
