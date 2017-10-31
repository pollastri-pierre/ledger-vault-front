import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import "./QuicklookGraph.css";
import DateFormat from "../../components/DateFormat";

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

  componentDidMount() {
    const { selected } = this.state;
    const svg = d3.select(this.svg);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .classed("chart", true)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let minX = this.props.data[0].time;
    let maxX = this.props.data[0].time;

    let minY = this.props.data[0].amount;
    let maxY = this.props.data[0].amount;

    let data = _.map(this.props.data, transaction => {
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
        value: transaction.amount,
        currency: transaction.currency
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

    data = _.map(data, transaction => {
      return {
        ...transaction,
        x: x(transaction.date),
        y: y(transaction.value)
      };
    });

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
      .attr("stroke", this.props.data[0].currency.color)
      .attr("fill", "none")
      .attr("stroke-width", "2px");

    g
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("fill", this.props.data[0].currency.color)
      .style("stroke", "white")
      .style("stroke-width", 2)
      .attr("opacity", 0)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("class", (d, i) => `dot${i}`)
      .classed("dot", true);
    g
      .selectAll("dot")
      .data(data)
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
        tooltip.style("left", `${selectedDot.x + 10}px`);
        tooltip.style("top", `${selectedDot.y}px`);
      }
    }
  }

  render() {
    const { selected } = this.state;
    const { data } = this.props;
    return (
      <div className="QuicklookGraph">
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
                    <DateFormat format="ddd D MMM" date={data[selected].date} />
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
    );
  }
}
