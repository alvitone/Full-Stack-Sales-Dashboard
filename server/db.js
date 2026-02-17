import { MongoClient } from "mongodb";

let db;

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  console.log(uri)

  // const uri = "mongodb://127.0.0.1:27017";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    db = client.db("sales_dashboard");
    console.log("MongoDB connected locally");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
}

export function getDB() {
  return db;
}
