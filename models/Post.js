
// a model for a Post document in the database. Each post has a title, description, a boardId to which it belongs, and a userId (optional) of the user who created it (if logged in). The boardId and userId fields are references to the Board and User models, respectively.

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(