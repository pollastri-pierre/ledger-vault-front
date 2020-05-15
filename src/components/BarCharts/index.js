// @flow

import React, { useEffect, useRef, useState, useMemo } from "react";
import type { BigNumber as BigNumberType } from "bignumber.js";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { groupData } from "./helpers";

type Data = { value: BigNumberType };
type BarChartsProps = {
  data: Data[],
  granularity: number,
  height: number,
  colors?: { main?: string, hover?: string },
  tooltipFormatter?: (string) => string,
};

const BarCharts = ({
  data,
  granularity,
  height,
  colors,
  tooltipFormatter,
}: BarChartsProps) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  const groupedData = useMemo(() => groupData(data, granularity), [
    data,
    granularity,
  ]);

  useEffect(() => {
    const resizeWidth = () => {
      setWidth(containerRef.current ? containerRef.current.offsetWidth : 0);
    };
    resizeWidth();
    window.addEventListener("resize", resizeWidth);

    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  const hoverColor =
    colors && colors.hover ? { cursor: { fill: colors.hover } } : {};
  const mainColor = colors && colors.main ? { fill: colors.main } : {};

  const defaultFormatter = (value) => value;
  return (
    <div ref={containerRef}>
      <BarChart width={width} height={height} data={groupedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis dataKey="count" />
        <XAxis dataKey="interval" hide />
        <Tooltip
          labelFormatter={tooltipFormatter || defaultFormatter}
          {...hoverColor}
        />
        <Bar dataKey="count" {...mainColor} />
      </BarChart>
    </div>
  );
};

// $FlowFixMe
export default React.memo(BarCharts);
