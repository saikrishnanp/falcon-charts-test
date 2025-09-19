import { ResponsivePieCanvas } from "@nivo/pie";
import { ResponsiveBarCanvas } from "@nivo/bar";
import { ResponsiveLineCanvas } from "@nivo/line";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import stackedBarData from "../../../data/revenue_details.json";
import utilizationData from "../../../data/utilization_data.json";
import { countBy, stackedKeys, STACK_COLORS } from "../utils";

const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([id, value]) => ({ id, label: id, value })
);

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

const billabilityData = Object.entries(countBy(allocations, "billability")).map(
  ([id, value]) => ({ id, label: id, value })
);

const categoryData = engineerCategories.map((cat) => ({
  category: cat.category,
  count: Math.floor(Math.random() * 10) + 1,
}));

const locationData = workLocations.map((loc) => ({
  id: loc.location,
  label: loc.location,
  value: Math.floor(Math.random() * 10) + 1,
}));


// Bar chart keys and colors
const barKeys = ["revenue", "capacity"];
const barColors = ["#82b1ff", "#69f0ae"];

// Prepare line data for Nivo
const lineKeys = [
  { key: "utilization", color: "#08c711ff", name: "Utilization (%)" },
  { key: "forecast", color: "#c74b40ff", name: "Utilization Forecast (%)" },
  { key: "avgUtilization", color: "#FFD700", name: "Average Utilization (%)" },
];

const lineData = lineKeys.map((line) => ({
  id: line.name,
  color: line.color,
  data: utilizationData.map((d) => ({
    x: d.month,
    y: d[line.key as keyof typeof d] ?? null,
  })),
}));

export default function NivoCanvasDemo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <div style={{ width: 350, height: 250 }}>
        <h3>User Privilege Distribution</h3>
        <ResponsivePieCanvas
          data={privilegeData}
          theme={{
            labels: { text: { fill: "#1976d2" } }, // pie slice labels
            legends: { text: { fill: "#1976d2" } }, // legend labels
          }}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Average Allocation % by Role</h3>
        <ResponsiveBarCanvas
          theme={{
            axis: {
              ticks: { text: { fill: "#1976d2" } }, // axis tick labels
              legend: { text: { fill: "#1976d2" } }, // axis legend labels
            },
          }}
          data={avgAllocByRole}
          keys={["avgAllocation"]}
          indexBy="role"
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Billability Breakdown</h3>
        <ResponsivePieCanvas
          theme={{
            labels: { text: { fill: "#1976d2" } }, // pie slice labels
            legends: { text: { fill: "#1976d2" } }, // legend labels
          }}
          data={billabilityData}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Engineer Category Distribution</h3>
        <ResponsiveBarCanvas
          theme={{
            axis: {
              ticks: { text: { fill: "#1976d2" } }, // axis tick labels
              legend: { text: { fill: "#1976d2" } }, // axis legend labels
            },
          }}
          data={categoryData}
          keys={["count"]}
          indexBy="category"
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        />
      </div>
      <div style={{ width: 350, height: 250 }}>
        <h3>Work Location Distribution</h3>
        <ResponsivePieCanvas
          theme={{
            labels: { text: { fill: "#1976d2" } }, // pie slice labels
            legends: { text: { fill: "#1976d2" } }, // legend labels
          }}
          data={locationData}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
        />
      </div>
      <div style={{ width: 750, height: 250 }}>
        <h3>Revenue Details</h3>
        <ResponsiveBarCanvas
          data={stackedBarData}
          keys={stackedKeys}
          indexBy="month"
          margin={{ top: 40, right: 120, bottom: 40, left: 60 }}
          padding={0.2}
          colors={STACK_COLORS}
          enableLabel={false}
          groupMode="stacked"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Month",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Value",
            legendPosition: "middle",
            legendOffset: -55,
          }}
          enableGridX={false}
          enableGridY={true}
          legends={[
            {
              dataFrom: "keys",
              anchor: "right", // Move legend to the right
              direction: "column", // Vertical legend
              justify: false,
              translateX: 90,
              itemsSpacing: 8,
              itemWidth: 80, // Reduce if needed
              itemHeight: 20,
              itemDirection: "left-to-right",
              symbolSize: 20,
              symbolShape: "square",
            },
          ]}
        />
      </div>
      {/* Dual y axis one on left and one on right is not supported by Nivo */}
      {/* Nivo charts doesn't support mix and match of line and bar, we need to customly implement by overlapping*/}
      <div style={{ width: 650, height: 250, position: "relative" }}>
        <h3>Utilization Details</h3>
        <ResponsiveBarCanvas
          data={utilizationData}
          keys={barKeys}
          indexBy="month"
          margin={{ top: 40, right: 80, bottom: 40, left: 60 }}
          padding={0.2}
          colors={barColors}
          enableLabel={false}
          groupMode="grouped"
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Month",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Sum of Utilization Revenue and Capacity",
            legendPosition: "middle",
            legendOffset: -55,
            format: (value) => `${(value / 1000).toLocaleString()}k`,
          }}
          enableGridX={false}
          enableGridY={true}
          legends={[
            {
              dataFrom: "keys",
              anchor: "top",
              direction: "row",
              justify: false,
              translateY: -30,
              itemsSpacing: 2,
              itemWidth: 120,
              itemHeight: 20,
              itemDirection: "left-to-right",
              symbolSize: 20,
              symbolShape: "circle",
            },
          ]}
          tooltip={({ id, value, color, indexValue }) => (
            <div style={{ padding: 8, color }}>
              <strong>{id}</strong> in <strong>{indexValue}</strong>: {value}
            </div>
          )}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none", // allow bar chart tooltips
          }}
        >
          <ResponsiveLineCanvas
            data={lineData}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: 120 }}
            axisLeft={null}
            axisBottom={null}
            enablePoints={false}
            enableGridX={false}
            enableGridY={false}
            colors={(line) => line.color}
            lineWidth={3}
            isInteractive={false}
            legends={[
              {
                anchor: "right",
                direction: "column",
                justify: false,
                translateX: 80,
                translateY: 0,
                itemsSpacing: 8,
                itemWidth: 120,
                itemHeight: 20,
                symbolSize: 20,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
