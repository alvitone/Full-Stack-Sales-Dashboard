import { MongoClient } from "mongodb";

  const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const statuses = [
  "New",
  "Contacted",
  "Follow Up",
  "Appointment Booked",
  "Converted",
  "Lost"
];

function randomStatus() {
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function randomRevenue(status) {
  if (status === "Converted") {
    return Math.floor(Math.random() * 5000) + 1000;
  }
  return 0;
}

async function seedData() {
  try {
    await client.connect();
    const db = client.db("sales_dashboard");
    const collection = db.collection("leads");

    await collection.deleteMany({});

    const leads = [];

    for (let i = 0; i < 200; i++) {
      const status = randomStatus();

      const randomDaysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - randomDaysAgo);

      leads.push({
        name: `Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        status,
        revenue: randomRevenue(status),
        createdAt
      });
    }

    await collection.insertMany(leads);

    console.log("Seed data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedData();
