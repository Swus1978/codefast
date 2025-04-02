// libs/mongoose.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is not defined");

let cachedConnection = global.mongoose || { conn: null, promise: null };
global.mongoose = cachedConnection;

async function connectMongo() {
  if (cachedConnection.conn) return cachedConnection.conn;
  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }
  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

export default connectMongo;
