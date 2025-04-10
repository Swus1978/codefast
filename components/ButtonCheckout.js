"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ButtonCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await axios.post("/api/billing/create-checkout", {
        successUrl: `${window.location.origin}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
      });
      console.log("Stripe response:", response.data);

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe checkout
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "Subscribe"
      )}
    </button>
  );
}
