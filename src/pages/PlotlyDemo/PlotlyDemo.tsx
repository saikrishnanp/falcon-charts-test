import Plot from "react-plotly.js";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import stackedBarData from "../../../data/revenue_details.json";
import utilizationData from "../../../data/utilization_data.json";
import { countBy, COLORS, STACK_COLORS, METRIC_COLORS } from "../utils";

// Pie: User Privilege Distribution
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([name, value]) => ({ name, value })
);

// Bar: Average Allocation % by Role
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
  avgAllocation: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
}));

// Pie: Billability Breakdown
const billabilityData = Object.entries(countBy(allocations, "billability")).map(
  ([name, value]) => ({ name, value })
);

// Bar: Engineer Category Distribution
const categoryData = engineerCategories.map((cat) => ({
  category: cat.category,
  count: Math.floor(Math.random() * 10) + 1, // mock count
}));

const PlotlyDemo = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      {/* User Privilege Distribution */}
      <div>
        <h3>User Privilege Distribution</h3>
        <Plot
          data={[
            {
              type: "pie",
              labels: privilegeData.map((d) => d.name),
              values: privilegeData.map((d) => d.value),
              hole: 0.4,
              marker: { colors: COLORS },
            },
          ]}
          layout={{ width: 300, height: 250, legend: { orientation: "h" } }}
        />
      </div>

      {/* Average Allocation % by Role */}
      <div>
        <h3>Average Allocation % by Role</h3>
        <Plot
          data={[
            {
              type: "bar",
              x: avgAllocByRole.map((d) => d.role),
              y: avgAllocByRole.map((d) => Number(d.avgAllocation)),
              marker: { color: "#bc58ebff" },
            },
          ]}
          layout={{
            width: 350,
            height: 250,
            xaxis: { title: { text: "Role" } },
            yaxis: { title: { text: "Avg Allocation %" } },
          }}
        />
      </div>

      {/* Billability Breakdown */}
      <div>
        <h3>Billability Breakdown</h3>
        <Plot
          data={[
            {
              type: "pie",
              labels: billabilityData.map((d) => d.name),
              values: billabilityData.map((d) => d.value),
              marker: { colors: COLORS },
            },
          ]}
          layout={{ width: 300, height: 250, legend: { orientation: "h" } }}
        />
      </div>

      {/* Engineer Category Distribution */}
      <div>
        <h3>Engineer Category Distribution</h3>
        <Plot
          data={[
            {
              type: "bar",
              x: categoryData.map((d) => d.category),
              y: categoryData.map((d) => d.count),
              marker: { color: "#00C49F" },
            },
          ]}
          layout={{ width: 350, height: 250, xaxis: { tickangle: -45 } }}
        />
      </div>

      {/* Revenue Details */}
      <div>
        <h3>Revenue Details</h3>
        <Plot
          data={[
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.revenue),
              name: "Revenue($)",
              marker: { color: STACK_COLORS[0] },
            },
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.activePO),
              name: "Active PO",
              marker: { color: STACK_COLORS[1] },
            },
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.committed),
              name: "Committed",
              marker: { color: STACK_COLORS[2] },
            },
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.bestCase),
              name: "Best Case",
              marker: { color: STACK_COLORS[3] },
            },
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.qualified50),
              name: "Qualified >= 50%",
              marker: { color: STACK_COLORS[4] },
            },
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.qualifiedBelow50),
              name: "Qualified < 50%",
              marker: { color: STACK_COLORS[5] },
            },
            {
              type: "bar",
              x: stackedBarData.map((d) => d.month),
              y: stackedBarData.map((d) => d.other),
              name: "Other Pipeline",
              marker: { color: STACK_COLORS[6] },
            },
          ]}
          layout={{
            barmode: "stack",
            width: 800,
            height: 300,
            xaxis: { title: { text: "Month" } },
            yaxis: { title: { text: "Value" } },
          }}
        />
      </div>

      {/* Utilization Details */}
      <div>
        <h3>Utilization Details</h3>
        <Plot
          data={[
            {
              type: "bar",
              x: utilizationData.map((d) => d.month),
              y: utilizationData.map((d) => d.revenue),
              name: "Utilization Revenue",
              marker: { color: METRIC_COLORS.revenue },
              yaxis: "y1",
            },
            {
              type: "bar",
              x: utilizationData.map((d) => d.month),
              y: utilizationData.map((d) => d.capacity),
              name: "Utilization Capacity",
              marker: { color: METRIC_COLORS.capacity },
              yaxis: "y1",
            },
            {
              type: "scatter",
              mode: "gauge",
              x: utilizationData.map((d) => d.month),
              y: utilizationData.map((d) => d.utilization),
              name: "Utilization (%)",
              line: { color: METRIC_COLORS.utilization, width: 2 },
              yaxis: "y2",
            },
            {
              type: "scatter",
              mode: "lines+markers",
              x: utilizationData.map((d) => d.month),
              y: utilizationData.map((d) => d.forecast),
              name: "Forecast (%)",
              line: { color: METRIC_COLORS.forecast, width: 2 },
              yaxis: "y2",
            },
            {
              type: "scatter",
              mode: "lines",
              x: utilizationData.map((d) => d.month),
              y: utilizationData.map((d) => d.avgUtilization),
              name: "Avg Utilization (%)",
              line: { color: METRIC_COLORS.avgUtilization, width: 2 },
              yaxis: "y2",
            },
          ]}
          layout={{
            width: 900,
            height: 400,
            barmode: "group",
            xaxis: { title: { text: "Month" } },
            yaxis: {
              title: { text: "Revenue & Capacity" },
              side: "left",
              tickformat: "~s",
            },
            yaxis2: {
              title: { text: "Utilization (%)" },
              overlaying: "y",
              side: "right",
              range: [0, 120],
            },
            legend: { orientation: "h" },
          }}
        />
      </div>
    </div>
  );
};

export default PlotlyDemo;
