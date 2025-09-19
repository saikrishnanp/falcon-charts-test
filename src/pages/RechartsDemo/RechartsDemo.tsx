import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import stackedBarData from "../../../data/revenue_details.json";
import utilizationData from "../../../data/utilization_data.json";
import { countBy, COLORS, STACK_COLORS, METRIC_COLORS } from "../utils";

// Pie: User Privilege Distribution
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([name, value]) => ({ name, value })
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

// Pie: Work Location Distribution
const locationData = workLocations.map((loc) => ({
  name: loc.location,
  value: Math.floor(Math.random() * 10) + 1, // mock count
}));

const RechartsDemo: React.FC = () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
    <div>
      <h3>User Privilege Distribution</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={privilegeData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={20}
          label
        >
          {privilegeData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              name={entry.name}
              fill={COLORS[idx % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
    <div>
      <h3>Average Allocation % by Role</h3>
      <BarChart width={350} height={250} data={avgAllocByRole}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="role" stroke="#1976d2" style={{ fontSize: 14 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avgAllocation" fill="#8884d8" />
      </BarChart>
    </div>
    <div>
      <h3>Billability Breakdown</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={billabilityData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {billabilityData.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
    <div>
      <h3>Engineer Category Distribution</h3>
      <BarChart width={350} height={250} data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" interval={0} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#00C49F" />
      </BarChart>
    </div>
    <div>
      <h3>Work Location Distribution</h3>
      <PieChart width={300} height={250}>
        <Pie
          data={locationData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {locationData.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
    <div>
      <h3>Revenue Details</h3>
      <ResponsiveContainer width={800} height={300}>
        <BarChart
          data={stackedBarData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="revenue"
            stackId="a"
            fill={STACK_COLORS[0]}
            name="Revenue($)"
          />
          <Bar
            dataKey="activePO"
            stackId="a"
            fill={STACK_COLORS[1]}
            name="Active PO"
          />
          <Bar
            dataKey="committed"
            stackId="a"
            fill={STACK_COLORS[2]}
            name="Committed"
          />
          <Bar
            dataKey="bestCase"
            stackId="a"
            fill={STACK_COLORS[3]}
            name="Best Case"
          />
          <Bar
            dataKey="qualified50"
            stackId="a"
            fill={STACK_COLORS[4]}
            name="Qualified Pipeline >= 50%"
          />
          <Bar
            dataKey="qualifiedBelow50"
            stackId="a"
            fill={STACK_COLORS[5]}
            name="Qualified Pipeline < 50%"
          />
          <Bar
            dataKey="other"
            stackId="a"
            fill={STACK_COLORS[6]}
            name="Other Pipeline"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div>
      <h3>Utilization Details</h3>
      <ResponsiveContainer width={900} height={400}>
        <BarChart
          data={utilizationData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: "#1976d2" }}
            label={{
              value: "Sum of Utilization Revenue and Capacity",
              angle: -90,
              // offset: 100,
              position: "insideBottomLeft",
              fill: "#1976d2",
            }}
            tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#FFD700" }}
            label={{
              value: "Utilization (%)",
              angle: 90,
              position: "insideRight",
              fill: "#FFD700",
            }}
            domain={[0, 120]}
          />
          <Tooltip />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill={METRIC_COLORS.revenue}
            name="Sum of Utilization Revenue"
          />
          <Bar
            yAxisId="left"
            dataKey="capacity"
            fill={METRIC_COLORS.capacity}
            name="Sum of Utilization Capacity"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="utilization"
            stroke={METRIC_COLORS.utilization}
            name="Utilization (%)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="linear"
            dataKey="forecast"
            stroke={METRIC_COLORS.forecast}
            name="Utilization Forecast (%)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgUtilization"
            stroke={METRIC_COLORS.avgUtilization}
            name="Average Utilization (%)"
            strokeWidth={2}
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RechartsDemo;
