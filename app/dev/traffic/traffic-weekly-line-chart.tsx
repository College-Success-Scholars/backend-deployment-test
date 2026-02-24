"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type WeekEntryCount = { weekNumber: number; entryCount: number };

interface TrafficWeeklyLineChartProps {
  data: WeekEntryCount[];
}

const MARGIN = { top: 24, right: 24, bottom: 32, left: 40 };
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 280;
/** Same green as the traffic heat map */
const TRAFFIC_COLOR = "#16a34a";

export function TrafficWeeklyLineChart({ data }: TrafficWeeklyLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dataWithPoints = data.filter((d) => d.entryCount > 0);

  useEffect(() => {
    if (!svgRef.current || dataWithPoints.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = DEFAULT_WIDTH - MARGIN.left - MARGIN.right;
    const height = DEFAULT_HEIGHT - MARGIN.top - MARGIN.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(dataWithPoints, (d) => d.weekNumber) as [number, number])
      .range([0, width])
      .nice();

    const yMax = d3.max(dataWithPoints, (d) => d.entryCount) ?? 1;
    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height, 0])
      .nice();

    const sortedData = [...dataWithPoints].sort((a, b) => a.weekNumber - b.weekNumber);

    const line = d3
      .line<WeekEntryCount>()
      .x((d) => x(d.weekNumber))
      .y((d) => y(d.entryCount))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(sortedData)
      .attr("fill", "none")
      .attr("stroke", TRAFFIC_COLOR)
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("d", line);

    g.selectAll(".dot")
      .data(sortedData)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.weekNumber))
      .attr("cy", (d) => y(d.entryCount))
      .attr("r", 3)
      .attr("fill", TRAFFIC_COLOR);

    const xAxis = d3.axisBottom(x).ticks(dataWithPoints.length).tickFormat((v) => String(v));
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("color", "hsl(var(--muted-foreground))")
      .selectAll("text")
      .attr("font-size", "11px");

    g.append("g")
      .call(d3.axisLeft(y))
      .attr("color", "hsl(var(--muted-foreground))")
      .selectAll("text")
      .attr("font-size", "11px");

    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  if (dataWithPoints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entry count by week</CardTitle>
          <CardDescription>
            No traffic data for the selected weeks.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entry count by week</CardTitle>
        <CardDescription>
          Line graph of entry tickets per campus week (aggregate).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pt-6">
        <svg
          ref={svgRef}
          width={DEFAULT_WIDTH + MARGIN.left + MARGIN.right}
          height={DEFAULT_HEIGHT}
          className="overflow-visible shrink-0"
        />
      </CardContent>
    </Card>
  );
}
