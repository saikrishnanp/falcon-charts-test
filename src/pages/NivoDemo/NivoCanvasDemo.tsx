import { ResponsivePieCanvas } from "@nivo/pie";
import { ResponsiveBarCanvas } from "@nivo/bar";
import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import { countBy } from "../utils";

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
    </div>
  );
}
