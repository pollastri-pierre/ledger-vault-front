// @flow

import * as d3 from "d3";
import React, { useRef, useEffect, useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { getAccountCurrencyUnit } from "data/currency";
import { currencyUnitValueFormat } from "components/CurrencyUnitValue";
import {
  getERC20TokenByContractAddress,
  getCurrencyLikeUnit,
} from "utils/cryptoCurrencies";
import colors, { opacity } from "shared/colors";
import { ensure, buildGraphData } from "utils/graph";
import type { Account, Transaction } from "data/types";

type Props = {|
  height: number,
  transactions: Transaction[],
  account: Account,
  nbDays: number,
  granularity: "DAY" | "HOUR",
|};

const BalanceGraph = (props: Props) => {
  const { height, transactions, account, nbDays, granularity } = props;

  const NODES = useRef({});
  const ref = useRef();
  const containerRef = useRef();
  const drawGraph = useCallback(() => {
    const { current } = ref;
    const { current: containerCurrent } = containerRef;
    if (!current) return;
    if (!containerCurrent) return;

    const margin = { top: 30, right: 30, bottom: 30, left: 100 };
    const width = containerCurrent.clientWidth - margin.left - margin.right;
    const height = containerCurrent.clientHeight - margin.top - margin.bottom;
    const isERC20 = account.account_type === "Erc20";

    let color;
    if (isERC20) {
      const ethCurrency = getCryptoCurrencyById("ethereum");
      color = ethCurrency.color;
    } else {
      const curr = getCryptoCurrencyById(account.currency);
      color = curr.color;
    }

    // parse the date / time
    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // define the line
    const graphLine = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    const area = d3
      .area()
      .x(function(d) {
        return x(d.date);
      })
      .y0(height)
      .y1(function(d) {
        return y(d.value);
      });

    ensure({ key: "defs", NODES: NODES.current }, () =>
      d3.select(current).append("defs"),
    );
    ensure({ key: "mainGradient", NODES: NODES.current }, () =>
      NODES.current.defs
        .append("linearGradient")
        .attr("id", "mainGradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%"),
    );

    ensure({ key: "svg", NODES: NODES.current }, () =>
      d3
        .select(current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`),
    );

    const data = buildGraphData({ account, nbDays, transactions, granularity });

    const evolutionOfBalance = data.reverse();
    // Scale the range of the data
    x.domain(
      d3.extent(evolutionOfBalance, function(d) {
        return d.date;
      }),
    );
    y.domain([
      0,
      d3.max(evolutionOfBalance, function(d) {
        return d.value;
      }),
    ]);

    ensure({ key: "graphLine", NODES: NODES.current }, () =>
      NODES.current.svg
        .append("path")
        .data([evolutionOfBalance])
        .attr("d", graphLine)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2),
    );

    ensure({ key: "gradientArea", NODES: NODES.current }, () =>
      NODES.current.svg
        .append("path")
        .data([evolutionOfBalance])
        .attr("d", area)
        .attr("fill", "url(#mainGradient)"),
    );

    ensure({ key: "stopsGradient", NODES: NODES.current }, () => {
      NODES.current.mainGradient
        .append("stop")
        .attr("stop-color", `${opacity(color, 0.2)}`)
        .attr("offset", "0");
      NODES.current.mainGradient
        .append("stop")
        .attr("stop-color", `${opacity(color, 0)}`)
        .attr("offset", "1");
    });

    // Y axis
    ensure({ key: "xAxis", NODES: NODES.current }, () =>
      NODES.current.svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(6)),
    );

    ensure({ key: "yAxis", NODES: NODES.current }, () =>
      NODES.current.svg.append("g").call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat(val => {
            if (isERC20) {
              const token = getERC20TokenByContractAddress(
                account.contract_address,
              );
              return currencyUnitValueFormat(
                getCurrencyLikeUnit(token),
                BigNumber(val),
              );
            }
            return currencyUnitValueFormat(
              getAccountCurrencyUnit(account),
              BigNumber(val),
            );
          }),
      ),
    );

    styleAxis(NODES.current.yAxis, true);
    styleAxis(NODES.current.xAxis);
  }, [account, nbDays, transactions, granularity]);

  useEffect(() => {
    drawGraph();
    window.addEventListener("resize", drawGraph);

    return () => {
      window.removeEventListener("resize", drawGraph);
    };
  }, [drawGraph]);

  return (
    <div style={{ height }} ref={containerRef}>
      <svg ref={ref} />
    </div>
  );
};

function styleAxis(node, noPath) {
  node.selectAll(".tick line").attr("stroke", "none");
  if (noPath) {
    node.selectAll("path").attr("stroke", "none");
  } else {
    node.selectAll("path").attr("stroke", colors.form.border);
  }
  node.selectAll("text").attr("fill", colors.textLight);
  node.selectAll("text").style("font-size", "12px");
}

export default BalanceGraph;
