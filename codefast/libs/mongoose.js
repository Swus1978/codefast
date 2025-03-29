import clientPromise from "@/libs/mongoose"; // Import client promise from mongoose.js

export default async function handler(req, res) {
  try {
    // Wait for the MongoDB client to connect
    const client = await clientPromise;

    // Get the MongoDB database (use your actual database name here)
    const db = client.db(); // Assuming default database; you can specify a database if needed

    // Perform any MongoDB operation, here we fetch from a collection
    const data = await db.collection("yourCollection").find().toArray();

    // Return the data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    // Handle any errors that occur during the connection or query
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
}
