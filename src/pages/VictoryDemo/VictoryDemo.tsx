import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
} from "victory";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import { countBy, COLORS } from "../utils";

// Pie: User Privilege Distribution
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([x, y]) => ({ x, y })
);

// Bar: Average Allocation Percentage by Role
const roleGroups = allocations.reduce((acc: { [role: string]: number[] }, alloc) => {
  if (!alloc.role) return acc;
  acc[alloc.role] = acc[alloc.role] || [];
  acc[alloc.role].push(alloc.allocation_percentage);
  return acc;
}, {});
const avgAllocByRole = Object.entries(roleGroups).map(([role, arr]) => ({
  x: role,
  y: Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)),
}));

// Pie: Billability Breakdown
const billabilityData = Object.entries(countBy(allocations, "billability")).map(
  ([x, y]) => ({ x, y })
);

// Bar: Engineer Category Distribution
const categoryData = engineerCategories.map(cat => ({
  x: cat.category,
  y: Math.floor(Math.random() * 10) + 1,
}));

// Pie: Work Location Distribution
const locationData = workLocations.map(loc => ({
  x: loc.location,
  y: Math.floor(Math.random() * 10) + 1,
}));

export default function VictoryDemo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <div style={{ width: 350, height: 250 }}>
        <h3>User Privilege Distribution</h3>
        <VictoryPie
          data={privilegeData}
          colorScale={COLORS}
          innerRadius={20}
          labelRadius={80}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          style={{ labels: { fontSize: 12 } }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Average Allocation % by Role</h3>
        <VictoryChart domainPadding={20}>
          <VictoryAxis style={{ tickLabels: { fill: "#1976d2", fontSize: 11 } }} />
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fill: "#1976d2", fontSize: 11 } }}
          />
          <VictoryBar
            data={avgAllocByRole}
            style={{ data: { fill: "#8884d8" } }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Billability Breakdown</h3>
        <VictoryPie
          data={billabilityData}
          colorScale={COLORS}
          labelRadius={80}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          style={{ labels: { fontSize: 12 } }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Engineer Category Distribution</h3>
        <VictoryChart domainPadding={20}>
          <VictoryAxis style={{ tickLabels: { fill: "#1976d2", fontSize: 11 } }} />
          <VictoryAxis
            dependentAxis
            style={{ tickLabels: { fill: "#1976d2", fontSize: 11 } }}
          />
          <VictoryBar
            data={categoryData}
            style={{ data: { fill: "#00C49F" } }}
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Work Location Distribution</h3>
        <VictoryPie
          data={locationData}
          colorScale={COLORS}
          labelRadius={80}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          style={{ labels: { fontSize: 12 } }}
        />
      </div>
    </div>
  );
}