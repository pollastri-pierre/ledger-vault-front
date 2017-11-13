// @flow

import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import "./QuicklookGraph.css";
import DateFormat from "../../components/DateFormat";

const fn = function(arg: number) {
  return arg;
};
// TODO use flowtype & fix eslint
export default class QuicklookGraph extends Component<*, *> {
  state = {
    selected: -1,
    width: 300 - 20 - 20,
    height: 190 - 20 - 20,
    tickLabel: "",
    x: fn,
    y: fn
  };
  tooltip: ?HTMLDivElement;

  svg: ?*;

  setSelected = (index: number) => {
    this.setState({ selected: index });
  };

  handleMouseOver = (d: *, i: number) => {
    console.log(d);
    this.setSelected(i);
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
    const selection = d3
      .select(".visibleDots")
      .selectAll(".dot")
      .data(data, d => d.x + d.y + d.time);

    selection.exit().remove();

    selection
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", data[0].currency.color)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("class", (d, i) => `dot${i}`)
      .classed("dot", true);
  };

  drawLine = (data: Array<*>) => {
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
      .attr("stroke", data[0].currency.color)
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

  drawGraph = (data: Array<*>, xAxis: *, yAxis: *) => {
    this.drawAxis(xAxis, yAxis);
    const x = this.state.x;
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
    const { minDomain } = this.props;

    const maxDomainX = [
      d3.min(data, function(d) {
        return d.time;
      }),
      d3.max(data, function(d) {
        return d.time;
      })
    ];

    let domainX = [];

    domainX[0] = maxDomainX[0] < minDomain[0] ? maxDomainX[0] : minDomain[0];
    domainX[1] = maxDomainX[1] > minDomain[1] ? maxDomainX[1] : minDomain[1];

    const x = d3
      .scaleTime()
      .domain(domainX)
      .range([55, width]);

    const domainY = [
      d3.min(data, function(d) {
        return d.amount;
      }),
      d3.max(data, function(d) {
        return d.amount;
      })
    ];

    const y = d3
      .scaleLinear()
      .domain(domainY)
      .range([height, 0]);
    this.setState({ x: x, y: y });
    return { x: x, y: y };
  };

  computeData = (data: Array<*>) => {
    const { width, x, y } = this.state;
    if (!x)
      return {
        data: data,
        xAxis: null,
        yAxis: null,
        x: null
      };

    let computedData = data.slice();

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

  setupZoomBehaviour = () => {
    const { width, height } = this.state;
    const { svg } = this;
    //setting up zoom behaviour
    const zoom = d3
      .zoom()
      //.scaleExtent([0, Infinity])
      //.translateExtent([[55, 0], [width, height]])
      //.extent([[55, 0], [width, height]])
      .on(
        "zoom",
        function() {
          const { x } = this.state;
          if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
            return;
          /*
          this.setState({
            x: d3.event.transform.rescaleX(x),
            selected: -1
          });*/
        }.bind(this)
      );
    d3.select(svg).call(zoom);
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
  };

  zoomTo = (d0: number, d1: number) => {
    const { width, x } = this.state;
    this.setState({
      x: d3.zoomIdentity
        .scale(width / (x(d1) - x(d0)))
        .translate(-x(d0), 0)
        .rescaleX(x),
      selected: -1
    });
  };

  componentDidMount() {
    console.log(this.props);

    //return if no data
    if (this.props.data.length === 0) return;
    //init placeholders

    this.initPlaceholders();

    //setting up zoom behaviour
    this.setupZoomBehaviour();

    this.computeXY(this.props.data);

    /* const { data, xAxis, yAxis } = this.computeData(this.props.data);

    this.drawInvisibleDots(data);

    this.drawVisibleDots(data);    console.log("13")

    this.drawGraph(data, xAxis, yAxis);    console.log("14")
    */
  }

  componentDidUpdate(prevProps: *, prevState: *) {
    const { selected } = this.state;
    const { dateRange, data: dataProp } = this.props;
    let duration = 0;

    if (selected !== prevState.selected) {
      //Hovering on tooltip
      this.handleTooltip();
    }
    if (JSON.stringify(dataProp) !== JSON.stringify(prevProps.data)) {
      this.computeXY(dataProp);
    } else if (
      JSON.stringify(prevProps.dateRange) !==
      JSON.stringify(this.props.dateRange)
    ) {
      //dateRange in props changed. Computing new transform and resetting the state

      /* calling computeData just to get x and y. */
      duration = 500;
      this.zoomTo(dateRange[0], dateRange[1]);
    } else if (prevState.x !== this.state.x) {
      //Redrawing grpah because of new zoom
      const { data, xAxis, yAxis } = this.computeData(dataProp);
      this.props.onDomainChange(this.state.x.domain());
      this.drawInvisibleDots(data);
      this.drawVisibleDots(data);
      this.drawGraph(data, xAxis, yAxis);
    }
  }

  render() {
    const { selected } = this.state;
    let { data } = this.props;
    if (data.length === 0) return null;
    return (
      <div className="QuicklookGraph">
        <div className="chartWrap">
          {selected !== -1 ? (
            <div
              className="tooltip lookDown hide"
              style={{ color: data[selected].currency.color }}
              ref={t => {
                this.tooltip = t;
              }}
            >
              <div className="tooltipTextWrap">
                <div className="tooltipText">
                  <div className="uppercase">
                    {data[selected].currency.units[0].code}{" "}
                    {data[selected].amount}
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
