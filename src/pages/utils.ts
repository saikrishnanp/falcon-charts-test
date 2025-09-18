interface CountByObject {
  [key: string]: number;
}

export const countBy = <T extends Record<string, unknown>>(arr: T[], key: keyof T): CountByObject => {
  return arr.reduce((acc: CountByObject, obj: T) => {
    const k = obj[key] as string;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const designationLevels = [
  "Engineer",
  "Senior Engineer",
  "Lead",
  "Manager",
  "Director"
];

export const STACK_COLORS = [
  "#82b1ff", // Revenue ($)
  "#69f0ae", // Active PO
  "#ffe082", // Committed
  "#ff8a80", // Best Case
  "#80cbc4", // Qualified Pipeline >= 50%
  "#b39ddb", // Qualified Pipeline < 50%
  "#ffb74d", // Other Pipeline
];

export const stackedKeys = [
  "revenue",
  "activePO",
  "committed",
  "bestCase",
  "qualified50",
  "qualifiedBelow50",
  "other",
];