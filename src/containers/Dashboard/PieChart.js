//@flow
import _ from "lodash";
import React, { Component } from "react";
import * as d3 from "d3";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import BadgeCurrency from "../../components/BadgeCurrency";
import type { PieChartData } from "../../data/types";
import "./PieChart.css";

export default class PieChart extends Component<
  {
    data: Array<PieChartData>,
    width: number,
    height: number
  },
  { selected: number }
> {
  state = {
    selected: -1
  };

  svg: ?Element;
  tooltip: ?Element;

  setSelected = (index: number) => {
    this.setState({ selected: index });
  };

  handleMouseOver = (d: *) => {
    console.log(d);
    this.setSelected(d.index);
  };

  handleMouseOut = () => {
    this.setSelected(-1);
  };

  componentDidMount() {
    const { selected } = this.state;
    const { data, width, height } = this.props;
    const $svg = this.svg;
    if (!$svg) return;

    const svg = d3.select($svg);
    //svg.attr("width", parseFloat(d3.select($svg.parentNode).style("width"))); //adapt to parent's width
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom; //+svg.attr("height") - margin.top - margin.bottom;
    const strokeWidth = 2.5;
    const outerRadius = chartWidth / 2;
    //const chartHeight = outerRadius * 2;
    svg
      .attr("height", chartHeight)
      .attr("width", chartWidth)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const g = svg.append("g").attr("class", "chartWrap");

    const arc = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(outerRadius - strokeWidth)
      .padAngle(0.05);

    const invisibleArc = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(0);

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

    g.attr("transform", `translate(${chartWidth / 2}, ${chartHeight / 2})`);

    g
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
      .style("fill", d => d.data.account.currency.color);

    //transparent Chart for hovering purposes
    g
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

  componentDidUpdate(prevProps: *, prevState: *) {
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
      <div className="pieChart">
        <div className="chartTooltipWrap">
          <div className="centerChart">
            <svg
              height="150"
              ref={c => {
                this.svg = c;
              }}
            />
            {selected !== -1 ? (
              <div
                className="tooltip hide"
                style={{
                  color: this.props.data[selected].account.currency.color
                }}
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
                          ? this.props.data[selected].account.currency.name
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <table className="currencyTable">
          <tbody>
            {_.map(this.props.data, (data, id) => {
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
                    <BadgeCurrency currency={data.account.currency} />
                    <span className="uppercase currencyName">
                      {data.account.currency.name}
                    </span>
                  </td>
                  <td className="currencyBalance">
                    <CurrencyAccountValue
                      account={data.account}
                      value={data.balance}
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
