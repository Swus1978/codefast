"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const ButtonVote = ({
  postId,
  initialUpvoted = false,
  initialDownvoted = false,
  initialUpvotes = 0,
  initialDownvotes = 0,
}) => {
  const router = useRouter();
  const [upvoted, setUpvoted] = useState(initialUpvoted);
  const [downvoted, setDownvoted] = useState(initialDownvoted);
  const [isLoading, setIsLoading] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes);
  const [downvoteCount, setDownvoteCount] = useState(initialDownvotes);

  const handleUpvote = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`/api/vote?postId=${postId}`);
      setUpvoteCount(response.data.upvotes);
      setDownvoteCount(response.data.downvotes);
      setUpvoted(response.data.upvoted);
      setDownvoted(response.data.downvoted);
      toast.success(response.data.message);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to update vote";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/vote?postId=${postId}`);
      setUpvoteCount(response.data.upvotes);
      setDownvoteCount(response.data.downvotes);
      setUpvoted(response.data.upvoted);
      setDownvoted(response.data.downvoted);
      toast.success(response.data.message);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to update vote";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={`group border px-4 py-2 text-lg flex flex-col items-center gap-1 rounded-xl transition-all duration-200 ${
          upvoted
            ? "bg-primary text-primary-content border-transparent"
            : "bg-base-100 text-base-content hover:border-base-content/25 hover:bg-base-200"
        }`}
        onClick={handleUpvote}
      >
        {isLoading && !downvoted ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-6 transition-transform  group-hover:text-primary group-hover:-translate-y-0.5 duration-200"
            >
              <path
                fillRule="evenodd"
                d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm group-hover:text-primary">
              {upvoteCount}
            </span>
          </>
        )}
      </button>
      <button
        className={`group border px-4 py-2 flex flex-col text-lg items-center gap-1 rounded-xl transition-all duration-200 ${
          downvoted
            ? "bg-error text-error-content border-transparent"
            : "bg-base-100 text-base-content hover:border-base-content/25 hover:bg-base-200"
        }`}
        onClick={handleDownvote}
      >
        {isLoading && !upvoted ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <>
            <span className="text-sm group-hover:text-primary">
              {downvoteCount}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-6 transition-transform group-hover:translate-y-0.5  group-hover:text-primary duration-200"
            >
              <path
                fillRule="evenodd"
                d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 0 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default ButtonVote;
