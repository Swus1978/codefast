"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const FormNewBoard = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    console.log("Submitting form with name:", name);

    try {
      const response = await axios.post("/api/board", { name });
      console.log("API response:", response.data);
      const { board } = response.data;
      setName("");
      toast.success("Board created successfully");
      router.push(`/dashboard/b/${board._id}`);
      console.log("Navigating to:", `/dashboard/b/${board._id}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again.";
      console.error("Error creating board:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Create a new feedback board</p>
      <label className="form-control w-full">
        <span className="label-text">Board Name</span>
        <input
          required
          type="text"
          className="input input-bordered w-full"
          placeholder="Type here"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button
        className="btn btn-primary w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        Create Board
      </button>
    </form>
  );
};

export default FormNewBoard;
