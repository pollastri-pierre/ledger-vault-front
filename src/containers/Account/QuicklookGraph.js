import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";

export default class QuicklookGraph extends Component {
  componentDidUpdate() {
    const svg = d3.select(this.svg);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let minX = this.props.data[0].time;
    let maxX = this.props.data[0].time;

    let minY = this.props.data[0].amount;
    let maxY = this.props.data[0].amount;

    const data = _.map(this.props.data, transaction => {
      if (transaction.time < minX) {
        minX = transaction.time;
      }

      if (transaction.amount < minY) {
        minY = transaction.amount;
      }

      if (transaction.time > maxX) {
        maxX = transaction.time;
      }

      if (transaction.amount > maxY) {
        maxY = transaction.amount;
      }

      return {
        date: transaction.time,
        value: transaction.amount
      };
    });

    const x = d3
      .scaleTime()
      .domain([minX, maxX])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(d3.timeDay);

    const yAxis = d3
      .axisRight(y)
      .ticks(3)
      .tickSize(width);

    function customXAxis(s) {
      s.call(xAxis);
      s.select(".domain").remove();
      s.selectAll(".tick line").attr("display", "none");
      s.selectAll(".tick text").attr("fill", "#999999");
    }

    function customYAxis(s) {
      s.call(yAxis);
      s.select(".domain").remove();
      s
        .selectAll(".tick:not(:first-of-type) line")
        .attr("stroke", "#e8e8e8")
        .attr("stroke-dasharray", "1,2");

      s
        .selectAll(".tick text")
        .attr("x", -20)
        .attr("dy", -12)
        .attr("fill", "#999999");

      s
        .selectAll(".tick:first-of-type line")
        .attr("stroke", "#999999")
        .attr("stroke-dasharray", "1,2");
    }

    g
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(customXAxis);

    g.append("g").call(customYAxis);

    const valueline = d3
      .line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    g
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("stroke", "#fcb653")
      .attr("fill", "none")
      .attr("stroke-width", "2px");
  }

  render() {
    return (
      <svg
        width="300"
        height="270"
        ref={c => {
          this.svg = c;
        }}
      />
    );
  }
}
