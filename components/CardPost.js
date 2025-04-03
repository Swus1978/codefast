"use client";

import ButtonVote from "./ButtonVote";

const CardPost = ({ post }) => {
  return (
    <li className="bg-base-100 rounded-3xl p-6 flex justify-between items-start">
      <div>
        <div className="font-bold mb-1">{post.title}</div>
        <div className="opacity-80 leading-relaxed">{post.description}</div>
      </div>
      <div className="flex gap-2">
        <ButtonVote
          postId={post._id.toString()}
          initialUpvoted={false}
          initialDownvoted={false}
          initialUpvotes={post.upvotes || 0}
          initialDownvotes={post.downvotes || 0}
        />
      </div>
    </li>
  );
};

export default CardPost;
