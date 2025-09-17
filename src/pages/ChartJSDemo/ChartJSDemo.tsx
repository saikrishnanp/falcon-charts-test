import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import { countBy, COLORS } from "../utils";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
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
                position: "bottom",
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
              legend: { position: "bottom" },
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
              legend: { position: "bottom", },
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
    </div>
  );
}
