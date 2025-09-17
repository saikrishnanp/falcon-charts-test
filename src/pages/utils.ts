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