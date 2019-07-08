// @flow

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import colors from "shared/colors";
import Box from "components/base/Box";

type Props = {
  nb?: number,
  total?: number,
  size: number,
  children?: React$Node,
};

export default function CircleProgress(props: Props) {
  const { size, total, nb, children } = props;
  const ref = useRef();

  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    const radius = size / 2;
    const border = 3;
    const circle = d3
      .arc()
      .startAngle(0)
      .innerRadius(radius)
      .outerRadius(radius - border);
    const svg = d3
      .select(current)
      .append("svg")
      .attr("width", size)
      .attr("height", size);
    const g = svg
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    g.append("path")
      .attr("fill", "#e2e2e2")
      .attr("stroke", "none")
      .attr("stroke-width", "3px")
      .attr("d", circle.endAngle(Math.PI * 2));

    if (typeof nb !== "undefined" && typeof total !== "undefined") {
      const percentage = 2 * (nb / total);
      g.append("path")
        .attr("fill", colors.ocean)
        .attr("stroke", "none")
        .attr("stroke-width", `${3}px`)
        .attr("d", circle.endAngle(Math.PI * percentage));
    }
  }, [size, total, nb]);

  const style = { width: size, height: size };

  return (
    <Box
      noShrink
      position="relative"
      align="center"
      justify="center"
      style={style}
    >
      <svg style={svgStyle} width={size} height={size} ref={ref} />
      {children || (
        <span>
          <strong>{nb}</strong>
          <span>/</span>
          <strong>{total}</strong>
        </span>
      )}
    </Box>
  );
}

const svgStyle = {
  position: "absolute",
  top: 0,
  left: 0,
};
