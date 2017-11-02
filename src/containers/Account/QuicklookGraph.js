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
      selected: -1
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

  handleScroll = () => {};

  handleHovering = prevState => {
    const { selected } = this.state;
    const { prevSelected } = prevState;
    if (selected !== prevSelected) {
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

  drawLine = data => {
    //Append visible dots
  };
  componentDidMount() {
    let { dateRange, tick, data } = this.props;
    data = _.sortBy(data, elem => new Date(elem.time).toISOString());

    if (this.props.data.length === 0) return;
    const svg = d3.select(this.svg);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .classed("chart", true)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("width", width);

    let minX = data[0].time;
    let maxX = data[0].time;

    let minY = data[0].amount;
    let maxY = data[0].amount;

    let computedData = _.map(data, transaction => {
      if (transaction.amount < minY) {
        minY = transaction.amount;
      }

      if (transaction.amount > maxY) {
        maxY = transaction.amount;
      }

      return {
        date: transaction.time,
        value: transaction.amount,
        currency: transaction.currency
      };
    });

    minX = dateRange[0];
    maxX = dateRange[1];

    const x = d3
      .scaleTime()
      .domain([minX, maxX])
      .range([55, width])
      .nice();

    const y = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);

    computedData = _.map(computedData, transaction => {
      return {
        ...transaction,
        x: x(transaction.date),
        y: y(transaction.value)
      };
    });

    const timeFormat =
      tick === "month"
        ? "%m"
        : tick === "week"
          ? "%w"
          : tick === "day" ? "%d" : tick === "hour" ? "%H" : "";
    let xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(timeFormat));

    const yAxis = d3
      .axisRight(y)
      .ticks(3)
      .tickSize(width);

    function customXAxis(s) {
      s.call(xAxis);
      s.select(".domain").remove();
      s.selectAll(".tick line").attr("display", "none");
      s
        .selectAll(".tick text")
        .attr("fill", "#999999")
        .attr("x", 0);
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
        .attr("x", 0)
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
      .append("text")
      .text(tick.toUpperCase())
      .attr("dy", 166)
      .attr("fill", "#999999")
      .attr("font-size", "10px")
      .attr("text-transform", "uppercase");

    g
      .append("path")
      .classed("valueline", true)
      .data([computedData])
      .attr("class", "line")
      .attr("d", valueline)
      .attr("stroke", computedData[0].currency.color)
      .attr("fill", "none")
      .attr("stroke-width", "2px");

    svg
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width - 55)
      .attr("height", height + margin.top + margin.bottom)
      .attr("x", 55 + margin.left)
      .attr("y", 0);

    g
      .append("g")
      .classed("visibleDots", true)
      .selectAll("dot")
      .data(computedData)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", computedData[0].currency.color)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("class", (d, i) => `dot${i}`)
      .classed("dot", true);

    g
      .append("g")
      .classed("hoveringDots", true)
      .selectAll("hoveringDot")
      .data(computedData)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .on("mouseover", this.handleMouseOver)
      .on("mouseout", this.handleMouseOut);
  }

  componentDidUpdate(prevProps, prevState) {
    this.handleHovering(prevState);
  }

  render() {
    const { selected } = this.state;
    let { data } = this.props;
    if (data.length === 0) return null;
    console.log(data);
    data = _.sortBy(data, elem => new Date(elem.time).toISOString());
    console.log(data);
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
            width="300"
            height="190"
            ref={c => {
              this.svg = c;
            }}
          />
        </div>
      </div>
    );
  }
}
