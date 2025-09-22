import { useState } from "react";
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
import {
  countBy,
  COLORS,
  STACK_COLORS,
  METRIC_COLORS,
  BUSINESS_UNITS,
} from "../utils";

import "./styles.css";

// Pie: User Privilege Distribution
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([name, value]) => ({ name, value })
);

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

const RechartsDemo = () => {
  const [selectedBU, setSelectedBU] = useState<string>("All");
  const [pieZoom, setPieZoom] = useState(1);
  const [xStart, setXStart] = useState(0);
  const [xEnd, setXEnd] = useState(5);
  const [yMin, setYMin] = useState(0);
  const [yMax, setYMax] = useState(100);

  // Filter allocations by selected business unit
  const filteredAllocations =
    selectedBU === "All"
      ? allocations
      : allocations.filter((a) => a.business_unit === selectedBU);

  // Calculate average allocation by role for filtered allocations
  const roleGroups = filteredAllocations.reduce(
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

  // Clamp xEnd to available data
  const maxX = avgAllocByRole.length;
  const visibleAvgAllocByRole = avgAllocByRole.slice(
    Math.max(0, xStart),
    Math.min(xEnd, maxX)
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <div>
        <h3>User Privilege Distribution</h3>
        <div className="flex-row gap-2 mb-2 text-lime-400">
          <button
            className="py-px px-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setPieZoom((z) => Math.min(z + 0.5, 2))}
          >
            Zoom In
          </button>
          <button
            className="py-px px-1 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setPieZoom((z) => Math.max(z - 0.5, 0.5))}
          >
            Zoom Out
          </button>
          <button
            className="py-px px-1 mx-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={() => setPieZoom(1)}
          >
            Reset
          </button>
        </div>
        <PieChart width={300} height={250}>
          <Pie
            data={privilegeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80 * pieZoom}
            innerRadius={20 * pieZoom}
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
        <h3 className="text-red">Average Allocation % by Role</h3>
        <div className="flex flex-row">
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 w-[340px] h-fit">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected BU</h4>
            <select
              value={selectedBU}
              onChange={(e) => setSelectedBU(e.target.value)}
              style={{ marginBottom: 12, padding: 4, fontSize: 16 }}
            >
              {BUSINESS_UNITS.map((bu) => (
                <option key={bu} value={bu}>
                  {bu}
                </option>
              ))}
            </select>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Axis Controls
            </h4>
            {/* X Range */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                X Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={maxX - 1}
                  value={xStart}
                  onChange={(e) =>
                    setXStart(
                      Math.max(0, Math.min(Number(e.target.value), xEnd - 1))
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min={xStart + 1}
                  max={maxX}
                  value={xEnd}
                  onChange={(e) =>
                    setXEnd(
                      Math.max(
                        xStart + 1,
                        Math.min(Number(e.target.value), maxX)
                      )
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Y Range */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Y Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={yMax - 1}
                  value={yMin}
                  onChange={(e) =>
                    setYMin(
                      Math.max(0, Math.min(Number(e.target.value), yMax - 1))
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min={yMin + 1}
                  max={100}
                  value={yMax}
                  onChange={(e) =>
                    setYMax(
                      Math.max(yMin + 1, Math.min(Number(e.target.value), 100))
                    )
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-sm transition-colors"
                onClick={() => {
                  setXStart(0);
                  setXEnd(5);
                  setYMin(0);
                  setYMax(100);
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <BarChart width={350} height={250} data={visibleAvgAllocByRole}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" stroke="#1976d2" style={{ fontSize: 14 }} />
            <YAxis domain={[yMin, yMax]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgAllocation" fill="#8884d8" />
          </BarChart>
        </div>
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
};

export default RechartsDemo;
