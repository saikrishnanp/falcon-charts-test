/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import users from "../../../data/users.json";
import allocations from "../../../data/people_allocation.json";
import engineerCategories from "../../../data/engineer_category.json";
import workLocations from "../../../data/work_locations.json";
import stackedBarData from "../../../data/revenue_details.json";
import utilizationData from "../../../data/utilization_data.json";
import { countBy, COLORS, STACK_COLORS, METRIC_COLORS } from "../utils";

// --- Data transforms (same as RechartsDemo) ---
const privilegeData = Object.entries(countBy(users, "privilege")).map(
  ([name, value]) => ({ name, value })
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
  avgAllocation: +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
}));

const billabilityData = Object.entries(countBy(allocations, "billability")).map(
  ([name, value]) => ({ name, value })
);

const categoryData = engineerCategories.map((cat) => ({
  category: cat.category,
  count: Math.floor(Math.random() * 10) + 1,
}));

const locationData = workLocations.map((loc) => ({
  name: loc.location,
  value: Math.floor(Math.random() * 10) + 1,
}));

// --- Reusable D3 Chart Hooks ---
function usePieChart(
  ref: React.RefObject<SVGSVGElement>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  colors: string[]
) {
  useEffect(() => {
    if (!ref.current) return;

    const width = 300;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3.arc<any>().innerRadius(20).outerRadius(radius);

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => colors[i % colors.length])
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    g.selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => d.data.name);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, ref, colors]);
}

function useBarChart(
  ref: React.RefObject<SVGSVGElement>,
  data: any[],
  xKey: string,
  yKey: string,
  color: string
) {
  useEffect(() => {
    if (!ref.current) return;

    const width = 350;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d[xKey]))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d[yKey])!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[xKey])!)
      .attr("y", (d) => y(d[yKey]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d[yKey]))
      .attr("fill", color);

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, ref, xKey, yKey, color]);
}

function useStackedBarChart(
  ref: React.RefObject<SVGSVGElement>,
  data: any[],
  keys: string[],
  colors: string[]
) {
  useEffect(() => {
    if (!ref.current) return;

    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.sum(keys, (k) => +d[k]))!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const stackGen = d3.stack().keys(keys);
    const series = stackGen(data);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .selectAll("g.layer")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "layer")
      .attr("fill", (_, i) => colors[i % colors.length])
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(String(d.data.month))!)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, ref, keys, colors]);
}

function useComboChart(
  ref: React.RefObject<SVGSVGElement>,
  data: any[],
  barKeys: { key: string; color: string; name: string }[],
  lineKeys: { key: string; color: string; name: string }[]
) {
  useEffect(() => {
    if (!ref.current) return;

    const width = 900;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 40, left: 70 };

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yLeft = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.revenue, d.capacity))!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const yRight = d3
      .scaleLinear()
      .domain([0, 120])
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yLeft)
          .tickFormat((d) => `${(Number(d) / 1000).toLocaleString()}k`)
      );

    svg
      .append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yRight));

    // Bars
    barKeys.forEach(({ key, color }) => {
      svg
        .selectAll(`rect.bar-${key}`)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", `bar-${key}`)
        .attr("x", (d) => x(d.month)!)
        .attr("y", (d) => yLeft(d[key]))
        .attr("width", x.bandwidth() / barKeys.length)
        .attr("height", (d) => yLeft(0) - yLeft(d[key]))
        .attr(
          "transform",
          () =>
            `translate(${
              (x.bandwidth() / barKeys.length) *
              barKeys.findIndex((b) => b.key === key)
            },0)`
        )
        .attr("fill", color);
    });

    // Lines
    lineKeys.forEach(({ key, color }) => {
      const line = d3
        .line<any>()
        .x((d) => x(d.month)! + x.bandwidth() / 2)
        .y((d) => yRight(d[key]));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", line);
    });

    return () => {
      d3.select(ref.current).selectAll("*").remove();
    };
  }, [data, ref, barKeys, lineKeys]);
}

// --- Component ---
const D3Demo: React.FC = () => {
  const piePrivilegeRef = useRef<SVGSVGElement>(null);
  const pieBillabilityRef = useRef<SVGSVGElement>(null);
  const pieLocationRef = useRef<SVGSVGElement>(null);
  const barAllocRef = useRef<SVGSVGElement>(null);
  const barCategoryRef = useRef<SVGSVGElement>(null);
  const stackedRevenueRef = useRef<SVGSVGElement>(null);
  const comboUtilizationRef = useRef<SVGSVGElement>(null);

  usePieChart(
    piePrivilegeRef as React.RefObject<SVGSVGElement>,
    privilegeData,
    COLORS
  );
  usePieChart(
    pieBillabilityRef as React.RefObject<SVGSVGElement>,
    billabilityData,
    COLORS
  );
  usePieChart(
    pieLocationRef as React.RefObject<SVGSVGElement>,
    locationData,
    COLORS
  );
  useBarChart(
    barAllocRef as React.RefObject<SVGSVGElement>,
    avgAllocByRole,
    "role",
    "avgAllocation",
    "#8884d8"
  );
  useBarChart(
    barCategoryRef as React.RefObject<SVGSVGElement>,
    categoryData,
    "category",
    "count",
    "#00C49F"
  );
  useStackedBarChart(
    stackedRevenueRef as React.RefObject<SVGSVGElement>,
    stackedBarData,
    [
      "revenue",
      "activePO",
      "committed",
      "bestCase",
      "qualified50",
      "qualifiedBelow50",
      "other",
    ],
    STACK_COLORS
  );
  useComboChart(
    comboUtilizationRef as React.RefObject<SVGSVGElement>,
    utilizationData,
    [
      { key: "revenue", color: METRIC_COLORS.revenue, name: "Revenue" },
      { key: "capacity", color: METRIC_COLORS.capacity, name: "Capacity" },
    ],
    [
      {
        key: "utilization",
        color: METRIC_COLORS.utilization,
        name: "Utilization (%)",
      },
      { key: "forecast", color: METRIC_COLORS.forecast, name: "Forecast (%)" },
      {
        key: "avgUtilization",
        color: METRIC_COLORS.avgUtilization,
        name: "Avg Utilization (%)",
      },
    ]
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
      <div>
        <h3>User Privilege Distribution</h3>
        <svg ref={piePrivilegeRef}></svg>
      </div>
      <div>
        <h3>Average Allocation % by Role</h3>
        <svg ref={barAllocRef}></svg>
      </div>
      <div>
        <h3>Billability Breakdown</h3>
        <svg ref={pieBillabilityRef}></svg>
      </div>
      <div>
        <h3>Engineer Category Distribution</h3>
        <svg ref={barCategoryRef}></svg>
      </div>
      <div>
        <h3>Work Location Distribution</h3>
        <svg ref={pieLocationRef}></svg>
      </div>
      <div>
        <h3>Revenue Details</h3>
        <svg ref={stackedRevenueRef}></svg>
      </div>
      <div>
        <h3>Utilization Details</h3>
        <svg ref={comboUtilizationRef}></svg>
      </div>
    </div>
  );
};

export default D3Demo;

// Observation - Needs more work to match features of other libraries
// - No built-in tooltips, legends, responsiveness
// - More verbose code for common charts
// - Great flexibility and customization options
// - Steeper learning curve
