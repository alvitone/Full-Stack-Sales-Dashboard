📊 Sales Dashboard – Full Stack 
Overview

This project is a full-stack Sales Dashboard built to provide internal business insights into lead and revenue performance.

It displays:

KPI summary metrics

Lead status distribution

Revenue trend over time

Date range filtering (Last 7 Days / Last 30 Days)

The system is built with a clear separation between frontend and backend and focuses on correct data aggregation and API integration.

🔧 Tech Stack
Frontend

Vue 3 (Vite)

Axios

Chart.js

CSS (Responsive layout)

Backend

Node.js

Express.js

MongoDB Atlas

MongoDB Native Driver (No Mongoose)

Deployment

Backend: Render

Frontend: Vercel

🏗 Architecture & Design Decisions
1️⃣ Backend Responsibilities

The backend:

Stores lead and sales data in MongoDB

Aggregates data using MongoDB aggregation pipelines

Exposes REST APIs for dashboard consumption

Applies date filtering at query level

All heavy computation (grouping, counting, summing revenue) is done server-side to keep frontend logic simple and clean.

2️⃣ Data Aggregation Strategy

MongoDB aggregation is used to:

Count total leads

Count leads by status

Calculate total revenue

Group revenue by date for trend chart

Example operations used:

$match for date filtering

$group for aggregation

$sum for revenue calculation

$count for totals

This ensures the frontend receives structured, ready-to-render JSON.

3️⃣ Frontend Responsibilities

The frontend:

Fetches dashboard data from APIs

Displays KPI cards

Renders line chart (Revenue Trend)

Renders pie chart (Lead Status Distribution)

Handles date range filter

Shows loading indicators during API calls

Displays proper empty states

The UI is responsive and optimized for 1366×768 and above.

📡 API Endpoints
KPI Summary
GET /api/dashboard/summary?range=7


Returns:

{
  "totalLeads": 120,
  "contactedLeads": 50,
  "salesClosed": 30,
  "totalRevenue": 180000
}

Lead Status Summary
GET /api/dashboard/status-summary?range=7


Returns:

[
  { "status": "New", "count": 20 },
  { "status": "Contacted", "count": 50 }
]

Revenue Trend
GET /api/dashboard/revenue-trend?range=7


Returns:

[
  { "date": "2025-02-10", "revenue": 15000 },
  { "date": "2025-02-11", "revenue": 18000 }
]

🚀 Local Setup Instructions
Backend
cd server
npm install


Create .env file:

MONGO_URI=your_mongodb_connection_string


Run:

node server.js

Frontend
cd client
npm install
npm run dev

🌍 Live Deployment

Frontend:

https://salesdashboard-one-neon.vercel.app/

Backend:

https://sales-dashboard-api-p5n5.onrender.com

📈 Data

Dummy business data was generated to simulate:

Multiple lead statuses

Realistic revenue distribution

Multi-day sales trends

This ensures charts and KPIs display meaningful insights.

<img width="1904" height="789" alt="image" src="https://github.com/user-attachments/assets/1da96ff2-ff91-4cab-81a6-e661d5bae6e7" />

<img width="1892" height="978" alt="image" src="https://github.com/user-attachments/assets/2ab6cae4-9261-4f50-8420-50e8d44a273f" />
