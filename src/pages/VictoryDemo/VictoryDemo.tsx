import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryStack,
  VictoryLegend,
  VictoryLine,
  VictoryGroup,
} from "victory";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import stackedBarData from "../../../data/revenue_details.json";
import utilizationData from "../../../data/utilization_data.json";
import {
  countBy,
  COLORS,
  stackedKeys,
  STACK_COLORS,
  METRIC_COLORS,
} from "../utils";

type RevenueDetail = {
  month: string;
  revenue: number;
  activePO: number;
  committed: number;
  bestCase: number;
  qualified50: number;
  qualifiedBelow50: number;
  other: number;
};

type StackedKey = keyof Omit<RevenueDetail, "month">;

// Pie: User Privilege Distribution
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([x, y]) => ({ x, y })
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
  x: role,
  y: Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)),
}));

// Pie: Billability Breakdown
const billabilityData = Object.entries(countBy(allocations, "billability")).map(
  ([x, y]) => ({ x, y })
);

// Bar: Engineer Category Distribution
const categoryData = engineerCategories.map((cat) => ({
  x: cat.category,
  y: Math.floor(Math.random() * 10) + 1,
}));

const locationData = workLocations.map((loc) => ({
  x: loc.location,
  y: Math.floor(Math.random() * 10) + 1,
}));

// Prepare Victory data for stacking
const stackedVictoryData = stackedKeys.map((key) =>
  stackedBarData.map((d) => ({
    x: d.month,
    y: d[key as StackedKey] || 0,
    label: `${key}: ${d[key as StackedKey] || 0}`,
  }))
);

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
          <VictoryAxis
            style={{ tickLabels: { fill: "#1976d2", fontSize: 11 } }}
          />
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
          <VictoryAxis
            style={{ tickLabels: { fill: "#1976d2", fontSize: 11 } }}
          />
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
      <div style={{ width: 900, height: 350 }}>
        <h3>Revenue Details</h3>
        <VictoryChart domainPadding={20} width={900} height={350}>
          <VictoryAxis
            style={{
              tickLabels: { fill: "#1976d2", fontSize: 11 },
              axisLabel: { fill: "#1976d2" },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fill: "#1976d2", fontSize: 11 },
              axisLabel: { fill: "#1976d2" },
            }}
            tickFormat={(t) => `${Math.round(t / 1000)}k`}
          />
          <VictoryLegend
            x={100}
            y={0}
            orientation="horizontal"
            gutter={20}
            data={stackedKeys.map((key, i) => ({
              name:
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
              symbol: { fill: STACK_COLORS[i] },
            }))}
          />
          <VictoryStack colorScale={STACK_COLORS}>
            {stackedVictoryData.map((data, i) => (
              <VictoryBar
                key={stackedKeys[i]}
                data={data}
                labelComponent={<VictoryTooltip />}
              />
            ))}
          </VictoryStack>
        </VictoryChart>
      </div>
      {/* Victory chart doesn't support dual axis (y axis tried in others) */}
      <div style={{ width: 900, height: 350 }}>
        <h3>Utilization Details</h3>
        <VictoryChart domainPadding={20} width={900} height={350}>
          <VictoryAxis
            style={{
              tickLabels: { fill: "#1976d2", fontSize: 11 },
              axisLabel: { fill: "#1976d2" },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fill: "#1976d2", fontSize: 11 },
              axisLabel: { fill: "#1976d2" },
            }}
            tickFormat={(t) => `${Math.round(t / 1000)}k`}
          />
          <VictoryLegend
            x={100}
            y={0}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Revenue", symbol: { fill: METRIC_COLORS.revenue } },
              { name: "Capacity", symbol: { fill: METRIC_COLORS.capacity } },
              {
                name: "Utilization (%)",
                symbol: { fill: METRIC_COLORS.utilization },
              },
              {
                name: "Utilization Forecast (%)",
                symbol: { fill: METRIC_COLORS.forecast },
              },
              {
                name: "Average Utilization (%)",
                symbol: { fill: METRIC_COLORS.avgUtilization },
              },
            ]}
          />
          <VictoryGroup
            offset={20}
            colorScale={[METRIC_COLORS.revenue, METRIC_COLORS.capacity]}
          >
            <VictoryBar
              data={utilizationData.map((d) => ({
                x: d.month,
                y: d.revenue,
                label: `Revenue: ${d.revenue}`,
              }))}
              style={{ data: { fill: METRIC_COLORS.revenue } }}
              barWidth={16}
              labelComponent={<VictoryTooltip />}
            />
            <VictoryBar
              data={utilizationData.map((d) => ({
                x: d.month,
                y: d.capacity,
                label: `Capacity: ${d.capacity}`,
              }))}
              style={{ data: { fill: METRIC_COLORS.capacity } }}
              barWidth={16}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryGroup>
          <VictoryLine
            data={utilizationData.map((d) => ({
              x: d.month,
              y: d.utilization * 10000, // scale for visual alignment
              // label: `Utilization: ${d.utilization}%`,
            }))}
            style={{
              data: { stroke: METRIC_COLORS.utilization, strokeWidth: 2 },
            }}
          />
          <VictoryLine
            data={utilizationData.map((d) => ({
              x: d.month,
              y: d.forecast * 10000, // scale for visual alignment
              // label: `Forecast: ${d.forecast}%`,
            }))}
            style={{ data: { stroke: METRIC_COLORS.forecast, strokeWidth: 2 } }}
          />
          <VictoryLine
            data={utilizationData.map((d) => ({
              x: d.month,
              y: d.avgUtilization * 10000, // scale for visual alignment
              // label: `Avg Utilization: ${d.avgUtilization}%`,
            }))}
            style={{
              data: { stroke: METRIC_COLORS.avgUtilization, strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
}
