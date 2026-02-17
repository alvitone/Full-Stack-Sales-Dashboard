import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dashboard", dashboardRoutes);


app.get("/", (req, res) => {
  res.send("Sales Dashboard API Running");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
