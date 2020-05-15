// @flow

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

import { ensure } from "utils/graph";

export type PieChartData = { [_: string]: { value: *, color: string } };
type Props = {
  data: PieChartData,
  size: number,
};

function PieChart(props: Props) {
  const { data, size } = props;
  const ref = useRef();
  const NODES = useRef({});
  const width = size;
  const height = size;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;
  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    if (Object.keys(data).length === 0) {
      return;
    }

    const svg = d3
      .select(current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d.value);
    const d3Data = {};
    const colors = {};

    Object.keys(data).forEach((key) => {
      d3Data[key] = data[key].value.toNumber();
      colors[key] = data[key].color;
    });
    const data_ready = pie(d3.entries(d3Data));
    ensure({ key: "pie", NODES: NODES.current }, () =>
      svg
        .selectAll()
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
        .attr("fill", (d) => colors[d.data.key]),
    );

    ensure({ key: "circleOverlay", NODES: NODES.current }, () =>
      svg
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 70)
        .attr("fill", "white"),
    );
  });
  return <svg ref={ref} />;
}

export default PieChart;
