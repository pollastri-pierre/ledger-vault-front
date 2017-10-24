import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './PieChart.css';


export default class PieChart extends Component {

  static propTypes = {
    data: PropTypes.instanceOf(Array).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      color : [
          {
            name: "yellow",
            hex: "#fcb653",
          },
          {
            name: "blue",
            hex: "#0ebdcd",
          },
          {
            name: "green",
            hex: "#65d196",
          },
          {
            name: "steel",
            hex: "#cccccc",
          },
        ],
      selected: -1,
    }
    this.setSelected.bind(this);
  }

  setSelected = (index) => {
    console.log(index)
    this.setState({selected: index})
  }

  handleMouseOver = (d, i) => {
    this.setSelected(d.index)
  }

  handleMouseOut = (d, i) => {
    this.setSelected(-1)
  }

  componentDidUpdate() {
    const svg = d3.select(this.svg);
    console.log(svg.select(() => this.parentNode));
    svg.attr("width", d3.select(svg.select(() => this.parentNode)).attr("width")); //adapt to parent's width
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const outerRadius = 50;
    const strokeWidth = 2.5;
    const chartHeight = ( outerRadius + strokeWidth ) * 2;
    //const chartWidth = chartHeight; //perfect circle

    const g = svg.append('g').classed("chartWrap", true).attr("height", height).attr("width", width).attr('transform', `translate(${margin.left}, ${margin.top})`);
    const data = this.props.data;

    const arc = d3.arc().outerRadius(outerRadius).innerRadius(outerRadius - strokeWidth).padAngle(0.05);

    const pie = d3.pie().sort(null).value(d => d.value);

    const chart = g.append("g").classed("chart", true).attr('transform', `translate(${(width)/2}, ${(chartHeight)/2})`);
    /* const arcs = */ chart.selectAll(".arc").data(pie(data)).enter()
                      .append("g").attr("class", "arc hover")
                      .append("path").attr("d", d => arc(d))
                      .style("fill", (d, i) => this.state.color[i].hex)
                      .on("mouseover", this.handleMouseOver)
                      .on("mouseout", this.handleMouseOut)
                      .style("cursor", "pointer");
    //const toolTip = g.append("g")
  }

  render() {
    const { selected, color } = this.state
    return (
      <div>
        <svg height="150" ref={(c) => { this.svg = c; }} />
        <table className="currencyTable">
          <tbody>
            {
              _.map(this.props.data, (currency, id) => {
                return (

                  <tr className={`currency ${ (selected !== -1 && selected !== id) ? 'disable' : ''}`} key={id}>
                    <td className="hover" onMouseOver={() => this.setSelected(id)} onMouseOut={() => this.setSelected(-1)}>
                      <span className={`bullet round inline bg-${color[id].name}`}></span>
                      <span className="inline uppercase currencyName">{currency.label}</span>
                    </td>
                    <td className="currencyBalance hover" onMouseOver={() => this.setSelected(id)} onMouseOut={() => this.setSelected(-1)}>{currency.value}</td>
                  </tr>

                )

              })

            }
          </tbody>
        </table>
      </div>
    );
  }
}
