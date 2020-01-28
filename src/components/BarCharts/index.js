// @flow

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import type { Utxo } from "data/types";
import { groupData } from "./helpers";

type BarChartsProps = { data: Utxo[], granularity: number, height: number };

const BarCharts = ({ data, granularity, height }: BarChartsProps) => {
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

  return (
    <div ref={containerRef}>
      <BarChart width={width} height={height} data={groupedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis dataKey="count" />
        <XAxis dataKey="interval" hide />
        <Tooltip labelFormatter={value => `Interval : ${value}`} />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BarCharts;
