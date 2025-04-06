// models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    value: {
      type: Number,
      required: true,
      enum: [1, -1], // 1 for upvote, -1 for downvote
    },
  },
  { timestamps: true }
);

// Ensure a user can only vote once per post
voteSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
