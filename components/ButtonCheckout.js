"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ButtonCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (isLoading) return;

    console.log("Subscribe clicked");
    setIsLoading(true);
    try {
      const response = await axios.post("/api/billing/create-checkout", {
        successUrl: `${window.location.origin}/dashboard/success`,
        cancelUrl: window.location.href,
      });
      console.log("Stripe response:", response.data);
      const redirectUrl = response.data.url;
      if (!redirectUrl) throw new Error("No redirect URL in response");
      console.log("Redirecting to:", redirectUrl);
      window.location.href = redirectUrl; // Should redirect here
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Something went wrong";
      console.error("Checkout error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleSubscribe}>
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "Subscribe"
      )}
    </button>
  );
};

export default ButtonCheckout;
