// @flow

import React, { useRef, useEffect } from "react";
import { BigNumber } from "bignumber.js";
import colors, { opacity } from "shared/colors";
import * as d3 from "d3";

import SearchTransactions from "api/queries/SearchTransactions";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { Connection } from "restlay/ConnectionQuery";
import { getAccountCurrencyUnit } from "data/currency";
import { getCurrencyLikeUnit } from "components/CurrencyAccountValue";
import { currencyUnitValueFormat } from "components/CurrencyUnitValue";
import { SoftCard } from "components/base/Card";
import type { Transaction, Account } from "data/types";
import { ensure } from "utils/graph";
import Widget, { connectWidget } from "./Widget";

type Props = {
  transactions: Connection<Transaction>,
  account: Account,
};

function TransactionsGraph(props: Props) {
  const { transactions, account } = props;
  const containerRef = useRef();
  const ref = useRef();
  const NODES = useRef({});

  const drawGraph = () => {
    const { current } = ref;
    if (!current) return;
    if (!containerRef.current) return;

    const margin = { top: 80, right: 50, bottom: 30, left: 100 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const isERC20 = account.account_type === "ERC20";

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

    const rawTransactions = transactions.edges.map(el => el.node);
    const dotsNumber = 30;
    const dayIncrement = 24 * 60 * 60 * 1000;
    const data = [];
    let { balance } = account;
    let j = 0;
    let t = new Date();
    t = new Date(startOfDay(t) - 1);

    for (let i = dotsNumber; i > 0; i--) {
      while (
        j < rawTransactions.length &&
        new Date(rawTransactions[j].created_on) > t
      ) {
        const { type, amount } = rawTransactions[j];
        balance =
          type === "SEND" ? balance.minus(amount) : balance.plus(amount);
        j++;
      }

      data.unshift({ date: t, value: balance.toNumber() });
      t = new Date(t - dayIncrement);
    }

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
  };

  useEffect(() => {
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined" && document.body) {
      resizeObserver = new ResizeObserver(() => {
        drawGraph();
      });

      resizeObserver.observe(document.body);
    }

    return () => {
      if (document.body && resizeObserver) {
        resizeObserver.unobserve(document.body);
      }
    };
  });

  return (
    <div ref={containerRef}>
      <Widget title="Your balance during the last 30 days">
        <SoftCard style={{ padding: 20, height: 350, paddingTop: 100 }}>
          <svg style={svgStyle} ref={ref} />
        </SoftCard>
      </Widget>
    </div>
  );
}

const start = new Date();
start.setMonth(start.getMonth() - 1);

export default connectWidget(TransactionsGraph, {
  height: 300,
  queries: {
    transactions: SearchTransactions,
  },
  propsToQueryParams: ({ account }: { account: Account }) => {
    return {
      account: [account.id],
      status: "SUBMITTED",
      start: start.toISOString(),
    };
  },
});

const svgStyle = {
  position: "absolute",
  top: 0,
  left: 0,
};

function startOfDay(t) {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

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
