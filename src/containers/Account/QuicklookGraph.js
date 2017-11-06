import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import "./QuicklookGraph.css";
import DateFormat from "../../components/DateFormat";

// TODO use flowtype & fix eslint
// TODO the component don't allow to send new data at the moment. try switch accross accounts
export default class QuicklookGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      data: [],
      domainX: [],
      domainY: [],
      xAxis: "",
      yAxis: "",
      mounted: 0,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      width: 300 - 20 - 20,
      height: 190 - 20 - 20,
      compute: 0,
      tick: ""
    };
    this.setSelected.bind(this);
  }

  setSelected = index => {
    this.setState({ selected: index });
  };

  handleMouseOver = (d, i) => {
    this.setSelected(i);
  };

  handleMouseOut = (d, i) => {
    this.setSelected(-1);
  };

  handleHovering = prevState => {
    const { selected } = this.state;
    if (selected !== prevState.selected) {
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
    }
  };

  drawInvisibleDots = data => {
    d3.selectAll(".hoverdot").remove();

    d3
      .select(".hoveringDots")
      .selectAll("hoveringDot")
      .data(data)
      .enter()
      .append("circle")
      .classed("hoverdot", true)
      .attr("r", 20)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .on("mouseout", this.handleMouseOut)
      .on("mouseover", this.handleMouseOver);
  };

  drawVisibleDots = data => {
    d3.selectAll(".dot").remove();
    d3
      .select(".visibleDots")
      .selectAll("dot")
      .data(data)
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

  drawLine = data => {
    const valueline = d3
      .line()
      .x(d => {
        return d.x;
      })
      .y(d => d.y);
    d3
      .select(".valueline")
      .data([data])
      .attr("class", "valueline")
      .attr("d", valueline)
      .attr("stroke", data[0].currency.color)
      .attr("fill", "none")
      .attr("stroke-width", "2px")
      .attr("clip-path", "url(#clip)");
  };

  drawxAxisLabel = label => {
    d3.select(".xAxisLabel").text(this.state.tick.toUpperCase());
  };

  drawAxis = () => {
    const { xAxis, yAxis } = this.state;
    d3.select(".xAxis").call(this.customXAxis);
    d3.select(".yAxis").call(this.customYAxis);
  };

  draw = () => {
    const { data } = this.state;
    this.drawAxis();
    this.drawxAxisLabel();
    this.drawLine(data);
  };

  customXAxis = s => {
    const { xAxis } = this.state;

    s.call(xAxis);
    s.select(".domain").remove();
    s.selectAll(".tick line").attr("display", "none");
    s
      .selectAll(".tick text")
      .attr("fill", "#999999")
      .attr("x", 0);
  };

  customYAxis = s => {
    const { yAxis } = this.state;

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

  computeData = () => {
    const { width, height, data, domainX, domainY, xAxis, yAxis } = this.state;
    let computedData = data.slice();

    const x = d3.event.transform.rescaleX(
      d3
        .scaleTime()
        .domain(
          d3.extent(data, function(d) {
            return d.date;
          })
        )
        .range([55, width])
        .nice()
    );
    const timeDelta = x.domain()[1] - x.domain()[0];

    const tick =
      timeDelta >= 31556952000 * 2
        ? "year"
        : timeDelta >= 2629746000 * 2
          ? "month"
          : timeDelta >= 86400000 ? "day" : "hour";

    let newXAxis = xAxis.scale(x);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, function(d) {
          return d.value;
        }),
        d3.max(data, function(d) {
          return d.value;
        })
      ])
      .range([height, 0]);

    const newYAxis = yAxis.scale(y);

    computedData = _.map(data, transaction => {
      return {
        ...transaction,
        x: x(transaction.date),
        y: y(transaction.value)
      };
    });
    this.setState({
      data: computedData,
      compute: 0,
      xAxis: newXAxis,
      yAxis: newYAxis,
      tick: tick
    });
  };

  componentDidMount() {
    let { dateRange, tick, data } = this.props;
    data = _.sortBy(data, elem => new Date(elem.time).toISOString());

    if (this.props.data.length === 0) return;

    const { margin, width, height } = this.state;

    const svg = d3.select(this.svg);
    svg.attr("height", height + margin.top + margin.bottom);
    svg.attr("width", width + margin.left + margin.right);
    const g = svg
      .append("g")
      .classed("chart", true)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("width", width);
    let domainY = [
      d3.min(data, function(d) {
        return d.amount;
      }),
      d3.max(data, function(d) {
        return d.amount;
      })
    ];
    let domainX = d3.extent(data, function(d) {
      return d.time;
    });

    let computedData = _.map(data, transaction => {
      return {
        date: transaction.time,
        value: transaction.amount,
        currency: transaction.currency
      };
    });
    const x = d3
      .scaleTime()
      .domain([domainX[0], domainX[1]])
      .range([55, width])
      .nice();

    const y = d3
      .scaleLinear()
      .domain([domainY[0], domainY[1]])
      .range([height, 0]);

    computedData = _.map(computedData, transaction => {
      return {
        ...transaction,
        x: x(transaction.date),
        y: y(transaction.value)
      };
    });
    const formatMillisecond = d3.timeFormat(".%L"),
      formatSecond = d3.timeFormat(":%S"),
      formatMinute = d3.timeFormat("%I:%M"),
      formatHour = d3.timeFormat("%I %p"),
      formatDay = d3.timeFormat("%a %d"),
      formatWeek = d3.timeFormat("%m/%d"),
      formatMonth = d3.timeFormat("%b"),
      formatYear = d3.timeFormat("%Y");

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

    const yAxis = d3
      .axisRight(y)
      .ticks(3)
      .tickSize(width);

    g
      .append("g")
      .classed("xAxis", true)
      .attr("transform", `translate(0, ${height})`);

    g.append("g").classed("yAxis", true);

    g
      .append("text")
      .classed("xAxisLabel", true)
      .attr("dy", 166)
      .attr("fill", "#999999")
      .attr("font-size", "10px")
      .attr("text-transform", "uppercase");
    g.append("path").classed("valueline", true);

    g
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width - 55)
      .attr("height", height + 100)
      .attr("x", 55)
      .attr("y", -50);

    g.append("g").classed("visibleDots", true);

    g.append("g").classed("hoveringDots", true);
    const zoom = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[55, 0], [width, height]])
      .extent([[55, 0], [width, height]])
      .on(
        "zoom",
        function() {
          this.setState({
            compute: 1,
            selected: -1
          });
        }.bind(this)
      );
    svg.call(zoom);
    this.setState({
      data: computedData,
      domainX: domainX,
      domainY: domainY,
      xAxis: xAxis,
      yAxis: yAxis,
      mounted: 1,
      tick: tick
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { domainX, domainY, xAxis, yAxis, compute, data } = this.state;
    if (this.state.mounted) {
      if (compute) {
        this.computeData();
        this.drawVisibleDots(data);
        this.drawInvisibleDots(data);
      } else {
        this.handleHovering(prevState);
        this.draw();
      }
    }
  }

  render() {
    const { selected } = this.state;
    let { data } = this.props;
    if (data.length === 0) return null;
    data = _.sortBy(data, elem => new Date(elem.time).toISOString());
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
