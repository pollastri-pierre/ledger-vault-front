import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import CurrencyNameValue from "../../components/CurrencyNameValue";
import BadgeCurrency from "../../components/BadgeCurrency";
import "./PieChart.css";

export default class PieChart extends Component {
  static propTypes = {
    data: PropTypes.instanceOf(Array).isRequired
  };

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
    this.setSelected(d.index);
  };

  handleMouseOut = (d, i) => {
    this.setSelected(-1);
  };

  componentDidMount() {
    const { selected } = this.state;
    const data = this.props.data;

    const svg = d3.select(this.svg);
    svg.attr(
      "width",
      parseFloat(d3.select(this.svg.parentNode).style("width"))
    ); //adapt to parent's width
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const outerRadius = 50;
    const strokeWidth = 2.5;
    const chartHeight = outerRadius * 2;

    const g = svg
      .append("g")
      .attr("class", "chartWrap")
      .attr("height", height)
      .attr("width", width)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const arc = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(outerRadius - strokeWidth)
      .padAngle(0.05);

    const invisibleArc = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(1.5)
      .padAngle(0.05);

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.counterValueBalance);

    let total = d3.sum(data, d => d.counterValueBalance);

    pie(data).forEach((d, i) => {
      data[i].center = arc.centroid(d); //Save center of arc for position of tooltip
      data[i].percentage = (d.data.counterValueBalance / total * 100).toFixed(
        0
      ); //Save percentage of arc
    });

    const chart = g
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${width / 2}, ${chartHeight / 2})`);

    chart
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", (d, i) => `arc ${"arc" + i}`)
      .append("path")
      .attr("d", d => arc(d))
      .attr(
        "class",
        (d, i) => (selected !== -1 && selected !== i ? "disable" : "")
      )
      .style("fill", d => d.data.meta.color);

    //transparent Chart for hovering purposes
    chart
      .selectAll(".invisibleArc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", (d, i) => `invisibleArc ${"invisibleArc" + i}`)
      .append("path")
      .attr("d", d => invisibleArc(d))
      .attr(
        "class",
        (d, i) => (selected !== -1 && selected !== i ? "disable" : "")
      )
      .style("opacity", 0) //make it transparent
      .on("mouseover", this.handleMouseOver)
      .on("mouseout", this.handleMouseOut);
  }

  componentDidUpdate(prevProps, prevState) {
    const { selected } = this.state;
    const { prevSelected } = prevState;
    const svg = d3.select(this.svg);
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");
    if (selected !== prevSelected) {
      d3
        .select(this.svg)
        .selectAll(".arc")
        .classed("disable", (d, i) => selected !== -1 && selected !== i)
        .classed("selected", (d, i) => selected !== -1 && selected === i);
      const tooltip = d3.select(this.tooltip);
      //Place tooltip
      tooltip.classed("hide", selected === -1);
      if (selected !== -1) {
        const selectedArc = d3.select(".arc" + selected).data()[0].data;
        let orientation =
          Math.abs(selectedArc.center[0]) > Math.abs(selectedArc.center[1])
            ? 0
            : 1; //getting best orientation (0 for horizontal )
        let orientationDeltaX = 0;
        let orientationDeltaY = 0;
        let arrowSpacing = 20;
        if (orientation === 0 && selectedArc.center[0] <= 0) {
          //A gauche
          orientationDeltaX =
            -parseFloat(tooltip.style("width")) - arrowSpacing;
          orientationDeltaY = -parseFloat(tooltip.style("height")) / 2;
          tooltip.classed("lookRight", true);
        } else if (orientation === 0 && selectedArc.center[0] > 0) {
          //A droite
          orientationDeltaX = arrowSpacing;
          orientationDeltaY = -parseFloat(tooltip.style("height")) / 2;
          tooltip.classed("lookLeft", true);
        } else if (orientation === 1 && selectedArc.center[1] > 0) {
          //En bas
          orientationDeltaX = -parseFloat(tooltip.style("width")) / 2;
          orientationDeltaY = arrowSpacing;
          tooltip.classed("lookUp", true);
        } else if (orientation === 1 && selectedArc.center[1] < 0) {
          //En haut
          orientationDeltaX = -parseFloat(tooltip.style("width")) / 2;
          orientationDeltaY =
            -parseFloat(tooltip.style("height")) - arrowSpacing;
          tooltip.classed("lookDown", true);
        }
        tooltip.style(
          "left",
          selectedArc.center[0] + svgWidth / 2 + orientationDeltaX + "px"
        );
        tooltip.style(
          "top",
          selectedArc.center[1] + svgHeight / 2 + orientationDeltaY + "px"
        );
        tooltip.select(".percentage").text(`${selectedArc.percentage}%`);
      } else {
        tooltip.classed("lookLeft", false);
        tooltip.classed("lookRight", false);
        tooltip.classed("lookUp", false);
        tooltip.classed("lookDown", false);
      }
    }
  }

  render() {
    const { selected } = this.state;

    return (
      <div>
        <svg
          height="150"
          ref={c => {
            this.svg = c;
          }}
        />
        {selected !== -1 ? (
          <div
            className="tooltip hide"
            style={{ color: this.props.data[selected].meta.color }}
            ref={t => {
              this.tooltip = t;
            }}
          >
            <div className="tooltipTextWrap">
              <div className="tooltipText">
                <div>
                  <span className="percentage" />
                </div>
                <div>
                  <span className="uppercase currencyName">
                    {this.props.data[selected]
                      ? this.props.data[selected].meta.name
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <table className="currencyTable">
          <tbody>
            {_.map(this.props.data, (currency, id) => {
              return (
                <tr
                  className={`currency ${
                    selected !== -1 && selected !== id ? "disable" : ""
                  } ${selected !== -1 && selected === id ? "selected" : ""}`}
                  key={id}
                  onMouseOver={() => this.setSelected(id)}
                  onMouseOut={() => this.setSelected(-1)}
                >
                  <td>
                    <BadgeCurrency currency={currency.meta} />
                    <span className="uppercase currencyName">
                      {currency.meta.name}
                    </span>
                  </td>
                  <td className="currencyBalance">
                    <CurrencyNameValue
                      currencyName={currency.meta.name}
                      value={currency.balance}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
