"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const CardPost = ({ post }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/post?postId=${post._id}`);
      toast.success("Post deleted successfully");
      router.refresh(); // Refresh the page to update the post list
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to delete post";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="bg-base-100 rounded-3xl p-6 flex justify-between items-center">
      <div>
        <div className="font-bold mb-1">{post.title}</div>
        <div className="opacity-80 leading-relaxed">{post.description}</div>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-square">⏫</button>
        <button
          className="btn btn-square btn-error"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "🗑️"
          )}
        </button>
      </div>
    </li>
  );
};

export default CardPost;
