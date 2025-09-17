import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import { countBy, COLORS } from "../utils";

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
        <XAxis dataKey="role" stroke="#1976d2" />
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
  </div>
);

export default RechartsDemo;
