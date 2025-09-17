import { uniqueNamesGenerator, names } from "unique-names-generator";
import { v4 as uuidv4 } from "uuid";

const designationLevels = [
  "Engineer",
  "Senior Engineer",
  "Lead",
  "Manager",
  "Director",
];
const getRandomPromotionCount = () => {
  // Weighted: most users get 1-2, fewer get 3-4
  const rand = Math.random();
  if (rand < 0.5) return 1; // 50% get 1 promotion
  if (rand < 0.8) return 2; // 30% get 2 promotions
  if (rand < 0.95) return 3; // 15% get 3 promotions
  return 4; // 5% get 4 promotions
};

const users = new Array(1000).fill(null).map((_, index) => {
  const name = uniqueNamesGenerator({
    dictionaries: [names],
    separator: " ",
    style: "capital",
  });
  const dateOfJoining = new Date(Date.now() - Math.random() * 10000000000);
  const numPromotions = getRandomPromotionCount();
  const promotions = [];
  let lastDate = new Date(dateOfJoining);
  for (let i = 0; i < numPromotions; i++) {
    lastDate = new Date(
      lastDate.getTime() + Math.random() * 2 * 365 * 24 * 60 * 60 * 1000
    );
    promotions.push({
      designation: designationLevels[i + 1],
      date: lastDate.toISOString(),
    });
  }
  return {
    id: uuidv4(),
    name,
    email: `user${index}@example.com`,
    privilege: Math.random() < 0.9 ? "user" : "admin",
    created_at: dateOfJoining.toISOString(),
    date_of_joining: dateOfJoining.toISOString(),
    updated_at: new Date().toISOString(),
    user_data_id: `user_data_${index}`,
    designation:
      promotions.length > 0
        ? promotions[promotions.length - 1].designation
        : designationLevels[0],
    promotions: [
      {
        designation: designationLevels[0],
        date: dateOfJoining.toISOString(),
      },
      ...promotions,
    ],
  };
});

const userIds = users.map((user) => user.id);

const allocations = new Array(1150).fill(null).map((_, index) => {
  return {
    id: uuidv4(),
    user_id: index < 1000 ? userIds[index] : userIds[index - 1000],
    alloc_start_date: new Date(2023, index % 12, 1).toISOString().split("T")[0],
    alloc_end_date: new Date(2023, (index % 12) + 1, 0)
      .toISOString()
      .split("T")[0],
    allocation_percentage: ((index % 10) + 1) * 10,
    billability: index % 2 === 0 ? "Billable" : "Non-Billable",
    billability_percentage: index % 2 === 0 ? ((index % 10) + 1) * 10 : 0,
    role: ["Developer", "Manager", "Designer", "QA"][index % 4],
    allocation_type: ["Full-Time", "Part-Time", "Contractor"][index % 3],
    status: ["Active", "Inactive", "Pending"][index % 3],
    comments: `This is a comment for allocation ${index + 1}`,
    location: ["New York", "San Francisco", "Remote", "London"][index % 4],
    mission: `Mission ${(index % 5) + 1}`,
    project: `Project ${(index % 10) + 1}`,
    created_by: `User ${(index % 20) + 1}`,
    created_at: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
    updated_at: new Date(2023, index % 12, (index % 28) + 1).toISOString(),
  };
});

console.log({ users, allocations });
