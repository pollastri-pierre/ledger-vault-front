import React, { Component } from 'react';
// import * as d3 from 'd3';
// import { scaleLinear } from 'd3-scale';
// import { axis } from 'd3-axis';

const WIDTH = 1000;
const HEIGHT = 500;
const MARGINS = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export default class QuicklookGraph extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
		// const vis = d3.select(this.ref);
		// // console.log(d3)
    // const xScale = scaleLinear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([2000, 2010]);
    // const yScale = scaleLinear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([134, 215]);
    // const xAxis = axis().scale(xScale);
    // const yAxis = axis().scale(yScale).orient("left");
    // //
	  // // vis.append("svg:g")
		// // 	.attr("class", "x axis")
		// // 	.attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		// // 	.call(xAxis);
    //
    //
  }

  render() {
    return (
      <svg ref="quickook"></svg>
    );
  }
}
