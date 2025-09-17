import ReactECharts from "echarts-for-react";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import { countBy, COLORS } from "../utils";

// Pie: User Privilege Distribution
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([name, value]) => ({ value, name })
);

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
const avgAllocByRole = Object.entries(roleGroups).map(([role, arr]) => ({
  role,
  avgAllocation: Number(
    (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
  ),
}));

// Pie: Billability Breakdown
const billabilityData = Object.entries(countBy(allocations, "billability")).map(
  ([name, value]) => ({ value, name })
);

// Bar: Engineer Category Distribution
const categoryData = engineerCategories.map((cat) => ({
  category: cat.category,
  count: Math.floor(Math.random() * 10) + 1,
}));

// Pie: Work Location Distribution
const locationData = workLocations.map((loc) => ({
  value: Math.floor(Math.random() * 10) + 1,
  name: loc.location,
}));

export default function EChartsDemo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <div style={{ width: 350, height: 250 }}>
        <h3>User Privilege Distribution</h3>
        <ReactECharts
          style={{ height: 200 }}
          option={{
            color: COLORS,
            legend: { bottom: 0 },
            tooltip: {},
            series: [
              {
                type: "pie",
                radius: ["20%", "80%"], // donut
                data: privilegeData,
                label: { show: true, fontSize: 12 },
              },
            ],
          }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Average Allocation % by Role</h3>
        <ReactECharts
          style={{ height: 200 }}
          option={{
            color: ["#8884d8"],
            legend: { bottom: 0 },
            tooltip: {},
            xAxis: {
              type: "category",
              data: avgAllocByRole.map((d) => d.role),
              axisLabel: { color: "#1976d2" },
            },
            yAxis: {
              type: "value",
              axisLabel: { color: "#1976d2" },
            },
            series: [
              {
                type: "bar",
                data: avgAllocByRole.map((d) => d.avgAllocation),
                label: { show: true, position: "top" },
              },
            ],
          }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Billability Breakdown</h3>
        <ReactECharts
          style={{ height: 200 }}
          option={{
            color: COLORS,
            legend: {
              bottom: 0,
              textStyle: {
                color: "#1976d2", // <-- legend label color
                fontSize: 14, // optional: legend font size
              },
            },
            tooltip: {},
            series: [
              {
                type: "pie",
                radius: ["0%", "80%"],
                data: billabilityData,
                label: { show: true, fontSize: 12, color: "#1976d2" },
              },
            ],
          }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Engineer Category Distribution</h3>
        <ReactECharts
          style={{ height: 200 }}
          option={{
            color: ["#00C49F"],
            legend: { bottom: 0 },
            tooltip: {},
            xAxis: {
              type: "category",
              data: categoryData.map((d) => d.category),
              axisLabel: { color: "#1976d2" },
            },
            yAxis: {
              type: "value",
              axisLabel: { color: "#1976d2" },
            },
            series: [
              {
                type: "bar",
                data: categoryData.map((d) => d.count),
                label: { show: true, position: "top" },
              },
            ],
          }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Work Location Distribution</h3>
        <ReactECharts
          style={{ height: 200 }}
          option={{
            color: COLORS,
            legend: {
              bottom: 0,
              textStyle: {
                color: "#1976d2", // <-- legend label color
                fontSize: 14, // optional: legend font size
              },
            },
            tooltip: {},
            series: [
              {
                type: "pie",
                radius: ["0%", "80%"],
                data: locationData,
                label: { show: true, fontSize: 12, color: "#1976d2" },
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
