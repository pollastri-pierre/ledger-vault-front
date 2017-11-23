// @flow

import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import "./QuicklookGraph.css";
import DateFormat from "../../components/DateFormat";
import type { lineChartPointEnhanced, Unit } from "../../data/types";
type Props = {
  data: Array<*>,
  dateRange: Array<*>,
  currencyUnit: Unit,
  currencyColor: string
};

export default class QuicklookGraph extends Component<Props, *> {
  state = {
    selected: -1,
    width: 100,
    height: 100,
    transform: "",
    margin: { top: 20, right: 0, bottom: 20, left: 65 }
  };

  tooltip: ?HTMLDivElement;

  svg: ?*;

  setSelected = (index: number) => {
    this.setState({ selected: index });
  };

  handleMouseOver = (d: lineChartPointEnhanced, i: number) => {
    if (d.tooltip) this.setSelected(i);
  };

  handleMouseOut = () => {
    this.setSelected(-1);
  };

  handleTooltip = () => {
    const { selected, margin } = this.state;

    const tooltipElement = d3.select(this.tooltip);
    tooltipElement.classed("hide", selected === -1);
    d3
      .select(this.svg)
      .selectAll(".dot")
      .attr("opacity", (d, i) => (selected === i ? 1 : 0))
      .classed("selected", (d, i) => selected !== -1 && selected === i);
    if (selected !== -1) {
      const selectedDot = d3.select(".dot.selected").data()[0];
      tooltipElement.style("left", `${selectedDot.x + margin.right + 15}px`);
      tooltipElement.style("top", `${selectedDot.y - 65}px`);
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
      .attr("r", 5)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .on("mouseout", this.handleMouseOut)
      .on("mouseover", this.handleMouseOver);
  };

  drawVisibleDots = (data: Array<*>) => {
    const { currencyColor } = this.props;
    const selection = d3
      .select(".visibleDots")
      .selectAll(".dot")
      .data(data, d => d.x + d.y + d.time);

    selection.exit().remove();

    selection
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", currencyColor)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("class", (d, i) => `dot${i}`)
      .classed("dot", true);
  };

  drawLine = (data: Array<*>) => {
    const { currencyColor } = this.props;

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
      .attr("stroke", currencyColor)
      .attr("fill", "none")
      .attr("stroke-width", "2px")
      .attr("clip-path", "url(#clip)");
  };

  drawxAxisLabel = (domainX: Array<*>) => {
    const timeDelta = domainX[1] - domainX[0];

    const yearInMs = 31556952000;
    const monthInMs = 2629746000;
    const dayInMs = 86400000;
    const tickLabel =
      timeDelta >= yearInMs * 2
        ? "year"
        : timeDelta >= monthInMs * 2
          ? "month"
          : timeDelta >= dayInMs ? "day" : "hour";
    d3
      .select(".xAxisLabel")
      .text(tickLabel.toUpperCase())
      .attr("fill", "#767676")
      .attr("style", "font-weight: 600; font-family: 'Open Sans'");
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
      .attr("fill", "#767676")
      .attr("style", "font-weight: 600; font-family: 'Open Sans'")
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
      .attr("dy", -8)
      .attr("fill", "#767676")
      .attr("style", "font-weight: 600; font-family: 'Open Sans'");

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
      .range([0, width]);

    const minY = d3.min(data, function(d) {
      return d.amount;
    });
    const domainY = [
      minY <= 0 ? minY : 0,
      d3.max(data, function(d) {
        return d.amount;
      })
    ];

    const y = d3
      .scaleLinear()
      .domain(domainY)
      .range([height, 0]);

    return { x: x, y: y };
  };

  computeData = (data: Array<*>) => {
    const { width, transform, margin } = this.state;

    let computedData = data.slice();

    let { x, y } = this.computeXY(data);

    if (transform) {
      x = transform.rescaleX(x);
    }

    const xAxis = this.generateFormatedXAxis(x);

    let newXAxis = xAxis.scale(x);

    //setting uo yAxis
    const yAxis = d3
      .axisRight(y)
      .ticks(3)
      .tickSize(width + margin.left);

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
    const { width, height, margin } = this.state;

    //init svg with d3js margin convention

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
    g
      .append("g")
      .classed("yAxis", true)
      .attr("transform", `translate(${-margin.left}, 0)`);

    //init xAxisLabel placeholder
    g
      .append("text")
      .classed("xAxisLabel", true)
      .attr("dy", 166)
      .attr("dx", -margin.left)
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
      .attr("transform", `translate(0, ${-(margin.top + margin.bottom) / 2})`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

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
    this.setState(prevState => {
      const { width } = prevState;
      const { x } = this.computeXY(data);
      return {
        transform: d3.zoomIdentity
          .scale(width / (x(d1) - x(d0)))
          .translate(-x(d0), 0),
        selected: -1
      };
    });
  };

  generateFormatedXAxis = x => {
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
      .tickFormat(date => {
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

    return xAxis;
  };

  displayNoData = () => {
    const { width } = this.state;
    const { dateRange: domainX } = this.props;

    const x = d3
      .scaleTime()
      .domain(domainX)
      .range([0, width]);

    const xAxis = this.generateFormatedXAxis(x);

    d3.select(".noData").attr("opacity", 1);
    this.drawxAxisLabel(domainX);
    d3.select(".xAxis").call(this.customXAxis, xAxis);
    d3.select(".yAxis").attr("opacity", 0);
    d3.select(".valueline").attr("opacity", 0);
  };

  componentDidMount() {
    const { margin } = this.state;
    const { data, dateRange } = this.props;
    const parent = d3.select(d3.select(this.svg).node().parentNode);
    const height =
      parseFloat(parent.style("height")) - margin.top - margin.bottom;
    const width =
      parseFloat(parent.style("width")) - margin.left - margin.right;

    this.setState({ height: height, width: width }, () => {
      //init placeholders
      this.initPlaceholders();
      //return if no data
      if (data.length) {
        this.zoomTo(dateRange[0], dateRange[1], data);
      }
    });
  }

  componentDidUpdate(prevProps: *, prevState: *) {
    const { selected } = this.state;
    const { dateRange, data: dataProp } = this.props;
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
      this.zoomTo(dateRange[0], dateRange[1], dataProp);
    } else if (prevState.transform !== this.state.transform) {
      //Redrawing graph
      const { data, xAxis, yAxis, x } = this.computeData(dataProp);
      this.drawInvisibleDots(data);
      this.drawVisibleDots(data);
      this.drawGraph(data, xAxis, yAxis, x);
    }
  }

  render() {
    const { selected } = this.state;
    let { data, currencyUnit, currencyColor } = this.props;
    return (
      <div className="QuicklookGraph">
        <div className="chartWrap">
          {selected !== -1 ? (
            <div
              className="tooltip lookDown hide"
              style={{ color: currencyColor }}
              ref={t => {
                this.tooltip = t;
              }}
            >
              <div className="tooltipTextWrap">
                <div className="tooltipText">
                  <div className="uppercase">
                    {currencyUnit.code} {data[selected].amount}
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
