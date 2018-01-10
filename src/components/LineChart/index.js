// @flow
import React, { Component } from "react";
import cx from "classnames";
import * as d3 from "d3";
import { withStyles } from "material-ui/styles";

import DateFormat from "components/DateFormat";

const styles = {
  lineChart: {
    width: "100%",
    height: "100%",
    paddingTop: 20,
    fontSize: 10,
    fontWeight: 600,
    fontFamily: "Open Sans"
  },
  noData: {
    pointerEvents: "none"
  },
  chartWrap: {
    position: "relative",
    svg: {
      overflow: "visible"
    }
  },
  tooltip: {
    position: "absolute",
    width: "auto !important",
    height: "auto !important",
    boxShadow:
      "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
    zIndex: 10,
    pointerEvents: "none",
    backgroundColor: "currentColor",
    padding: 15,
    transition: "opacity 0.3s ease-out"
  },
  lookDown: {
    "&:before": {
      content: '""',
      display: "block",
      width: 0,
      height: 0,
      position: "absolute",
      borderTop: "10px solid",
      borderRight: "10px solid transparent !important",
      borderLeft: "10px solid transparent !important",
      left: 40,
      top: "63px !important"
    },
    ".tooltipText span": {
      float: "right"
    }
  },
  tooltipTextWrap: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  tooltipText: {
    color: "white",
    fontSize: 13,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  uppercase: {
    textTransform: "uppercase"
  },
  date: {
    color: "#e2e2e2",
    fontSize: 11
  },
  hide: {
    opacity: 0,
    zIndex: 1
  },
  xAxisLabel: {
    textTransform: "uppercase",
    position: "absolute",
    bottom: 1,
    color: "#767676"
  }
};

type DataPointEnhanced = {
  date: number,
  value: number,
  x: number,
  y: number
};

type Props = {
  data: Array<[number, number]>,
  color: string,
  formatTooltip: Function,
  noXAxisLabel?: boolean,
  showTooltip?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
};

class LineChart extends Component<Props, *> {
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

  handleMouseOut = () => {
    this.setSelected(-1);
  };

  bisectDate = d3.bisector(d => d.date).left;

  mousemove = () => {
    const { data: dataProp, showTooltip } = this.props;
    const { margin } = this.state;
    const { data, x } = this.computeData(dataProp);
    const x0 = x.invert(d3.mouse(this.svg)[0] - margin.left);
    const i = this.bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    let final = 0;
    if (!d0) {
      final = i;
    } else if (!d1) {
      final = i - 1;
    } else {
      final = x0 - d0[0] > d1[0] - x0 ? i : i - 1;
    }
    showTooltip && this.setSelected(final);
  };

  handleTooltip = () => {
    const { selected, margin } = this.state;
    const { classes } = this.props;

    const tooltipElement = d3.select(this.tooltip);
    tooltipElement.classed(classes.hide, selected === -1);
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

  drawVisibleDots = (data: DataPointEnhanced[]) => {
    const { color } = this.props;
    const selection = d3
      .select(".visibleDots")
      .selectAll(".dot")
      .data(data, d => d.x + d.y + d.date);

    selection.exit().remove();

    selection
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", color)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("class", (d, i) => `dot${i}`)
      .classed("dot", true);
  };

  drawLine = (data: DataPointEnhanced[]) => {
    const { color } = this.props;

    const valueline = d3
      .line()
      .x(d => {
        return d.x.toFixed(1);
      })
      .y(d => d.y.toFixed(1));

    const selection = d3.select(".valueline").data([data]);

    selection
      .attr("class", "valueline")
      .attr("d", valueline)
      .attr("stroke", color)
      .attr("fill", "none")
      .attr("stroke-width", "2px")
      .attr("clip-path", "url(#clip)");
  };

  getXAxisLabel = (domainX: [number, number]) => {
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
    return tickLabel.toUpperCase();
  };

  drawAxis = (xAxis: *, yAxis: *) => {
    d3.select(".xAxis").call(this.customXAxis, xAxis);
    d3.select(".yAxis").call(this.customYAxis, yAxis);
  };

  drawGraph = (data: Array<*>, xAxis: *, yAxis: *) => {
    this.drawAxis(xAxis, yAxis);
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
        return d[0];
      }),
      d3.max(data, function(d) {
        return d[0];
      })
    ];

    const x = d3
      .scaleTime()
      .domain(domainX)
      .range([0, width]);

    const minY = d3.min(data, function(d) {
      return d[1];
    });
    const domainY = [
      minY <= 0 ? minY : 0,
      d3.max(data, function(d) {
        return d[1];
      })
    ];

    const y = d3
      .scaleLinear()
      .domain(domainY)
      .range([height, 0]);

    return { x: x, y: y };
  };

  computeData = (data: Array<[number, number]>) => {
    const { width, transform, margin } = this.state;

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

    const computedData = data.map(([date, value]) => ({
      date: date,
      value: value,
      x: x(date),
      y: y(value)
    }));
    return {
      data: computedData,
      xAxis: newXAxis,
      yAxis: yAxis,
      x: x
    };
  };

  initPlaceholders = () => {
    const { classes } = this.props;
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
      .classed(classes.xAxisLabel, true)
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
      .attr("transform", `translate(-5, ${-(margin.top + margin.bottom) / 2})`)
      .attr("width", width + 10)
      .attr("height", height + margin.top + margin.bottom)
      .classed("cliprect", true);

    g
      .append("rect")
      .attr("transform", `translate(-5, ${-(margin.top + margin.bottom) / 2})`)
      .attr("width", width + 10)
      .attr("height", height + margin.top + margin.bottom)
      .attr("fill", "transparent")
      .on("mousemove", this.mousemove)
      .on("mouseout", this.handleMouseOut)
      .classed("hoverMap", true);

    //init placeholder for visible dots
    g
      .append("g")
      .classed("visibleDots", true)
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
      .classed(classes.noData, true);
  };

  updatePlaceholders = () => {
    const { width, height, margin } = this.state;

    //init svg with d3js margin convention

    const svg = d3.select(this.svg);
    svg.attr("height", height + margin.top + margin.bottom);
    svg.attr("width", width + margin.left + margin.right);

    const g = svg
      .select("chart")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("width", width);

    //init xAxis placeholder
    g.select("xAxis").attr("transform", `translate(0, ${height})`);

    //init clipPath for zooming purposes
    g
      .select(".cliprect")
      .attr("transform", `translate(0, ${-(margin.top + margin.bottom) / 2})`)
      .attr("width", width + margin.left + margin.right + 20)
      .attr("height", height + margin.top + margin.bottom);

    //update placeholder for NO DATA AVAILABLE text
    g
      .select(".noData")
      .attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");
  };

  zoomTo = (d0: number, d1: number, data: Array<[number, number]>) => {
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

  generateFormatedXAxis = (x: Function) => {
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
    const { data } = this.props;

    const x = d3
      .scaleTime()
      .domain(this.getDateRange(data))
      .range([0, width]);

    const xAxis = this.generateFormatedXAxis(x);

    d3.select(".noData").attr("opacity", 1);
    d3.select(".xAxis").call(this.customXAxis, xAxis);
    d3.select(".yAxis").attr("opacity", 0);
    d3.select(".valueline").attr("opacity", 0);
  };

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    const { margin } = this.state;
    const { data } = this.props;
    const parent = d3.select(d3.select(this.svg).node().parentNode);
    const dateRange = this.getDateRange(data);
    const height = Math.round(
      parseFloat(parent.style("height")) - margin.top - margin.bottom
    );
    const width = Math.round(
      parseFloat(parent.style("width")) - margin.left - margin.right
    );

    this.setState({ height: height, width: width }, () => {
      //init placeholders
      this.initPlaceholders();
      //return if no data
      if (data.length) {
        this.zoomTo(dateRange[0], dateRange[1], data);
      }
    });
  }

  resize = () => {
    const { margin } = this.state;
    const { data } = this.props;
    const dateRange = this.getDateRange(data);
    const parent = d3.select(d3.select(this.svg).node().parentNode);
    const height =
      parseFloat(parent.style("height")) - margin.top - margin.bottom;
    const width =
      parseFloat(parent.style("width")) - margin.left - margin.right;

    this.setState({ height: height, width: width }, () => {
      this.updatePlaceholders();
      //return if no data
      if (data.length) {
        this.zoomTo(dateRange[0], dateRange[1], data);
      }
    });
  };

  updateColor = () => {
    const { color } = this.props;
    d3.select(".valueline").attr("stroke", color);
    d3
      .select(".visibleDots")
      .selectAll(".dot")
      .attr("fill", color);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidUpdate(prevProps: *, prevState: *) {
    const currentSelected = this.state.selected;
    const prevSelected = prevState.selected;
    const currentData = this.props.data;
    const prevData = prevProps.data;
    const prevDateRange = this.getDateRange(prevData);
    const currentDateRange = this.getDateRange(currentData);
    const currentColor = this.props.color;
    const prevColor = prevProps.color;
    if (!currentData.length) {
      this.displayNoData();
      return;
    }
    if (prevColor !== currentColor) {
      this.updateColor();
    }
    d3.select(".noData").attr("opacity", 0);
    d3.select(".yAxis").attr("opacity", 1);
    d3.select(".valueline").attr("opacity", 1);
    if (currentSelected !== prevSelected) {
      //Hovering on tooltip
      this.handleTooltip();
    }

    if (
      prevDateRange[0] !== currentDateRange[0] ||
      prevDateRange[1] !== currentDateRange[1] ||
      JSON.stringify(currentData) !== JSON.stringify(prevData)
    ) {
      //dateRange in props changed. Computing new transform and resetting the state
      this.zoomTo(currentDateRange[0], currentDateRange[1], currentData);
    } else if (prevState.transform !== this.state.transform) {
      //Redrawing graph
      const { data, xAxis, yAxis } = this.computeData(currentData);
      this.drawVisibleDots(data);
      this.drawGraph(data, xAxis, yAxis);
    }
  }

  getDateRange = (data: Array<[number, number]>): [number, number] => {
    return [data[0][0], data[data.length - 1][0]];
  };

  render() {
    const { selected } = this.state;
    let { data, classes, color, formatTooltip, noXAxisLabel } = this.props;
    return (
      <div className={classes.lineChart}>
        <div className={classes.chartWrap}>
          {selected !== -1 && (
            <div
              className={cx([classes.tooltip, classes.lookDown, classes.hide])}
              style={{ color: color }}
              ref={t => {
                this.tooltip = t;
              }}
            >
              <div className={classes.tooltipTextWrap}>
                <div className={classes.tooltipText}>
                  <div className={classes.uppercase}>
                    {formatTooltip(data[selected][1])}
                  </div>
                  <div>
                    <span className={cx([classes.uppercase, classes.date])}>
                      <DateFormat format="ddd D MMM" date={data[selected][0]} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <svg
            ref={c => {
              this.svg = c;
            }}
          />
          {!noXAxisLabel && (
            <div className={classes.xAxisLabel}>
              {this.getXAxisLabel(this.getDateRange(data))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LineChart);
