import { designationLevels } from "./utils";

interface SankeyPayloadItem {
  payload: {
    source: number;
    target: number;
    value: number;
    userNames?: string[];
  };
}

const SankeyToolTips = ({ active, payload }: { active: boolean; payload: SankeyPayloadItem[] }) => {
  if (active && payload && payload.length && payload[0].payload) {
    const link = payload[0].payload;
    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: 10 }}>
        <div>
          <strong>
            {designationLevels[link.source]} → {designationLevels[link.target]}
          </strong>
        </div>
        <div>Users promoted: {link.value}</div>
        <div style={{ maxHeight: 100, overflowY: "auto", fontSize: 12 }}>
          {link.userNames && link.userNames.slice(0, 10).map((name, idx) => (
            <div key={idx}>{name}</div>
          ))}
          {link.userNames && link.userNames.length > 10 && (
            <div>...and {link.userNames.length - 10} more</div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default SankeyToolTips;