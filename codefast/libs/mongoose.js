// libs/mongoose.js
import mongoose from "mongoose";

// Function to connect to MongoDB using Mongoose
const connectMongo = async () => {
  // Avoid duplicate connections (i.e., when in development mode)
  if (mongoose.connections[0].readyState) {
    return;
  }

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Ensures more stable connections
  });
};

if (typeof window !== "undefined") {
  throw new Error("MongoDB client should only be used on the server");
}

// Validate the MongoDB URI
if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
}

export default connectMongo;
