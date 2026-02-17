import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const db = getDB();
    const range = parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const totalLeads = await db.collection("leads")
      .countDocuments({ createdAt: { $gte: startDate } });

    const contactedLeads = await db.collection("leads")
      .countDocuments({
        createdAt: { $gte: startDate },
        status: "Contacted"
      });

    const salesClosed = await db.collection("leads")
      .countDocuments({
        createdAt: { $gte: startDate },
        status: "Converted"
      });

    const revenueResult = await db.collection("leads").aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "Converted"
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" }
        }
      }
    ]).toArray();

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      totalLeads,
      contactedLeads,
      salesClosed,
      totalRevenue
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/status-summary", async (req, res) => {
  try {
    const db = getDB();
    const range = parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const result = await db.collection("leads").aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Ensure all statuses exist even if count is 0
    const allStatuses = [
      "New",
      "Contacted",
      "Follow Up",
      "Appointment Booked",
      "Converted",
      "Lost"
    ];

    const formatted = allStatuses.map(status => {
      const found = result.find(r => r._id === status);
      return {
        status,
        count: found ? found.count : 0
      };
    });

    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/revenue-trend", async (req, res) => {
  try {
    const db = getDB();
    const range = parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

    const rawData = await db.collection("leads").aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "Converted"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Convert to map for easier lookup
    const revenueMap = {};
    rawData.forEach(item => {
      revenueMap[item._id] = item.revenue;
    });

    // Fill missing dates
    const result = [];
    for (let i = range; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const formattedDate = date.toISOString().split("T")[0];

      result.push({
        date: formattedDate,
        revenue: revenueMap[formattedDate] || 0
      });
    }

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});



export default router;
