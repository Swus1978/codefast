// libs/mongoose.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

let cachedConnection = global.mongoose || { conn: null, promise: null };
global.mongoose = cachedConnection;

async function connectMongo() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        connectTimeoutMS: 5000, // Fail after 5s
        serverSelectionTimeoutMS: 5000, // Faster server selection
        ssl: true,
        tlsAllowInvalidCertificates: false,
      })
      .catch((err) => {
        cachedConnection.promise = null;
        throw err;
      });
  }

  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

export default connectMongo;
