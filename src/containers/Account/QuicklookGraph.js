// @flow

import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import "./QuicklookGraph.css";
import DateFormat from "../../components/DateFormat";
import CurrencyUnitValue from "../../components/CurrencyUnitValue.js";

type Props = {
  data: Arrray<*>,
  dateRange: Array<*>,
  currency: Array<*>
};

export default class QuicklookGraph extends Component<Props, *> {
  state = {
    selected: -1,
    width: 300 - 20 - 20,
    height: 190 - 20 - 20,
    transform: ""
  };

  tooltip: ?HTMLDivElement;

  svg: ?*;

  setSelected = (index: number) => {
    this.setState({ selected: index });
  };

  handleMouseOver = (d: *, i: number) => {
    if (d.tooltip) this.setSelected(i);
  };

  handleMouseOut = (d: *, i: number) => {
    this.setSelected(-1);
  };

  handleTooltip = () => {
    const { selected } = this.state;
    const tooltip = d3.select(this.tooltip);
    tooltip.classed("hide", selected === -1);
    d3
      .select(this.svg)
      .selectAll(".dot")
      .attr("opacity", (d, i) => (selected === i ? 1 : 0))
      .classed("selected", (d, i) => selected !== -1 && selected === i);
    if (selected !== -1) {
      const selectedDot = d3.select(".dot.selected").data()[0];
      tooltip.style("left", `${selectedDot.x - 30}px`);
      tooltip.style("top", `${selectedDot.y - 65}px`);
    }
  };

  drawInvisibleDots = (data: Array<*>) => {
    const selection = d3
      .select(".hoveringDots")
      .selectAll(".hoverdot")
      .data(data, d => d.x + d.y + d.time);
    selection.exit().remove();
    selection
      .enter()
      .append("circle")
      .classed("hoverdot", true)
      .attr("r", 10)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .on("mouseout", this.handleMouseOut)
      .on("mouseover", this.handleMouseOver);
  };

  drawVisibleDots = (data: Array<*>) => {
    const { currency } = this.props;
    const selection = d3
      .select(".visibleDots")
      .selectAll(".dot")
      .data(data, d => d.x + d.y + d.time);

    selection.exit().remove();

    selection
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", currency.color)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("class", (d, i) => `dot${i}`)
      .classed("dot", true);
  };

  drawLine = (data: Array<*>) => {
    const { currency } = this.props;

    const valueline = d3
      .line()
      .x(d => {
        return d.x;
      })
      .y(d => d.y);

    const selection = d3.select(".valueline").data([data]);

    selection
      .attr("class", "valueline")
      .attr("d", valueline)
      .attr("stroke", currency.color)
      .attr("fill", "none")
      .attr("stroke-width", "2px")
      .attr("clip-path", "url(#clip)");
  };

  drawxAxisLabel = (domainX: Array<*>) => {
    const timeDelta = domainX[1] - domainX[0];

    const tickLabel =
      timeDelta >= 31556952000 * 2
        ? "year"
        : timeDelta >= 2629746000 * 2
          ? "month"
          : timeDelta >= 86400000 ? "day" : "hour";
    d3.select(".xAxisLabel").text(tickLabel.toUpperCase());
  };

  drawAxis = (xAxis: *, yAxis: *) => {
    d3.select(".xAxis").call(this.customXAxis, xAxis);
    d3.select(".yAxis").call(this.customYAxis, yAxis);
  };

  drawGraph = (data: Array<*>, xAxis: *, yAxis: *, x: *) => {
    this.drawAxis(xAxis, yAxis);
    let domain = [];
    if (x) domain = x.domain();
    this.drawxAxisLabel(domain);
    this.drawLine(data);
  };

  customXAxis = (s: *, xAxis: *) => {
    s.call(xAxis);
    s.select(".domain").remove();
    s.selectAll(".tick line").attr("display", "none");
    s
      .selectAll(".tick text")
      .attr("fill", "#999999")
      .attr("x", 0);
  };

  customYAxis = (s: *, yAxis: *) => {
    s.call(yAxis);
    s.select(".domain").remove();
    s
      .selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "#e8e8e8")
      .attr("stroke-dasharray", "1,2");

    s
      .selectAll(".tick text")
      .attr("x", 0)
      .attr("dy", -12)
      .attr("fill", "#999999");

    s
      .selectAll(".tick:first-of-type line")
      .attr("stroke", "#999999")
      .attr("stroke-dasharray", "1,2");
  };

  computeXY = (data: Array<*>) => {
    const { width, height } = this.state;

    const domainX = [
      d3.min(data, function(d) {
        return d.time;
      }),
      d3.max(data, function(d) {
        return d.time;
      })
    ];

    const x = d3
      .scaleTime()
      .domain(domainX)
      .range([55, width]);

    const minY = d3.min(data, function(d) {
      return d.amount;
    });
    console.log(data);
    const domainY = [
      minY <= 0 ? minY : 0,
      d3.max(data, function(d) {
        return d.amount;
      })
    ];

    console.log(domainY);
    const y = d3
      .scaleLinear()
      .domain(domainY)
      .range([height, 0]);

    return { x: x, y: y };
  };

  computeData = (data: Array<*>) => {
    const { width, transform } = this.state;

    let computedData = data.slice();

    let { x, y } = this.computeXY(data);

    if (transform) {
      x = transform.translate(35, 0).rescaleX(x);
    }

    //Setting up xAxis tick format behaviour. subject to change
    const formatMillisecond = d3.timeFormat(".%L"),
      formatSecond = d3.timeFormat(":%S"),
      formatMinute = d3.timeFormat("%I:%M"),
      formatHour = d3.timeFormat("%I %p"),
      formatDay = d3.timeFormat("%a %d"),
      formatWeek = d3.timeFormat("%m/%d"),
      formatMonth = d3.timeFormat("%b"),
      formatYear = d3.timeFormat("%Y");

    //setting up xAxis
    const xAxis = d3
      .axisBottom(x)
      .ticks(4)
      .tickFormat((date, i) => {
        return (d3.timeSecond(date) < date
          ? formatMillisecond
          : d3.timeMinute(date) < date
            ? formatSecond
            : d3.timeHour(date) < date
              ? formatMinute
              : d3.timeDay(date) < date
                ? formatHour
                : d3.timeMonth(date) < date
                  ? d3.timeWeek(date) < date ? formatDay : formatWeek
                  : d3.timeYear(date) < date ? formatMonth : formatYear)(date);
      });

    let newXAxis = xAxis.scale(x);

    //setting uo yAxis
    const yAxis = d3
      .axisRight(y)
      .ticks(3)
      .tickSize(width);

    computedData = _.map(data, transaction => {
      if (!x && !y) return transaction;
      return {
        ...transaction,
        x: x(transaction.time),
        y: y(transaction.amount)
      };
    });

    return {
      data: computedData,
      xAxis: newXAxis,
      yAxis: yAxis,
      x: x
    };
  };

  initPlaceholders = () => {
    const { width, height } = this.state;

    //init svg with d3js margin convention
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const svg = d3.select(this.svg);
    svg.attr("height", height + margin.top + margin.bottom);
    svg.attr("width", width + margin.left + margin.right);

    const g = svg
      .append("g")
      .classed("chart", true)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("width", width);

    //init xAxis placeholder
    g
      .append("g")
      .classed("xAxis", true)
      .attr("transform", `translate(0, ${height})`);

    //init yAxis placeholder
    g.append("g").classed("yAxis", true);

    //init xAxisLabel placeholder
    g
      .append("text")
      .classed("xAxisLabel", true)
      .attr("dy", 166)
      .attr("fill", "#999999")
      .attr("font-size", "10px")
      .attr("text-transform", "uppercase");

    //init line placeholde
    g.append("path").classed("valueline", true);

    //init clipPath for zooming purposes
    g
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width - 55)
      .attr("height", height + 100)
      .attr("x", 55)
      .attr("y", -50);

    //init placeholder for visible dots
    g
      .append("g")
      .classed("visibleDots", true)
      .attr("clip-path", "url(#clip)");

    //init placeholder for invisible dots (bigger invisible dots for better ux)
    g
      .append("g")
      .classed("hoveringDots", true)
      .attr("clip-path", "url(#clip)");

    //init placeholder for NO DATA AVAILABLE text
    g
      .append("text")
      .text("No data available")
      .attr("dx", -52)
      .attr("dy", -9)
      .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")")
      .attr("fill", "#999999")
      .attr("font-size", "13px")
      .attr("opacity", 0)
      .classed("noData", true);
  };

  zoomTo = (d0: number, d1: number, data: Array<*>) => {
    this.setState((prevState, props) => {
      const { width } = prevState;
      const { x } = this.computeXY(data);
      return {
        transform: d3.zoomIdentity
          .scale((width - 55) / (x(d1) - x(d0)))
          .translate(55 - x(d0), 0),
        selected: -1
      };
    });
  };

  displayNoData = () => {
    const { width } = this.state;
    const { dateRange: domainX } = this.props;

    const x = d3
      .scaleTime()
      .domain(domainX)
      .range([55, width]);

    //Setting up xAxis tick format behaviour. subject to change
    const formatMillisecond = d3.timeFormat(".%L"),
      formatSecond = d3.timeFormat(":%S"),
      formatMinute = d3.timeFormat("%I:%M"),
      formatHour = d3.timeFormat("%I %p"),
      formatDay = d3.timeFormat("%a %d"),
      formatWeek = d3.timeFormat("%m/%d"),
      formatMonth = d3.timeFormat("%b"),
      formatYear = d3.timeFormat("%Y");

    //setting up xAxis
    const xAxis = d3
      .axisBottom(x)
      .ticks(4)
      .tickFormat((date, i) => {
        return (d3.timeSecond(date) < date
          ? formatMillisecond
          : d3.timeMinute(date) < date
            ? formatSecond
            : d3.timeHour(date) < date
              ? formatMinute
              : d3.timeDay(date) < date
                ? formatHour
                : d3.timeMonth(date) < date
                  ? d3.timeWeek(date) < date ? formatDay : formatWeek
                  : d3.timeYear(date) < date ? formatMonth : formatYear)(date);
      });

    d3.select(".noData").attr("opacity", 1);
    this.drawxAxisLabel(domainX);
    d3.select(".xAxis").call(this.customXAxis, xAxis);
    d3.select(".yAxis").attr("opacity", 0);
    d3.select(".valueline").attr("opacity", 0);
  };

  componentDidMount() {
    const { data, dateRange } = this.props;
    //init placeholders
    this.initPlaceholders();
    //return if no data
    if (data.length) {
      this.zoomTo(dateRange[0], dateRange[1], data);
    }
  }

  componentDidUpdate(prevProps: *, prevState: *) {
    const { selected, transform } = this.state;
    const { dateRange, data: dataProp } = this.props;
    let duration = 0;
    if (!dataProp.length) {
      this.displayNoData();
      return;
    }
    d3.select(".noData").attr("opacity", 0);
    d3.select(".yAxis").attr("opacity", 1);
    d3.select(".valueline").attr("opacity", 1);

    if (selected !== prevState.selected) {
      //Hovering on tooltip
      this.handleTooltip();
    }
    if (
      prevProps.dateRange[0] !== this.props.dateRange[0] ||
      prevProps.dateRange[1] !== this.props.dateRange[1] ||
      JSON.stringify(dataProp) !== JSON.stringify(prevProps.data)
    ) {
      //dateRange in props changed. Computing new transform and resetting the state
      duration = 500;
      console.log("GOING TO : ", dateRange.map(a => new Date(a)));
      this.zoomTo(dateRange[0], dateRange[1], dataProp);
    } else if (prevState.transform != this.state.transform) {
      //Redrawing graph
      const { data, xAxis, yAxis, x } = this.computeData(dataProp);
      console.log("drwaing this domain : ", x.domain());
      this.drawInvisibleDots(data);
      this.drawVisibleDots(data);
      this.drawGraph(data, xAxis, yAxis, x);
    }
  }

  render() {
    const { selected } = this.state;
    let { data, currency } = this.props;
    return (
      <div className="QuicklookGraph">
        <div className="chartWrap">
          {selected !== -1 ? (
            <div
              className="tooltip lookDown hide"
              style={{ color: currency.color }}
              ref={t => {
                this.tooltip = t;
              }}
            >
              <div className="tooltipTextWrap">
                <div className="tooltipText">
                  <div className="uppercase">
                    <CurrencyUnitValue
                      unit={currency.units[0]}
                      value={data[selected].amount}
                    />
                  </div>
                  <div>
                    <span className="uppercase date">
                      <DateFormat
                        format="ddd D MMM"
                        date={data[selected].time}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <svg
            ref={c => {
              this.svg = c;
            }}
          />
        </div>
      </div>
    );
  }
}
