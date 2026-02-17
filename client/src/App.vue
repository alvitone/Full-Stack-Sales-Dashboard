<script setup>
import { ref, onMounted, watch } from "vue"
import axios from "axios"
import { Line, Doughnut } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from "chart.js"

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale
)

const summary = ref(null)
const statusSummary = ref([])
const revenueTrend = ref([])
const range = ref(7)
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const summaryRes = await axios.get(
      `http://localhost:5000/api/dashboard/summary?range=${range.value}`
    )
    summary.value = summaryRes.data

    const statusRes = await axios.get(
      `http://localhost:5000/api/dashboard/status-summary?range=${range.value}`
    )
    statusSummary.value = statusRes.data

    const revenueRes = await axios.get(
      `http://localhost:5000/api/dashboard/revenue-trend?range=${range.value}`
    )
    revenueTrend.value = revenueRes.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
watch(range, fetchData)

const lineData = ref({ labels: [], datasets: [] })
const donutData = ref({ labels: [], datasets: [] })

watch(revenueTrend, () => {
  lineData.value = {
    labels: revenueTrend.value.map(d => d.date),
    datasets: [
      {
        label: "Revenue",
        data: revenueTrend.value.map(d => d.revenue),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.4
      }
    ]
  }
})

watch(statusSummary, () => {
  donutData.value = {
    labels: statusSummary.value.map(d => d.status),
    datasets: [
      {
        data: statusSummary.value.map(d => d.count),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f59e0b",
          "#a855f7",
          "#06b6d4",
          "#ef4444"
        ]
      }
    ]
  }
})
</script>

<template>
  <div class="dashboard">

    <!-- Header -->
    <div class="header">
      <h1>Sales Dashboard</h1>

      <select v-model="range" class="range-select">
        <option :value="7">Last 7 Days</option>
        <option :value="30">Last 30 Days</option>
      </select>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading dashboard...</p>
    </div>

    <!-- KPI Cards -->
    <div v-if="summary" class="kpi-grid">
      <div class="card">
        <h3>Total Leads</h3>
        <p>{{ summary.totalLeads }}</p>
      </div>
      <div class="card">
        <h3>Contacted Leads</h3>
        <p>{{ summary.contactedLeads }}</p>
      </div>
      <div class="card">
        <h3>Sales Closed</h3>
        <p>{{ summary.salesClosed }}</p>
      </div>
      <div class="card">
        <h3>Total Revenue</h3>
        <p>₹ {{ summary.totalRevenue.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <div class="chart-large">
        <h2>Revenue Trend</h2>
        <Line :data="lineData" />
      </div>

      <div class="chart-small">
        <h2>Status Distribution</h2>
        <Doughnut :data="donutData" />
      </div>
    </div>

    <!-- Status Table -->
    <div class="table-section">
      <h2>Lead Status Summary</h2>

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in statusSummary" :key="item.status">
            <td>{{ item.status }}</td>
            <td>{{ item.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style>
/* Global */
body {
  margin: 0;
  background: linear-gradient(135deg, #e0f2ff, #f0f9ff);
  font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Main Container */
.dashboard {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
  box-sizing: border-box;
  position: relative;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
}

.range-select {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 14px;
}

/* KPI Section */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.card h3 {
  margin: 0 0 10px;
  font-size: 13px;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.5px;
}

.card p {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
}

/* Charts Section */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  margin-bottom: 40px;
}

.chart-large,
.chart-small {
  background: white;
  padding: 30px;
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.chart-large h2,
.chart-small h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

/* Table Section */
.table-section {
  background: white;
  padding: 30px;
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
}

.table-section h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 18px;
  text-align: left;
}

th {
  background: #f1f5f9;
  font-weight: 600;
  font-size: 14px;
  color: #334155;
}

td {
  font-size: 14px;
  color: #1e293b;
}

tr:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #bfdbfe;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .dashboard {
    padding: 30px 16px;
  }
}

</style>
