"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const CardPostAdmin = ({ post }) => {
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
    <li className="bg-base-100 p-6 rounded-3xl ">
      <div className="font-bold mb-1">{post.title}</div>
      <div className="opacity-80 leading-relaxed max-h-32 overflow-scroll">
        {post.description}
      </div>
      <button
        className="btn btn-slate-100 mt-2"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Delete"
        )}
      </button>
    </li>
  );
};

export default CardPostAdmin;
