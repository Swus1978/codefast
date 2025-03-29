import { MongoClient, ServerApiVersion } from "mongodb";

// Validate environment variable
if (!process.env.MONGO_URI) {
  throw new Error("Invalid/Missing environment variable: 'MONGO_URI'");
}

const uri = process.env.MONGO_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

// Use a global variable to cache the MongoDB client in development mode
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, reuse the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
