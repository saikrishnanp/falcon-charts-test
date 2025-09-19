import { Pie, Bar, Doughnut, Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  BarElement,
} from "chart.js";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import stackedBarData from "../../../data/revenue_details.json";
import utilizationData from "../../../data/utilization_data.json";
import { countBy, COLORS, STACK_COLORS, stackedKeys } from "../utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

// Pie: User Privilege Distribution
const privilegeDataRaw = Object.entries(countBy(users, "privilege"));
const privilegeData = {
  labels: privilegeDataRaw.map(([name]) => name),
  datasets: [
    {
      data: privilegeDataRaw.map(([, value]) => value),
      backgroundColor: COLORS,
    },
  ],
};

// Bar: Average Allocation Percentage by Role
const roleGroups = allocations.reduce(
  (acc: { [role: string]: number[] }, alloc) => {
    if (!alloc.role) return acc;
    acc[alloc.role] = acc[alloc.role] || [];
    acc[alloc.role].push(alloc.allocation_percentage);
    return acc;
  },
  {}
);
const avgAllocByRoleRaw = Object.entries(roleGroups).map(([role, arr]) => ({
  role,
  avgAllocation: Number(
    (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
  ),
}));
const avgAllocByRole = {
  labels: avgAllocByRoleRaw.map((d) => d.role),
  datasets: [
    {
      label: "Avg Allocation %",
      data: avgAllocByRoleRaw.map((d) => d.avgAllocation),
      backgroundColor: "#8884d8",
    },
  ],
};

// Pie: Billability Breakdown
const billabilityDataRaw = Object.entries(countBy(allocations, "billability"));
const billabilityData = {
  labels: billabilityDataRaw.map(([name]) => name),
  datasets: [
    {
      data: billabilityDataRaw.map(([, value]) => value),
      backgroundColor: COLORS,
    },
  ],
};

// Bar: Engineer Category Distribution
const categoryDataRaw = engineerCategories.map((cat) => ({
  category: cat.category,
  count: Math.floor(Math.random() * 10) + 1,
}));
const categoryData = {
  labels: categoryDataRaw.map((d) => d.category),
  datasets: [
    {
      label: "Count",
      data: categoryDataRaw.map((d) => d.count),
      backgroundColor: "#00C49F",
    },
  ],
};

// Pie: Work Location Distribution
const locationDataRaw = workLocations.map((loc) => ({
  name: loc.location,
  value: Math.floor(Math.random() * 10) + 1,
}));
const locationData = {
  labels: locationDataRaw.map((d) => d.name),
  datasets: [
    {
      data: locationDataRaw.map((d) => d.value),
      backgroundColor: COLORS,
    },
  ],
};

// Stacked bar chart: Revenue Details
const chartData = {
  labels: stackedBarData.map((d) => d.month),
  datasets: stackedKeys.map((key, i) => ({
    label:
      key === "revenue"
        ? "Revenue($)"
        : key === "activePO"
        ? "Active PO"
        : key === "committed"
        ? "Committed"
        : key === "bestCase"
        ? "Best Case"
        : key === "qualified50"
        ? "Qualified Pipeline >= 50%"
        : key === "qualifiedBelow50"
        ? "Qualified Pipeline < 50%"
        : "Other Pipeline",
    data: stackedBarData.map((d) => d[key as keyof typeof d] || 0),
    backgroundColor: STACK_COLORS[i],
    stack: "stack1",
    borderWidth: 1,
  })),
};

const chartOptions = {
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#1976d2",
        font: { size: 12 },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      ticks: { color: "#1976d2" },
      title: { display: true, text: "Month", color: "#1976d2" },
    },
    y: {
      stacked: true,
      ticks: { color: "#1976d2" },
      title: { display: true, text: "Value", color: "#1976d2" },
    },
  },
};

const utilizationChartData = {
  labels: utilizationData.map((d) => d.month),
  datasets: [
    {
      type: "bar" as const,
      label: "Revenue",
      data: utilizationData.map((d) => d.revenue),
      backgroundColor: "#82b1ff",
      yAxisID: "y",
      order: 2,
    },
    {
      type: "bar" as const,
      label: "Capacity",
      data: utilizationData.map((d) => d.capacity),
      backgroundColor: "#69f0ae",
      yAxisID: "y",
      order: 2,
    },
    {
      type: "line" as const,
      label: "Utilization (%)",
      data: utilizationData.map((d) => d.utilization),
      borderColor: "#ffe082",
      backgroundColor: "#ffe082",
      yAxisID: "y1",
      tension: 0.3,
      fill: false,
      pointRadius: 0,
      order: 1,
    },
    {
      type: "line" as const,
      label: "Utilization Forecast (%)",
      data: utilizationData.map((d) => d.forecast),
      borderColor: "#ff8a80",
      backgroundColor: "#ff8a80",
      yAxisID: "y1",
      tension: 0.3,
      fill: false,
      pointRadius: 0,
      order: 1,
    },
    {
      type: "line" as const,
      label: "Average Utilization (%)",
      data: utilizationData.map((d) => d.avgUtilization),
      borderColor: "#FFD700",
      backgroundColor: "#FFD700",
      yAxisID: "y1",
      tension: 0.3,
      fill: false,
      pointRadius: 0,
      order: 1,
    },
  ],
};

export default function ChartJSDemo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <div style={{ width: 350, height: 250 }}>
        <h3>User Privilege Distribution</h3>
        <Doughnut
          data={privilegeData}
          options={{
            plugins: {
              legend: {
                position: "bottom" as const,
              },
            },
          }}
        />
      </div>
      <div style={{ width: 450, height: 250 }}>
        <h3>Average Allocation % by Role</h3>
        <Bar
          data={avgAllocByRole}
          options={{
            indexAxis: "x",
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" as const },
            },
            scales: {
              x: {
                ticks: { color: "#1976d2" }, // X axis label color
                title: { color: "#1976d2" }, // X axis title color (if used)
              },
              y: {
                ticks: { color: "#1976d2" }, // Y axis label color
                title: { color: "#1976d2" }, // Y axis title color (if used)
              },
            },
          }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Billability Breakdown</h3>
        <Pie
          data={billabilityData}
          options={{
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
      <div style={{ width: 450, height: 250 }}>
        <h3>Engineer Category Distribution</h3>
        <Bar
          data={categoryData}
          options={{
            indexAxis: "x",
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" as const },
            },
            scales: {
              x: {
                ticks: { color: "#8179eeff" }, // X axis label color
                title: { color: "#c959f5ff" }, // X axis title color (if used)
              },
              y: {
                ticks: { color: "#f1f8ffff" }, // Y axis label color
                title: { color: "#f8f8f8ff" }, // Y axis title color (if used)
              },
            },
          }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Work Location Distribution</h3>
        <Pie
          data={locationData}
          options={{
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
      <div style={{ width: 750, height: 250 }}>
        <h3>Revenue details</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div style={{ width: 900, height: 400, marginTop: 50 }}>
        <h3>Utilization details</h3>
        <Chart
          type="bar"
          data={utilizationChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#1976d2",
                  font: { size: 12 },
                },
              },
              tooltip: {
                enabled: true,
              },
            },
            scales: {
              x: {
                ticks: { color: "#1976d2" },
                title: { display: true, text: "Month", color: "#1976d2" },
              },
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Sum of Utilization Revenue and Capacity",
                  color: "#1976d2",
                },
                ticks: {
                  color: "#1976d2",
                  callback: (value) => `${Number(value) / 1000}k`,
                },
                grid: { color: "#eee" },
              },
              y1: {
                type: "linear",
                position: "right",
                title: {
                  display: true,
                  text: "Utilization (%)",
                  color: "#6200ffff",
                },
                min: 10,
                max: 110,
                ticks: { color: "#6200ffff" },
                grid: { drawOnChartArea: false },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
